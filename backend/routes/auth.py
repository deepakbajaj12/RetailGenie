from flask import Blueprint, request, jsonify, current_app
import jwt
import datetime
import bcrypt
import os
from backend.utils.firebase_utils import FirebaseUtils
from backend.utils.email_service import send_welcome_email

auth_bp = Blueprint('auth', __name__)
firebase = FirebaseUtils()

# Secret key for JWT - should be in env vars
SECRET_KEY = os.getenv("SECRET_KEY", "dev_secret_key")

@auth_bp.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    name = data.get('name', 'User')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    # Check if user exists
    existing_users = firebase.query_documents('users', 'email', '==', email)
    if existing_users:
        return jsonify({"error": "User already exists"}), 400

    # Hash password
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    # Create user
    user_data = {
        "email": email,
        "password": hashed_password.decode('utf-8'),
        "name": name,
        "created_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
    }
    
    user_id = firebase.create_document('users', user_data)

    # Send welcome email
    # Note: This requires MAIL_SERVER, MAIL_PORT, etc. to be configured in app.py
    email_sent = send_welcome_email(email, name)

    return jsonify({
        "message": "User registered successfully", 
        "user_id": user_id,
        "email_sent": email_sent
    }), 201

@auth_bp.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    # Find user
    users = firebase.query_documents('users', 'email', '==', email)
    if not users:
        return jsonify({"error": "Invalid credentials"}), 401
    
    user = users[0]
    stored_password = user.get('password')
    
    if bcrypt.checkpw(password.encode('utf-8'), stored_password.encode('utf-8')):
        token = jwt.encode({
            'user_id': user.get('id'),
            'email': email,
            'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=24)
        }, SECRET_KEY, algorithm="HS256")
        
        return jsonify({
            "token": token, 
            "message": "Login successful",
            "user": {
                "id": user.get('id'),
                "email": user.get('email'),
                "name": user.get('name')
            }
        }), 200
    
    return jsonify({"error": "Invalid credentials"}), 401
