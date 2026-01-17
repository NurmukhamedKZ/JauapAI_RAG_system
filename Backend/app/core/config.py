import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "JauapAI Backend"
    API_V1_STR: str = "/api"
    
    # Database (Railway PostgreSQL)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "")
    
    # AI KEYS
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    
    # RAG / VECTORS
    QDRANT_API: str = os.getenv("QDRANT_API", "")
    QDRANT_URL: str = os.getenv("QDRANT_URL", "")
    VOYAGE_API: str = os.getenv("VOYAGE_API", "")
    COLLECTION_NAME: str = "JauapAI"
    
    # JWT Auth
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-super-secret-key-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # Business Logic
    FREE_TIER_MESSAGE_LIMIT: int = int(os.getenv("FREE_TIER_MESSAGE_LIMIT", "5"))

settings = Settings()
