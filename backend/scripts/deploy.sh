#!/bin/bash

# RetailGenie Backend Production Deployment Script
echo "🚀 Deploying RetailGenie Backend to Production..."

# Set production environment
export FLASK_ENV=production
export DEBUG=False

# Check if all required files exist
echo "📋 Checking required files..."

if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "📝 Please create .env from .env.template with production values"
    exit 1
fi

if [ ! -f firebase-credentials.json ]; then
    echo "❌ Firebase credentials not found!"
    echo "📝 Please add firebase-credentials.json with production credentials"
    exit 1
fi

if [ ! -f requirements.txt ]; then
    echo "❌ requirements.txt not found!"
    exit 1
fi

# Install production dependencies
echo "📦 Installing production dependencies..."
pip install -r requirements.txt

# Create logs directory if it doesn't exist
mkdir -p logs

# Run basic health check
echo "🔍 Running pre-deployment health check..."
python -c "
import importlib.util
modules = ['flask', 'flask_cors', 'firebase_admin', 'openai', 'requests']
for module in modules:
    spec = importlib.util.find_spec(module)
    if spec is None:
        print(f'❌ {module} not found')
        exit(1)
    else:
        print(f'✅ {module} available')
print('✅ All required modules available')
"

if [ $? -ne 0 ]; then
    echo "❌ Health check failed"
    exit 1
fi

echo "✅ Pre-deployment checks passed!"
echo ""
echo "🌟 Starting production server..."
echo "📊 API will be available at: http://localhost:5000"
echo "🔍 Health Check: http://localhost:5000/api/health"
echo ""
echo "📝 For production deployment:"
echo "   • Use gunicorn: gunicorn --bind 0.0.0.0:5000 app:app"
echo "   • Or use Docker: docker build -t retailgenie-backend ."
echo "   • Configure reverse proxy (nginx/apache)"
echo "   • Set up SSL certificates"
echo ""
echo "Press Ctrl+C to stop the server"

# Start the application
if command -v gunicorn &> /dev/null; then
    echo "🚀 Starting with Gunicorn (recommended for production)..."
    gunicorn --bind 0.0.0.0:${PORT:-5000} --workers ${WORKERS:-4} --timeout ${TIMEOUT:-30} app:app
else
    echo "⚠️  Gunicorn not found, using Flask dev server..."
    echo "📝 For production, install gunicorn: pip install gunicorn"
    python app.py
fi
