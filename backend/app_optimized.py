#!/usr/bin/env python3
"""
RetailGenie Backend API - Optimized Version
Enhanced with caching, rate limiting, and advanced monitoring
"""

import json
import logging
import os
import sys
import time
from datetime import datetime, timezone
from functools import wraps
from typing import Any, Dict, Optional

from flask import Flask, g, jsonify, request
from flask_caching import Cache
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

# Add the project root to Python path
current_dir = (
    os.path.dirname(os.path.abspath(__file__))
    if "__file__" in globals()
    else os.getcwd()
)
sys.path.insert(0, current_dir)

from config import Config
from utils.firebase_utils import FirebaseUtils

# Initialize Flask app
app = Flask(__name__)
app.config.from_object(Config)

# Enable CORS
CORS(app, origins=["*"])

# Initialize caching
cache = Cache(
    app,
    config={
        "CACHE_TYPE": "simple",  # Use simple cache for development
        "CACHE_DEFAULT_TIMEOUT": 300,  # 5 minutes default timeout
    },
)

# Initialize rate limiting
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["1000 per hour", "100 per minute"],
)

# Initialize Firebase
firebase = FirebaseUtils()


# Configure structured logging
class JSONFormatter(logging.Formatter):
    """Custom JSON formatter for structured logging"""

    def format(self, record):
        log_entry = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "level": record.levelname,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno,
            "request_id": getattr(g, "request_id", None),
        }

        if hasattr(record, "duration"):
            log_entry["duration"] = record.duration

        return json.dumps(log_entry)


# Configure logger
if not app.debug:
    handler = logging.StreamHandler()
    handler.setFormatter(JSONFormatter())
    app.logger.addHandler(handler)
    app.logger.setLevel(logging.INFO)


# Performance monitoring decorator
def measure_time(operation: str):
    """Decorator to measure execution time of functions"""

    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            start_time = time.time()
            try:
                result = f(*args, **kwargs)
                end_time = time.time()
                duration = end_time - start_time

                # Log slow operations
                if duration > 1.0:
                    app.logger.warning(
                        f"Slow {operation}: {f.__name__} took {duration:.2f}s"
                    )
                else:
                    app.logger.info(
                        f"{operation}: {f.__name__} completed in {duration:.2f}s"
                    )

                return result
            except Exception as e:
                end_time = time.time()
                duration = end_time - start_time
                app.logger.error(
                    f"Error in {operation}: {f.__name__} failed after {duration:.2f}s - {str(e)}"
                )
                raise

        return decorated_function

    return decorator


# Request middleware
@app.before_request
def before_request():
    """Set up request context and timing"""
    g.start_time = time.time()
    g.request_id = request.headers.get("X-Request-ID", f"req-{int(time.time())}")


@app.after_request
def after_request(response):
    """Log request completion and performance metrics"""
    duration = time.time() - g.start_time

    # Log slow requests
    if duration > 2.0:
        app.logger.warning(
            f"Slow request: {request.method} {request.path} took {duration:.2f}s"
        )

    # Add performance headers
    response.headers["X-Response-Time"] = f"{duration:.3f}s"
    response.headers["X-Request-ID"] = g.request_id

    return response


# Error handlers
@app.errorhandler(429)
def ratelimit_handler(e):
    """Handle rate limit exceeded"""
    return (
        jsonify(
            {
                "error": "Rate limit exceeded",
                "message": str(e.description),
                "retry_after": e.retry_after,
            }
        ),
        429,
    )


@app.errorhandler(500)
def internal_error(error):
    """Handle internal server errors"""
    app.logger.error(f"Internal server error: {str(error)}")
    return (
        jsonify(
            {
                "error": "Internal server error",
                "message": "An unexpected error occurred",
            }
        ),
        500,
    )


# Health and monitoring endpoints
@app.route("/")
def home():
    """Root endpoint"""
    return jsonify(
        {
            "message": "RetailGenie API - Optimized Version",
            "version": "2.0.0",
            "status": "running",
            "endpoints": {
                "health": "/health",
                "metrics": "/metrics",
                "v1": "/api/v1",
                "v2": "/api/v2",
            },
        }
    )


