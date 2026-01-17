from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from uuid import UUID

# Message schemas
class MessageBase(BaseModel):
    content: str
    role: str  # 'user' or 'assistant'

class MessageCreate(BaseModel):
    message: str
    filters: Optional[dict] = None  # {discipline, grade, publisher, model}

class MessageResponse(BaseModel):
    id: UUID
    conversation_id: UUID
    role: str
    content: str
    filters: Optional[dict] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Conversation schemas
class ConversationCreate(BaseModel):
    title: Optional[str] = None

class ConversationResponse(BaseModel):
    id: UUID
    title: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ConversationDetailResponse(BaseModel):
    id: UUID
    title: Optional[str]
    created_at: datetime
    updated_at: datetime
    messages: List[MessageResponse]

    class Config:
        from_attributes = True

class ConversationListResponse(BaseModel):
    conversations: List[ConversationResponse]
