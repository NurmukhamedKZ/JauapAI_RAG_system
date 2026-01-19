"""
Chat endpoint for RAG-based conversations.
Handles message streaming with subscription limits.
"""
import logging
from fastapi import APIRouter, Depends, Request, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session

from Backend.app.core.security import get_current_user
from Backend.app.core.config import settings
from Backend.app.models.user import User
from Backend.app.db.database import get_db
from Backend.app.services.user_service import (
    check_and_reset_message_count,
    check_message_limit,
    increment_message_count,
    decrement_message_count,
)

logger = logging.getLogger(__name__)

router = APIRouter()


class ChatRequest(BaseModel):
    """Request schema for chat endpoint."""
    message: str
    filters: Optional[Dict[str, Any]] = None


@router.post("/chat")
async def chat_endpoint(
    request: Request,
    chat_request: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Chat endpoint protected by JWT Auth.
    Streams the response from the RAG service.
    Enforces message limits based on subscription plan.
    """
    # Re-query user from database to ensure we have a fresh, session-attached object
    user = db.query(User).filter(User.id == current_user.id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check and reset message count if needed
    user = check_and_reset_message_count(user, db)
    
    # Check message limit
    within_limit, error_message = check_message_limit(user)
    if not within_limit:
        raise HTTPException(status_code=429, detail=error_message)
    
    # Get RAG service
    rag_service = getattr(request.app.state, "rag_service", None)
    if not rag_service:
        raise HTTPException(status_code=500, detail="RAG Service not initialized")

    # Increment message count BEFORE starting the stream
    user = increment_message_count(user, db)
    
    try:
        async def generate():
            try:
                # Use stream_chat_with_context - fixed method name
                for chunk in rag_service.stream_chat_with_context(
                    context_messages=[],  # No history for direct chat endpoint
                    question=chat_request.message, 
                    filters=chat_request.filters
                ):
                    yield chunk
            except Exception as e:
                logger.error(f"Error in chat streaming: {e}")
                yield f"Error: {str(e)}"
        
        return StreamingResponse(generate(), media_type="text/plain")

    except Exception as e:
        # Rollback message count on error
        decrement_message_count(user, db)
        logger.error(f"Chat endpoint error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
