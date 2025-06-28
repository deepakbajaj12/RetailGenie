# RetailGenie Backend - Complete Setup & Usage Instructions

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [System Requirements](#system-requirements)
3. [Software Installation](#software-installation)
4. [Project Setup](#project-setup)
5. [Environment Configuration](#environment-configuration)
6. [Firebase Setup](#firebase-setup)
7. [Running the Application](#running-the-application)
8. [API Documentation](#api-documentation)
9. [Testing](#testing)
10. [Troubleshooting](#troubleshooting)
11. [Production Deployment](#production-deployment)
12. [Development Workflow](#development-workflow)
13. [CI/CD Pipeline](#ci-cd-pipeline)
14. [Database Migration](#database-migration)
15. [API Documentation Standards](#api-documentation-standards)
16. [Quick Reference Commands](#quick-reference-commands)

---

## Prerequisites

Before starting, ensure you have:
- A computer with Windows 10+, macOS 10.14+, or Linux Ubuntu 18.04+
- Internet connection for downloading dependencies
- Administrator/sudo access for software installation
- A Google account for Firebase setup
- Basic knowledge of command line operations

---

## System Requirements

### Minimum Requirements
- **RAM**: 4GB (8GB recommended)
- **Storage**: 2GB free space
- **CPU**: Dual-core processor
- **Network**: Stable internet connection

### Recommended Requirements
- **RAM**: 8GB or higher
- **Storage**: 5GB free space
- **CPU**: Quad-core processor
- **Network**: High-speed internet connection

---

## Software Installation

### Step 1: Install Python

#### For Windows:
1. Go to [python.org](https://www.python.org/downloads/)
2. Download Python 3.8 or higher (recommended: Python 3.11)
3. Run the installer
4. **IMPORTANT**: Check "Add Python to PATH" during installation
5. Click "Install Now"
6. Verify installation by opening Command Prompt and typing:
   ```cmd
   python --version
   ```

#### For macOS:
1. Install Homebrew (if not already installed):
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```
2. Install Python:
   ```bash
   brew install python@3.11
   ```
3. Verify installation:
   ```bash
   python3 --version
   ```

#### For Linux (Ubuntu/Debian):
1. Update package list:
   ```bash
   sudo apt update
   ```
2. Install Python:
   ```bash
   sudo apt install python3 python3-pip python3-venv
   ```
3. Verify installation:
   ```bash
   python3 --version
   ```

### Step 2: Install Git

#### For Windows:
1. Go to [git-scm.com](https://git-scm.com/download/win)
2. Download Git for Windows
3. Run the installer with default settings
4. Verify installation:
   ```cmd
   git --version
   ```

#### For macOS:
```bash
brew install git
```

#### For Linux:
```bash
sudo apt install git
```

### Step 3: Install Code Editor (VS Code - Recommended)

1. Go to [code.visualstudio.com](https://code.visualstudio.com/)
2. Download VS Code for your operating system
3. Install with default settings
4. Install recommended extensions:
   - Python
   - Python Docstring Generator
   - GitLens
   - REST Client (for API testing)

### Step 4: Install Node.js (for frontend development)

1. Go to [nodejs.org](https://nodejs.org/)
2. Download LTS version
3. Install with default settings
4. Verify installation:
   ```bash
   node --version
   npm --version
   ```

---

## Project Setup

### Step 1: Clone the Repository

1. Open terminal/command prompt
2. Navigate to your desired directory:
   ```bash
   cd /path/to/your/projects
   ```
3. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/RetailGenie.git
   cd RetailGenie/backend
   ```

### Step 2: Create Virtual Environment

#### For Windows:
```cmd
python -m venv venv
venv\Scripts\activate
```

#### For macOS/Linux:
```bash
python3 -m venv venv
source venv/bin/activate
```

**Note**: You should see `(venv)` at the beginning of your command prompt, indicating the virtual environment is active.

### Step 3: Install Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

**What gets installed:**
- Flask: Web framework
- python-dotenv: Environment variable management
- openai: AI integration
- firebase-admin: Firebase integration
- reportlab: PDF generation
- requests: HTTP requests
- Flask-CORS: Cross-origin resource sharing

---

## Environment Configuration

### Step 1: Create Environment File

1. In the `backend` directory, create a file named `.env`:
   ```bash
   touch .env  # Linux/macOS
   # or create manually in Windows
   ```

2. Open `.env` file and add the following variables:
   ```env
   # Flask Configuration
   FLASK_ENV=development
   FLASK_DEBUG=True
   SECRET_KEY=your-secret-key-here-change-this-in-production

   # OpenAI Configuration
   OPENAI_API_KEY=your-openai-api-key-here

   # Firebase Configuration
   FIREBASE_CREDENTIALS_PATH=path/to/your/firebase-credentials.json
   FIREBASE_PROJECT_ID=your-firebase-project-id

   # Database Configuration (if using traditional DB)
   DATABASE_URL=your-database-url-here

   # Email Configuration (for notifications)
   SMTP_SERVER=smtp.gmail.com
   SMTP_PORT=587
   EMAIL_USERNAME=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password

   # API Configuration
   API_BASE_URL=http://localhost:5000
   CORS_ORIGINS=http://localhost:3000,http://localhost:3001
   ```

### Step 2: Generate Secret Key

Run this Python command to generate a secure secret key:
```python
python -c "import secrets; print(secrets.token_hex(32))"
```
Copy the output and replace `your-secret-key-here-change-this-in-production` in your `.env` file.

---

## Firebase Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `retailgenie-[your-name]`
4. Disable Google Analytics (optional for development)
5. Click "Create project"

### Step 2: Enable Firestore Database

1. In Firebase Console, click "Firestore Database"
2. Click "Create database"
3. Select "Start in test mode" (for development)
4. Choose your preferred location
5. Click "Done"

### Step 3: Create Service Account

1. Go to Project Settings (gear icon)
2. Click "Service accounts" tab
3. Click "Generate new private key"
4. Download the JSON file
5. Rename it to `firebase-credentials.json`
6. Move it to your backend directory
7. Update the `FIREBASE_CREDENTIALS_PATH` in your `.env` file:
   ```env
   FIREBASE_CREDENTIALS_PATH=./firebase-credentials.json
   ```

### Step 4: Configure Firebase Security Rules

1. In Firestore Database, go to "Rules" tab
2. Replace the default rules with:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Allow read/write access to all documents for development
       // CHANGE THIS FOR PRODUCTION
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```
3. Click "Publish"

### Step 5: Set Up Collections

Run this Python script to create initial collections:

```python
# create_collections.py
from utils.firebase_utils import FirebaseUtils

firebase = FirebaseUtils()

# Create sample product
product_data = {
    "name": "Sample Product",
    "price": 29.99,
    "category": "Electronics",
    "description": "This is a sample product",
    "in_stock": True,
    "created_at": "2024-01-01T00:00:00Z"
}

firebase.create_document("products", product_data)
print("Sample product created!")

# Create sample feedback
feedback_data = {
    "product_id": "sample-product-id",
    "rating": 5,
    "comment": "Great product!",
    "user_name": "Test User",
    "created_at": "2024-01-01T00:00:00Z"
}

firebase.create_document("feedback", feedback_data)
print("Sample feedback created!")
```

---

## Running the Application

### Step 1: Activate Virtual Environment

Make sure your virtual environment is activated:

#### Windows:
```cmd
venv\Scripts\activate
```

#### macOS/Linux:
```bash
source venv/bin/activate
```

### Step 2: Set Environment Variables (Alternative to .env)

If you prefer to set environment variables manually:

#### Windows:
```cmd
set FLASK_ENV=development
set FLASK_DEBUG=True
```

#### macOS/Linux:
```bash
export FLASK_ENV=development
export FLASK_DEBUG=True
```

### Step 3: Start the Server

```bash
python app.py
```

**Expected Output:**
```
 * Debug mode: on
 * Running on http://127.0.0.1:5000
 * Restarting with stat
 * Debugger is active!
```

### Step 4: Verify Server is Running

Open your browser and go to: `http://localhost:5000`

You should see a JSON response:
```json
{
  "message": "RetailGenie API is running!",
  "status": "success"
}
```

---

## API Documentation

### Base URL
```
Development: http://localhost:5000
Production: https://your-domain.com
```

### Authentication
Most endpoints require authentication. Include the token in headers:
```
Authorization: Bearer your-jwt-token-here
```

### Available Endpoints

#### 1. Health Check
```http
GET /
```
**Response:**
```json
{
  "message": "RetailGenie API is running!",
  "status": "success"
}
```

#### 2. Product Endpoints

##### Get All Products
```http
GET /api/products
```

##### Get Single Product
```http
GET /api/products/{product_id}
```

##### Create Product
```http
POST /api/products
Content-Type: application/json

{
  "name": "Product Name",
  "price": 29.99,
  "category": "Electronics",
  "description": "Product description",
  "in_stock": true
}
```

##### Update Product
```http
PUT /api/products/{product_id}
Content-Type: application/json

{
  "name": "Updated Product Name",
  "price": 39.99
}
```

##### Delete Product
```http
DELETE /api/products/{product_id}
```

#### 3. Authentication Endpoints

##### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

##### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

#### 4. Feedback Endpoints

##### Get Product Feedback
```http
GET /api/feedback/{product_id}
```

##### Submit Feedback
```http
POST /api/feedback
Content-Type: application/json

{
  "product_id": "product-id-here",
  "rating": 5,
  "comment": "Great product!",
  "user_name": "John Doe"
}
```

### API Testing with cURL

#### Test Health Check:
```bash
curl -X GET http://localhost:5000/
```

#### Test Product Creation:
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "price": 19.99,
    "category": "Test Category",
    "description": "Test description",
    "in_stock": true
  }'
```

### API Testing with VS Code REST Client

Create a file named `api-tests.http` in your project:

```http
### Health Check
GET http://localhost:5000/

### Get All Products
GET http://localhost:5000/api/products

### Create Product
POST http://localhost:5000/api/products
Content-Type: application/json

{
  "name": "API Test Product",
  "price": 25.99,
  "category": "Test",
  "description": "Created via API test",
  "in_stock": true
}

### Register User
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "testpassword123",
  "name": "Test User"
}
```

---

## Testing

### Step 1: Install Testing Dependencies

```bash
pip install pytest pytest-flask pytest-cov
```

### Step 2: Create Test Files

Create a `tests` directory:
```bash
mkdir tests
touch tests/__init__.py
touch tests/test_app.py
```

### Step 3: Write Basic Tests

Add to `tests/test_app.py`:
```python
import pytest
from app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_health_check(client):
    response = client.get('/')
    assert response.status_code == 200
    assert b'RetailGenie API is running!' in response.data

def test_products_endpoint(client):
    response = client.get('/api/products')
    assert response.status_code in [200, 404]  # 404 if no products exist
```

### Step 4: Run Tests

```bash
pytest tests/ -v
```

---

## Troubleshooting

### Common Issues and Solutions

#### 1. "Module not found" Error
**Problem**: Python can't find installed modules
**Solution**: 
- Make sure virtual environment is activated
- Reinstall requirements: `pip install -r requirements.txt`

#### 2. "Port already in use" Error
**Problem**: Port 5000 is occupied
**Solution**: 
- Kill the process: `lsof -ti:5000 | xargs kill -9` (macOS/Linux)
- Or use a different port: `flask run --port 5001`

#### 3. Firebase Connection Error
**Problem**: Cannot connect to Firebase
**Solution**: 
- Check Firebase credentials path in `.env`
- Verify Firebase project ID
- Ensure service account has proper permissions

#### 4. CORS Error
**Problem**: Frontend can't connect to API
**Solution**: 
- Check CORS_ORIGINS in `.env`
- Ensure Flask-CORS is installed
- Verify frontend URL is in allowed origins

#### 5. Environment Variables Not Loading
**Problem**: `.env` file not being read
**Solution**: 
- Ensure `.env` file is in the same directory as `app.py`
- Check file permissions
- Verify python-dotenv is installed

### Debug Mode

Enable detailed error messages:
```python
# In app.py
app.config['DEBUG'] = True
```

### Logging

Check application logs:
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

---

## Production Deployment

### Step 1: Prepare for Production

1. Update `.env` for production:
   ```env
   FLASK_ENV=production
   FLASK_DEBUG=False
   SECRET_KEY=very-secure-secret-key-here
   ```

2. Install production server:
   ```bash
   pip install gunicorn
   ```

### Step 2: Deploy to Render (Recommended)

1. Create `render.yaml` (already exists):
   ```yaml
   services:
     - type: web
       name: retailgenie-backend
       env: python
       buildCommand: pip install -r requirements.txt
       startCommand: gunicorn --bind 0.0.0.0:$PORT app:app
   ```

2. Connect your GitHub repository to Render
3. Deploy automatically

### Step 3: Deploy to Heroku

1. Install Heroku CLI
2. Create `Procfile`:
   ```
   web: gunicorn app:app
   ```
3. Deploy:
   ```bash
   heroku create your-app-name
   git push heroku main
   ```

### Step 4: Deploy to Google Cloud Platform

1. Install Google Cloud SDK
2. Create `app.yaml`:
   ```yaml
   runtime: python39
   
   env_variables:
     FLASK_ENV: production
     SECRET_KEY: your-secret-key
   ```
3. Deploy:
   ```bash
   gcloud app deploy
   ```

### Step 5: Deploy with Docker

1. Create `Dockerfile` (if not exists):
   ```dockerfile
   FROM python:3.11-slim

   WORKDIR /app

   # Install system dependencies
   RUN apt-get update && apt-get install -y \
       gcc \
       && rm -rf /var/lib/apt/lists/*

   # Copy requirements first for better caching
   COPY requirements.txt .
   RUN pip install --no-cache-dir -r requirements.txt

   # Copy application code
   COPY . .

   # Create non-root user
   RUN adduser --disabled-password --gecos '' appuser
   RUN chown -R appuser:appuser /app
   USER appuser

   EXPOSE 5000

   # Use gunicorn for production
   CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "4", "app:app"]
   ```

2. Create `.dockerignore`:
   ```
   venv/
   __pycache__/
   *.pyc
   .env
   .git/
   README.md
   tests/
   .pytest_cache/
   ```

3. Build and run Docker container:
   ```bash
   # Build image
   docker build -t retailgenie-backend .

   # Run container
   docker run -p 5000:5000 --env-file .env retailgenie-backend
   ```

4. Docker Compose for development:
   ```yaml
   # docker-compose.yml
   version: '3.8'
   services:
     backend:
       build: .
       ports:
         - "5000:5000"
       volumes:
         - .:/app
         - /app/venv
       environment:
         - FLASK_ENV=development
         - FLASK_DEBUG=True
       env_file:
         - .env
   ```

   Run with: `docker-compose up --build`

### Step 6: API Versioning

For production applications, implement API versioning:

1. **URL Versioning** (Recommended):
   ```
   /api/v1/products
   /api/v2/products
   ```

2. **Header Versioning**:
   ```
   API-Version: v1
   ```

3. **Example implementation**:
   ```python
   # In routes/product_routes.py
   from flask import Blueprint

   # Version 1 blueprint
   product_v1_bp = Blueprint('product_v1', __name__, url_prefix='/api/v1')

   @product_v1_bp.route('/products', methods=['GET'])
   def get_products_v1():
       # Version 1 implementation
       pass

   # Version 2 blueprint  
   product_v2_bp = Blueprint('product_v2', __name__, url_prefix='/api/v2')

   @product_v2_bp.route('/products', methods=['GET'])
   def get_products_v2():
       # Version 2 implementation with new features
       pass
   ```

---

## Performance Optimization

### Caching

1. **Install Redis** (for production caching):
   ```bash
   pip install redis flask-caching
   ```

2. **Configure caching**:
   ```python
   from flask_caching import Cache

   cache = Cache(app, config={'CACHE_TYPE': 'redis'})

   @cache.cached(timeout=300)  # Cache for 5 minutes
   def get_products():
       # Expensive database operation
       pass
   ```

### Database Optimization

1. **Connection Pooling**:
   ```python
   # For production, use connection pooling
   from sqlalchemy import create_engine
   from sqlalchemy.pool import QueuePool

   engine = create_engine(
       DATABASE_URL,
       poolclass=QueuePool,
       pool_size=20,
       max_overflow=0
   )
   ```

2. **Query Optimization**:
   ```python
   # Use pagination for large datasets
   @app.route('/api/products')
   def get_products():
       page = request.args.get('page', 1, type=int)
       per_page = request.args.get('per_page', 20, type=int)
       
       products = firebase_utils.get_documents_paginated(
           'products', 
           page=page, 
           per_page=per_page
       )
       return jsonify(products)
   ```

### Rate Limiting

1. **Install Flask-Limiter**:
   ```bash
   pip install Flask-Limiter
   ```

2. **Configure rate limiting**:
   ```python
   from flask_limiter import Limiter
   from flask_limiter.util import get_remote_address

   limiter = Limiter(
       app,
       key_func=get_remote_address,
       default_limits=["1000 per hour"]
   )

   @app.route('/api/products')
   @limiter.limit("100 per minute")
   def get_products():
       pass
   ```

---

## Monitoring and Logging

### Application Monitoring

1. **Health Check Endpoint**:
   ```python
   @app.route('/health')
   def health_check():
       return jsonify({
           'status': 'healthy',
           'timestamp': datetime.utcnow().isoformat(),
           'version': '1.0.0',
           'environment': os.getenv('FLASK_ENV'),
           'database': 'connected' if firebase_utils.test_connection() else 'disconnected'
       })
   ```

2. **Metrics Collection**:
   ```python
   import time
   from functools import wraps

   def measure_time(f):
       @wraps(f)
       def decorated_function(*args, **kwargs):
           start_time = time.time()
           result = f(*args, **kwargs)
           end_time = time.time()
           app.logger.info(f"{f.__name__} took {end_time - start_time:.2f} seconds")
           return result
       return decorated_function
   ```

### Structured Logging

1. **Configure structured logging**:
   ```python
   import logging
   import json
   from datetime import datetime

   class JSONFormatter(logging.Formatter):
       def format(self, record):
           log_entry = {
               'timestamp': datetime.utcnow().isoformat(),
               'level': record.levelname,
               'message': record.getMessage(),
               'module': record.module,
               'function': record.funcName,
               'line': record.lineno
           }
           return json.dumps(log_entry)

   # Configure logger
   handler = logging.StreamHandler()
   handler.setFormatter(JSONFormatter())
   app.logger.addHandler(handler)
   app.logger.setLevel(logging.INFO)
   ```

---

## Advanced Features

### Background Tasks

1. **Install Celery** (for async tasks):
   ```bash
   pip install celery redis
   ```

2. **Configure Celery**:
   ```python
   # celery_app.py
   from celery import Celery

   def make_celery(app):
       celery = Celery(
           app.import_name,
           backend=app.config['CELERY_RESULT_BACKEND'],
           broker=app.config['CELERY_BROKER_URL']
       )
       return celery

   celery = make_celery(app)

   @celery.task
   def send_email_async(recipient, subject, body):
       # Send email in background
       pass
   ```

### WebSocket Support

1. **Install Flask-SocketIO**:
   ```bash
   pip install flask-socketio
   ```

2. **Configure WebSocket**:
   ```python
   from flask_socketio import SocketIO, emit

   socketio = SocketIO(app, cors_allowed_origins="*")

   @socketio.on('connect')
   def handle_connect():
       emit('response', {'data': 'Connected'})
   ```

### API Documentation with Swagger

1. **Install Flask-RESTX**:
   ```bash
   pip install flask-restx
   ```

2. **Configure Swagger**:
   ```python
   from flask_restx import Api, Resource, fields

   api = Api(app, doc='/docs/', title='RetailGenie API')

   product_model = api.model('Product', {
       'name': fields.String(required=True, description='Product name'),
       'price': fields.Float(required=True, description='Product price'),
       'category': fields.String(description='Product category')
   })

   @api.route('/products')
   class ProductList(Resource):
       @api.marshal_list_with(product_model)
       def get(self):
           """Get all products"""
           return products
   ```

---

## Development Workflow

### Git Workflow

1. **Branch Strategy**:
   ```bash
   # Create feature branch
   git checkout -b feature/product-recommendations
   
   # Make changes and commit
   git add .
   git commit -m "feat: implement product recommendations API"
   
   # Push branch
   git push origin feature/product-recommendations
   
   # Create pull request
   # After review, merge to main
   ```

2. **Commit Message Conventions**:
   ```
   feat: new feature
   fix: bug fix
   docs: documentation changes
   style: formatting changes
   refactor: code refactoring
   test: adding tests
   chore: maintenance tasks
   ```

3. **Pre-commit Hooks**:
   ```bash
   # Install pre-commit
   pip install pre-commit
   
   # Create .pre-commit-config.yaml
   touch .pre-commit-config.yaml
   ```

   Add to `.pre-commit-config.yaml`:
   ```yaml
   repos:
     - repo: https://github.com/psf/black
       rev: 22.3.0
       hooks:
         - id: black
           language_version: python3
     - repo: https://github.com/pycqa/flake8
       rev: 4.0.1
       hooks:
         - id: flake8
     - repo: https://github.com/pre-commit/mirrors-mypy
       rev: v0.950
       hooks:
         - id: mypy
   ```

   Install hooks:
   ```bash
   pre-commit install
   ```

### Code Quality

1. **Code Formatting with Black**:
   ```bash
   # Format all Python files
   black .
   
   # Check formatting without making changes
   black --check .
   ```

2. **Linting with Flake8**:
   ```bash
   # Run linter
   flake8 .
   
   # With custom configuration
   flake8 --max-line-length=88 --ignore=E203,W503 .
   ```

3. **Type Checking with MyPy**:
   ```bash
   # Install mypy
   pip install mypy
   
   # Run type checking
   mypy . --ignore-missing-imports
   ```

4. **Create setup.cfg** for tool configuration:
   ```ini
   [flake8]
   max-line-length = 88
   ignore = E203, W503
   exclude = venv, .git, __pycache__
   
   [mypy]
   python_version = 3.8
   ignore_missing_imports = True
   ```

### Testing Strategy

1. **Test Structure**:
   ```
   tests/
   ├── unit/
   │   ├── test_controllers.py
   │   ├── test_models.py
   │   └── test_utils.py
   ├── integration/
   │   ├── test_api_endpoints.py
   │   └── test_database.py
   └── conftest.py
   ```

2. **Test Configuration** (`conftest.py`):
   ```python
   import pytest
   from app import create_app
   
   @pytest.fixture
   def app():
       app = create_app({'TESTING': True})
       return app
   
   @pytest.fixture
   def client(app):
       return app.test_client()
   
   @pytest.fixture
   def runner(app):
       return app.test_cli_runner()
   ```

3. **Test Coverage**:
   ```bash
   # Install coverage
   pip install pytest-cov
   
   # Run tests with coverage
   pytest --cov=. --cov-report=html
   
   # View coverage report
   open htmlcov/index.html
   ```

### Environment Management

1. **Multiple Environments**:
   ```
   .env.development
   .env.testing
   .env.production
   ```

2. **Environment-specific Configuration**:
   ```python
   # config.py
   import os
   
   class Config:
       SECRET_KEY = os.environ.get('SECRET_KEY')
       FIREBASE_CREDENTIALS_PATH = os.environ.get('FIREBASE_CREDENTIALS_PATH')
   
   class DevelopmentConfig(Config):
       DEBUG = True
       FIREBASE_PROJECT_ID = 'retailgenie-dev'
   
   class ProductionConfig(Config):
       DEBUG = False
       FIREBASE_PROJECT_ID = 'retailgenie-prod'
   
   config = {
       'development': DevelopmentConfig,
       'production': ProductionConfig,
       'default': DevelopmentConfig
   }
   ```

---

## CI/CD Pipeline

### GitHub Actions

1. **Create Workflow Directory**:
   ```bash
   mkdir -p .github/workflows
   ```

2. **Create CI Pipeline** (`.github/workflows/ci.yml`):
   ```yaml
   name: CI/CD Pipeline
   
   on:
     push:
       branches: [ main, develop ]
     pull_request:
       branches: [ main ]
   
   jobs:
     test:
       runs-on: ubuntu-latest
       
       strategy:
         matrix:
           python-version: [3.8, 3.9, '3.10', '3.11']
       
       steps:
       - uses: actions/checkout@v3
       
       - name: Set up Python ${{ matrix.python-version }}
         uses: actions/setup-python@v3
         with:
           python-version: ${{ matrix.python-version }}
       
       - name: Install dependencies
         run: |
           python -m pip install --upgrade pip
           pip install -r requirements.txt
           pip install pytest pytest-cov flake8 black mypy
       
       - name: Lint with flake8
         run: |
           flake8 . --count --select=E9,F63,F7,F82 --show-source --statistics
           flake8 . --count --exit-zero --max-complexity=10 --max-line-length=88 --statistics
       
       - name: Format check with black
         run: black --check .
       
       - name: Type check with mypy
         run: mypy . --ignore-missing-imports
       
       - name: Test with pytest
         run: |
           pytest --cov=. --cov-report=xml
       
       - name: Upload coverage to Codecov
         uses: codecov/codecov-action@v3
         with:
           file: ./coverage.xml
   
     deploy:
       needs: test
       runs-on: ubuntu-latest
       if: github.ref == 'refs/heads/main'
       
       steps:
       - uses: actions/checkout@v3
       
       - name: Deploy to production
         run: |
           # Add deployment steps here
           echo "Deploying to production..."
   ```

### Automated Testing

1. **Integration Tests**:
   ```python
   # tests/integration/test_api.py
   import pytest
   import json
   
   def test_product_crud_flow(client):
       # Test create product
       response = client.post('/api/products', 
           data=json.dumps({
               'name': 'Test Product',
               'price': 29.99,
               'category': 'Test'
           }),
           content_type='application/json'
       )
       assert response.status_code == 201
       product_id = response.json['id']
       
       # Test get product
       response = client.get(f'/api/products/{product_id}')
       assert response.status_code == 200
       assert response.json['name'] == 'Test Product'
       
       # Test update product
       response = client.put(f'/api/products/{product_id}',
           data=json.dumps({'price': 39.99}),
           content_type='application/json'
       )
       assert response.status_code == 200
       
       # Test delete product
       response = client.delete(f'/api/products/{product_id}')
       assert response.status_code == 204
   ```

2. **Load Testing**:
   ```bash
   # Install locust
   pip install locust
   
   # Create locustfile.py
   from locust import HttpUser, task, between
   
   class WebsiteUser(HttpUser):
       wait_time = between(1, 3)
       
       @task
       def get_products(self):
           self.client.get("/api/products")
       
       @task(3)
       def get_single_product(self):
           self.client.get("/api/products/1")
   
   # Run load test
   locust -f locustfile.py --host=http://localhost:5000
   ```

---

## Database Migration

### Firestore Schema Management

1. **Version Control for Schema**:
   ```python
   # migrations/v1_initial_schema.py
   from utils.firebase_utils import FirebaseUtils
   
   def migrate():
       firebase = FirebaseUtils()
       
       # Create collections with initial documents
       collections = [
           'products',
           'users', 
           'feedback',
           'orders',
           'analytics'
       ]
       
       for collection_name in collections:
           # Create collection with a dummy document
           firebase.create_document(collection_name, {
               'initialized': True,
               'version': '1.0',
               'created_at': firebase.get_timestamp()
           })
   
   if __name__ == '__main__':
       migrate()
   ```

2. **Data Backup Strategy**:
   ```python
   # backup.py
   import json
   from datetime import datetime
   from utils.firebase_utils import FirebaseUtils
   
   def backup_collection(collection_name):
       firebase = FirebaseUtils()
       documents = firebase.get_all_documents(collection_name)
       
       backup_data = {
           'collection': collection_name,
           'timestamp': datetime.utcnow().isoformat(),
           'documents': documents
       }
       
       filename = f"backup_{collection_name}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
       with open(filename, 'w') as f:
           json.dump(backup_data, f, indent=2)
       
       print(f"Backup created: {filename}")
   
   if __name__ == '__main__':
       collections = ['products', 'users', 'feedback']
       for collection in collections:
           backup_collection(collection)
   ```

---

## API Documentation Standards

### OpenAPI/Swagger Documentation

1. **Complete API Specification**:
   ```yaml
   # api-spec.yaml
   openapi: 3.0.0
   info:
     title: RetailGenie API
     description: Comprehensive retail management API
     version: 1.0.0
     contact:
       name: API Support
       email: support@retailgenie.com
   
   servers:
     - url: https://api.retailgenie.com/v1
       description: Production server
     - url: http://localhost:5000/api
       description: Development server
   
   paths:
     /products:
       get:
         summary: Get all products
         tags:
           - Products
         parameters:
           - name: page
             in: query
             schema:
               type: integer
               default: 1
           - name: limit
             in: query
             schema:
               type: integer
               default: 20
         responses:
           '200':
             description: List of products
             content:
               application/json:
                 schema:
                   type: object
                   properties:
                     products:
                       type: array
                       items:
                         $ref: '#/components/schemas/Product'
                     pagination:
                       $ref: '#/components/schemas/Pagination'
   
   components:
     schemas:
       Product:
         type: object
         required:
           - name
           - price
         properties:
           id:
             type: string
             format: uuid
           name:
             type: string
             minLength: 1
             maxLength: 100
           price:
             type: number
             format: float
             minimum: 0
           category:
             type: string
           description:
             type: string
           in_stock:
             type: boolean
           created_at:
             type: string
             format: date-time
   ```

2. **Postman Collection Export**:
   ```json
   {
     "info": {
       "name": "RetailGenie API",
       "description": "Complete API collection for RetailGenie",
       "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
     },
     "variable": [
       {
         "key": "base_url",
         "value": "http://localhost:5000",
         "type": "string"
       },
       {
         "key": "auth_token",
         "value": "",
         "type": "string"
       }
     ],
     "item": [
       {
         "name": "Products",
         "item": [
           {
             "name": "Get All Products",
             "request": {
               "method": "GET",
               "header": [],
               "url": {
                 "raw": "{{base_url}}/api/products",
                 "host": ["{{base_url}}"],
                 "path": ["api", "products"]
               }
             }
           }
         ]
       }
     ]
   }
   ```

---

## Quick Reference Commands

### Daily Development Commands

```bash
# Start development environment
source venv/bin/activate
export FLASK_ENV=development
python app.py

# Run tests
pytest tests/ -v --cov=.

# Format code
black . && flake8 .

# Type check
mypy . --ignore-missing-imports

# Create migration
python migrations/create_migration.py

# Backup database
python backup.py

# Deploy to staging
git push origin develop

# Deploy to production
git push origin main
```

### Useful One-liners

```bash
# Check API health
curl -s http://localhost:5000/health | jq

# Load test endpoint
curl -X GET http://localhost:5000/api/products -w "@curl-format.txt"

# Check Python imports
python -c "import sys; print('\n'.join(sys.path))"

# Generate requirements.txt
pip freeze > requirements.txt

# Find unused dependencies
pip-check

# Security audit
pip-audit
```

---

## Troubleshooting Quick Fixes

### Performance Issues

1. **Slow API Responses**:
   ```python
   # Add request timing middleware
   @app.before_request
   def before_request():
       g.start_time = time.time()
   
   @app.after_request
   def after_request(response):
       duration = time.time() - g.start_time
       if duration > 1.0:  # Log slow requests
           app.logger.warning(f"Slow request: {request.path} took {duration:.2f}s")
       return response
   ```

2. **Memory Usage**:
   ```python
   # Monitor memory usage
   import psutil
   import os
   
   @app.route('/metrics')
   def metrics():
       process = psutil.Process(os.getpid())
       memory_info = process.memory_info()
       return jsonify({
           'memory_usage_mb': memory_info.rss / 1024 / 1024,
           'cpu_percent': process.cpu_percent()
       })
   ```

### Database Issues

1. **Connection Problems**:
   ```python
   # Test Firebase connection
   def test_firebase_connection():
       try:
           firebase = FirebaseUtils()
           firebase.db.collection('test').limit(1).get()
           return True
       except Exception as e:
           app.logger.error(f"Firebase connection failed: {e}")
           return False
   ```

2. **Query Optimization**:
   ```python
   # Use batch operations for multiple documents
   def batch_create_products(products):
       batch = firebase.db.batch()
       for product in products:
           doc_ref = firebase.db.collection('products').document()
           batch.set(doc_ref, product)
       batch.commit()
   ```

---
