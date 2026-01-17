from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from Backend.app.core.config import settings
from Backend.app.api.endpoints import chat, auth, conversations, subscription
from Backend.app.services.rag_service import RAGService
from Backend.app.db.database import engine, Base
from Backend.app.models import user, chat as chat_models
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created.")
    
    logger.info("Initializing RAG Service...")
    try:
        app.state.rag_service = RAGService()
        logger.info("RAG Service initialized successfully.")
    except Exception as e:
        logger.error(f"Failed to initialize RAG Service: {e}")
    
    yield
    
    # Shutdown
    logger.info("Shutting down...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan,
    reload=True
)

# CORS
origins = [
    "*",  # Allow all for development, restrict in production
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(chat.router, prefix=settings.API_V1_STR)
app.include_router(conversations.router, prefix=settings.API_V1_STR)
app.include_router(subscription.router, prefix=settings.API_V1_STR)

@app.get("/health")
def health_check():
    return {"status": "ok"}
