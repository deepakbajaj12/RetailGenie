#!/bin/bash

# RetailGenie Backend Startup Script
# Based on comprehensive setup instructions

echo "🚀 Starting RetailGenie Backend..."
echo "=" * 50

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if Python is installed
if ! command_exists python3; then
    echo "❌ Python 3 is not installed!"
    echo "📝 Please install Python 3.8+ from https://python.org"
    exit 1
fi

# Check Python version
python_version=$(python3 -c "import sys; print(f'{sys.version_info.major}.{sys.version_info.minor}')")
echo "✅ Python version: $python_version"

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "📝 Creating .env from template..."
    if [ -f .env.template ]; then
        cp .env.template .env
        echo "✅ .env file created from template"
        echo "⚠️  Please edit .env file with your actual configuration values:"
        echo "   - OPENAI_API_KEY"
        echo "   - FIREBASE_PROJECT_ID"
        echo "   - FIREBASE_CREDENTIALS_PATH"
        echo "   - SECRET_KEY"
        read -p "Press Enter to continue after updating .env file..."
    else
        echo "❌ .env.template not found!"
        exit 1
    fi
fi

# Check if firebase credentials exist
if [ ! -f firebase-credentials.json ]; then
    echo "❌ firebase-credentials.json not found!"
    echo "📝 Please add your Firebase service account credentials file:"
    echo "   1. Go to Firebase Console → Project Settings → Service Accounts"
    echo "   2. Click 'Generate new private key'"
    echo "   3. Save the JSON file as 'firebase-credentials.json'"
    echo "   4. Place it in the backend directory"
    read -p "Press Enter to continue after adding firebase-credentials.json..."

    if [ ! -f firebase-credentials.json ]; then
        echo "❌ firebase-credentials.json still not found!"
        exit 1
    fi
fi

# Check if virtual environment exists, create if not
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
    if [ $? -ne 0 ]; then
        echo "❌ Failed to create virtual environment"
        exit 1
    fi
    echo "✅ Virtual environment created"
fi

# Activate virtual environment
echo "📦 Activating virtual environment..."
if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
    # Windows
    source venv/Scripts/activate
else
    # Linux/macOS
    source venv/bin/activate
fi

if [ $? -ne 0 ]; then
    echo "❌ Failed to activate virtual environment"
    exit 1
fi

echo "✅ Virtual environment activated"

# Upgrade pip
echo "📦 Upgrading pip..."
pip install --upgrade pip

# Install dependencies
echo "📦 Installing dependencies..."
pip install -r requirements.txt

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Check if essential modules are available
echo "🔍 Checking essential modules..."
python3 -c "
import importlib.util
modules = ['flask', 'flask_cors', 'firebase_admin', 'openai', 'requests', 'python_dotenv']
failed_modules = []
for module in modules:
    spec = importlib.util.find_spec(module)
    if spec is None:
        failed_modules.append(module)
        print(f'❌ {module} not found')
    else:
        print(f'✅ {module} available')

if failed_modules:
    print(f'❌ Missing modules: {failed_modules}')
    exit(1)
else:
    print('✅ All essential modules available')
"

if [ $? -ne 0 ]; then
    echo "❌ Module check failed"
    exit 1
fi

# Set environment variables
export FLASK_ENV=development
export FLASK_DEBUG=True

# Create logs directory if it doesn't exist
mkdir -p logs

echo "=" * 50
echo "✅ Environment setup complete!"
echo ""
echo "🌟 Starting Flask application..."
echo "📊 API will be available at: http://localhost:5000"
echo "🔍 Health Check: http://localhost:5000/api/health"
echo "📚 Full API Documentation: Available through configured endpoints"
echo ""
echo "🛠 Development Tools:"
echo "   • Test API: python test_api.py"
echo "   • Deploy: ./deploy.sh"
echo "   • View logs: tail -f logs/app.log"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the Flask application
python app.py
