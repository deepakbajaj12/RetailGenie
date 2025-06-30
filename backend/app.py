import logging
import os
import uuid
from datetime import datetime, timezone

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS

from utils.firebase_utils import FirebaseUtils
from routes.predict_demand import predict_demand_bp

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def get_json_data():
    """Safely get JSON data from request with proper error handling."""
    # Handle empty request
    if not request.data:
        return None, jsonify({"error": "No JSON data provided"}), 400

    try:
        # Try to get JSON data
        data = request.get_json(silent=True, force=True)
        if not data:
            return None, jsonify({"error": "No JSON data provided"}), 400
        return data, None, None
    except Exception:
        # If there's a JSON parsing error
        return None, jsonify({"error": "Invalid JSON format"}), 400


def create_app():
    app = Flask(__name__)
    app.register_blueprint(predict_demand_bp)

    # Initialize Firebase
    firebase = FirebaseUtils()

    # Enable CORS with specific configuration
    cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
    CORS(app, origins=cors_origins, supports_credentials=True)

    # Health check endpoint
    @app.route("/")
    def home():
        return jsonify(
            {
                "message": "RetailGenie API is running!",
                "status": "success",
                "database": "Firebase Firestore" if firebase.db else "Mock Database",
            }
        )

    @app.route("/health")
    def health():
        db_status = "connected" if firebase.db else "disconnected"
        return jsonify(
            {
                "status": "healthy",
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "database_status": db_status,
                "firebase_project": os.getenv("FIREBASE_PROJECT_ID", "not-configured"),
            }
        )

    # Product endpoints
    @app.route("/api/products", methods=["GET"])
    def get_products():
        try:
            products = firebase.get_documents("products")
            return jsonify({"products": products, "count": len(products)})
        except Exception as e:
            logger.error(f"Error getting products: {str(e)}")
            return jsonify({"error": "Failed to retrieve products"}), 500

    @app.route("/api/products/<product_id>", methods=["GET"])
    def get_product(product_id):
        try:
            product = firebase.get_document("products", product_id)
            if product:
                return jsonify(product)
            else:
                return jsonify({"error": "Product not found"}), 404
        except Exception as e:
            logger.error(f"Error getting product {product_id}: {str(e)}")
            return jsonify({"error": "Failed to retrieve product"}), 500

    @app.route("/api/products", methods=["POST"])
    def create_product():
        try:
            # Get JSON data safely
            data, error_response, status_code = get_json_data()
            if error_response:
                return error_response, status_code

            # Validate required fields
            required_fields = ["name", "price"]
            for field in required_fields:
                if field not in data:
                    return jsonify({"error": f"Missing required field: {field}"}), 400

            # Add metadata
            product_data = {
                "name": data.get("name"),
                "price": float(data.get("price")),
                "category": data.get("category", "Uncategorized"),
                "description": data.get("description", ""),
                "in_stock": data.get("in_stock", True),
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat(),
            }

            # Create document in Firebase
            product_id = firebase.create_document("products", product_data)
            product_data["id"] = product_id

            logger.info(f"Created product: {product_id}")
            return jsonify(product_data), 201

        except Exception as e:
            logger.error(f"Error creating product: {str(e)}")
            return jsonify({"error": "Failed to create product"}), 500

    @app.route("/api/products/<product_id>", methods=["PUT"])
    def update_product(product_id):
        try:
            # Get JSON data safely
            data, error_response, status_code = get_json_data()
            if error_response:
                return error_response, status_code

            # Get existing product
            existing_product = firebase.get_document("products", product_id)
            if not existing_product:
                return jsonify({"error": "Product not found"}), 404

            # Update data
            update_data = {"updated_at": datetime.now(timezone.utc).isoformat()}

            # Update only provided fields
            for field in ["name", "price", "category", "description", "in_stock"]:
                if field in data:
                    if field == "price":
                        update_data[field] = float(data[field])
                    else:
                        update_data[field] = data[field]

            # Update document in Firebase
            firebase.update_document("products", product_id, update_data)

            # Get updated product
            updated_product = firebase.get_document("products", product_id)
            updated_product["id"] = product_id

            logger.info(f"Updated product: {product_id}")
            return jsonify(updated_product)

        except Exception as e:
            logger.error(f"Error updating product {product_id}: {str(e)}")
            return jsonify({"error": "Failed to update product"}), 500

    @app.route("/api/products/<product_id>", methods=["DELETE"])
    def delete_product(product_id):
        try:
            # Check if product exists
            existing_product = firebase.get_document("products", product_id)
            if not existing_product:
                return jsonify({"error": "Product not found"}), 404

            # Delete document from Firebase
            firebase.delete_document("products", product_id)

            logger.info(f"Deleted product: {product_id}")
            return "", 204

        except Exception as e:
            logger.error(f"Error deleting product {product_id}: {str(e)}")
            return jsonify({"error": "Failed to delete product"}), 500

    # Authentication endpoints
    @app.route("/api/auth/register", methods=["POST"])
    def register():
        try:
            # Get JSON data safely
            data, error_response, status_code = get_json_data()
            if error_response:
                return error_response, status_code

            required_fields = ["email", "password", "name"]
            for field in required_fields:
                if field not in data:
                    return jsonify({"error": f"Missing required field: {field}"}), 400

            # Check if user already exists
            existing_users = firebase.query_documents(
                "users", "email", "==", data["email"]
            )
            if existing_users:
                return jsonify({"error": "User with this email already exists"}), 400

            # Create user data (without password for security)
            user_data = {
                "email": data["email"],
                "name": data["name"],
                "role": "user",
                "created_at": datetime.now(timezone.utc).isoformat(),
                "is_active": True,
            }

            # Create user in Firebase
            user_id = firebase.create_document("users", user_data)
            user_data["id"] = user_id

            # Note: In production, implement proper password hashing and JWT
            logger.info(f"Registered user: {data['email']}")
            return (
                jsonify(
                    {
                        "message": "User registered successfully",
                        "user": user_data,
                        "token": f"jwt-token-{user_id}",  # Replace with real JWT
                    }
                ),
                201,
            )

        except Exception as e:
            logger.error(f"Error registering user: {str(e)}")
            return jsonify({"error": "Failed to register user"}), 500

    @app.route("/api/auth/login", methods=["POST"])
    def login():
        try:
            # Get JSON data safely
            data, error_response, status_code = get_json_data()
            if error_response:
                return error_response, status_code

            required_fields = ["email", "password"]
            for field in required_fields:
                if field not in data:
                    return jsonify({"error": f"Missing required field: {field}"}), 400

            # Find user by email
            users = firebase.query_documents("users", "email", "==", data["email"])
            if not users:
                return jsonify({"error": "Invalid credentials"}), 401

            user = users[0]
            # Note: In production, implement proper password verification

            logger.info(f"User logged in: {data['email']}")
            return jsonify(
                {
                    "message": "Login successful",
                    "user": user,
                    "token": f'jwt-token-{user["id"]}',  # Replace with real JWT
                }
            )

        except Exception as e:
            logger.error(f"Error logging in user: {str(e)}")
            return jsonify({"error": "Failed to login"}), 500

    # Feedback endpoints
    @app.route("/api/feedback/<product_id>", methods=["GET"])
    def get_feedback(product_id):
        try:
            # Get all feedback for the product
            feedback_list = firebase.query_documents(
                "feedback", "product_id", "==", product_id
            )

            # Calculate average rating
            total_rating = 0
            count = len(feedback_list)

            if count > 0:
                total_rating = sum(f.get("rating", 0) for f in feedback_list)
                average_rating = round(total_rating / count, 1)
            else:
                average_rating = 0

            return jsonify(
                {
                    "product_id": product_id,
                    "feedback": feedback_list,
                    "average_rating": average_rating,
                    "total_reviews": count,
                }
            )

        except Exception as e:
            logger.error(f"Error getting feedback for product {product_id}: {str(e)}")
            return jsonify({"error": "Failed to retrieve feedback"}), 500

    @app.route("/api/feedback", methods=["POST"])
    def submit_feedback():
        try:
            # Get JSON data safely
            data, error_response, status_code = get_json_data()
            if error_response:
                return error_response, status_code

            required_fields = ["product_id", "rating", "comment", "user_name"]
            for field in required_fields:
                if field not in data:
                    return jsonify({"error": f"Missing required field: {field}"}), 400

            # Validate rating
            rating = data.get("rating")
            if not isinstance(rating, (int, float)) or rating < 1 or rating > 5:
                return jsonify({"error": "Rating must be between 1 and 5"}), 400

            # Create feedback data
            feedback_data = {
                "product_id": data["product_id"],
                "rating": int(rating),
                "comment": data["comment"],
                "user_name": data["user_name"],
                "created_at": datetime.now(timezone.utc).isoformat(),
            }

            # Create feedback in Firebase
            feedback_id = firebase.create_document("feedback", feedback_data)
            feedback_data["id"] = feedback_id

            logger.info(f"Submitted feedback: {feedback_id}")
            return (
                jsonify(
                    {
                        "message": "Feedback submitted successfully",
                        "feedback": feedback_data,
                    }
                ),
                201,
            )

        except Exception as e:
            logger.error(f"Error submitting feedback: {str(e)}")
            return jsonify({"error": "Failed to submit feedback"}), 500

    # Database initialization endpoint
    @app.route("/api/admin/init-db", methods=["POST"])
    def init_database():
        try:
            # Initialize database with sample data
            sample_products = [
                {
                    "name": "Wireless Bluetooth Headphones",
                    "price": 79.99,
                    "category": "Electronics",
                    "description": "High-quality wireless headphones with noise "
                    "cancellation",
                    "in_stock": True,
                    "created_at": datetime.now(timezone.utc).isoformat(),
                    "updated_at": datetime.now(timezone.utc).isoformat(),
                },
                {
                    "name": "Smart Fitness Watch",
                    "price": 199.99,
                    "category": "Electronics",
                    "description": "Advanced fitness tracking with heart rate "
                    "monitoring",
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

    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"error": "Endpoint not found"}), 404

    @app.errorhandler(500)
    def internal_error(error):
        logger.error(f"Internal server error: {str(error)}")
        return jsonify({"error": "Internal server error"}), 500

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, host="0.0.0.0", port=5000)