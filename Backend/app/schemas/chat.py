"""
Pydantic schemas for chat and conversation data validation.
"""
from pydantic import BaseModel
from typing import Optional, List, Literal
from datetime import datetime
from uuid import UUID


# Message schemas
class MessageBase(BaseModel):
    """Base message schema."""
    content: str
    role: Literal["user", "assistant"]  # Type-safe role field


class MessageCreate(BaseModel):
    """Schema for creating a new message."""
    message: str
    filters: Optional[dict] = None  # {discipline, grade, publisher, model}


class MessageResponse(BaseModel):
    """Schema for message response."""
    id: UUID
    conversation_id: UUID
    role: Literal["user", "assistant"]
    content: str
    filters: Optional[dict] = None
    created_at: datetime

    class Config:
        from_attributes = True


# Conversation schemas
class ConversationCreate(BaseModel):
    """Schema for creating a new conversation."""
    title: Optional[str] = None


class ConversationResponse(BaseModel):
    """Schema for conversation response (without messages)."""
    id: UUID
    title: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ConversationDetailResponse(BaseModel):
    """Schema for conversation with all messages."""
    id: UUID
    title: Optional[str]
    created_at: datetime
    updated_at: datetime
    messages: List[MessageResponse]

    class Config:
        from_attributes = True


class ConversationListResponse(BaseModel):
    """Schema for list of conversations."""
    conversations: List[ConversationResponse]
