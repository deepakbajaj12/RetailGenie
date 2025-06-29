import json

import pytest


class TestBasicFunctionality:
    """Test basic API functionality with mocked Firebase."""

    def test_health_endpoints(self, client):
        """Test health check endpoints."""
        # Test home endpoint
        response = client.get("/")
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data["message"] == "RetailGenie API is running!"
        assert data["status"] == "success"

        # Test health endpoint
        response = client.get("/health")
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data["status"] == "healthy"
        assert "timestamp" in data

    def test_products_crud(self, client, mock_firebase):
        """Test basic product CRUD operations."""
        # Test GET products
        response = client.get("/api/products")
        assert response.status_code == 200
        data = json.loads(response.data)
        assert "products" in data
        assert "count" in data

        # Test POST product
        product_data = {
            "name": "Test Product",
            "price": 29.99,
            "category": "Test",
            "description": "A test product",
        }

        response = client.post(
            "/api/products",
            data=json.dumps(product_data),
            content_type="application/json",
        )
        assert response.status_code == 201
        data = json.loads(response.data)
        assert data["name"] == "Test Product"
        assert data["price"] == 29.99

    def test_authentication_basic(self, client, mock_firebase):
        """Test basic authentication endpoints."""
        # Mock setup for registration
        mock_firebase.query_documents.return_value = []  # No existing users

        user_data = {
            "email": "test@example.com",
            "password": "password123",
            "name": "Test User",
        }

        response = client.post(
            "/api/auth/register",
            data=json.dumps(user_data),
            content_type="application/json",
        )
        assert response.status_code == 201
        data = json.loads(response.data)
        assert data["message"] == "User registered successfully"
        assert "user" in data
        assert "token" in data

    def test_feedback_basic(self, client, mock_firebase):
        """Test basic feedback functionality."""
        feedback_data = {
            "product_id": "test-product-id",
            "rating": 5,
            "comment": "Great product!",
            "user_name": "Test User",
        }

        response = client.post(
            "/api/feedback",
            data=json.dumps(feedback_data),
            content_type="application/json",
        )
        assert response.status_code == 201
        data = json.loads(response.data)
        assert data["message"] == "Feedback submitted successfully"
        assert data["feedback"]["rating"] == 5

    def test_error_handling(self, client):
        """Test basic error handling."""
        # Test 404
        response = client.get("/nonexistent-endpoint")
        assert response.status_code == 404
        data = json.loads(response.data)
        assert "error" in data

        # Test POST without JSON
        response = client.post("/api/products")
        assert response.status_code in [400, 500]  # Either is acceptable


class TestDataValidation:
    """Test data validation and edge cases."""

    def test_product_validation(self, client, mock_firebase):
        """Test product data validation."""
        # Missing required fields
        incomplete_product = {"name": "Incomplete Product"}

        response = client.post(
            "/api/products",
            data=json.dumps(incomplete_product),
            content_type="application/json",
        )
        assert response.status_code == 400
        data = json.loads(response.data)
        assert "error" in data
        assert "price" in data["error"]

    def test_feedback_validation(self, client, mock_firebase):
        """Test feedback validation."""
        # Invalid rating
        invalid_feedback = {
            "product_id": "test-product",
            "rating": 10,  # Invalid rating
            "comment": "Test comment",
            "user_name": "Test User",
        }

        response = client.post(
            "/api/feedback",
            data=json.dumps(invalid_feedback),
            content_type="application/json",
        )
        assert response.status_code == 400
        data = json.loads(response.data)
        assert "Rating must be between 1 and 5" in data["error"]

    def test_auth_validation(self, client, mock_firebase):
        """Test authentication validation."""
        # Missing fields
        incomplete_user = {
            "email": "test@example.com"
            # Missing password and name
        }

        response = client.post(
            "/api/auth/register",
            data=json.dumps(incomplete_user),
            content_type="application/json",
        )
        assert response.status_code == 400
        data = json.loads(response.data)
        assert "error" in data
