import logging

from flask import Blueprint, jsonify, request
from middleware.auth_middleware import require_auth
from utils.firebase_utils import FirebaseUtils

logger = logging.getLogger(__name__)

settings_bp = Blueprint("settings", __name__)
firebase = FirebaseUtils()
collection_name = "settings"


@settings_bp.route("", methods=["GET"])
@require_auth
def get_settings():
    """
    Get settings for the authenticated user
    """
    try:
        user_id = request.current_user.get("user_id")
        settings = firebase.get_document(collection_name, user_id)

        # If no settings exist yet, return default settings
        if not settings:
            default_settings = {
                "id": user_id,
                "darkMode": False,
                "emailNotifications": True,
                "pushNotifications": False,
                "smsNotifications": False,
                "currency": "USD",
                "language": "en",
                "lowStockThreshold": 10,
                "theme": "light",
                "updated_at": None,
            }
            return jsonify(default_settings), 200

        return jsonify(settings), 200
    except Exception as e:
        logger.error(f"Error getting settings: {str(e)}")
        return jsonify({"error": "Failed to retrieve settings"}), 500


@settings_bp.route("", methods=["PUT"])
@require_auth
def update_settings():
    """
    Update settings for the authenticated user
    """
    try:
        user_id = request.current_user.get("user_id")
        data = request.get_json(silent=True) or {}

        # Update settings in Firestore
        data["updated_at"] = firebase.db.SERVER_TIMESTAMP if firebase.db else None

        # Use user_id as document_id to maintain 1:1 mapping
        firebase.create_document(collection_name, data, document_id=user_id)

        # Return the saved settings
        saved_settings = firebase.get_document(collection_name, user_id)
        return jsonify(saved_settings or data), 200
    except Exception as e:
        logger.error(f"Error updating settings: {str(e)}")
        return jsonify({"error": "Failed to update settings"}), 500
