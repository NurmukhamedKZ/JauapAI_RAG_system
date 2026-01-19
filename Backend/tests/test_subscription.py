"""
Tests for subscription endpoints.
"""
import pytest
from fastapi.testclient import TestClient


class TestSubscriptionStatus:
    """Tests for subscription status endpoint."""
    
    def test_get_status_free_user(self, client: TestClient, auth_headers, test_user):
        """Test getting subscription status for free user."""
        response = client.get("/api/subscription/status", headers=auth_headers)
        
        assert response.status_code == 200
        data = response.json()
        assert data["plan"] == "free"
        assert data["message_limit"] == 5
        assert data["message_count"] == 0
        assert data["messages_remaining"] == 5
    
    def test_get_status_pro_user(self, client: TestClient, pro_auth_headers, pro_user):
        """Test getting subscription status for pro user."""
        response = client.get("/api/subscription/status", headers=pro_auth_headers)
        
        assert response.status_code == 200
        data = response.json()
        assert data["plan"] == "pro"
        assert data["message_limit"] == 200
    
    def test_get_status_with_usage(self, client: TestClient, auth_headers, db_session, test_user):
        """Test status reflects message usage."""
        # Simulate message usage
        test_user.message_count = 3
        db_session.commit()
        
        response = client.get("/api/subscription/status", headers=auth_headers)
        
        assert response.status_code == 200
        data = response.json()
        assert data["message_count"] == 3
        assert data["messages_remaining"] == 2


class TestSubscriptionToggle:
    """Tests for subscription toggle endpoint."""
    
    def test_toggle_free_to_pro(self, client: TestClient, auth_headers, test_user):
        """Test upgrading from free to pro."""
        response = client.post("/api/subscription/toggle", headers=auth_headers)
        
        assert response.status_code == 200
        data = response.json()
        assert data["new_plan"] == "pro"
        assert "200" in data["message"]
    
    def test_toggle_pro_to_free(self, client: TestClient, pro_auth_headers, pro_user):
        """Test downgrading from pro to free."""
        response = client.post("/api/subscription/toggle", headers=pro_auth_headers)
        
        assert response.status_code == 200
        data = response.json()
        assert data["new_plan"] == "free"
        assert "5" in data["message"]
    
    def test_toggle_requires_auth(self, client: TestClient):
        """Test that toggle requires authentication."""
        response = client.post("/api/subscription/toggle")
        
        assert response.status_code == 403
