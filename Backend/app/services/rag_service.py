"""
RAG (Retrieval-Augmented Generation) Service.
Handles hybrid search with dense and sparse vectors, reranking, and LLM generation.
"""
from sympy import content
from langchain_core.messages.base import BaseMessage
from langchain_core.messages import SystemMessage, AIMessage, HumanMessage
import logging
from typing import List, Optional, Dict, Any, Generator
from qdrant_client import QdrantClient, models
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_voyageai import VoyageAIEmbeddings
import voyageai
from FlagEmbedding import BGEM3FlagModel


from Backend.app.core.config import settings

logger = logging.getLogger(__name__)


class RAGService:
    """
    RAG Service for hybrid search and context-aware chat.
    
    Uses:
    - Voyage AI for dense embeddings
    - BGE-M3 for sparse embeddings
    - Qdrant for vector storage with RRF fusion
    - Voyage reranker for precision
    - Google Gemini for generation
    """
    
    def __init__(self) -> None:
        """Initialize RAG service with all required models and connections."""
        self.client: Optional[QdrantClient] = None
        self.dense_model: Optional[VoyageAIEmbeddings] = None
        self.sparse_model: Optional[BGEM3FlagModel] = None
        self.voyage_client: Optional[voyageai.Client] = None
        self.llm: Optional[ChatGoogleGenerativeAI] = None
        
        self.connect_qdrant()
        self.init_models()
        self.init_chain()

    def connect_qdrant(self) -> None:
        """Establish connection to Qdrant vector database."""
        try:
            self.client = QdrantClient(url=settings.QDRANT_URL, api_key=settings.QDRANT_API)
            logger.info(f"Connected to Qdrant at {settings.QDRANT_URL}")
        except Exception as e:
            logger.error(f"Failed to connect to Qdrant: {e}")
            raise

    def init_models(self) -> None:
        """Initialize all ML models required for RAG pipeline."""
        # 1. Voyage Embeddings (Dense)
        try:
            self.dense_model = VoyageAIEmbeddings(
                voyage_api_key=settings.VOYAGE_API, 
                model="voyage-4-lite",
                output_dimension=1024
            )
        except Exception as e:
            logger.error(f"Failed to load Voyage Dense model: {e}")
            raise

        # 2. BGE M3 (Sparse) - Note: This is heavy to load
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

        # 4. LLM - Google Gemini
        try:
            self.llm = ChatGoogleGenerativeAI(
                model="gemini-3-flash-preview",
                temperature=1,
                google_api_key=settings.GEMINI_API_KEY
            )
        except Exception as e:
            logger.error(f"Failed to init Gemini: {e}")
            raise

    def sparse_query(self, query: str) -> tuple[List[int], List[float]]:
        """
        Generate sparse vector representation using BGE-M3.
        
        Args:
            query: The search query text
            
        Returns:
            Tuple of (token indices, token weights)
        """
        output = self.sparse_model.encode(
            query, 
            return_dense=False, 
            return_sparse=True, 
            return_colbert_vecs=False
        )
        
        lex_weights = output['lexical_weights']
        
        # Handle list output (batch encoding)
        if isinstance(lex_weights, list):
            lex_weights = lex_weights[0]
             
        keys = [int(k) for k in lex_weights.keys()]
        vals = [float(v) for v in lex_weights.values()]
        return keys, vals

    def hybrid_retriever_func(
        self, 
        query: str, 
        metadata_filter: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Perform hybrid search in Qdrant and return formatted context.
        
        Uses RRF (Reciprocal Rank Fusion) to combine dense and sparse results,
        then reranks with Voyage reranker for precision.
        
        Args:
            query: The search query
            metadata_filter: Optional filters for discipline, grade, publisher
            
        Returns:
            Dict with 'context_text' containing formatted search results
        """
        # Build Qdrant filter from metadata
        qdrant_filter = None
        if metadata_filter:
            conditions = []
            for key, value in metadata_filter.items():
                if value:  # Only add if value is not None/Empty
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
        query_sparse = models.SparseVector(indices=keys, values=vals)

        # Perform Hybrid Search using RRF
        try:
            search_results = self.client.query_points(
                collection_name=settings.COLLECTION_NAME,
                prefetch=[
                    models.Prefetch(query=query_dense, using="voyage-dense", limit=30, filter=qdrant_filter),
                    models.Prefetch(query=query_sparse, using="bge-sparse", limit=30, filter=qdrant_filter),
                ],
                query=models.FusionQuery(fusion=models.Fusion.RRF),
                limit=50,
                with_payload=True
            )
        except Exception as e:
            logger.error(f"Error querying Qdrant: {e}")
            return {"context_text": "Error searching database.", "images": []}

        if not search_results.points:
            return {"context_text": "Информация не найдена.", "images": []}
        
        # Rerank with Voyage
        candidate_texts = [hit.payload['page_content'] for hit in search_results.points]
        
        try:
            rerank_results = self.voyage_client.rerank(
                query=query, 
                documents=candidate_texts, 
                model="rerank-2.5", 
                top_k=5
            )
        except Exception as e:
            logger.error(f"Error reranking: {e}")
            # Fallback to top 5 from initial search
            reranked_docs_fallback = []
            for hit in search_results.points[:5]:
                reranked_docs_fallback.append(f"""
{hit.payload.get('metadata', {})}
{hit.payload['page_content']}""")
            return {"context_text": "\n\n".join(reranked_docs_fallback)}

        # Format results
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
Кітап атауы: {discipline}
Сынып: {grade}
Баспа: {publisher}
Беттер: {', '.join(map(str, pages)) if isinstance(pages, list) else str(pages)}

{hit.payload['page_content']}""")
            
        return {"context_text": "\n\n".join(reranked_docs)}

    def build_prompt_with_context(self, input_dict: Dict[str, Any]) -> List[HumanMessage]:
        """
        Build prompt with conversation history for context.
        
        Args:
            input_dict: Dict containing 'context_messages', 'question', 'context_data'
            
        Returns:
            List containing HumanMessage with formatted prompt
        """
        context_messages = input_dict.get("context_messages", [])
        question = input_dict["question"]
        context_data = input_dict["context_data"]
        # print(context_data)
        
        prompt = f"""
Сен Қазақстандағы ҰБТ (Бірыңғай ұлттық тестілеу) бойынша репетиторсын, оқушыларды күрделі ЕНТ-ға дайындауға маманданғансын.
Сенің мақсатың - тек жауап беру емес, сонымен қатар оқушыға берілген мәтінге сүйене отырып, сұрақтар қойып материалды түсінуге көмектесу. 

Нұсқаулықтар:
1. Жауапты нақты фактілермен (жылдар, есімдер, оқиғалар) негізде.
2. Жауапты тек контекст негізінде беру керек, жаңа ақпаратты ойлап табуға болмайды.
3. Егер контекстте ақпарат болмаса, "Мәтінде бұл сұраққа жауап жоқ" деп айт, бірақ "мен ЕНТ-ға дайындауға көмектесе аламын" деп айт.
4. Жауаптың соңында міндетті түрде пайдаланылған дереккөздерді көрсет. (Кітап атауы, Сыныбы, Баспасы, Кытап беттерінің нөмірлері)

Контекст:
{context_data["context_text"]}
"""
        messages: List[BaseMessage] = [SystemMessage(content=prompt)]
        for msg in context_messages:
            if msg["role"] == "user":
                messages.append(HumanMessage(content=msg["content"]))
            else:
                messages.append(AIMessage(content=msg["content"]))
        messages.append(HumanMessage(content=question))
        
        return messages

    def init_chain(self) -> None:
        """Initialize chain - kept for compatibility."""
        pass  # We now use stream_chat_with_context directly

    def stream_chat_with_context(
        self, 
        context_messages: List[Dict[str, str]], 
        question: str, 
        filters: Optional[Dict[str, Any]] = None
    ) -> Generator[str, None, None]:
        """
        Stream chat with conversation context.
        
        Args:
            context_messages: List of previous messages with 'role' and 'content'
            question: Current user question
            filters: Optional filters for RAG search
            
        Yields:
            String chunks of the generated response
        """
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
                # Gemini may return list of dicts with 'text' key
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
