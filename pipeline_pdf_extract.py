from unstructured.partition.pdf import partition_pdf

import base64
import io
from PIL import Image as PILImage  # Rename to avoid conflict with IPython.display.Image

from dotenv import load_dotenv
import os

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

import uuid
from qdrant_client import QdrantClient, models
from langchain_qdrant import QdrantVectorStore
from langchain_core.documents import Document
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_classic.retrievers import MultiVectorRetriever

import pickle
from langchain_classic.storage import LocalFileStore, EncoderBackedStore





output_path = "data/"
file_path = output_path + 'Kazakhstan_tarihi_7_mektep.pdf'

DISCIPLINE = "Kazakstan_tarihi"
GRADE = "7"
PUBLISHER = "Mektep"


load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
QDRANT_API = os.getenv("QDRANT_API")
QDRANT_URL = os.getenv("QDRANT_URL")



print("Analyzing the PDF file")

# Reference: https://docs.unstructured.io/open-source/core-functionality/chunking
chunks = partition_pdf(
    filename=file_path,
    infer_table_structure=True,            # extract tables
    strategy="hi_res",                     # mandatory to infer tables

    languages=["kaz"],

    extract_image_block_types=["Image"],   # Add 'Table' to list to extract image of tables
    # image_output_dir_path=output_path,   # if None, images and tables will saved in base64

    extract_image_block_to_payload=True,   # if true, will extract base64 for API usage

    chunking_strategy="by_title",          # or 'basic'
    max_characters=10000,                  # defaults to 500
    combine_text_under_n_chars=2000,       # defaults to 0
    new_after_n_chars=6000,

    # extract_images_in_pdf=True,          # deprecated
)
print("Finished analyze")

# # Add metadata to chunks
for chunk in chunks:
    chunk.metadata.discipline = DISCIPLINE
    chunk.metadata.grade = GRADE
    chunk.metadata.publisher = PUBLISHER


elements = chunks[2].metadata.orig_elements
chunks_images = [el for el in elements if "Image" in str(type(el))]


tables = []
texts = []

for chunk in chunks:
    if "Table" in str(type(chunk)):
        tables.append(chunk)
    if "CompositeElement" in str(type(chunk)):
        texts.append(chunk)

# Get the images from the CompositeElement objects
def get_images_base64(chunks):
    images_b64 = []
    for chunk in chunks:
        if "CompositeElement" in str(type(chunk)):
            chunk_els = chunk.metadata.orig_elements
            for el in chunk_els:
                if "Image" in str(type(el)):
                    images_b64.append(el.metadata.image_base64)
    return images_b64

images = get_images_base64(chunks)


# Filtering
def filter_small_images(base64_list, min_width=200):
    print(f"Filtering for images wider than {min_width}px...\n")

    filtered_images = []
    
    for i, b64_code in enumerate(base64_list):
        try:
            # 1. Decode base64 to bytes
            image_data = base64.b64decode(b64_code)
            
            # 2. Read image metadata using Pillow (without saving to disk)
            with PILImage.open(io.BytesIO(image_data)) as img:
                width, height = img.size
            
            # 3. Filter: Check if width is greater than limit
            if width > min_width:
                print(f"✅ Image {i}: {width}x{height} px")
                # display(Image(data=image_data))
                filtered_images.append(b64_code)
            else:
                # print(f"Skipped Image {i}: {width}x{height} px (Too small)")
                pass
                
        except Exception as e:
            print(f"Error processing image {i}: {e}")
    return filtered_images

# Usage
filtered_images = filter_small_images(images, min_width=150)




# Prompt
prompt_text = """
You are an assistant tasked with summarizing tables and text.
Give a concise summary of the table or text in kazakh language.

Respond only with the summary, no additionnal comment.
Do not start your message by saying "Here is a summary" or anything like that.
Just give the summary as it is.

Table or text chunk: {element}

"""

prompt = ChatPromptTemplate.from_template(prompt_text)

# Summary chain
model = ChatGoogleGenerativeAI(model="gemini-3-flash-preview", api_key=GEMINI_API_KEY, temperature=1,)
summarize_chain = {"element": lambda x: x} | prompt | model | StrOutputParser()


