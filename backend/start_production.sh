#!/bin/bash

# RetailGenie Production API Startup Script
# For quick reference commands, see: ./DEV_QUICK_REFERENCE.md

echo "🚀 Starting RetailGenie Production API..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "❌ Virtual environment not found. Please run setup first."
    exit 1
fi

# Activate virtual environment
source venv/bin/activate

# Set production environment variables
export FLASK_ENV=production
export PORT=5001

# Check if Firebase credentials exist
if [ ! -f "firebase-credentials.json" ]; then
    echo "⚠️  Firebase credentials not found. Using mock database."
fi

# Start the production API
echo "🎯 Starting API on port $PORT..."
echo "📚 API Documentation: http://localhost:$PORT/api/v1/info"
echo "🔍 Health Check: http://localhost:$PORT/health"
echo "📖 Quick Reference: ./DEV_QUICK_REFERENCE.md"
echo "🎬 Demo Script: ./demo_api.sh"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

python app_production.py
