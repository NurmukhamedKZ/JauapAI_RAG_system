"""
FastAPI application entry point.
Configures middleware, routes, and startup/shutdown events.
"""
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from Backend.app.core.config import settings
from Backend.app.core.middleware import RequestIDMiddleware, RequestLoggingMiddleware
from Backend.app.api.endpoints import chat, auth, conversations, subscription, vote
from Backend.app.services.rag_service import RAGService
from Backend.app.db.database import engine, Base
from Backend.app.models import user, chat as chat_models, vote as vote_models

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan manager.
    Handles startup and shutdown events.
    """
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
        app.state.rag_service = None
    
    yield
    
    # Shutdown
    logger.info("Shutting down...")


# Create FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan,
)

# Add custom middleware (order matters - first added is outermost)
app.add_middleware(RequestLoggingMiddleware)
app.add_middleware(RequestIDMiddleware)

# Add CORS middleware with configurable origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(chat.router, prefix=settings.API_V1_STR)
app.include_router(conversations.router, prefix=settings.API_V1_STR)
app.include_router(subscription.router, prefix=settings.API_V1_STR)
app.include_router(vote.router, prefix=settings.API_V1_STR)


@app.get("/health")
def health_check():
    """
    Health check endpoint with dependency status.
    Returns status of the application and its dependencies.
    """
    rag_status = "ready" if getattr(app.state, "rag_service", None) else "not_initialized"
    
    return {
        "status": "ok",
        "service": settings.PROJECT_NAME,
        "rag_service": rag_status,
    }


@app.get("/")
def root():
    """Root endpoint with API information."""
    return {
        "message": f"Welcome to {settings.PROJECT_NAME}",
        "docs": "/docs",
        "health": "/health",
    }
