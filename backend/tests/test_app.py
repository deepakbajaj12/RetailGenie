import json
from unittest.mock import Mock, patch

import pytest


class TestHealthEndpoints:
    """Test health and status endpoints."""

    def test_home_endpoint(self, client):
        """Test the home endpoint."""
        response = client.get("/")
        assert response.status_code == 200

        data = json.loads(response.data)
        assert data["message"] == "RetailGenie API is running!"
        assert data["status"] == "success"
        assert "database" in data

    def test_health_endpoint(self, client):
        """Test the health check endpoint."""
        response = client.get("/health")
        assert response.status_code == 200

        data = json.loads(response.data)
        assert data["status"] == "healthy"
        assert "timestamp" in data
        assert "database_status" in data
        assert "firebase_project" in data


class TestProductEndpoints:
    """Test product-related endpoints."""

    def test_get_products(self, client, mock_firebase):
        """Test getting all products."""
        response = client.get("/api/products")
        assert response.status_code == 200

        data = json.loads(response.data)
        assert "products" in data
        assert "count" in data
        assert data["count"] == 2
        assert len(data["products"]) == 2

    def test_get_single_product(self, client, mock_firebase):
        """Test getting a single product."""
        response = client.get("/api/products/test-product-1")
        assert response.status_code == 200

        data = json.loads(response.data)
        assert data["id"] == "test-product-1"
        assert data["name"] == "Test Product 1"
        assert data["price"] == 29.99

    def test_get_nonexistent_product(self, client, mock_firebase):
        """Test getting a product that doesn't exist."""
        mock_firebase.get_document.return_value = None

        response = client.get("/api/products/nonexistent")
        assert response.status_code == 404

        data = json.loads(response.data)
        assert data["error"] == "Product not found"

    def test_create_product(self, client, mock_firebase):
        """Test creating a new product."""
        product_data = {
            "name": "New Test Product",
            "price": 39.99,
            "category": "Test Category",
            "description": "A new test product",
            "in_stock": True,
        }

        response = client.post(
            "/api/products",
            data=json.dumps(product_data),
            content_type="application/json",
        )
        assert response.status_code == 201

        data = json.loads(response.data)
        assert data["name"] == "New Test Product"
        assert data["price"] == 39.99
        assert data["id"] == "new-document-id"

    def test_create_product_missing_fields(self, client, mock_firebase):
        """Test creating a product with missing required fields."""
        product_data = {
            "name": "Incomplete Product"
            # Missing price
        }

        response = client.post(
            "/api/products",
            data=json.dumps(product_data),
            content_type="application/json",
        )
        assert response.status_code == 400

        data = json.loads(response.data)
        assert "error" in data
        assert "Missing required field: price" in data["error"]

    def test_create_product_no_json(self, client, mock_firebase):
        """Test creating a product with no JSON data."""
        response = client.post("/api/products")
        assert response.status_code == 400

        data = json.loads(response.data)
        assert data["error"] == "No JSON data provided"

    def test_update_product(self, client, mock_firebase):
        """Test updating an existing product."""
        update_data = {"name": "Updated Product Name", "price": 59.99}

        # Mock the updated product response
        mock_firebase.get_document.return_value = {
            "id": "test-product-1",
            "name": "Updated Product Name",
            "price": 59.99,
            "category": "Electronics",
            "description": "Test product description",
            "in_stock": True,
            "created_at": "2023-01-01T10:00:00Z",
            "updated_at": "2023-01-01T12:00:00Z",
        }

        response = client.put(
            "/api/products/test-product-1",
            data=json.dumps(update_data),
            content_type="application/json",
        )
        assert response.status_code == 200

        data = json.loads(response.data)
        assert data["name"] == "Updated Product Name"
        assert data["price"] == 59.99

    def test_update_nonexistent_product(self, client, mock_firebase):
        """Test updating a product that doesn't exist."""
        mock_firebase.get_document.return_value = None

        update_data = {"name": "Updated Name"}

        response = client.put(
            "/api/products/nonexistent",
            data=json.dumps(update_data),
            content_type="application/json",
        )
        assert response.status_code == 404

        data = json.loads(response.data)
        assert data["error"] == "Product not found"

    def test_delete_product(self, client, mock_firebase):
        """Test deleting a product."""
        response = client.delete("/api/products/test-product-1")
        assert response.status_code == 204
        assert response.data == b""

    def test_delete_nonexistent_product(self, client, mock_firebase):
        """Test deleting a product that doesn't exist."""
        mock_firebase.get_document.return_value = None

        response = client.delete("/api/products/nonexistent")
        assert response.status_code == 404

        data = json.loads(response.data)
        assert data["error"] == "Product not found"


