from flask import Blueprint, jsonify, request
import logging

from controllers.auth_controller import AuthController

logger = logging.getLogger(__name__)
auth_bp = Blueprint("auth", __name__)
auth_controller = AuthController()


@auth_bp.route("/register", methods=["POST"])
def register():
    """Register a new user"""
    try:
        data = request.get_json(silent=True)
        if data is None:
            return jsonify({"error": "No JSON data provided"}), 400

        required_fields = ["email", "password", "name"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        result = auth_controller.register_user(data)
        # Frontend expects: { message, user, token }
        return (
            jsonify(
                {
                    "message": "User registered successfully",
                    "user": result["user"],
                    "token": result["token"],
                }
            ),
            201,
        )
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        logger.error(f"Registration failed: {str(e)}")
        return jsonify({"error": "Registration failed"}), 500


@auth_bp.route("/login", methods=["POST"])
def login():
    """User login"""
    try:
        data = request.get_json(silent=True)
        if data is None:
            return jsonify({"error": "No JSON data provided"}), 400

        required_fields = ["email", "password"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        result = auth_controller.login_user(data["email"], data["password"])
        # Frontend expects: { message, user, token }
        return (
            jsonify(
                {
                    "message": "Login successful",
                    "user": result["user"],
                    "token": result["token"],
                }
            ),
            200,
        )
    except ValueError as e:
        err_msg = str(e)
        if "Invalid email" in err_msg or "password" in err_msg:
            err_msg = "Invalid credentials"
        return jsonify({"error": err_msg}), 401
    except Exception as e:
        logger.error(f"Login failed: {str(e)}")
        return jsonify({"error": "Login failed"}), 500


@auth_bp.route("/logout", methods=["POST"])
def logout():
    """User logout"""
    try:
        token = request.headers.get("Authorization")
        if not token:
            return jsonify({"error": "Authorization token required"}), 401

        auth_controller.logout_user(token)
        return jsonify({"message": "Logout successful"}), 200
    except Exception as e:
        logger.error(f"Logout failed: {str(e)}")
        return jsonify({"error": "Logout failed"}), 500


@auth_bp.route("/profile", methods=["GET"])
def get_profile():
    """Get user profile"""
    try:
        token = request.headers.get("Authorization")
        if not token:
            return jsonify({"error": "Authorization token required"}), 401

        profile = auth_controller.get_user_profile(token)
        return jsonify(profile), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 401
    except Exception as e:
        logger.error(f"Failed to retrieve profile: {str(e)}")
        return jsonify({"error": "Failed to retrieve profile"}), 500


@auth_bp.route("/profile", methods=["PUT"])
def update_profile():
    """Update user profile"""
    try:
        token = request.headers.get("Authorization")
        if not token:
            return jsonify({"error": "Authorization token required"}), 401

        data = request.get_json(silent=True) or {}
        updated_profile = auth_controller.update_user_profile(token, data)
        return jsonify(updated_profile), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 401
    except Exception as e:
        logger.error(f"Failed to update profile: {str(e)}")
        return jsonify({"error": "Failed to update profile"}), 500
