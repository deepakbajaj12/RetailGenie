import json
from unittest.mock import patch
import pytest

@pytest.fixture
def mock_jwt_decode():
    with patch("jwt.decode") as mock_decode:
        mock_decode.return_value = {
            "user_id": "test-user-id",
            "email": "test@example.com",
            "exp": 9999999999
        }
        yield mock_decode

def test_get_settings_default(client, mock_firebase, mock_jwt_decode, auth_headers):
    """Test retrieving default settings when none exist in Firestore"""
    # Force mock firebase get_document to return None (so default settings are returned)
    mock_firebase.get_document.return_value = None

    response = client.get("/api/settings", headers=auth_headers)
    assert response.status_code == 200
    
    data = json.loads(response.data)
    assert data["darkMode"] is False
    assert data["currency"] == "USD"
    assert data["id"] == "test-user-id"

def test_get_settings_custom(client, mock_firebase, mock_jwt_decode, auth_headers):
    """Test retrieving existing custom settings"""
    custom_settings = {
        "id": "test-user-id",
        "darkMode": True,
        "currency": "EUR",
        "language": "fr"
    }
    mock_firebase.get_document.return_value = custom_settings

    response = client.get("/api/settings", headers=auth_headers)
    assert response.status_code == 200
    
    data = json.loads(response.data)
    assert data["darkMode"] is True
    assert data["currency"] == "EUR"
    assert data["language"] == "fr"

def test_update_settings(client, mock_firebase, mock_jwt_decode, auth_headers):
    """Test updating settings"""
    updated_data = {
        "darkMode": True,
        "currency": "GBP",
        "language": "en"
    }
    mock_firebase.get_document.return_value = {**updated_data, "id": "test-user-id"}

    response = client.put(
        "/api/settings",
        headers=auth_headers,
        data=json.dumps(updated_data)
    )
    assert response.status_code == 200
    
    data = json.loads(response.data)
    assert data["darkMode"] is True
    assert data["currency"] == "GBP"
    assert data["id"] == "test-user-id"
    assert mock_firebase.create_document.called

def test_settings_unauthorized(client):
    """Test settings endpoint blocks request with missing auth token"""
    response = client.get("/api/settings")
    assert response.status_code == 401
