"""
Tests for conversation and message endpoints.
"""
import pytest
from fastapi.testclient import TestClient
from uuid import uuid4


class TestConversations:
    """Tests for conversation CRUD endpoints."""
    
    def test_create_conversation(self, client: TestClient, auth_headers):
        """Test creating a new conversation."""
        response = client.post(
            "/api/conversations",
            json={"title": "Test Conversation"},
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Test Conversation"
        assert "id" in data
        assert "created_at" in data
    
    def test_create_conversation_default_title(self, client: TestClient, auth_headers):
        """Test creating conversation without title uses default."""
        response = client.post(
            "/api/conversations",
            json={},
            headers=auth_headers
        )
        
        assert response.status_code == 200
        assert response.json()["title"] == "New Chat"
    
    def test_list_conversations_empty(self, client: TestClient, auth_headers):
        """Test listing conversations when none exist."""
        response = client.get("/api/conversations", headers=auth_headers)
        
        assert response.status_code == 200
        assert response.json() == []
    
    def test_list_conversations(self, client: TestClient, auth_headers):
        """Test listing conversations."""
        # Create two conversations
        client.post("/api/conversations", json={"title": "First"}, headers=auth_headers)
        client.post("/api/conversations", json={"title": "Second"}, headers=auth_headers)
        
        response = client.get("/api/conversations", headers=auth_headers)
        
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2
    
    def test_get_conversation(self, client: TestClient, auth_headers):
        """Test getting a specific conversation."""
        # Create conversation
        create_response = client.post(
            "/api/conversations",
            json={"title": "My Chat"},
            headers=auth_headers
        )
        conversation_id = create_response.json()["id"]
        
        # Get conversation
        response = client.get(f"/api/conversations/{conversation_id}", headers=auth_headers)
        
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "My Chat"
        assert data["messages"] == []
    
    def test_get_nonexistent_conversation(self, client: TestClient, auth_headers):
        """Test getting a conversation that doesn't exist."""
        fake_id = str(uuid4())
        response = client.get(f"/api/conversations/{fake_id}", headers=auth_headers)
        
        assert response.status_code == 404
    
    def test_delete_conversation(self, client: TestClient, auth_headers):
        """Test deleting a conversation."""
        # Create conversation
        create_response = client.post(
            "/api/conversations",
            json={"title": "To Delete"},
            headers=auth_headers
        )
        conversation_id = create_response.json()["id"]
        
        # Delete conversation
        delete_response = client.delete(
            f"/api/conversations/{conversation_id}",
            headers=auth_headers
        )
        
        assert delete_response.status_code == 200
        
        # Verify it's deleted
        get_response = client.get(
            f"/api/conversations/{conversation_id}",
            headers=auth_headers
        )
        assert get_response.status_code == 404


class TestMessages:
    """Tests for message endpoints."""
    
    def test_send_message(self, client: TestClient, auth_headers):
        """Test sending a message to a conversation."""
        # Create conversation
        create_response = client.post(
            "/api/conversations",
            json={"title": "Chat"},
            headers=auth_headers
        )
        conversation_id = create_response.json()["id"]
        
        # Send message
        response = client.post(
            f"/api/conversations/{conversation_id}/messages",
            json={"message": "Hello, assistant!"},
            headers=auth_headers
        )
        
        assert response.status_code == 200
        # Response is streaming, so we check content type
        assert "text/plain" in response.headers.get("content-type", "")
    
    def test_send_message_with_filters(self, client: TestClient, auth_headers):
        """Test sending a message with filters."""
        # Create conversation
        create_response = client.post(
            "/api/conversations",
            json={},
            headers=auth_headers
        )
        conversation_id = create_response.json()["id"]
        
        # Send message with filters
        response = client.post(
            f"/api/conversations/{conversation_id}/messages",
            json={
                "message": "Tell me about history",
                "filters": {
                    "discipline": "Казакстан Тарихы",
                    "grade": "10",
                    "publisher": "Атамұра"
                }
            },
            headers=auth_headers
        )
        
        assert response.status_code == 200
    
    def test_send_message_nonexistent_conversation(self, client: TestClient, auth_headers):
        """Test sending message to non-existent conversation."""
        fake_id = str(uuid4())
        response = client.post(
            f"/api/conversations/{fake_id}/messages",
            json={"message": "Hello"},
            headers=auth_headers
        )
        
        assert response.status_code == 404


class TestMessageLimits:
    """Tests for message limit enforcement."""
    
    def test_free_user_message_limit(self, client: TestClient, auth_headers, db_session, test_user):
        """Test that free users are limited to 5 messages."""
        # Set message count to limit
        test_user.message_count = 5
        db_session.commit()
        
        # Create conversation
        create_response = client.post(
            "/api/conversations",
            json={},
            headers=auth_headers
        )
        conversation_id = create_response.json()["id"]
        
        # Try to send message
        response = client.post(
            f"/api/conversations/{conversation_id}/messages",
            json={"message": "Should fail"},
            headers=auth_headers
        )
        
        assert response.status_code == 429
        assert "limit reached" in response.json()["detail"].lower()
    
    def test_pro_user_higher_limit(self, client: TestClient, pro_auth_headers, db_session, pro_user):
        """Test that pro users have higher message limit."""
        # Set some messages but under pro limit
        pro_user.message_count = 50
        db_session.commit()
        
        # Create conversation
        create_response = client.post(
            "/api/conversations",
            json={},
            headers=pro_auth_headers
        )
        conversation_id = create_response.json()["id"]
        
        # Should be able to send message
        response = client.post(
            f"/api/conversations/{conversation_id}/messages",
            json={"message": "Should work"},
            headers=pro_auth_headers
        )
        
        assert response.status_code == 200
