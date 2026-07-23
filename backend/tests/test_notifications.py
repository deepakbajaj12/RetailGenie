import json
from unittest.mock import patch

import pytest


@pytest.fixture
def mock_jwt_decode():
    with patch("jwt.decode") as mock_decode:
        mock_decode.return_value = {
            "user_id": "test-user-id",
            "email": "test@example.com",
            "exp": 9999999999,
        }
        yield mock_decode


def test_get_notifications_seeding(
    client, mock_firebase, mock_jwt_decode, auth_headers
):
    """Test retrieving notifications which triggers seeding if empty"""
    mock_firebase.query_documents.return_value = []

    # We mock create_document to return a fake ID
    mock_firebase.create_document.return_value = "fake-notif-id"

    response = client.get("/api/notifications", headers=auth_headers)
    assert response.status_code == 200

    data = json.loads(response.data)
    assert len(data) == 3
    assert data[0]["user_id"] == "test-user-id"
    assert data[0]["id"] == "fake-notif-id"
    assert mock_firebase.create_document.call_count == 3


def test_get_notifications_existing(
    client, mock_firebase, mock_jwt_decode, auth_headers
):
    """Test retrieving existing user notifications"""
    existing_notifications = [
        {
            "id": "notif-1",
            "user_id": "test-user-id",
            "title": "Alert 1",
            "read": False,
            "created_at": "2023-01-01T10:00:00Z",
        }
    ]
    mock_firebase.query_documents.return_value = existing_notifications

    response = client.get("/api/notifications", headers=auth_headers)
    assert response.status_code == 200

    data = json.loads(response.data)
    assert len(data) == 1
    assert data[0]["title"] == "Alert 1"
    assert mock_firebase.create_document.called is False


def test_mark_notification_as_read(
    client, mock_firebase, mock_jwt_decode, auth_headers
):
    """Test marking notification as read"""
    mock_firebase.update_document.return_value = True

    response = client.put("/api/notifications/notif-1/read", headers=auth_headers)
    assert response.status_code == 200

    data = json.loads(response.data)
    assert data["success"] is True
    mock_firebase.update_document.assert_called_with(
        "notifications", "notif-1", {"read": True}
    )


def test_delete_notification(client, mock_firebase, mock_jwt_decode, auth_headers):
    """Test deleting notification"""
    mock_firebase.delete_document.return_value = True

    response = client.delete("/api/notifications/notif-1", headers=auth_headers)
    assert response.status_code == 200

    data = json.loads(response.data)
    assert data["success"] is True
    mock_firebase.delete_document.assert_called_with("notifications", "notif-1")


def test_notifications_unauthorized(client):
    """Test notification endpoint blocks request with missing auth token"""
    response = client.get("/api/notifications")
    assert response.status_code == 401
