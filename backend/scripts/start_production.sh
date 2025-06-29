#!/bin/bash

# Production startup script for RetailGenie Backend
# This script starts the application in production mode

set -e

echo "🚀 Starting RetailGenie Backend in Production Mode"

# Load environment variables
if [ -f .env.production ]; then
    echo "📝 Loading production environment..."
    export $(cat .env.production | grep -v '#' | xargs)
elif [ -f .env ]; then
    echo "📝 Loading environment from .env..."
    export $(cat .env | grep -v '#' | xargs)
else
    echo "⚠️  No environment file found, using defaults"
fi

# Set production defaults
export FLASK_ENV=${FLASK_ENV:-production}
export FLASK_DEBUG=${FLASK_DEBUG:-False}
export PORT=${PORT:-5000}
export HOST=${HOST:-0.0.0.0}
export WORKERS=${WORKERS:-4}

echo "🔧 Configuration:"
echo "   Environment: $FLASK_ENV"
echo "   Debug: $FLASK_DEBUG"
echo "   Host: $HOST"
echo "   Port: $PORT"
echo "   Workers: $WORKERS"

# Validate critical environment variables
if [ -z "$SECRET_KEY" ] || [ "$SECRET_KEY" = "dev-secret-change-in-production" ]; then
    echo "⚠️  Warning: Using default SECRET_KEY. Please set a secure SECRET_KEY in production!"
fi

if [ -z "$FIREBASE_PROJECT_ID" ]; then
    echo "⚠️  Warning: FIREBASE_PROJECT_ID not set. Some features may not work."
fi

# Check if firebase credentials exist
if [ ! -f firebase-credentials.json ]; then
    echo "⚠️  Warning: firebase-credentials.json not found. Database features may not work."
fi

# Pre-flight checks
echo "🔍 Running pre-flight checks..."

# Check if app can import successfully
python3 -c "
try:
    from app_versioned import app
    print('✅ App imports successfully')
except Exception as e:
    print(f'❌ App import failed: {e}')
    exit(1)
"

# Check database connectivity
python3 -c "
try:
    from utils.firebase_utils import FirebaseUtils
    firebase = FirebaseUtils()
    if firebase.db:
        print('✅ Firebase connection successful')
    else:
        print('⚠️  Firebase connection failed, running with mock data')
except Exception as e:
    print(f'⚠️  Database check failed: {e}')
"

# Start the production server
echo "🎯 Starting production server..."

# Choose server based on environment
if command -v gunicorn >/dev/null 2>&1; then
    echo "🦄 Using Gunicorn production server"
    exec gunicorn \
        --bind $HOST:$PORT \
        --workers $WORKERS \
        --worker-class sync \
        --worker-connections 1000 \
        --max-requests 1000 \
        --max-requests-jitter 100 \
        --timeout 120 \
        --keep-alive 2 \
        --log-level info \
        --access-logfile - \
        --error-logfile - \
        app_versioned:app
else
    echo "⚠️  Gunicorn not found, using Flask development server"
    echo "⚠️  This is not recommended for production!"
    python3 app_versioned.py
fi
