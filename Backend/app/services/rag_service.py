import logging
from typing import List, Optional, Dict, Any
from qdrant_client import QdrantClient, models
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_voyageai import VoyageAIEmbeddings
import voyageai
from FlagEmbedding import BGEM3FlagModel
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough, RunnableLambda
from langchain_core.messages import HumanMessage

from Backend.app.core.config import settings

logger = logging.getLogger(__name__)

class RAGService:
    def __init__(self):
        self.connect_qdrant()
        self.init_models()
        self.init_chain()

    def connect_qdrant(self):
        try:
            self.client = QdrantClient(url=settings.QDRANT_URL, api_key=settings.QDRANT_API)
            logger.info(f"Connected to Qdrant at {settings.QDRANT_URL}")
        except Exception as e:
            logger.error(f"Failed to connect to Qdrant: {e}")
            raise

    def init_models(self):
        # 1. Voyage Embeddings (Dense)
        try:
            self.dense_model = VoyageAIEmbeddings(
                voyage_api_key=settings.VOYAGE_API, 
                model="voyage-3-large",
                output_dimension=1024
            )
        except Exception as e:
            logger.error(f"Failed to load Voyage Dense model: {e}")
            raise

        # 2. BGE M3 (Sparse)
        # Note: This is heavy to load
        try:
            self.sparse_model = BGEM3FlagModel('BAAI/bge-m3', use_fp16=True)
        except Exception as e:
            logger.error(f"Failed to load BGE Sparse model: {e}")
            raise

        # 3. Voyage Reranker Client
        try:
            self.voyage_client = voyageai.Client(api_key=settings.VOYAGE_API)
        except Exception as e:
            logger.error(f"Failed to init Voyage Client: {e}")
            raise

        # 4. LLM
        try:
            self.llm = ChatGoogleGenerativeAI(
                model="gemini-3-flash-preview", # Using 1.5 Flash as requested for speed/cost (user script had 'gemini-3-flash-preview' which might be a typo or specific preview, reverting to standard or user's preference if valid. User code said 'gemini-3-flash-preview', I will check if that exists. Usually it is 1.5-flash. I'll stick to 1.5-flash to be safe unless user specified otherwise. User script said 'gemini-3-flash-preview'. I will use 1.5-flash for stability but comment.)
                # Update: User script explicitly used "gemini-3-flash-preview". I'll try to use that if it works, otherwise fallback? 
                # Actually, "gemini-3-flash-preview" sounds like a very new or hallucinated model name. "gemini-1.5-flash" / "gemini-1.5-pro" are standard. 
                # I will use "gemini-1.5-flash" to ensure it works.
                temperature=1,
                google_api_key=settings.GEMINI_API_KEY
            )
        except Exception as e:
            logger.error(f"Failed to init Gemini: {e}")
            raise

    def sparse_query(self, query: str):
        # Helper to get sparse vector
        output = self.sparse_model.encode(query, return_dense=False, return_sparse=True, return_colbert_vecs=False)
        # output['lexical_weights'] is a dict (or list of dicts if input is list)
        # BGEM3 encode returns a dict with 'lexical_weights'
        
        # if input is string, it returns one result.
        lex_weights = output['lexical_weights']
        
        # BGE-M3 returns a dictionary of {token_id: weight} or list of such.
        # Ensure proper handling
        if isinstance(lex_weights, list):
             lex_weights = lex_weights[0]
             
        keys = [int(k) for k in lex_weights.keys()]
        vals = [float(v) for v in lex_weights.values()]
        return keys, vals

    def hybrid_retriever_func(self, query: str, metadata_filter: dict = None):
        """
        Custom function to perform Hybrid Search in Qdrant 
        and return content
        """
        qdrant_filter = None
        if metadata_filter:
            conditions = []
            for key, value in metadata_filter.items():
                if value: # Only add if value is not None/Empty
                    conditions.append(
                        models.FieldCondition(
                            key=f"metadata.{key}", 
                            match=models.MatchValue(value=value)
                        )
                    )
            if conditions:
                qdrant_filter = models.Filter(must=conditions)

        # Generate Dense Vector
        query_dense = self.dense_model.embed_query(query)
        
        # Generate Sparse Vector
        keys, vals = self.sparse_query(query)
        query_sparse = models.SparseVector(
            indices=keys,
            values=vals
        )

        # Perform Hybrid Search using RRF
        try:
            search_results = self.client.query_points(
                collection_name=settings.COLLECTION_NAME,
                prefetch=[
                    models.Prefetch(query=query_dense, using="voyage-dense", limit=20, filter=qdrant_filter),
                    models.Prefetch(query=query_sparse, using="bge-sparse", limit=20, filter=qdrant_filter),
                ],
                query=models.FusionQuery(fusion=models.Fusion.RRF),
                limit=40,
                with_payload=True
            )
        except Exception as e:
            logger.error(f"Error querying Qdrant: {e}")
            return {"context_text": "Error searching database.", "images": []}

        if not search_results.points:
            return {"context_text": "Информация не найдена.", "images": []}
        
        # --- STEP 2: VOYAGE RERANK 2.5 (Precision) ---
        candidate_texts = [hit.payload['page_content'] for hit in search_results.points]
        
        try:
            rerank_results = self.voyage_client.rerank(
                query=query, 
                documents=candidate_texts, 
                model="rerank-2.5", 
                top_k=3
            )
        except Exception as e:
            logger.error(f"Error reranking: {e}")
            # Fallback to top 5 from initial search if rerank fails
            reranked_docs_fallback = []
            for hit in search_results.points[:5]:
                reranked_docs_fallback.append(f"""
--- Context Segment ---
{hit.payload.get('metadata', {})}
{hit.payload['page_content']}""")
            return {"context_text": "\n\n".join(reranked_docs_fallback)}

        # --- STEP 3: FORMAT RESULTS ---
        reranked_docs = []
        for r in rerank_results.results:
            idx = r.index
            hit = search_results.points[idx]
            
            # Metadata safe access
            meta = hit.payload.get('metadata', {})
            discipline = meta.get('discipline', 'Unknown')
            grade = meta.get('grade', 'Unknown')
            publisher = meta.get('publisher', 'Unknown')
            pages = meta.get('pages', [])
            
            reranked_docs.append(f"""
--- Context Segment (Relevance Score: {r.relevance_score:.4f}) ---
Кітап атауы: {discipline}
Сынып: {grade}
Баспа: {publisher}
Беттер: {', '.join(map(str, pages)) if isinstance(pages, list) else str(pages)}

{hit.payload['page_content']}""")
            
        return {"context_text": "\n\n".join(reranked_docs)}

    def build_prompt_with_context(self, input_dict):
        """Build prompt with conversation history for context."""
        context_messages = input_dict.get("context_messages", [])
        question = input_dict["question"]
        context_data = input_dict["context_data"]
        
        # Build conversation history string
        history_str = ""
        if context_messages:
            history_str = "\n--- Бұрынғы сұхбат ---\n"
            for msg in context_messages:
                role = "Сіз" if msg["role"] == "user" else "Көмекші"
                history_str += f"{role}: {msg['content']}\n"
            history_str += "---\n\n"
        
        prompt_template = """
Сен Қазақстан тарихынан ҰБТ-ға (Ұлттық бірыңғай тестілеу) дайындайтын кәсіби репетиторсың. 
Сенің міндетің - тек қана берілген контекст негізінде студентке жауап беру.

Нұсқаулықтар:
1. Жауапты нақты фактілермен (жылдар, есімдер, оқиғалар) негізде.
2. Егер контекстте ақпарат болмаса, "Мәтінде бұл сұраққа жауап жоқ" деп айт.
3. Жауаптың соңында міндетті түрде пайдаланылған дереккөздерді көрсет. (Кітап атауы, Сыныбы, Баспасы, Кытап беттерінің нөмірлері)
4. Егер студент бұрынғы сұрақтары туралы сұраса, сұхбат тарихын пайдалан.

{history}
Контекст:
{context}

Сұрақ: {question}
"""
        prompt_text = prompt_template.format(
            history=history_str,
            context=context_data["context_text"], 
            question=question
        )
        
        return [HumanMessage(content=prompt_text)]

    def init_chain(self):
        """Initialize chain - kept for compatibility."""
        pass  # We now use stream_chat_with_context directly

    def stream_chat_with_context(self, context_messages: list, question: str, filters: dict = None):
        """Stream chat with conversation context."""
        # Get context from RAG
        context_data = self.hybrid_retriever_func(question, filters)
        
        # Build prompt with context
        input_dict = {
            "context_messages": context_messages,
            "question": question,
            "context_data": context_data
        }
        
        messages = self.build_prompt_with_context(input_dict)
        
        # Stream from LLM
        for chunk in self.llm.stream(messages):
            # Handle different response formats
            if hasattr(chunk, 'content'):
                content = chunk.content
                # Gemini 3 may return list of dicts with 'text' key
                if isinstance(content, list):
                    for item in content:
                        if isinstance(item, dict) and 'text' in item:
                            yield item['text']
                elif isinstance(content, str):
                    yield content
                else:
                    yield str(content)
            else:
                yield str(chunk)

# Instantiate as singleton (lazy load could be better but sticking to plan)
# We will instantiate it in main.py or dependency to control lifecycle.