@app.route("/health")
@cache.cached(timeout=30)  # Cache health check for 30 seconds
def health_check():
    """Enhanced health check endpoint"""
    try:
        # Test database connectivity
        db_status = "connected"
        firebase_project = None

        try:
            # Quick database test
            firebase.db.collection("health_check").limit(1).get()
            firebase_project = firebase.project_id
        except Exception as e:
            db_status = "disconnected"
            app.logger.error(f"Database health check failed: {e}")

        return jsonify(
            {
                "status": "healthy",
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "version": "2.0.0",
                "environment": os.getenv("FLASK_ENV", "production"),
                "database_status": db_status,
                "firebase_project": firebase_project,
                "api_versions": {"v1": "active", "v2": "active"},
                "cache_status": "active",
                "rate_limiting": "active",
            }
        )
    except Exception as e:
        app.logger.error(f"Health check failed: {e}")
        return jsonify({"status": "unhealthy", "error": str(e)}), 503


@app.route("/metrics")
@limiter.limit("10 per minute")
def metrics():
    """System metrics endpoint"""
    try:
        import psutil

        process = psutil.Process(os.getpid())
        memory_info = process.memory_info()

        return jsonify(
            {
                "memory_usage_mb": round(memory_info.rss / 1024 / 1024, 2),
                "cpu_percent": process.cpu_percent(),
                "cache_stats": {
                    "hits": cache.get("cache_hits") or 0,
                    "misses": cache.get("cache_misses") or 0,
                },
                "timestamp": datetime.now(timezone.utc).isoformat(),
            }
        )
    except ImportError:
        return jsonify(
            {
                "message": "psutil not available for system metrics",
                "timestamp": datetime.now(timezone.utc).isoformat(),
            }
        )


# API Version 1 Routes
@app.route("/api/v1/products", methods=["GET"])
@limiter.limit("50 per minute")
@cache.cached(timeout=300, query_string=True)  # Cache for 5 minutes
@measure_time("v1_products_list")
def get_products_v1():
    """Get all products - V1 API"""
    try:
        page = request.args.get("page", 1, type=int)
        limit = request.args.get("limit", 20, type=int)

        # Validate pagination parameters
        if page < 1 or limit < 1 or limit > 100:
            return jsonify({"error": "Invalid pagination parameters"}), 400

        products = firebase.get_all_documents("products")

        # Simple pagination
        start_idx = (page - 1) * limit
        end_idx = start_idx + limit
        paginated_products = products[start_idx:end_idx]

        return jsonify(
            {
                "products": paginated_products,
                "count": len(products),
                "page": page,
                "limit": limit,
                "total_pages": (len(products) + limit - 1) // limit,
                "version": "1.0.0",
            }
        )
    except Exception as e:
        app.logger.error(f"Error fetching products v1: {e}")
        return jsonify({"error": "Failed to fetch products"}), 500


@app.route("/api/v1/products/<product_id>", methods=["GET"])
@limiter.limit("100 per minute")
@cache.cached(timeout=600)  # Cache individual products for 10 minutes
@measure_time("v1_product_get")
def get_product_v1(product_id):
    """Get a specific product - V1 API"""
    try:
        product = firebase.get_document("products", product_id)
        if not product:
            return jsonify({"error": "Product not found", "version": "1.0.0"}), 404

        return jsonify(product)
    except Exception as e:
        app.logger.error(f"Error fetching product v1: {e}")
        return jsonify({"error": "Failed to fetch product"}), 500


