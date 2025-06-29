import json
from unittest.mock import Mock, patch

import pytest

from utils.firebase_utils import FirebaseUtils


class TestFirebaseUtils:
    """Test Firebase utilities with mocked Firebase."""

    @patch("firebase_admin.initialize_app")
    @patch("firebase_admin.firestore.client")
    def test_firebase_initialization(self, mock_firestore, mock_init):
        """Test Firebase initialization."""
        mock_db = Mock()
        mock_firestore.return_value = mock_db

        firebase = FirebaseUtils()

        assert firebase.db is not None
        mock_init.assert_called_once()
        mock_firestore.assert_called_once()

    @patch("firebase_admin.initialize_app")
    @patch("firebase_admin.firestore.client")
    def test_create_document(self, mock_firestore, mock_init):
        """Test document creation."""
        mock_db = Mock()
        mock_collection = Mock()
        mock_doc_ref = Mock()

        mock_db.collection.return_value = mock_collection
        mock_collection.add.return_value = (mock_doc_ref, None)
        mock_doc_ref.id = "test-doc-id"
        mock_firestore.return_value = mock_db

        firebase = FirebaseUtils()
        doc_id = firebase.create_document("test_collection", {"name": "test"})

        assert doc_id == "test-doc-id"
        mock_db.collection.assert_called_with("test_collection")
        mock_collection.add.assert_called_with({"name": "test"})

    @patch("firebase_admin.initialize_app")
    @patch("firebase_admin.firestore.client")
    def test_get_document(self, mock_firestore, mock_init):
        """Test document retrieval."""
        mock_db = Mock()
        mock_collection = Mock()
        mock_doc_ref = Mock()
        mock_doc = Mock()

        mock_db.collection.return_value = mock_collection
        mock_collection.document.return_value = mock_doc_ref
        mock_doc_ref.get.return_value = mock_doc
        mock_doc.exists = True
        mock_doc.to_dict.return_value = {"name": "test", "price": 29.99}
        mock_doc.id = "test-doc-id"
        mock_firestore.return_value = mock_db

        firebase = FirebaseUtils()
        result = firebase.get_document("test_collection", "test-doc-id")

        assert result["name"] == "test"
        assert result["price"] == 29.99
        assert result["id"] == "test-doc-id"

    @patch("firebase_admin.initialize_app")
    @patch("firebase_admin.firestore.client")
    def test_get_nonexistent_document(self, mock_firestore, mock_init):
        """Test retrieving a document that doesn't exist."""
        mock_db = Mock()
        mock_collection = Mock()
        mock_doc_ref = Mock()
        mock_doc = Mock()

        mock_db.collection.return_value = mock_collection
        mock_collection.document.return_value = mock_doc_ref
        mock_doc_ref.get.return_value = mock_doc
        mock_doc.exists = False
        mock_firestore.return_value = mock_db

        firebase = FirebaseUtils()
        result = firebase.get_document("test_collection", "nonexistent")

        assert result is None

    @patch("firebase_admin.initialize_app")
    @patch("firebase_admin.firestore.client")
    def test_get_documents(self, mock_firestore, mock_init):
        """Test getting multiple documents."""
        mock_db = Mock()
        mock_collection = Mock()
        mock_doc1 = Mock()
        mock_doc2 = Mock()

        mock_db.collection.return_value = mock_collection
        mock_collection.stream.return_value = [mock_doc1, mock_doc2]

        mock_doc1.to_dict.return_value = {"name": "Product 1", "price": 29.99}
        mock_doc1.id = "doc1"
        mock_doc2.to_dict.return_value = {"name": "Product 2", "price": 39.99}
        mock_doc2.id = "doc2"

        mock_firestore.return_value = mock_db

        firebase = FirebaseUtils()
        results = firebase.get_documents("test_collection")

        assert len(results) == 2
        assert results[0]["name"] == "Product 1"
        assert results[0]["id"] == "doc1"
        assert results[1]["name"] == "Product 2"
        assert results[1]["id"] == "doc2"

    @patch("firebase_admin.initialize_app")
    @patch("firebase_admin.firestore.client")
    def test_update_document(self, mock_firestore, mock_init):
        """Test document update."""
        mock_db = Mock()
        mock_collection = Mock()
        mock_doc_ref = Mock()

        mock_db.collection.return_value = mock_collection
        mock_collection.document.return_value = mock_doc_ref
        mock_firestore.return_value = mock_db

        firebase = FirebaseUtils()
        result = firebase.update_document(
            "test_collection", "test-doc-id", {"name": "updated"}
        )

        assert result is True
        mock_doc_ref.update.assert_called_with({"name": "updated"})

    @patch("firebase_admin.initialize_app")
    @patch("firebase_admin.firestore.client")
    def test_delete_document(self, mock_firestore, mock_init):
        """Test document deletion."""
        mock_db = Mock()
        mock_collection = Mock()
        mock_doc_ref = Mock()

        mock_db.collection.return_value = mock_collection
        mock_collection.document.return_value = mock_doc_ref
        mock_firestore.return_value = mock_db

        firebase = FirebaseUtils()
        result = firebase.delete_document("test_collection", "test-doc-id")

        assert result is True
        mock_doc_ref.delete.assert_called_once()

    @patch("firebase_admin.initialize_app")
    @patch("firebase_admin.firestore.client")
    def test_query_documents(self, mock_firestore, mock_init):
        """Test document querying."""
        mock_db = Mock()
        mock_collection = Mock()
        mock_query = Mock()
        mock_doc = Mock()

        mock_db.collection.return_value = mock_collection
        mock_collection.where.return_value = mock_query
        mock_query.stream.return_value = [mock_doc]

        mock_doc.to_dict.return_value = {
            "name": "Filtered Product",
            "category": "Electronics",
        }
        mock_doc.id = "filtered-doc"

        mock_firestore.return_value = mock_db

        firebase = FirebaseUtils()
        results = firebase.query_documents(
            "test_collection", "category", "==", "Electronics"
        )

        assert len(results) == 1
        assert results[0]["name"] == "Filtered Product"
        assert results[0]["category"] == "Electronics"
        mock_collection.where.assert_called_with("category", "==", "Electronics")
