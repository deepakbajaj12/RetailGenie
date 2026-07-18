import logging
from datetime import datetime, timezone

from flask import Blueprint, jsonify, request

from utils.firebase_utils import FirebaseUtils

logger = logging.getLogger(__name__)
supplier_bp = Blueprint("suppliers", __name__)
firebase = FirebaseUtils()


@supplier_bp.route("", methods=["GET"])
def get_suppliers():
    """Get all suppliers"""
    try:
        suppliers = firebase.get_documents("suppliers")
        suppliers.sort(key=lambda x: x.get("name", ""), reverse=False)
        return jsonify({"suppliers": suppliers, "count": len(suppliers)}), 200
    except Exception as e:
        logger.error(f"Failed to retrieve suppliers: {str(e)}")
        return jsonify({"error": "Failed to retrieve suppliers"}), 500


@supplier_bp.route("", methods=["POST"])
def create_supplier():
    """Create a new supplier"""
    try:
        data = request.get_json(silent=True) or {}
        required_fields = ["name", "contact_email"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        supplier_data = {
            "name": data.get("name"),
            "contact_email": data.get("contact_email"),
            "phone": data.get("phone", ""),
            "address": data.get("address", ""),
            "category": data.get("category", "General"),
            "rating": float(data.get("rating", 4.0)),
            "status": data.get("status", "Active"),
            "lead_time_days": int(data.get("lead_time_days", 7)),
            "payment_terms": data.get("payment_terms", "Net 30"),
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }

        supplier_id = firebase.create_document("suppliers", supplier_data)
        supplier_data["id"] = supplier_id

        logger.info(f"Created supplier: {supplier_id}")
        return jsonify(supplier_data), 201
    except Exception as e:
        logger.error(f"Failed to create supplier: {str(e)}")
        return jsonify({"error": "Failed to create supplier"}), 500


@supplier_bp.route("/<supplier_id>", methods=["GET"])
def get_supplier(supplier_id):
    """Get a specific supplier"""
    try:
        supplier = firebase.get_document("suppliers", supplier_id)
        if not supplier:
            return jsonify({"error": "Supplier not found"}), 404
        supplier["id"] = supplier_id
        return jsonify(supplier), 200
    except Exception as e:
        logger.error(f"Failed to retrieve supplier {supplier_id}: {str(e)}")
        return jsonify({"error": "Failed to retrieve supplier"}), 500


@supplier_bp.route("/<supplier_id>", methods=["PUT"])
def update_supplier(supplier_id):
    """Update a supplier"""
    try:
        data = request.get_json(silent=True) or {}
        existing = firebase.get_document("suppliers", supplier_id)
        if not existing:
            return jsonify({"error": "Supplier not found"}), 404

        update_data = {**data, "updated_at": datetime.now(timezone.utc).isoformat()}
        update_data.pop("id", None)  # Don't store id in document

        firebase.update_document("suppliers", supplier_id, update_data)
        updated = firebase.get_document("suppliers", supplier_id)
        updated["id"] = supplier_id

        logger.info(f"Updated supplier: {supplier_id}")
        return jsonify(updated), 200
    except Exception as e:
        logger.error(f"Failed to update supplier {supplier_id}: {str(e)}")
        return jsonify({"error": "Failed to update supplier"}), 500


@supplier_bp.route("/<supplier_id>", methods=["DELETE"])
def delete_supplier(supplier_id):
    """Delete a supplier"""
    try:
        existing = firebase.get_document("suppliers", supplier_id)
        if not existing:
            return jsonify({"error": "Supplier not found"}), 404

        firebase.delete_document("suppliers", supplier_id)
        logger.info(f"Deleted supplier: {supplier_id}")
        return jsonify({"message": "Supplier deleted successfully"}), 200
    except Exception as e:
        logger.error(f"Failed to delete supplier {supplier_id}: {str(e)}")
        return jsonify({"error": "Failed to delete supplier"}), 500
