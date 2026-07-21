import logging
import os
import sys

from dotenv import load_dotenv
from flask import Flask, jsonify
from flask_cors import CORS

# Ensure the app folder is in python path so imports
# like "from controllers.x import y" work
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from utils.firebase_utils import FirebaseUtils  # noqa: E402

from config.config import get_config  # noqa: E402


def create_app(config_class=None):
    """Application factory pattern"""
    app = Flask(__name__)

    # Load configuration
    if config_class is None:
        config_class = get_config()
    app.config.from_object(config_class)

    # Configure CORS - allow all origins to avoid issues with frontend on 3000
    CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

    # Configure logging
    log_level = app.config.get("LOG_LEVEL", "INFO")
    logging.basicConfig(
        level=getattr(logging, log_level),
        format="[%(asctime)s] %(levelname)s in %(module)s: %(message)s",
    )

    # Email is handled via utils.email_utils.EmailUtils (raw SMTP) — no Flask-Mail init needed.

    # Initialize AuthMiddleware
    from middleware.auth_middleware import AuthMiddleware
    AuthMiddleware(app)

    # Import and register blueprints
    from routes.admin_routes import admin_bp
    from routes.ai_assistant_routes import ai_assistant_bp
    from routes.ai_routes import ai_bp
    from routes.analytics_routes import analytics_bp
    from routes.auth_routes import auth_bp
    from routes.feedback_routes import feedback_bp
    from routes.inventory_routes import inventory_bp
    from routes.notification_routes import notification_bp
    from routes.order_routes import order_bp
    from routes.predict_demand_routes import predict_demand_bp
    from routes.pricing_routes import pricing_bp
    from routes.product_routes import product_bp
    from routes.safety_routes import safety_bp
    from routes.settings_routes import settings_bp
    from routes.supplier_routes import supplier_bp

    # Register blueprints with prefixes matching what the frontend expects
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(product_bp, url_prefix="/api/products")
    app.register_blueprint(order_bp, url_prefix="/api/orders")
    app.register_blueprint(feedback_bp, url_prefix="/api/feedback")
    app.register_blueprint(safety_bp, url_prefix="/api/safety")
    app.register_blueprint(ai_bp)  # paths already start with /ai/
    app.register_blueprint(analytics_bp, url_prefix="/api/analytics")
    app.register_blueprint(predict_demand_bp)  # path is /predict-demand
    app.register_blueprint(admin_bp, url_prefix="/api/admin")
    # Previously orphaned blueprints — now registered
    app.register_blueprint(inventory_bp, url_prefix="/api/inventory")
    app.register_blueprint(ai_assistant_bp, url_prefix="/api/assistant")
    app.register_blueprint(pricing_bp, url_prefix="/api/pricing")
    app.register_blueprint(supplier_bp, url_prefix="/api/suppliers")
    app.register_blueprint(settings_bp, url_prefix="/api/settings")
    app.register_blueprint(notification_bp, url_prefix="/api/notifications")

    @app.route("/", methods=["GET"])
    def home():
        return (
            jsonify(
                {
                    "message": "RetailGenie API is running!",
                    "status": "success",
                    "database": "connected" if FirebaseUtils().db else "mocked",
                }
            ),
            200,
        )

    @app.route("/health", methods=["GET"])
    def health_check():
        from datetime import datetime

        return (
            jsonify(
                {
                    "status": "healthy",
                    "timestamp": datetime.now().isoformat(),
                    "database_status": "connected" if FirebaseUtils().db else "mocked",
                    "firebase_project": os.getenv(
                        "FIREBASE_PROJECT_ID", "retailgenie-mock"
                    ),
                }
            ),
            200,
        )

    @app.errorhandler(404)
    def not_found_error(error):
        return jsonify({"error": "Endpoint not found"}), 404

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({"error": "Internal server error"}), 500

    return app
