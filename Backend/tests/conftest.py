"""
Pytest configuration and fixtures for backend tests.
Provides test database setup, client fixtures, and mock services.
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from unittest.mock import MagicMock, patch
import os

# Set test environment before importing app modules
os.environ["DATABASE_URL"] = "sqlite:///:memory:"
os.environ["SECRET_KEY"] = "test-secret-key-for-testing-only"
os.environ["GEMINI_API_KEY"] = "test-api-key"
os.environ["QDRANT_URL"] = "http://localhost:6333"
os.environ["QDRANT_API"] = "test-api"
os.environ["VOYAGE_API"] = "test-api"

from Backend.app.db.database import Base, get_db
from Backend.app.main import app
from Backend.app.models.user import User
from Backend.app.core.security import hash_password, create_access_token


# Create test database engine
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    """Override database dependency with test database."""
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


@pytest.fixture(scope="function")
def db_session():
    """Create a fresh database session for each test."""
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        # Drop all tables after test
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db_session):
    """Create a test client with mocked services."""
    # Override database dependency
    app.dependency_overrides[get_db] = override_get_db
    
    # Mock RAG service
    mock_rag = MagicMock()
    mock_rag.stream_chat_with_context.return_value = iter(["Test ", "response"])
    app.state.rag_service = mock_rag
    
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    with TestClient(app) as test_client:
        yield test_client
    
    # Cleanup
    app.dependency_overrides.clear()
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def test_user(db_session) -> User:
    """Create a test user."""
    user = User(
        email="test@example.com",
        password_hash=hash_password("testpassword123"),
        full_name="Test User",
        subscription_tier="free",
        message_count=0,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture(scope="function")
def pro_user(db_session) -> User:
    """Create a pro subscription test user."""
    user = User(
        email="pro@example.com",
        password_hash=hash_password("testpassword123"),
        full_name="Pro User",
        subscription_tier="pro",
        message_count=0,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture(scope="function")
def auth_headers(test_user) -> dict:
    """Create authentication headers for test user."""
    token = create_access_token(data={"sub": str(test_user.id), "email": test_user.email})
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture(scope="function")
def pro_auth_headers(pro_user) -> dict:
    """Create authentication headers for pro user."""
    token = create_access_token(data={"sub": str(pro_user.id), "email": pro_user.email})
    return {"Authorization": f"Bearer {token}"}
