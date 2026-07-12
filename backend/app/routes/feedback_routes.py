from flask import Blueprint, jsonify, request
import logging

from utils.firebase_utils import FirebaseUtils

logger = logging.getLogger(__name__)
feedback_bp = Blueprint("feedback", __name__)
firebase = FirebaseUtils()

@feedback_bp.route("/<product_id>", methods=["GET"])
def get_product_feedback(product_id):
    """Get all feedback for a specific product"""
    try:
        feedback_list = firebase.query_documents(
            "feedback", "product_id", "==", product_id
        ) or []

        # Calculate average rating
        total_rating = 0
        count = len(feedback_list)

        if count > 0:
            total_rating = sum(f.get("rating", 0) for f in feedback_list)
            average_rating = round(total_rating / count, 1)
        else:
            average_rating = 0

        return jsonify({
            "product_id": product_id,
            "feedback": feedback_list,
            "average_rating": average_rating,
            "total_reviews": count
        }), 200
    except Exception as e:
        logger.error(f"Failed to retrieve feedback for product {product_id}: {str(e)}")
        return jsonify({"error": "Failed to retrieve feedback"}), 500

@feedback_bp.route("", methods=["POST"])
def submit_feedback():
    """Submit user feedback"""
    try:
        data = request.get_json(silent=True)
        if data is None:
            return jsonify({"error": "No JSON data provided"}), 400

        required_fields = ["product_id", "rating", "comment", "user_name"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        # Validate rating
        try:
            rating = float(data.get("rating"))
            if rating < 1 or rating > 5:
                return jsonify({"error": "Rating must be between 1 and 5"}), 400
        except (ValueError, TypeError):
            return jsonify({"error": "Rating must be a number between 1 and 5"}), 400

        feedback_data = {
            "product_id": data["product_id"],
            "rating": int(rating),
            "comment": data["comment"],
            "user_name": data["user_name"],
            "created_at": datetime.now().isoformat() if 'datetime' in globals() else None
        }
        
        # Make sure datetime is imported
        from datetime import datetime
        feedback_data["created_at"] = datetime.now().isoformat()

        feedback_id = firebase.create_document("feedback", feedback_data)
        feedback_data["id"] = feedback_id

        logger.info(f"Submitted feedback: {feedback_id}")
        return jsonify({
            "message": "Feedback submitted successfully",
            "feedback": feedback_data
        }), 201
    except Exception as e:
        logger.error(f"Failed to submit feedback: {str(e)}")
        return jsonify({"error": "Failed to submit feedback"}), 500
