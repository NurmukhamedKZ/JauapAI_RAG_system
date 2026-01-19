"""
Database configuration and session management.
Uses SQLAlchemy with connection pooling for production reliability.
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from Backend.app.core.config import settings

# Create SQLAlchemy engine with connection pooling
engine = create_engine(
    settings.DATABASE_URL,
    pool_size=5,           # Number of connections to keep open
    max_overflow=10,       # Maximum number of connections beyond pool_size
    pool_pre_ping=True,    # Verify connections before using them
    pool_recycle=3600,     # Recycle connections after 1 hour
)

# Create SessionLocal class for database sessions
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for declarative models
Base = declarative_base()


def get_db():
    """
    Dependency to get database session.
    Yields a database session and ensures it's closed after use.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
