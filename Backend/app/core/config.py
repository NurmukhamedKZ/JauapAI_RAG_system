import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "JauapAI Backend"
    API_V1_STR: str = "/api"
    
    # SUPABASE
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "")
    
    # AI KEYS
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "") # Optional if using Gemini
    
    # RAG / VECTORS
    QDRANT_API: str = os.getenv("QDRANT_API", "")
    QDRANT_URL: str = os.getenv("QDRANT_URL", "")
    VOYAGE_API: str = os.getenv("VOYAGE_API", "")
    COLLECTION_NAME: str = "JauapAI"
    
    # AUTH (Google)
    GOOGLE_CLIENT_ID: str = os.getenv("CLIENT_ID", "")
    GOOGLE_CLIENT_SECRET: str = os.getenv("CLIENT_SECRET", "")
    
    # SECURITY
    SECRET_KEY: str = os.getenv("SECRET_KEY", "changeme")

settings = Settings()
