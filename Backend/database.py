from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .config import settings
import warnings

# Suppress warnings about passlib/bcrypt if any
warnings.filterwarnings("ignore", category=DeprecationWarning)

SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL

# If we don't have a DB URL yet (during setup), we can fail gracefully or use a placeholder
if not SQLALCHEMY_DATABASE_URL:
    # Fallback to a placeholder or raise explicit error in production
    print("WARNING: DATABASE_URL is not set. Database connection will fail.")
    SQLALCHEMY_DATABASE_URL = "postgresql://user:pass@localhost/dbname" 

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
