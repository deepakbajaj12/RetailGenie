import json
from unittest.mock import Mock, patch

import pytest


class TestIntegration:
    """Integration tests that test the full application flow."""

    def test_full_product_lifecycle(self, client, mock_firebase):
        """Test complete product lifecycle: create, read, update, delete."""
        # 1. Create a product
        create_data = {
            "name": "Integration Test Product",
            "price": 99.99,
            "category": "Test",
            "description": "Product for integration testing",
            "in_stock": True,
        }

        mock_firebase.create_document.return_value = "integration-product-id"

        create_response = client.post(
            "/api/products",
            data=json.dumps(create_data),
            content_type="application/json",
        )
        assert create_response.status_code == 201

        # 2. Read the product
        mock_firebase.get_document.return_value = {
            "id": "integration-product-id",
            "name": "Integration Test Product",
            "price": 99.99,
            "category": "Test",
            "description": "Product for integration testing",
            "in_stock": True,
            "created_at": "2023-01-01T10:00:00Z",
            "updated_at": "2023-01-01T10:00:00Z",
        }

        read_response = client.get("/api/products/integration-product-id")
        assert read_response.status_code == 200
        read_data = json.loads(read_response.data)
        assert read_data["name"] == "Integration Test Product"

        # 3. Update the product
        update_data = {"name": "Updated Integration Product", "price": 149.99}

        mock_firebase.get_document.return_value = {
            "id": "integration-product-id",
            "name": "Updated Integration Product",
            "price": 149.99,
            "category": "Test",
            "description": "Product for integration testing",
            "in_stock": True,
            "created_at": "2023-01-01T10:00:00Z",
            "updated_at": "2023-01-01T12:00:00Z",
        }

        update_response = client.put(
            "/api/products/integration-product-id",
            data=json.dumps(update_data),
            content_type="application/json",
        )
        assert update_response.status_code == 200
        update_data = json.loads(update_response.data)
        assert update_data["name"] == "Updated Integration Product"
        assert update_data["price"] == 149.99

        # 4. Delete the product
        delete_response = client.delete("/api/products/integration-product-id")
        assert delete_response.status_code == 204

    def test_user_registration_and_login_flow(self, client, mock_firebase):
        """Test user registration followed by login."""
        # 1. Register a new user
        register_data = {
            "email": "integration@test.com",
            "password": "password123",
            "name": "Integration Test User",
        }

        mock_firebase.query_documents.return_value = []  # No existing users
        mock_firebase.create_document.return_value = "integration-user-id"

        register_response = client.post(
            "/api/auth/register",
            data=json.dumps(register_data),
            content_type="application/json",
        )
        assert register_response.status_code == 201

        register_data = json.loads(register_response.data)
        assert register_data["user"]["email"] == "integration@test.com"

        # 2. Login with the registered user
        login_data = {"email": "integration@test.com", "password": "password123"}

        mock_firebase.query_documents.return_value = [
            {
                "id": "integration-user-id",
                "email": "integration@test.com",
                "name": "Integration Test User",
                "role": "user",
            }
        ]

        login_response = client.post(
            "/api/auth/login",
            data=json.dumps(login_data),
            content_type="application/json",
        )
        assert login_response.status_code == 200

        login_data = json.loads(login_response.data)
        assert login_data["user"]["email"] == "integration@test.com"
        assert "token" in login_data

    def test_product_feedback_flow(self, client, mock_firebase):
        """Test submitting and retrieving product feedback."""
        product_id = "feedback-test-product"

        # 1. Submit feedback
        feedback_data = {
            "product_id": product_id,
            "rating": 5,
            "comment": "Excellent product for testing!",
            "user_name": "Integration Tester",
        }

        mock_firebase.create_document.return_value = "feedback-id-1"

        submit_response = client.post(
            "/api/feedback",
            data=json.dumps(feedback_data),
            content_type="application/json",
        )
        assert submit_response.status_code == 201

        # 2. Get feedback for the product
        mock_firebase.query_documents.return_value = [
            {
                "id": "feedback-id-1",
                "product_id": product_id,
                "rating": 5,
                "comment": "Excellent product for testing!",
                "user_name": "Integration Tester",
                "created_at": "2023-01-01T10:00:00Z",
            }
        ]

        get_response = client.get(f"/api/feedback/{product_id}")
        assert get_response.status_code == 200

        feedback_response = json.loads(get_response.data)
        assert feedback_response["product_id"] == product_id
        assert len(feedback_response["feedback"]) == 1
        assert feedback_response["average_rating"] == 5.0
        assert feedback_response["total_reviews"] == 1

    def test_database_initialization_and_product_retrieval(self, client, mock_firebase):
        """Test database initialization followed by product retrieval."""
        # 1. Initialize database
        mock_firebase.create_document.side_effect = [
            "init-prod-1",
            "init-prod-2",
            "init-prod-3",
        ]

        init_response = client.post("/api/admin/init-db")
        assert init_response.status_code == 201

        init_data = json.loads(init_response.data)
        assert init_data["products_created"] == 3

        # 2. Get all products
        mock_firebase.get_documents.return_value = [
            {
                "id": "init-prod-1",
                "name": "Wireless Bluetooth Headphones",
                "price": 79.99,
                "category": "Electronics",
                "description": "High-quality wireless headphones with noise cancellation",
                "in_stock": True,
            },
            {
                "id": "init-prod-2",
                "name": "Smart Fitness Watch",
                "price": 199.99,
                "category": "Electronics",
                "description": "Advanced fitness tracking with heart rate monitoring",
                "in_stock": True,
            },
            {
                "id": "init-prod-3",
                "name": "Organic Coffee Beans",
                "price": 24.99,
                "category": "Food & Beverage",
                "description": "Premium organic coffee beans, medium roast",
                "in_stock": False,
            },
        ]

        products_response = client.get("/api/products")
        assert products_response.status_code == 200

        products_data = json.loads(products_response.data)
        assert products_data["count"] == 3
        assert len(products_data["products"]) == 3

        # Verify specific products
        product_names = [p["name"] for p in products_data["products"]]
        assert "Wireless Bluetooth Headphones" in product_names
        assert "Smart Fitness Watch" in product_names
        assert "Organic Coffee Beans" in product_names


