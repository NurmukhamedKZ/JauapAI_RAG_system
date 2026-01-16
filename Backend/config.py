import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Database (Supabase)
    SUPABASE_URL = os.getenv("SUPABASE_URL")
    SUPABASE_KEY = os.getenv("SUPABASE_KEY")
    DATABASE_URL = os.getenv("DATABASE_URL")
    
    # Auth
    SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")
    ALGORITHM = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))
    
    # Freemium
    FREE_TIER_MESSAGE_LIMIT = int(os.getenv("FREE_TIER_MESSAGE_LIMIT", 5))

settings = Config()