print("Text summarizing")
# Summarize text
text_summaries = summarize_chain.batch(texts, {"max_concurrency": 10})

print("Table summarizing")
# Summarize tables
tables_html = [table.metadata.text_as_html for table in tables]
table_summaries = summarize_chain.batch(tables_html, {"max_concurrency": 10})

#Summarize images
prompt_template = """Describe the image in detail in kazakh language. For context,
                  the image is part of a Kazakh History book for the 6th grade."""
messages = [
    (
        "user",
        [
            {"type": "text", "text": prompt_template},
            {
                "type": "image_url",
                "image_url": {"url": "data:image/jpeg;base64,{image}"},
            },
        ],
    )
]
prompt = ChatPromptTemplate.from_messages(messages)
chain = prompt | model | StrOutputParser()

print("image summarizing")
image_summaries = chain.batch(filtered_images, {"max_concurrency": 5})


#Qdrant
client = QdrantClient(location=QDRANT_URL, api_key=QDRANT_API)

collection_name = "GrantGPT_multi_modal_RAG"

nested_fields = ["metadata.discipline", "metadata.publisher", "metadata.grade"]

for field in nested_fields:
    client.create_payload_index(
        collection_name=collection_name,
        field_name=field,
        field_schema=models.PayloadSchemaType.KEYWORD
    )
    print(f"Index created for nested field: '{field}'")


# The vectorstore to use to index the child chunks
vectorstore = QdrantVectorStore(
    client=client,
    collection_name=collection_name,
    embedding=GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-001", api_key=GEMINI_API_KEY, output_dimensionality=768),
)

# 1. Create the base local storage (handles raw bytes)
fs = LocalFileStore("parent_documents_store")

# 2. Define how to serialize (Object -> Bytes) and deserialize (Bytes -> Object)
def pickle_encoder(obj):
    return pickle.dumps(obj)

def pickle_decoder(data):
    return pickle.loads(data)

# 3. Create the "Smart" store that works with your objects
# Use THIS 'store' variable in your MultiVectorRetriever
store = EncoderBackedStore(
    store=fs,
    key_encoder=lambda x: x, # keys are already strings, so no change needed
    value_serializer=pickle_encoder,
    value_deserializer=pickle_decoder
)


id_key = "doc_id"

# The retriever (empty to start)
retriever = MultiVectorRetriever(
    vectorstore=vectorstore,
    docstore=store,
    id_key=id_key,
)

print("Adding texts to VectorDB")
#Add texts
doc_ids = [str(uuid.uuid4()) for _ in texts]
summary_texts = [
    Document(
        page_content=summary, 
        metadata={
            id_key: doc_ids[i],
            # ADD YOUR METADATA HERE
            "discipline": DISCIPLINE,
            "publisher": PUBLISHER,
            "grade": PUBLISHER
        }
    ) for i, summary in enumerate(text_summaries)
]

# Add to vectorstore and docstore
retriever.vectorstore.add_documents(summary_texts)
retriever.docstore.mset(list(zip(doc_ids, texts)))

print("Adding tables to VectorDB")
# Add tables
table_ids = [str(uuid.uuid4()) for _ in tables]
summary_tables = [
    Document(page_content=summary,              
             metadata={
                id_key: table_ids[i], 
                "discipline": DISCIPLINE,
                "publisher": PUBLISHER,
                "grade": GRADE
                }) for i, summary in enumerate(table_summaries)
]
retriever.vectorstore.add_documents(summary_tables)
retriever.docstore.mset(list(zip(table_ids, tables)))


print("Adding images to VectorDB")
# Add image summaries
img_ids = [str(uuid.uuid4()) for _ in filtered_images]
summary_img = [
    Document(page_content=summary,             
     metadata={
                id_key: img_ids[i], 
                "discipline": DISCIPLINE,
                "publisher": PUBLISHER,
                "grade": GRADE
                }) for i, summary in enumerate(image_summaries)
]
retriever.vectorstore.add_documents(summary_img)
retriever.docstore.mset(list(zip(img_ids, filtered_images)))


print(f"Inserted Text: {len(text_summaries)}")
print(f"Inserted Tables: {len(table_summaries)}")
print(f"Inserted Images: {len(image_summaries)}")