"""
Tests for API versioning functionality
"""

import pytest
from flask import Flask

from app_versioned import create_versioned_app


class TestAPIVersioning:
    """Test API versioning functionality"""

    @pytest.fixture
    def app(self):
        """Create test app with versioning"""
        app = create_versioned_app()
        app.config["TESTING"] = True
        return app

    @pytest.fixture
    def client(self, app):
        """Create test client"""
        return app.test_client()

    def test_main_api_info(self, client):
        """Test main API info endpoint"""
        response = client.get("/")
        assert response.status_code == 200

        data = response.get_json()
        assert "api_versions" in data
        assert "v1" in data["api_versions"]
        assert "v2" in data["api_versions"]

    def test_health_check(self, client):
        """Test global health check"""
        response = client.get("/health")
        assert response.status_code == 200

        data = response.get_json()
        assert data["status"] == "healthy"
        assert "api_versions" in data

    def test_v1_api_info(self, client):
        """Test V1 API info endpoint"""
        response = client.get("/api/v1/info")
        assert response.status_code == 200

        data = response.get_json()
        assert data["version"] == "1.0.0"
        assert data["status"] == "active"
        assert "endpoints" in data

    def test_v2_api_info(self, client):
        """Test V2 API info endpoint"""
        response = client.get("/api/v2/info")
        assert response.status_code == 200

        data = response.get_json()
        assert data["version"] == "2.0.0"
        assert data["status"] == "active"
        assert "new_features" in data

    def test_v1_health_check(self, client):
        """Test V1 health check"""
        response = client.get("/api/v1/health")
        assert response.status_code == 200

        data = response.get_json()
        assert data["version"] == "1.0.0"
        assert data["status"] == "healthy"

    def test_v2_health_check(self, client):
        """Test V2 enhanced health check"""
        response = client.get("/api/v2/health")
        assert response.status_code == 200

        data = response.get_json()
        assert data["version"] == "2.0.0"
        assert data["status"] == "healthy"
        assert "services" in data

    def test_v1_products_endpoint(self, client):
        """Test V1 products endpoint"""
        response = client.get("/api/v1/products")
        assert response.status_code == 200

        data = response.get_json()
        assert "products" in data
        assert "count" in data
        assert data["version"] == "1.0.0"

    def test_v2_products_endpoint(self, client):
        """Test V2 enhanced products endpoint"""
        response = client.get("/api/v2/products")
        assert response.status_code == 200

        data = response.get_json()
        assert "products" in data
        assert "count" in data
        assert data["version"] == "2.0.0"
        assert "filters_applied" in data

    def test_v2_products_with_filters(self, client):
        """Test V2 products with filtering"""
        response = client.get("/api/v2/products?category=Electronics&min_price=100")
        assert response.status_code == 200

        data = response.get_json()
        assert data["version"] == "2.0.0"
        assert data["filters_applied"]["category"] == "Electronics"
        assert data["filters_applied"]["min_price"] == 100.0

    def test_v1_create_product(self, client):
        """Test V1 product creation"""
        product_data = {
            "name": "Test Product V1",
            "price": 99.99,
            "category": "Test",
            "description": "V1 test product",
        }

        response = client.post("/api/v1/products", json=product_data)
        assert response.status_code == 201

        data = response.get_json()
        assert data["name"] == "Test Product V1"
        assert data["version"] == "1.0.0"

    def test_v2_create_enhanced_product(self, client):
        """Test V2 enhanced product creation"""
        product_data = {
            "name": "Test Product V2",
            "price": 199.99,
            "category": "Electronics",
            "description": "V2 enhanced test product",
            "stock_quantity": 50,
            "tags": ["test", "v2"],
            "specifications": {"color": "blue"},
        }

        response = client.post("/api/v2/products", json=product_data)
        assert response.status_code == 201

        data = response.get_json()
        assert data["name"] == "Test Product V2"
        assert data["version"] == "2.0.0"
        assert "sku" in data
        assert "tags" in data
        assert "specifications" in data

    def test_v2_search_functionality(self, client):
        """Test V2 search endpoint (V2 only)"""
        response = client.get("/api/v2/search?q=test")
        assert response.status_code == 200

        data = response.get_json()
        assert "results" in data
        assert "query" in data
        assert data["version"] == "2.0.0"

    def test_v1_search_not_available(self, client):
        """Test that V1 doesn't have search endpoint"""
        response = client.get("/api/v1/search?q=test")
        assert response.status_code == 404

    def test_v1_auth_login(self, client):
        """Test V1 authentication"""
        auth_data = {"email": "test@example.com", "password": "testpass"}

        response = client.post("/api/v1/auth/login", json=auth_data)
        assert response.status_code == 200

        data = response.get_json()
        assert "token" in data
        assert data["version"] == "1.0.0"

    def test_v1_feedback_submission(self, client):
        """Test V1 feedback submission"""
        feedback_data = {"content": "Great API!", "rating": 5, "user_id": "test_user"}

        response = client.post("/api/v1/feedback", json=feedback_data)
        assert response.status_code == 201

        data = response.get_json()
        assert data["message"] == "Feedback submitted successfully"
        assert data["feedback"]["version"] == "1.0.0"

    def test_v1_analytics(self, client):
        """Test V1 analytics"""
        response = client.get("/api/v1/analytics/dashboard")
        assert response.status_code == 200

        data = response.get_json()
        assert "metrics" in data
        assert data["version"] == "1.0.0"

    def test_v2_enhanced_analytics(self, client):
        """Test V2 enhanced analytics"""
        response = client.get("/api/v2/analytics/dashboard")
        assert response.status_code == 200

        data = response.get_json()
        assert "metrics" in data
        assert data["version"] == "2.0.0"
        assert "categories" in data["metrics"]
        assert "total_views" in data["metrics"]

    def test_v1_ai_chat(self, client):
        """Test V1 AI chat"""
        chat_data = {"message": "Hello AI"}

        response = client.post("/api/v1/ai/chat", json=chat_data)
        assert response.status_code == 200

        data = response.get_json()
        assert "response" in data
        assert data["version"] == "1.0.0"

    def test_v2_enhanced_ai_chat(self, client):
        """Test V2 enhanced AI chat"""
        chat_data = {"message": "Show me analytics", "context": {"user_id": "test"}}

        response = client.post("/api/v2/ai/chat", json=chat_data)
        assert response.status_code == 200

        data = response.get_json()
        assert "response" in data
        assert data["version"] == "2.0.0"
        assert "suggestions" in data
        assert data["context_used"] is True

    def test_version_headers_in_response(self, client):
        """Test that version headers are included in responses"""
        response = client.get("/api/v1/health")
        assert response.headers.get("API-Version") == "v1"
        assert "v1,v2" in response.headers.get("API-Versions-Available", "")

        response = client.get("/api/v2/health")
        assert response.headers.get("API-Version") == "v2"

    def test_404_error_handling(self, client):
        """Test 404 error handling with version info"""
        response = client.get("/api/v1/nonexistent")
        assert response.status_code == 404

        data = response.get_json()
        assert "available_versions" in data
        assert "v1" in data["available_versions"]
        assert "v2" in data["available_versions"]

    def test_database_initialization(self, client):
        """Test database initialization endpoint"""
        response = client.post("/api/admin/init-database")
        assert response.status_code == 201

        data = response.get_json()
        assert "created" in data
        assert "api_versions_supported" in data
        assert "v1" in data["api_versions_supported"]
        assert "v2" in data["api_versions_supported"]
