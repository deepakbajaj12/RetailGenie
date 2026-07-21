import logging
from datetime import datetime
from flask import Blueprint, jsonify, request
from middleware.auth_middleware import require_auth
from utils.firebase_utils import FirebaseUtils

logger = logging.getLogger(__name__)

notification_bp = Blueprint("notifications", __name__)
firebase = FirebaseUtils()
collection_name = "notifications"

@notification_bp.route("", methods=["GET"])
@require_auth
def get_notifications():
    """
    Get notifications for the authenticated user
    """
    try:
        user_id = request.current_user.get("user_id")
        notifications = firebase.query_documents(collection_name, "user_id", "==", user_id)
        
        # If no notifications exist, seed default notifications for a better portfolio demonstration
        if not notifications:
            default_notifications = [
                {
                    "user_id": user_id,
                    "title": "Welcome to RetailGenie!",
                    "message": "Welcome to your AI-powered retail management dashboard. Start by browsing products or checking inventory insights.",
                    "type": "info",
                    "read": False,
                    "created_at": datetime.now().isoformat()
                },
                {
                    "user_id": user_id,
                    "title": "Low Stock Warning",
                    "message": "Product 'Premium Wireless Headphones' has dropped below the threshold of 10 items (7 remaining).",
                    "type": "warning",
                    "read": False,
                    "created_at": datetime.now().isoformat()
                },
                {
                    "user_id": user_id,
                    "title": "Smart Pricing Optimization Opportunity",
                    "message": "AI pricing engine detected surge demand for category 'Electronics'. Recommended price adjustments are ready.",
                    "type": "success",
                    "read": False,
                    "created_at": datetime.now().isoformat()
                }
            ]
            
            for notif in default_notifications:
                notif_id = firebase.create_document(collection_name, notif)
                notif["id"] = notif_id
            
            notifications = default_notifications
            
        # Sort by created_at descending
        try:
            notifications.sort(key=lambda x: x.get("created_at", ""), reverse=True)
        except Exception:
            pass
            
        return jsonify(notifications), 200
    except Exception as e:
        logger.error(f"Error getting notifications: {str(e)}")
        return jsonify({"error": "Failed to retrieve notifications"}), 500

@notification_bp.route("/<notification_id>/read", methods=["PUT"])
@require_auth
def mark_as_read(notification_id):
    """
    Mark a notification as read
    """
    try:
        success = firebase.update_document(collection_name, notification_id, {"read": True})
        if not success:
            return jsonify({"error": "Notification not found"}), 404
        return jsonify({"message": "Notification marked as read", "success": True}), 200
    except Exception as e:
        logger.error(f"Error marking notification as read: {str(e)}")
        return jsonify({"error": "Failed to update notification"}), 500

@notification_bp.route("/<notification_id>", methods=["DELETE"])
@require_auth
def delete_notification(notification_id):
    """
    Delete a notification
    """
    try:
        success = firebase.delete_document(collection_name, notification_id)
        if not success:
            return jsonify({"error": "Notification not found"}), 404
        return jsonify({"message": "Notification deleted successfully", "success": True}), 200
    except Exception as e:
        logger.error(f"Error deleting notification: {str(e)}")
        return jsonify({"error": "Failed to delete notification"}), 500
