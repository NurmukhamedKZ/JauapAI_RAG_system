from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List
import json
from uuid import UUID

from ..database import get_db
from ..auth.security import get_current_user
from ..models.user import User
from ..models.conversation import Conversation
from ..chat.schemas import (
    ChatMessageRequest, 
    ChatMessageResponse, 
    ConversationSummary,
    ConversationDetail,
    SourceInfo
)
from ..services.message_service import (
    check_message_limit, 
    increment_message_count,
    get_usage_stats
)
from ..services.history_service import HistoryService
from ..chat.chat_service import RAGChatService

router = APIRouter(prefix="/chat", tags=["Chat"])

# Initialize RAG service (singleton pattern)
rag_service = RAGChatService()

@router.post("/message/stream")
async def send_message_stream(
    request: ChatMessageRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Send a chat message and receive streaming response (SSE)
    """
    # 1. Check message limit
    if not check_message_limit(db, current_user.id, current_user.subscription_tier):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS, 
            detail="Monthly message limit reached. Please upgrade to Premium."
        )
    
    # 2. Get or create conversation
    if request.conversation_id:
        conversation = HistoryService.get_conversation(
            db, request.conversation_id, current_user.id
        )
        if not conversation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found"
            )
    else:
        # Create new conversation
        conversation = HistoryService.create_conversation(
            db, 
            current_user.id, 
            request.filter.dict() if request.filter else None,
            title=None  # Will be auto-generated from first message
        )
    
    # 3. Save user message
    user_message = HistoryService.add_message(
        db, conversation.id, "user", request.message
    )
    
    # 4. Get chat history for context
    messages = HistoryService.get_conversation_messages(db, conversation.id)
    chat_history = HistoryService.format_chat_history_for_llm(messages[:-1])  # Exclude last (current) message
    
    # 5. Prepare metadata filter
    metadata_filter = None
    if request.filter:
        metadata_filter = request.filter.dict(exclude_none=True)
    elif conversation.metadata_filter:
        metadata_filter = conversation.metadata_filter
    
    # 6. Generate streaming response
    async def event_generator():
        """SSE event generator"""
        full_response = ""
        sources = []
        
        try:
            # First, do retrieval to get sources
            retrieval_result = rag_service.hybrid_retrieve(
                request.message, 
                metadata_filter
            )
            sources = retrieval_result["sources"]
            
            # Send sources first as metadata
            yield f"data: {json.dumps({'type': 'sources', 'data': sources})}\n\n"
            
            # Stream the response
            async for chunk in rag_service.generate_response_stream(
                request.message,
                metadata_filter,
                chat_history
            ):
                full_response += chunk
                yield f"data: {json.dumps({'type': 'token', 'data': chunk})}\n\n"
            
            # Save assistant message
            assistant_message = HistoryService.add_message(
                db, conversation.id, "assistant", full_response, sources
            )
            
            # Update conversation title if it's the first exchange
            if not conversation.title and len(messages) <= 2:
                # Auto-generate title from first message (truncate to 50 chars)
                title = request.message[:50] + "..." if len(request.message) > 50 else request.message
                HistoryService.update_conversation_title(db, conversation.id, title)
            
            # Increment usage counter
            new_count = increment_message_count(db, current_user.id)
            
            # Get usage stats
            usage_stats = get_usage_stats(db, current_user.id, current_user.subscription_tier)
            
            # Send completion event with metadata
            completion_data = {
                'type': 'done',
                'data': {
                    'conversation_id': str(conversation.id),
                    'message_id': str(assistant_message.id),
                    'remaining_messages': usage_stats['remaining'],
                    'messages_used_this_month': usage_stats['message_count']
                }
            }
            yield f"data: {json.dumps(completion_data)}\n\n"
            
        except Exception as e:
            error_data = {
                'type': 'error',
                'data': {'message': str(e)}
            }
            yield f"data: {json.dumps(error_data)}\n\n"
    
    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"  # Disable buffering for nginx
        }
    )

@router.post("/message", response_model=ChatMessageResponse)
async def send_message(
    request: ChatMessageRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Send a chat message and receive complete response (non-streaming)
    """
    # 1. Check message limit
    if not check_message_limit(db, current_user.id, current_user.subscription_tier):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS, 
            detail="Monthly message limit reached. Please upgrade to Premium."
        )
    
    # 2. Get or create conversation
    if request.conversation_id:
        conversation = HistoryService.get_conversation(
            db, request.conversation_id, current_user.id
        )
        if not conversation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found"
            )
    else:
        conversation = HistoryService.create_conversation(
            db, 
            current_user.id, 
            request.filter.dict() if request.filter else None
        )
    
    # 3. Save user message
    user_message = HistoryService.add_message(
        db, conversation.id, "user", request.message
    )
    
    # 4. Get chat history
    messages = HistoryService.get_conversation_messages(db, conversation.id)
    chat_history = HistoryService.format_chat_history_for_llm(messages[:-1])
    
    # 5. Prepare metadata filter
    metadata_filter = None
    if request.filter:
        metadata_filter = request.filter.dict(exclude_none=True)
    elif conversation.metadata_filter:
        metadata_filter = conversation.metadata_filter
    
    # 6. Generate response
    response_text, sources = await rag_service.generate_response(
        request.message, 
        metadata_filter,
        chat_history
    )
    
    # 7. Save assistant message
    assistant_message = HistoryService.add_message(
        db, conversation.id, "assistant", response_text, sources
    )
    
    # 8. Update title if first exchange
    if not conversation.title and len(messages) <= 2:
        title = request.message[:50] + "..." if len(request.message) > 50 else request.message
        HistoryService.update_conversation_title(db, conversation.id, title)
    
    # 9. Increment usage
    increment_message_count(db, current_user.id)
    usage_stats = get_usage_stats(db, current_user.id, current_user.subscription_tier)
    
    return ChatMessageResponse(
        conversation_id=conversation.id,
        message_id=assistant_message.id,
        response=response_text,
        sources=[SourceInfo(**src) for src in sources],
        remaining_messages=usage_stats['remaining'],
        messages_used_this_month=usage_stats['message_count']
    )

@router.get("/conversations", response_model=List[ConversationSummary])
def get_conversations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all conversations for the current user"""
    conversations = HistoryService.get_user_conversations(db, current_user.id)
    
    return [
        ConversationSummary(
            id=conv.id,
            title=conv.title,
            created_at=conv.created_at,
            updated_at=conv.updated_at,
            message_count=msg_count
        )
        for conv, msg_count in conversations
    ]

@router.get("/conversations/{conversation_id}", response_model=ConversationDetail)
def get_conversation_detail(
    conversation_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific conversation with all messages"""
    conversation = HistoryService.get_conversation(db, conversation_id, current_user.id)
    
    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found"
        )
    
    messages = HistoryService.get_conversation_messages(db, conversation_id)
    
    return ConversationDetail(
        id=conversation.id,
        title=conversation.title,
        messages=messages,
        created_at=conversation.created_at,
        updated_at=conversation.updated_at,
        metadata_filter=conversation.metadata_filter
    )

@router.delete("/conversations/{conversation_id}")
def delete_conversation(
    conversation_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a conversation and all its messages"""
    success = HistoryService.delete_conversation(db, conversation_id, current_user.id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found"
        )
    
    return {"message": "Conversation deleted successfully"}