# API Version 2 Routes
@app.route("/api/v2/products", methods=["GET"])
@limiter.limit("50 per minute")
@cache.cached(timeout=300, query_string=True)
@measure_time("v2_products_list")
def get_products_v2():
    """Get all products with enhanced features - V2 API"""
    try:
        page = request.args.get("page", 1, type=int)
        limit = request.args.get("limit", 20, type=int)
        category = request.args.get("category")
        sort_by = request.args.get("sort_by", "name")
        sort_order = request.args.get("sort_order", "asc")

        # Validate parameters
        if page < 1 or limit < 1 or limit > 100:
            return jsonify({"error": "Invalid pagination parameters"}), 400

        if sort_by not in ["name", "price", "created_at"]:
            sort_by = "name"

        if sort_order not in ["asc", "desc"]:
            sort_order = "asc"

        products = firebase.get_all_documents("products")

        # Filter by category if specified
        if category:
            products = [
                p for p in products if p.get("category", "").lower() == category.lower()
            ]

        # Sort products
        reverse = sort_order == "desc"
        if sort_by == "price":
            products = sorted(
                products, key=lambda x: x.get("price", 0), reverse=reverse
            )
        elif sort_by == "created_at":
            products = sorted(
                products, key=lambda x: x.get("created_at", ""), reverse=reverse
            )
        else:
            products = sorted(
                products, key=lambda x: x.get("name", ""), reverse=reverse
            )

        # Pagination
        start_idx = (page - 1) * limit
        end_idx = start_idx + limit
        paginated_products = products[start_idx:end_idx]

        return jsonify(
            {
                "products": paginated_products,
                "count": len(products),
                "page": page,
                "limit": limit,
                "total_pages": (len(products) + limit - 1) // limit,
                "filters": {
                    "category": category,
                    "sort_by": sort_by,
                    "sort_order": sort_order,
                },
                "version": "2.0.0",
            }
        )
    except Exception as e:
        app.logger.error(f"Error fetching products v2: {e}")
        return jsonify({"error": "Failed to fetch products"}), 500


@app.route("/api/v2/products/<product_id>", methods=["GET"])
@limiter.limit("100 per minute")
@cache.cached(timeout=600)
@measure_time("v2_product_get")
def get_product_v2(product_id):
    """Get a specific product with enhanced data - V2 API"""
    try:
        product = firebase.get_document("products", product_id)
        if not product:
            return jsonify({"error": "Product not found", "version": "2.0.0"}), 404

        # Add enhanced data for V2
        product["version"] = "2.0.0"
        product["last_accessed"] = datetime.now(timezone.utc).isoformat()

        return jsonify(product)
    except Exception as e:
        app.logger.error(f"Error fetching product v2: {e}")
        return jsonify({"error": "Failed to fetch product"}), 500


@app.route("/api/v2/products/search", methods=["GET"])
@limiter.limit("30 per minute")
@cache.cached(timeout=300, query_string=True)
@measure_time("v2_product_search")
def search_products_v2():
    """Search products - V2 API only"""
    try:
        query = request.args.get("query", "").strip()
        if not query:
            return jsonify({"error": "Search query required", "version": "2.0.0"}), 400

        products = firebase.get_all_documents("products")

        # Simple text search
        matching_products = []
        for product in products:
            if (
                query.lower() in product.get("name", "").lower()
                or query.lower() in product.get("description", "").lower()
                or query.lower() in product.get("category", "").lower()
            ):
                matching_products.append(product)

        return jsonify(
            {
                "products": matching_products,
                "count": len(matching_products),
                "query": query,
                "version": "2.0.0",
            }
        )
    except Exception as e:
        app.logger.error(f"Error searching products v2: {e}")
        return jsonify({"error": "Search failed"}), 500


# Cache management endpoints
@app.route("/api/admin/cache/clear", methods=["POST"])
@limiter.limit("5 per minute")
def clear_cache():
    """Clear application cache"""
    try:
        cache.clear()
        return jsonify(
            {
                "message": "Cache cleared successfully",
                "timestamp": datetime.now(timezone.utc).isoformat(),
            }
        )
    except Exception as e:
        app.logger.error(f"Error clearing cache: {e}")
        return jsonify({"error": "Failed to clear cache"}), 500


@app.route("/api/admin/cache/stats", methods=["GET"])
@limiter.limit("10 per minute")
def cache_stats():
    """Get cache statistics"""
    return jsonify(
        {
            "cache_type": "simple",
            "default_timeout": 300,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }
    )


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_DEBUG", "False").lower() == "true"

    app.logger.info(f"Starting RetailGenie API - Optimized Version on port {port}")
    app.run(host="0.0.0.0", port=port, debug=debug)
