import logging
from datetime import datetime, timezone

from flask import Blueprint, jsonify
from utils.firebase_utils import FirebaseUtils

logger = logging.getLogger(__name__)
admin_bp = Blueprint("admin", __name__)
firebase = FirebaseUtils()


@admin_bp.route("/init-db", methods=["POST"])
def init_database():
    """Initialize database with sample data"""
    try:
        sample_products = [
            {
                "name": "Wireless Bluetooth Headphones",
                "price": 79.99,
                "category": "Electronics",
                "description": "High-quality wireless headphones with noise cancellation",
                "in_stock": True,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat(),
            },
            {
                "name": "Smart Fitness Watch",
                "price": 199.99,
                "category": "Electronics",
                "description": "Advanced fitness tracking with heart rate monitoring",
                "in_stock": True,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat(),
            },
            {
                "name": "Organic Coffee Beans",
                "price": 24.99,
                "category": "Food & Beverage",
                "description": "Premium organic coffee beans, medium roast",
                "in_stock": False,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat(),
            },
        ]

        created_products = []
        for product in sample_products:
            product_id = firebase.create_document("products", product)
            product["id"] = product_id
            created_products.append(product)

        logger.info("Database initialized with sample data")
        return (
            jsonify(
                {
                    "message": "Database initialized successfully",
                    "products_created": len(created_products),
                    "products": created_products,
                }
            ),
            201,
        )
    except Exception as e:
        logger.error(f"Error initializing database: {str(e)}")
        return jsonify({"error": "Failed to initialize database"}), 500
