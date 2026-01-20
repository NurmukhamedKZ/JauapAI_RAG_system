"""
Application configuration using Pydantic BaseSettings.
All settings are loaded from environment variables with validation.
"""
from typing import Dict, List
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    Uses Pydantic BaseSettings for validation and type coercion.
    """
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )
    
    # Project
    PROJECT_NAME: str = "JauapAI Backend"
    API_V1_STR: str = "/api"
    
    # CORS - comma-separated origins in env, defaults to localhost for dev
    CORS_ORIGINS: str = Field(
        default="http://localhost:3000,http://localhost:5173",
        description="Comma-separated list of allowed origins"
    )
    
    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS_ORIGINS string into list."""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]
    
    # Database (Railway PostgreSQL)
    DATABASE_URL: str = Field(
        ...,  # Required, no default
        description="PostgreSQL database URL"
    )
    
    # AI API Keys
    GEMINI_API_KEY: str = Field(default="", description="Google Gemini API key")
    OPENAI_API_KEY: str = Field(default="", description="OpenAI API key")
    
    # RAG / Vector Store
    QDRANT_API: str = Field(default="", description="Qdrant API key")
    QDRANT_URL: str = Field(default="", description="Qdrant URL")
    VOYAGE_API: str = Field(default="", description="Voyage AI API key")
    COLLECTION_NAME: str = "JauapAI_2"
    
    # JWT Authentication - SECRET_KEY is required, no default for security
    SECRET_KEY: str = Field(
        ...,  # Required, no default - must be set in environment
        description="JWT secret key for token signing"
    )
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(
        default=60 * 24,  # 24 hours
        ge=1,
        description="Access token expiration in minutes"
    )
    
    # Google OAuth
    GOOGLE_CLIENT_ID: str = Field(default="", description="Google OAuth Client ID")
    GOOGLE_CLIENT_SECRET: str = Field(default="", description="Google OAuth Client Secret")
    GOOGLE_REDIRECT_URI: str = Field(
        default="http://localhost:5173/auth/callback",
        description="Google OAuth redirect URI"
    )
    
    # Business Logic - Plan limits
    FREE_TIER_MESSAGE_LIMIT: int = Field(default=5, ge=1)
    PRO_TIER_MESSAGE_LIMIT: int = Field(default=200, ge=1)
    
    @property
    def plan_limits(self) -> Dict[str, int]:
        """Get plan limits as a dictionary."""
        return {
            "free": self.FREE_TIER_MESSAGE_LIMIT,
            "pro": self.PRO_TIER_MESSAGE_LIMIT,
        }


settings = Settings()