class TestErrorScenarios:
    """Test various error scenarios and edge cases."""

    def test_firebase_connection_failure(self, client):
        """Test behavior when Firebase connection fails."""
        with patch("app.FirebaseUtils") as mock_firebase_class:
            firebase_instance = Mock()
            firebase_instance.db = None  # Simulate connection failure
            firebase_instance.get_documents.side_effect = Exception(
                "Firebase connection failed"
            )
            mock_firebase_class.return_value = firebase_instance

            response = client.get("/api/products")
            assert response.status_code == 500

            data = json.loads(response.data)
            assert "error" in data

    def test_malformed_json_requests(self, client, mock_firebase):
        """Test handling of malformed JSON requests."""
        response = client.post(
            "/api/products", data='{"invalid": json}', content_type="application/json"
        )
        assert response.status_code == 400

    def test_content_type_validation(self, client, mock_firebase):
        """Test validation of content type."""
        response = client.post(
            "/api/products", data='{"name": "Test"}', content_type="text/plain"
        )
        assert response.status_code == 400

    def test_large_payload_handling(self, client, mock_firebase):
        """Test handling of large payloads."""
        large_description = "A" * 10000  # 10KB description
        product_data = {
            "name": "Large Product",
            "price": 99.99,
            "category": "Test",
            "description": large_description,
            "in_stock": True,
        }

        mock_firebase.create_document.return_value = "large-product-id"

        response = client.post(
            "/api/products",
            data=json.dumps(product_data),
            content_type="application/json",
        )
        assert response.status_code == 201  # Should handle large payloads

    def test_concurrent_operations(self, client, mock_firebase):
        """Test handling of concurrent operations."""
        # This would require more complex setup for true concurrency testing
        # For now, we'll test rapid sequential operations

        mock_firebase.create_document.side_effect = [f"product-{i}" for i in range(5)]

        for i in range(5):
            product_data = {
                "name": f"Concurrent Product {i}",
                "price": 10.0 + i,
                "category": "Test",
            }

            response = client.post(
                "/api/products",
                data=json.dumps(product_data),
                content_type="application/json",
            )
            assert response.status_code == 201
