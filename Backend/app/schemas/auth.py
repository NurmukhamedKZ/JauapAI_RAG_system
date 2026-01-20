from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None

class RegisterResponse(BaseModel):
    """Response after registration - prompts email verification."""
    message: str
    email: str
    requires_verification: bool = True

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

class VerifyEmailRequest(BaseModel):
    """Request to verify email with token."""
    token: str

class ResendVerificationRequest(BaseModel):
    """Request to resend verification email."""
    email: EmailStr

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: Optional[str]
    is_active: bool
    is_email_verified: bool
    subscription_tier: str
    message_count: int
    message_limit: int
    created_at: datetime

    class Config:
        from_attributes = True

