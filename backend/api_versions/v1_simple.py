"""
Simple API Versioning Blueprint - v1
Minimal version for testing
"""

from typing import Any

from flask import Blueprint, jsonify

# Create v1 blueprint
api_v1 = Blueprint("api_v1", __name__, url_prefix="/api/v1")


# Version-specific endpoints
@api_v1.route("/info")
def api_info() -> Any:
    """Get API version information"""
    return jsonify(
        {
            "version": "1.0.0",
            "description": "RetailGenie API Version 1",
            "endpoints": {
                "products": "/api/v1/products",
                "feedback": "/api/v1/feedback",
                "auth": "/api/v1/auth",
                "analytics": "/api/v1/analytics",
                "inventory": "/api/v1/inventory",
                "pricing": "/api/v1/pricing",
                "ai_assistant": "/api/v1/ai",
            },
            "status": "active",
        }
    )


@api_v1.route("/health")
def api_health() -> Any:
    """Health check endpoint for v1 API"""
    import os
    from datetime import datetime, timezone

    return jsonify(
        {
            "status": "healthy",
            "version": "1.0.0",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "environment": os.getenv("FLASK_ENV", "development"),
            "services": {
                "api": "running",
                "websocket": "available",
                "celery": "configured",
                "swagger_docs": "available",
            },
        }
    )