class TestAuthEndpoints:
    """Test authentication endpoints."""

    def test_register_user(self, client, mock_firebase):
        """Test user registration."""
        user_data = {
            "email": "test@example.com",
            "password": "password123",
            "name": "Test User",
        }

        # Mock no existing users
        mock_firebase.query_documents.return_value = []
        mock_firebase.create_document.return_value = "new-document-id"

        response = client.post(
            "/api/auth/register",
            data=json.dumps(user_data),
            content_type="application/json",
        )
        assert response.status_code == 201

        data = json.loads(response.data)
        assert data["message"] == "User registered successfully"
        assert data["user"]["email"] == "test@example.com"
        assert data["user"]["name"] == "Test User"
        assert "token" in data

    def test_register_existing_user(self, client, mock_firebase):
        """Test registering a user that already exists."""
        user_data = {
            "email": "existing@example.com",
            "password": "password123",
            "name": "Existing User",
        }

        # Mock existing user
        mock_firebase.query_documents.return_value = [
            {"id": "existing-user", "email": "existing@example.com"}
        ]

        response = client.post(
            "/api/auth/register",
            data=json.dumps(user_data),
            content_type="application/json",
        )
        assert response.status_code == 400

        data = json.loads(response.data)
        assert data["error"] == "User with this email already exists"

    def test_login_user(self, client, mock_firebase):
        """Test user login."""
        login_data = {"email": "test@example.com", "password": "password123"}

        # Mock existing user
        mock_firebase.query_documents.return_value = [
            {
                "id": "user-123",
                "email": "test@example.com",
                "name": "Test User",
                "role": "user",
            }
        ]

        response = client.post(
            "/api/auth/login",
            data=json.dumps(login_data),
            content_type="application/json",
        )
        assert response.status_code == 200

        data = json.loads(response.data)
        assert data["message"] == "Login successful"
        assert data["user"]["email"] == "test@example.com"
        assert "token" in data

    def test_login_invalid_user(self, client, mock_firebase):
        """Test login with invalid credentials."""
        login_data = {"email": "nonexistent@example.com", "password": "password123"}

        # Mock no user found
        mock_firebase.query_documents.return_value = []

        response = client.post(
            "/api/auth/login",
            data=json.dumps(login_data),
            content_type="application/json",
        )
        assert response.status_code == 401

        data = json.loads(response.data)
        assert data["error"] == "Invalid credentials"


class TestFeedbackEndpoints:
    """Test feedback endpoints."""

    def test_get_feedback(self, client, mock_firebase):
        """Test getting feedback for a product."""
        # Mock feedback data
        mock_firebase.query_documents.return_value = [
            {
                "id": "feedback-1",
                "product_id": "test-product-1",
                "rating": 5,
                "comment": "Great product!",
                "user_name": "Test User",
                "created_at": "2023-01-01T10:00:00Z",
            },
            {
                "id": "feedback-2",
                "product_id": "test-product-1",
                "rating": 4,
                "comment": "Good value",
                "user_name": "Another User",
                "created_at": "2023-01-02T10:00:00Z",
            },
        ]

        response = client.get("/api/feedback/test-product-1")
        assert response.status_code == 200

        data = json.loads(response.data)
        assert data["product_id"] == "test-product-1"
        assert len(data["feedback"]) == 2
        assert data["average_rating"] == 4.5
        assert data["total_reviews"] == 2

    def test_submit_feedback(self, client, mock_firebase):
        """Test submitting feedback."""
        feedback_data = {
            "product_id": "test-product-1",
            "rating": 5,
            "comment": "Excellent product!",
            "user_name": "Happy Customer",
        }

        mock_firebase.create_document.return_value = "new-document-id"

        response = client.post(
            "/api/feedback",
            data=json.dumps(feedback_data),
            content_type="application/json",
        )
        assert response.status_code == 201

        data = json.loads(response.data)
        assert data["message"] == "Feedback submitted successfully"
        assert data["feedback"]["rating"] == 5
        assert data["feedback"]["comment"] == "Excellent product!"
        assert data["feedback"]["id"] == "new-document-id"

    def test_submit_feedback_invalid_rating(self, client, mock_firebase):
        """Test submitting feedback with invalid rating."""
        feedback_data = {
            "product_id": "test-product-1",
            "rating": 6,  # Invalid rating
            "comment": "Good product",
            "user_name": "Test User",
        }

        response = client.post(
            "/api/feedback",
            data=json.dumps(feedback_data),
            content_type="application/json",
        )
        assert response.status_code == 400

        data = json.loads(response.data)
        assert data["error"] == "Rating must be between 1 and 5"


class TestAdminEndpoints:
    """Test admin endpoints."""

    def test_init_database(self, client, mock_firebase):
        """Test database initialization."""
        mock_firebase.create_document.side_effect = ["prod-1", "prod-2", "prod-3"]

        response = client.post("/api/admin/init-db")
        assert response.status_code == 201

        data = json.loads(response.data)
        assert data["message"] == "Database initialized successfully"
        assert data["products_created"] == 3
        assert len(data["products"]) == 3


class TestErrorHandlers:
    """Test error handling."""

    def test_404_handler(self, client):
        """Test 404 error handler."""
        response = client.get("/nonexistent-endpoint")
        assert response.status_code == 404

        data = json.loads(response.data)
        assert data["error"] == "Endpoint not found"
