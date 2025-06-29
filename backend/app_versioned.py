"""
Production-ready Flask app with API versioning support
Supports both V1 (stable) and V2 (enhanced) APIs
"""

import logging
import os
from datetime import datetime, timezone

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS

# Import API versions
from api_versions.v1 import api_v1
from api_versions.v2 import api_v2
from utils.firebase_utils import FirebaseUtils

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


def create_versioned_app():
    """Create Flask app with API versioning support"""
    app = Flask(__name__)

    # Production configuration
    app.config["SECRET_KEY"] = os.getenv(
        "SECRET_KEY", "dev-secret-change-in-production"
    )
    app.config["DEBUG"] = os.getenv("FLASK_DEBUG", "False").lower() == "true"
    app.config["ENV"] = os.getenv("FLASK_ENV", "production")

    # Initialize Firebase
    firebase = FirebaseUtils()

    # Enhanced CORS configuration for production
    cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
    CORS(
        app,
        origins=cors_origins,
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization", "API-Version"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    )

    # Register API version blueprints
    app.register_blueprint(api_v1)
    app.register_blueprint(api_v2)

    # Main API info endpoint
    @app.route("/")
    def home():
        return jsonify(
            {
                "message": "RetailGenie API with Versioning Support",
                "status": "running",
                "environment": app.config["ENV"],
                "database": "Firebase Firestore" if firebase.db else "Mock Database",
                "api_versions": {
                    "v1": {
                        "status": "stable",
                        "base_url": "/api/v1",
                        "description": "Stable production API",
                    },
                    "v2": {
                        "status": "enhanced",
                        "base_url": "/api/v2",
                        "description": "Enhanced API with new features",
                    },
                },
                "documentation": {"v1": "/api/v1/info", "v2": "/api/v2/info"},
            }
        )

    @app.route("/health")
    def health():
        """Global health check"""
        db_status = "connected" if firebase.db else "disconnected"
        return jsonify(
            {
                "status": "healthy",
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "database_status": db_status,
                "firebase_project": os.getenv("FIREBASE_PROJECT_ID", "not-configured"),
                "environment": app.config["ENV"],
                "api_versions": {"v1": "active", "v2": "active"},
            }
        )

    # Version detection middleware
    @app.before_request
    def detect_api_version():
        """Detect API version from headers or URL"""
        # Check for API-Version header
        api_version = request.headers.get("API-Version")
        if api_version:
            request.api_version = api_version
            logger.info(f"API version {api_version} requested via header")
        else:
            # Detect from URL path
            if request.path.startswith("/api/v1/"):
                request.api_version = "v1"
            elif request.path.startswith("/api/v2/"):
                request.api_version = "v2"
            else:
                request.api_version = "v1"  # Default to v1

    @app.after_request
    def add_version_headers(response):
        """Add version information to response headers"""
        if hasattr(request, "api_version"):
            response.headers["API-Version"] = request.api_version
        response.headers["API-Versions-Available"] = "v1,v2"
        return response

    # Global error handlers
    @app.errorhandler(404)
    def not_found(error):
        api_version = getattr(request, "api_version", "unknown")
        return (
            jsonify(
                {
                    "error": "Endpoint not found",
                    "api_version": api_version,
                    "available_versions": ["v1", "v2"],
                    "documentation": {"v1": "/api/v1/info", "v2": "/api/v2/info"},
                }
            ),
            404,
        )

    @app.errorhandler(500)
    def internal_error(error):
        api_version = getattr(request, "api_version", "unknown")
        logger.error(f"Internal server error: {error}")
        return (
            jsonify({"error": "Internal server error", "api_version": api_version}),
            500,
        )

    # Database initialization endpoint
    @app.route("/api/admin/init-database", methods=["POST"])
    def init_database():
        """Initialize database with sample data (admin only)"""
        try:
            # Sample products for both API versions
            sample_products = [
                {
                    "name": "Premium Wireless Headphones",
                    "price": 299.99,
                    "category": "Electronics",
                    "description": "High-quality wireless headphones with noise cancellation",
                    "in_stock": True,
                    "stock_quantity": 50,
                    "sku": "ELEC-001",
                    "tags": ["wireless", "audio", "premium"],
                    "images": ["headphones1.jpg"],
                    "specifications": {
                        "battery_life": "30 hours",
                        "connectivity": "Bluetooth 5.0",
                    },
                    "views": 0,
                    "created_at": datetime.now(timezone.utc).isoformat(),
                    "updated_at": datetime.now(timezone.utc).isoformat(),
                },
                {
                    "name": "Smart Fitness Tracker",
                    "price": 199.99,
                    "category": "Wearables",
                    "description": "Advanced fitness tracker with heart rate monitoring",
                    "in_stock": True,
                    "stock_quantity": 30,
                    "sku": "WEAR-001",
                    "tags": ["fitness", "smart", "health"],
                    "images": ["tracker1.jpg"],
                    "specifications": {
                        "battery_life": "7 days",
                        "water_resistance": "IP68",
                    },
                    "views": 0,
                    "created_at": datetime.now(timezone.utc).isoformat(),
                    "updated_at": datetime.now(timezone.utc).isoformat(),
                },
                {
                    "name": "Organic Coffee Beans",
                    "price": 24.99,
                    "category": "Food",
                    "description": "Premium organic coffee beans from sustainable farms",
                    "in_stock": True,
                    "stock_quantity": 100,
                    "sku": "FOOD-001",
                    "tags": ["organic", "coffee", "sustainable"],
                    "images": ["coffee1.jpg"],
                    "specifications": {"origin": "Colombia", "roast": "Medium"},
                    "views": 0,
                    "created_at": datetime.now(timezone.utc).isoformat(),
                    "updated_at": datetime.now(timezone.utc).isoformat(),
                },
            ]

            # Create products
            created_products = []
            for product_data in sample_products:
                product_id = firebase.create_document("products", product_data)
                product_data["id"] = product_id
                created_products.append(product_data)

            # Sample feedback
            sample_feedback = [
                {
                    "content": "Great product selection and fast delivery!",
                    "rating": 5,
                    "user_id": "user_001",
                    "created_at": datetime.now(timezone.utc).isoformat(),
                },
                {
                    "content": "Good experience overall, could improve the search feature.",
                    "rating": 4,
                    "user_id": "user_002",
                    "created_at": datetime.now(timezone.utc).isoformat(),
                },
            ]

            # Create feedback
            created_feedback = []
            for feedback_data in sample_feedback:
                feedback_id = firebase.create_document("feedback", feedback_data)
                feedback_data["id"] = feedback_id
                created_feedback.append(feedback_data)

            logger.info("Database initialized successfully")
            return (
                jsonify(
                    {
                        "message": "Database initialized successfully",
                        "created": {
                            "products": len(created_products),
                            "feedback": len(created_feedback),
                        },
                        "api_versions_supported": ["v1", "v2"],
                    }
                ),
                201,
            )

        except Exception as e:
            logger.error(f"Error initializing database: {str(e)}")
            return jsonify({"error": "Failed to initialize database"}), 500

    return app


# Create the app instance
app = create_versioned_app()

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    debug = os.getenv("FLASK_DEBUG", "False").lower() == "true"

    logger.info(f"Starting RetailGenie API server on port {port}")
    logger.info(f"Environment: {os.getenv('FLASK_ENV', 'production')}")
    logger.info(f"Debug mode: {debug}")
    logger.info("API Versions: v1 (stable), v2 (enhanced)")

    app.run(host="0.0.0.0", port=port, debug=debug)
