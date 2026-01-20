"""
Conversation endpoints for managing chat history.
Handles CRUD operations and message streaming with context.
"""
import logging
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from Backend.app.db.database import get_db
from Backend.app.models.chat import Conversation, Message
from Backend.app.models.user import User
from Backend.app.schemas.chat import (
    ConversationCreate,
    ConversationResponse,
    ConversationDetailResponse,
    MessageCreate,
)
from Backend.app.core.security import get_current_user
from Backend.app.services.user_service import (
    check_and_reset_message_count,
    check_message_limit,
    increment_message_count,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/conversations", tags=["Conversations"])


@router.get("", response_model=List[ConversationResponse])
def list_conversations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List all conversations for the current user."""
    conversations = (
        db.query(Conversation)
        .filter(Conversation.user_id == current_user.id)
        .order_by(Conversation.updated_at.desc())
        .all()
    )
    return conversations


@router.post("", response_model=ConversationResponse)
def create_conversation(
    data: ConversationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new conversation."""
    conversation = Conversation(
        user_id=current_user.id,
        title=data.title or "New Chat"
    )
    db.add(conversation)
    db.commit()
    db.refresh(conversation)
    return conversation


@router.get("/{conversation_id}", response_model=ConversationDetailResponse)
def get_conversation(
    conversation_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a conversation with all messages."""
    conversation = (
        db.query(Conversation)
        .filter(Conversation.id == conversation_id, Conversation.user_id == current_user.id)
        .first()
    )
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return conversation


@router.delete("/{conversation_id}")
def delete_conversation(
    conversation_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a conversation."""
    conversation = (
        db.query(Conversation)
        .filter(Conversation.id == conversation_id, Conversation.user_id == current_user.id)
        .first()
    )
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    db.delete(conversation)
    db.commit()
    return {"message": "Conversation deleted"}


@router.post("/guest/messages")
async def send_guest_message(
    request: Request,
    data: MessageCreate,
    db: Session = Depends(get_db),
):
    """
    Send a message as a guest (one-time use).
    Does not save conversation to DB and returns streaming response directly.
    """
    # Get RAG service
    rag_service = getattr(request.app.state, "rag_service", None)
    if not rag_service:
        raise HTTPException(status_code=500, detail="RAG Service not initialized")
    
    # Prepare filters for RAG
    filters = {}
    if data.filters:
        for key in ["discipline", "grade", "publisher"]:
            if data.filters.get(key):
                filters[key] = data.filters[key]
    
    # Generate and stream response
    async def generate():
        try:
            # Guest chat has no history context
            for chunk in rag_service.stream_chat_with_context(
                [],  # Empty context messages
                data.message, 
                filters
            ):
                if isinstance(chunk, dict):
                    text = chunk.get("response", "")
                else:
                    text = str(chunk)
                yield text
        except Exception as e:
            error_msg = f"Error generating response: {str(e)}"
            logger.error(error_msg)
            yield error_msg
            
    return StreamingResponse(generate(), media_type="text/plain")


@router.post("/{conversation_id}/messages")
async def send_message(
    conversation_id: UUID,
    request: Request,
    data: MessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Send a message and get streaming response."""
    # Get conversation
    conversation = (
        db.query(Conversation)
        .filter(Conversation.id == conversation_id, Conversation.user_id == current_user.id)
        .first()
    )
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    # Re-query user to ensure proper session attachment
    user = db.query(User).filter(User.id == current_user.id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check and reset message count if needed
    user = check_and_reset_message_count(user, db)
    
    # Check message limit
    within_limit, error_message = check_message_limit(user)
    if not within_limit:
        raise HTTPException(status_code=429, detail=error_message)
    
    # Increment message count
    user = increment_message_count(user, db)
    
    # Get RAG service
    rag_service = getattr(request.app.state, "rag_service", None)
    if not rag_service:
        raise HTTPException(status_code=500, detail="RAG Service not initialized")
    
    # Get previous messages for context
    previous_messages = (
        db.query(Message)
        .filter(Message.conversation_id == conversation_id)
        .order_by(Message.created_at)
        .all()
    )
    
    # Build context from previous messages (last 10)
    context_messages = [
        {"role": msg.role, "content": msg.content}
        for msg in previous_messages[-10:]
    ]
    
    # Save user message
    user_message = Message(
        conversation_id=conversation_id,
        role="user",
        content=data.message,
        filters=data.filters
    )
    db.add(user_message)
    
    # Update conversation title if first message
    if not previous_messages:
        # Use first 50 chars of message as title
        conversation.title = data.message[:50] + ("..." if len(data.message) > 50 else "")
    
    db.commit()
    
    # Prepare filters for RAG
    filters = {}
    if data.filters:
        for key in ["discipline", "grade", "publisher"]:
            if data.filters.get(key):
                filters[key] = data.filters[key]
    
    # Generate and stream response
    async def generate():
        full_response = ""
        try:
            for chunk in rag_service.stream_chat_with_context(
                context_messages, 
                data.message, 
                filters
            ):
                if isinstance(chunk, dict):
                    # Chain returns dict with 'response' key
                    text = chunk.get("response", "")
                else:
                    text = str(chunk)
                full_response += text
                yield text
        except Exception as e:
            error_msg = f"Error generating response: {str(e)}"
            logger.error(error_msg)
            full_response = error_msg
            yield error_msg
        
        # Save assistant message after streaming completes
        try:
            assistant_message = Message(
                conversation_id=conversation_id,
                role="assistant",
                content=full_response,
                filters=data.filters
            )
            db.add(assistant_message)
            db.commit()
        except Exception as e:
            logger.error(f"Error saving assistant message: {e}")
    
    return StreamingResponse(generate(), media_type="text/plain")
