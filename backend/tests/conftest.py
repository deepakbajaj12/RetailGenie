import os
from unittest.mock import Mock, patch

import pytest


@pytest.fixture(scope="session")
def app():
    """Create application for testing with mocked Firebase."""
    # Set test environment variables
    os.environ["TESTING"] = "true"
    os.environ["FIREBASE_PROJECT_ID"] = "test-project"

    # Mock Firebase before importing the app
    with patch("utils.firebase_utils.FirebaseUtils") as mock_firebase_class:
        firebase_instance = Mock()
        firebase_instance.db = Mock()  # Mock database connection
        mock_firebase_class.return_value = firebase_instance

        from app import create_app

        app = create_app()
        app.config["TESTING"] = True

        # Store the mock firebase instance for use in tests
        app.mock_firebase = firebase_instance

        yield app


@pytest.fixture
def client(app):
    """Test client for the Flask application."""
    return app.test_client()


@pytest.fixture
def mock_firebase(app):
    """Get the mocked Firebase instance."""
    firebase = app.mock_firebase

    # Reset mocks between tests
    firebase.reset_mock()

    # Set up default mock responses
    firebase.db = Mock()
    firebase.get_documents.return_value = [
        {
            "id": "test-product-1",
            "name": "Test Product 1",
            "price": 29.99,
            "category": "Electronics",
            "description": "Test product description",
            "in_stock": True,
            "created_at": "2023-01-01T10:00:00Z",
            "updated_at": "2023-01-01T10:00:00Z",
        },
        {
            "id": "test-product-2",
            "name": "Test Product 2",
            "price": 49.99,
            "category": "Books",
            "description": "Another test product",
            "in_stock": False,
            "created_at": "2023-01-02T10:00:00Z",
            "updated_at": "2023-01-02T10:00:00Z",
        },
    ]

    firebase.get_document.return_value = {
        "id": "test-product-1",
        "name": "Test Product 1",
        "price": 29.99,
        "category": "Electronics",
        "description": "Test product description",
        "in_stock": True,
        "created_at": "2023-01-01T10:00:00Z",
        "updated_at": "2023-01-01T10:00:00Z",
    }

    firebase.create_document.return_value = "new-document-id"
    firebase.update_document.return_value = True
    firebase.delete_document.return_value = True
    firebase.query_documents.return_value = []

    return firebase


@pytest.fixture
def integration_mock_firebase(app):
    """Special Firebase mock for integration tests with dynamic responses."""
    firebase = app.mock_firebase
    firebase.reset_mock()

    # Storage for created documents
    firebase._storage = {}
    firebase._id_counter = 1000

    def mock_create_document(collection, data):
        doc_id = f"doc-{firebase._id_counter}"
        firebase._id_counter += 1
        document = data.copy()
        document["id"] = doc_id
        firebase._storage[doc_id] = document
        return doc_id

    def mock_get_document(collection, doc_id):
        return firebase._storage.get(doc_id)

    def mock_get_documents(collection):
        return list(firebase._storage.values())

    def mock_update_document(collection, doc_id, data):
        if doc_id in firebase._storage:
            firebase._storage[doc_id].update(data)
            return True
        return False

    def mock_delete_document(collection, doc_id):
        if doc_id in firebase._storage:
            del firebase._storage[doc_id]
            return True
        return False

    firebase.create_document.side_effect = mock_create_document
    firebase.get_document.side_effect = mock_get_document
    firebase.get_documents.side_effect = mock_get_documents
    firebase.update_document.side_effect = mock_update_document
    firebase.delete_document.side_effect = mock_delete_document
    firebase.db = Mock()  # Mock database connection

    return firebase


# Additional test fixtures for development workflow


@pytest.fixture
def sample_product_data():
    """Sample product data for testing."""
    return {
        "name": "Test Product",
        "price": 25.99,
        "category": "Test Category",
        "description": "A test product for unit testing",
        "in_stock": True,
        "stock_quantity": 50,
        "sku": "TEST-001",
    }


@pytest.fixture
def sample_user_data():
    """Sample user data for testing."""
    return {
        "email": "test@example.com",
        "username": "testuser",
        "password": "testpassword123",
    }


@pytest.fixture
def performance_timer():
    """Timer for performance testing."""
    import time

    class Timer:
        def __init__(self):
            self.start_time = None
            self.end_time = None

        def start(self):
            self.start_time = time.time()

        def stop(self):
            self.end_time = time.time()

        @property
        def duration(self):
            if self.start_time and self.end_time:
                return self.end_time - self.start_time
            return None

    return Timer()


@pytest.fixture
def auth_headers():
    """Sample authentication headers."""
    return {"Authorization": "Bearer test-token", "Content-Type": "application/json"}


@pytest.fixture(autouse=True)
def reset_mocks():
    """Reset all mocks after each test."""
    yield
    # Any cleanup can be done here
