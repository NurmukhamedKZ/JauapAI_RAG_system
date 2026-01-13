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

import json
from langchain_classic.storage import LocalFileStore, EncoderBackedStore

import json
from langchain_qdrant import QdrantVectorStore
from langchain_community.storage import RedisStore
from langchain_classic.storage import EncoderBackedStore
from langchain_classic.retrievers import MultiVectorRetriever
from langchain_core.documents import Document
from qdrant_client import QdrantClient, models




output_path = "data/"
file_path = output_path + 'Kazakhstan_tarihi_8_atamura_sample.pdf'

DISCIPLINE = "Қазақстан тарихы"
GRADE = "8"
PUBLISHER = "Атамұра"


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
                  the image is part of a Kazakh History book for the 8th grade."""
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
# --- 1. Qdrant Setup (Your existing code) ---
client = QdrantClient(location=QDRANT_URL, api_key=QDRANT_API)
collection_name = "Redis-Docker_test_1"

# Check if collection exists to avoid errors on restart
if not client.collection_exists(collection_name):
    client.create_collection(
        collection_name=collection_name,
        vectors_config=models.VectorParams(
            size=768, 
            distance=models.Distance.COSINE
        ),
    )

# Note the "metadata." prefix
nested_fields = ["metadata.discipline", "metadata.publisher", "metadata.grade"]

for field in nested_fields:
    client.create_payload_index(
        collection_name=collection_name,
        field_name=field,
        field_schema=models.PayloadSchemaType.KEYWORD
    )
    print(f"Index created for nested field: '{field}'")

vectorstore = QdrantVectorStore(
    client=client,
    collection_name=collection_name,
    embedding=GoogleGenerativeAIEmbeddings(
        model="models/gemini-embedding-001", 
        api_key=GEMINI_API_KEY,
        output_dimensionality=768
    ),
)

# --- 2. Redis Storage Setup (Replaces LocalFileStore) ---

# A. Create the Base Store (Handles raw bytes in Redis)
# 'namespace' adds a prefix to keys (e.g. "parent_docs:doc_id") so they are organized
redis_byte_store = RedisStore(
    redis_url="redis://localhost:6379", 
    namespace="parent_docs"
)

# B. Define Serializers (Object -> JSON Bytes)
# JSON is safer and cleaner than pickle for production
def json_encoder(obj: Document) -> bytes:
    if hasattr(obj, "to_dict"):
        return json.dumps(obj.to_dict())
    # If it's already a string (like your base64 images), just dump it
    return json.dumps(obj)


def json_decoder(data: bytes) -> Document:
    if data is None:
        return None
    return json.loads(data)

# C. Create the "Smart" Store
# This wraps Redis to automatically handle Document objects
store = EncoderBackedStore(
    store=redis_byte_store,
    key_encoder=lambda x: x, 
    value_serializer=json_encoder,
    value_deserializer=json_decoder
)

# --- 3. The Retriever ---
id_key = "doc_id"

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
            "grade": GRADE
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






from langchain_core.runnables import RunnablePassthrough, RunnableLambda
from langchain_core.messages import SystemMessage, HumanMessage
from langchain_core.prompts import ChatPromptTemplate
from base64 import b64decode


def parse_docs(docs):
    b64 = []
    text = []
    for doc in docs:
        if isinstance(doc, str): # Images are stored as raw base64 strings
            b64.append(doc)
        elif isinstance(doc, dict): # Texts/Tables are stored as JSON dicts
            text.append(doc)
    return {"images": b64, "texts": text}


def build_prompt(kwargs):

    docs_by_type = kwargs["context"]
    user_question = kwargs["question"]

    context_text = ""
    if len(docs_by_type["texts"]) > 0:
        for text_element in docs_by_type["texts"]:
            context_text += f"The Discipline: {text_element["metadata"]["discipline"]} \n"
            context_text += f"The Grade: {text_element["metadata"]["grade"]} \n"
            context_text += f"The Publisher: {text_element["metadata"]["publisher"]} \n"
            context_text += f"The Page number: {text_element["metadata"]["page_number"]} \n\n"
            context_text += text_element["text"] + "\n\n"

    
    system_instruction = """
    You are an expert UNT (Unified National Testing) tutor in Kazakhstan, specializing in preparing students for high-stakes exams.
    Your goal is not just to answer, but to help the student understand the material based strictly on the provided text.

    ### STRICT DATA BOUNDARIES
    - Answer **ONLY** based on the provided Context.
    - If the answer is not in the context, explicitly state: "Мәтінде бұл сұрақтың жауабы жоқ" (if Kazakh) or "В тексте нет ответа на этот вопрос" (if Russian). Do not make up information.

    ### RESPONSE FORMAT
    1. **Direct Answer**: Start with a clear, direct answer to the question.
    2. **Explanation**: Provide a long sentence explanation citing the context (e.g., "Because the text mentions...").
    3. **Questions**: Ask 2-3 questions from the context to ensure that students understand the material
    4. **Source**: Necessarily provide information sources that you used (Book, Grade, Publisher, and Page number)

    ### TONE & STYLE
    - **Language**: Strictly mirror the user's language (Kazakh or Russian).
    - **Format**: Use bullet points for readability.
    """

    # construct prompt with context (including images)
    prompt_template = f"""
    Answer the question based only on the following context, which can include text, tables, and the below image.
    Context: {context_text}
    Question: {user_question}
    """

    prompt_content = [{"type": "text", "text": prompt_template}]

    if len(docs_by_type["images"]) > 0:
        for image in docs_by_type["images"]:
            prompt_content.append(
                {
                    "type": "image_url",
                    "image_url": {"url": f"data:image/jpeg;base64,{image}"},
                }
            )


    return ChatPromptTemplate.from_messages(
        [
            SystemMessage(content=system_instruction),
            HumanMessage(content=prompt_content),
        ]
    )



model = ChatGoogleGenerativeAI(model="gemini-3-pro-preview", api_key=GEMINI_API_KEY, temperature=1)


chain = (
    {
        "context": retriever | RunnableLambda(parse_docs),
        "question": RunnablePassthrough(),
    }
    | RunnableLambda(build_prompt)
    | model
    | StrOutputParser()
)

chain_with_sources = {
    "context": retriever | RunnableLambda(parse_docs),
    "question": RunnablePassthrough(),
} | RunnablePassthrough().assign(
    response=(
        RunnableLambda(build_prompt)
        | model
        | StrOutputParser()
    )
)


query = "первая петиция?"

response = chain_with_sources.invoke(
    query
)

print("Response:", response['response'])

print("\n\nContext:")
for text in response['context']['texts']:
    print(text["text"])
    print("Page number: ", text["metadata"]["page_number"])
    print("\n" + "-"*50 + "\n")
