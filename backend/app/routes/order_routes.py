import logging
from datetime import datetime, timezone

from flask import Blueprint, jsonify, request
from utils.firebase_utils import FirebaseUtils

logger = logging.getLogger(__name__)
order_bp = Blueprint("orders", __name__)
firebase = FirebaseUtils()


@order_bp.route("", methods=["GET"])
def get_orders():
    """Get all orders"""
    try:
        orders = firebase.get_documents("orders")
        # Sort by date desc
        orders.sort(key=lambda x: x.get("created_at", ""), reverse=True)
        return jsonify({"orders": orders, "count": len(orders)}), 200
    except Exception as e:
        logger.error(f"Failed to retrieve orders: {str(e)}")
        return jsonify({"error": "Failed to retrieve orders"}), 500


@order_bp.route("", methods=["POST"])
def create_order():
    """Create a new order"""
    try:
        data = request.get_json(silent=True) or {}
        required_fields = ["customer_name", "total_amount", "items"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        order_data = {
            "customer_name": data.get("customer_name"),
            "total_amount": float(data.get("total_amount")),
            "status": data.get("status", "Pending"),
            "items": data.get("items"),  # List of {product_id, quantity, price}
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }

        order_id = firebase.create_document("orders", order_data)
        order_data["id"] = order_id

        logger.info(f"Created order: {order_id}")
        return jsonify(order_data), 201
    except Exception as e:
        logger.error(f"Failed to create order: {str(e)}")
        return jsonify({"error": "Failed to create order"}), 500


@order_bp.route("/<order_id>", methods=["PUT"])
def update_order(order_id):
    """Update order status"""
    try:
        data = request.get_json(silent=True) or {}

        # Verify order exists
        existing = firebase.get_document("orders", order_id)
        if not existing:
            return jsonify({"error": "Order not found"}), 404

        update_data = {"updated_at": datetime.now(timezone.utc).isoformat()}
        if "status" in data:
            update_data["status"] = data["status"]

        firebase.update_document("orders", order_id, update_data)

        updated_order = firebase.get_document("orders", order_id)
        updated_order["id"] = order_id

        logger.info(f"Updated order: {order_id}")
        return jsonify(updated_order), 200
    except Exception as e:
        logger.error(f"Failed to update order {order_id}: {str(e)}")
        return jsonify({"error": "Failed to update order"}), 500
