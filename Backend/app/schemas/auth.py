from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int

class GoogleAuthRequest(BaseModel):
    """Request body for Google OAuth authentication."""
    credential: str  # Google ID token from frontend

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: Optional[str]
    is_active: bool
    subscription_tier: str
    message_count: int
    message_limit: int
    created_at: datetime

    class Config:
        from_attributes = True
