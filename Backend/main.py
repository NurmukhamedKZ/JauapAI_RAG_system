from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .database import engine, Base
from .routes import auth, subscription

# Create tables on startup (simplest way for now, Alembic is better for prod)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="RAG Chatbot API",
    description="Monolithic Backend for RAG Chatbot with Auth and Freemium model",
    version="1.0.0"
)

# CORS
origins = [
    "http://localhost:5173", # Vite default
    "http://localhost:3000",
    "*" # For development
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(subscription.router)

# Placeholder for Chat Router (to be added by other dev)
# from .routes import chat
# app.include_router(chat.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to RAG Chatbot API"}