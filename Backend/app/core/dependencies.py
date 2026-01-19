"""
Core dependencies for dependency injection.
Provides reusable service instances and utilities.
"""
from functools import lru_cache
from fastapi import Request, HTTPException
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from Backend.app.services.rag_service import RAGService


def get_rag_service(request: Request) -> "RAGService":
    """
    Get the RAG service instance from app state.
    
    Args:
        request: FastAPI request object
        
    Returns:
        RAGService instance
        
    Raises:
        HTTPException: If RAG service is not initialized
    """
    rag_service = getattr(request.app.state, "rag_service", None)
    if not rag_service:
        raise HTTPException(
            status_code=503,
            detail="RAG Service not initialized. Please try again later."
        )
    return rag_service
