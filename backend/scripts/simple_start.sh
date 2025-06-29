#!/bin/bash

echo "=== RetailGenie Backend (Simple Start) ==="

# Check if virtual environment exists, create if not
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install core dependencies
echo "Installing core dependencies..."
pip install Flask Flask-CORS firebase-admin python-dotenv

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "Error: .env file not found. Please create it from .env.template"
    exit 1
fi

# Check if Firebase credentials exist
if [ ! -f "firebase-credentials.json" ]; then
    echo "Error: firebase-credentials.json not found. Please add your Firebase service account key"
    exit 1
fi

echo "Starting RetailGenie Backend..."
echo "Server will be available at: http://localhost:5000"
echo "Database: Firebase Firestore"
echo ""
echo "API Endpoints:"
echo "  GET  /                     - Home"
echo "  GET  /health               - Health check"
echo "  GET  /api/products         - Get all products"
echo "  POST /api/products         - Create product"
echo "  GET  /api/products/{id}    - Get product"
echo "  PUT  /api/products/{id}    - Update product"
echo "  DELETE /api/products/{id}  - Delete product"
echo "  POST /api/auth/register    - Register user"
echo "  POST /api/auth/login       - Login user"
echo "  GET  /api/feedback/{id}    - Get product feedback"
echo "  POST /api/feedback         - Submit feedback"
echo "  POST /api/admin/init-db    - Initialize database"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the Flask application
python app.py
