from llama_parse import LlamaParse
from dotenv import load_dotenv
import os
import uuid
import time
from PyPDF2 import PdfReader, PdfWriter
import re
from qdrant_client import QdrantClient, models
from langchain_text_splitters import MarkdownHeaderTextSplitter, RecursiveCharacterTextSplitter
from FlagEmbedding import BGEM3FlagModel
from langchain_voyageai import VoyageAIEmbeddings

# !!! Configuration Constants !!!
DISCIPLINE = "Қазақстан тарихы"
GRADE = "9 сынып"
PUBLISHER = "Мектеп"

collection_name = "JauapAI"

file_path = "data/kazakhstan_tarihi_9_mektep.pdf"
CHUNKS_DIR = "data/temp_chunks"

BATCH_SIZE = 2  # Number of pages per batch



load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

QDRANT_API = os.getenv("QDRANT_API")
QDRANT_URL = os.getenv("QDRANT_URL")

LLAMA_PARSE_API = os.getenv("LLAMA_PARSE_API")

VOYAGE_API = os.getenv("VOYAGE_API")



# Initialize Voyage Large
dense_model = VoyageAIEmbeddings(
    voyage_api_key=VOYAGE_API, 
    model="voyage-3-large",
    output_dimension=1024
)
sparse_model = BGEM3FlagModel('BAAI/bge-m3', use_fp16=True)

client = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API)



full_markdown_list = []
full_markdown = ""
image_vault = {}


parser = LlamaParse(
    api_key=LLAMA_PARSE_API,
    parse_mode="parse_page_with_lvm",
    model="openai-gpt-4-1-mini",
    vendor_multimodal_api_key=OPENAI_API_KEY,
    result_type="markdown",
    high_res_ocr=True,
    adaptive_long_table=True,  # Adaptive long table. LlamaParse will try to detect long table and adapt the output
    outlined_table_extraction=True,  # Whether to try to extract outlined tables
    num_workers=1,
    max_timeout=300,
    job_timeout_in_seconds=300,
    system_prompt_append="Қазақ пен Казакты алмастырма"
)




if not os.path.exists(CHUNKS_DIR):
    os.makedirs(CHUNKS_DIR)

def split_pdf(path, batch_size):
    reader = PdfReader(path)
    total_pages = reader.pages.__len__()
    chunk_paths = []
    
    for i in range(0, total_pages, batch_size):
        writer = PdfWriter()
        end_page = min(i + batch_size, total_pages)
        for page_num in range(i, end_page):
            writer.add_page(reader.pages[page_num])
        
        chunk_filename = f"{CHUNKS_DIR}/chunk_{i}_{end_page}.pdf"
        with open(chunk_filename, "wb") as f:
            writer.write(f)
        chunk_paths.append(chunk_filename)
    
    return chunk_paths

# --- MAIN PARSING LOGIC ---

chunk_files = split_pdf(file_path, BATCH_SIZE)



print(f"Total chunks to process: {len(chunk_files)}")

for idx, chunk_file in enumerate(chunk_files):
    stop = True
    retry_count = 0
    
    while stop and retry_count < 10:
        try:
            print(f"[{idx+1}/{len(chunk_files)}] | {chunk_file}")

            if not os.path.exists(chunk_file):
                raise FileNotFoundError(f"Chunk file not found: {chunk_file}")
            
            # Using get_json_result for the specific chunk
            json_results = parser.get_json_result(chunk_file)
            pages = json_results[0].get("pages", [])

            if not pages:
                raise ValueError(f"No pages returned from parser {json_results[0]["error"]}")
            
            chunk_markdown = ""
            
            # Process results for this chunk
            for i, page in enumerate(pages, start=1):
                full_markdown += f"START OF PAGE: {int(chunk_file.split("_")[-2])+i}\n"
                full_markdown += page.get("md", "") + "\n"
                full_markdown += f"\nEND OF PAGE: {int(chunk_file.split("_")[-2])+i}\n"

                chunk_markdown += f"START OF PAGE: {int(chunk_file.split("_")[-2])+i}\n"
                chunk_markdown += page.get("md", "") + "\n"
                chunk_markdown += f"\nEND OF PAGE: {int(chunk_file.split("_")[-2])+i}\n"
                
                for img in page.get("images", []):
                    # We add chunk index to image name to avoid collisions
                    img_name = f"chunk_{idx}_{img.get('name')}"
                    print()
                    print(f"Processing image: {img_name}")
                    if img.get("base64"):
                        image_vault[img_name] = img.get("base64")
                        # Update the markdown reference to the new unique image name
                        full_markdown = full_markdown.replace(img.get('name'), img_name)

            full_markdown_list.append(chunk_markdown)

            stop = False # Success
            with open(file_path.replace("data/","data/Parsed_").replace(".pdf",".md"), "a", encoding="utf-8") as f:
            # with open("data/Parsed_Kazakh_history_6_samle.md", "a", encoding="utf-8") as f:
                f.write(chunk_markdown)
            print()
            print(f"Length of parsed pages: {len(chunk_markdown)}")
            print(f"Current total markdown length: {len(full_markdown)}")
            
        except ValueError as e:
            retry_count += 1
            print(f"Chunk: {idx+1}, Attempt: {retry_count}, Error: {e}")
            time.sleep(60) # Wait before retry
        except FileNotFoundError as e:
            stop = False
        except Exception as e:
            time.sleep(1) # Wait before retry
            
    # Clean up temp file
    if os.path.exists(chunk_file):
        os.remove(chunk_file)

