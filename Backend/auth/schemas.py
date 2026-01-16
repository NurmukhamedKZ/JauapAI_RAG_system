from pydantic import BaseModel, EmailStr
from typing import Optional
from uuid import UUID
from datetime import datetime

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class UserResponse(BaseModel):
    id: UUID
    email: EmailStr
    full_name: Optional[str] = None
    is_active: bool
    subscription_tier: str
    created_at: datetime

    class Config:
        from_attributes = True

class MessageUsageResponse(BaseModel):
    user_id: UUID
    month: str
    message_count: int
    limit: int
    remaining: int
