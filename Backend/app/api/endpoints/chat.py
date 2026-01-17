from fastapi import APIRouter, Depends, Request, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from datetime import datetime
from dateutil.relativedelta import relativedelta

from Backend.app.core.security import get_current_user
from Backend.app.models.user import User
from Backend.app.db.database import get_db

router = APIRouter()

# Plan limits
PLAN_LIMITS = {
    "free": 5,
    "pro": 200,
}

class ChatRequest(BaseModel):
    message: str
    filters: Optional[Dict[str, Any]] = None


def check_and_reset_message_count(user: User, db: Session) -> User:
    """Reset message count if a month has passed since last reset."""
    now = datetime.utcnow()
    if user.message_count_reset_at is None or user.message_count_reset_at < now - relativedelta(months=1):
        user.message_count = 0
        user.message_count_reset_at = now
        db.commit()
        db.refresh(user)
    return user


@router.post("/chat")
async def chat_endpoint(
    request: Request,
    chat_request: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Chat endpoint protected by JWT Auth.
    Streams the response from Gemini.
    Enforces message limits based on subscription plan.
    """
    # Re-query user from database to ensure we have a fresh, session-attached object
    user = db.query(User).filter(User.id == current_user.id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check and reset message count if needed
    user = check_and_reset_message_count(user, db)
    
    # Check message limit
    limit = PLAN_LIMITS.get(user.subscription_tier, 5)
    if user.message_count >= limit:
        raise HTTPException(
            status_code=429,
            detail=f"Message limit reached. You have used {user.message_count}/{limit} messages this month. Upgrade to Pro for more messages."
        )
    
    rag_service = getattr(request.app.state, "rag_service", None)
    if not rag_service:
        raise HTTPException(status_code=500, detail="RAG Service not initialized")

    # Increment message count BEFORE starting the stream
    user.message_count += 1
    db.commit()
    db.refresh(user)
    
    try:
        async def generate():
            for chunk in rag_service.stream_chat(chat_request.message, chat_request.filters):
                yield chunk
        
        return StreamingResponse(generate(), media_type="text/plain")

    except Exception as e:
        # Rollback message count on error
        user.message_count -= 1
        db.commit()
        raise HTTPException(status_code=500, detail=str(e))

