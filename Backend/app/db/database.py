"""
Database configuration and session management.
Uses SQLAlchemy with connection pooling for production reliability.
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from Backend.app.core.config import settings

# Create SQLAlchemy engine with connection pooling
# Railway's PostgreSQL proxy may close idle connections, so we use aggressive recycling
engine = create_engine(
    settings.DATABASE_URL,
    pool_size=5,           # Number of connections to keep open
    max_overflow=10,       # Maximum number of connections beyond pool_size
    pool_pre_ping=True,    # Verify connections before using them
    pool_recycle=300,      # Recycle connections after 5 minutes (Railway closes idle connections)
    pool_timeout=30,       # Timeout for getting connection from pool
    connect_args={
        "connect_timeout": 10,  # Connection timeout in seconds
        "keepalives": 1,        # Enable TCP keepalives
        "keepalives_idle": 30,  # Seconds before sending keepalive
        "keepalives_interval": 10,  # Seconds between keepalives
        "keepalives_count": 5,  # Number of keepalives before giving up
    },
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