print("--- ALL CHUNKS PROCESSED ---")
print(f"Total markdown length: {len(full_markdown)}")
print(f"Total images extracted: {len(image_vault)}")


full_markdown = full_markdown.replace("```markdown", "").replace("```", "")



# Настраиваем разделитель по заголовкам Markdown
headers_to_split_on = [
    ("#", "Header_1"),
    ("##", "Header_2"),
    ("###", "Header_3"),
]
markdown_splitter = MarkdownHeaderTextSplitter(
    headers_to_split_on=headers_to_split_on, 
    strip_headers=False, # Оставляем заголовки внутри текста для векторизации
    
)
semantic_chunks = markdown_splitter.split_text(full_markdown)


# Initialize splitter
token_splitter = RecursiveCharacterTextSplitter.from_tiktoken_encoder(
    chunk_size=1024,      # Target size in characters (or tokens if configured)
    chunk_overlap=100,    # Overlap to preserve context at edges
    separators=["\n\n", "\n", " "], # Priority order for splitting
    model_name="gpt-4o"
)

final_docs = token_splitter.split_documents(semantic_chunks)


page_t = 1
for doc in final_docs:
    # 1. Find ALL page markers in this specific chunk
    # matches will be a list like ['5', '6']
    page_matches = re.findall(r"(?:START|END) OF PAGE: (\d+)", doc.page_content)
    
    # 2. Convert to integers and sort unique
    if page_matches:
        found_pages = sorted(list(set(map(int, page_matches))))
        # Update your tracker if needed, or just use these pages
        page_t = found_pages[-1] 
    else:
        found_pages = [page_t] # Fallback to last known page
        
    # 3. Add to metadata (Critical for citations!)
    doc.metadata["pages"] = found_pages
    
    # 4. CLEAN the text. Don't embed "START OF PAGE 5". It confuses the semantic meaning.
    # Remove the markers from the content
    doc.page_content = re.sub(r"(START|END) OF PAGE: \d+\n?", "", doc.page_content).strip()

print(f"Создано {len(final_docs)} логических разделов. Начинаем эмбеддинг...")



filtered_docs = [doc for doc in final_docs if doc.page_content.strip()]

# 2. Now extract text from the clean list
text_documents = [doc.page_content for doc in filtered_docs]



# EMBEDDING FUNCTIONS
def sparse_documents(corpus):
    output = sparse_model.encode(corpus,
    return_dense=False, 
    return_sparse=True, 
    return_colbert_vecs=False)

    batch_keys = []
    batch_values = []
    for batch in output["lexical_weights"]:
        batch_keys.append([int(k) for k in batch.keys()])
        batch_values.append([float(v) for v in batch.values()])
    return batch_keys, batch_values
    

# Генерация векторов (Dense + Sparse)
print("Генерация векторов...")
dense_vectors = dense_model.embed_documents(text_documents)

print("Генерация разреженных векторов...")
s_indices_batch, s_values_batch = sparse_documents(text_documents)




# Note the "metadata." prefix
nested_fields = ["metadata.discipline", "metadata.publisher", "metadata.grade", "metadata.pages"]

for field in nested_fields:
    client.create_payload_index(
        collection_name=collection_name,
        field_name=field,
        field_schema=models.PayloadSchemaType.KEYWORD
    )
    print(f"Index created for nested field: '{field}'")



point_ids = [str(uuid.uuid4()) for _ in text_documents]

# Сохраняем в Qdrant
points = [models.PointStruct(
    id=point_ids[i],
    vector={
        "voyage-dense": dense,
        "bge-sparse": models.SparseVector(indices=keys, values=vals)
    },
    payload={
        "page_content": text,
        "metadata": {
            "discipline": DISCIPLINE,
            "grade": GRADE,
            "publisher": PUBLISHER,
            "pages": filtered_docs[i].metadata.get("pages", []) 
        }
    }
) for i, (text, dense, keys, vals) in enumerate(zip(text_documents, dense_vectors, s_indices_batch, s_values_batch))] 

client.upsert(collection_name=collection_name, points=points)


print("✅ Индексация по заголовкам завершена!")

print(f"{file_path} parsing and indexing completed successfully.")