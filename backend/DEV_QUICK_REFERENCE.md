# RetailGenie Development Quick Reference

## Quick Reference Commands

### Daily Development Commands

```bash
# Start development environment
source venv/bin/activate
export FLASK_ENV=development
python app.py

# Start production environment
./start_production.sh

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
curl -s http://localhost:5001/health | jq

# Load test endpoint
curl -X GET http://localhost:5001/api/products -w "@curl-format.txt"

# Check Python imports
python -c "import sys; print('\n'.join(sys.path))"

# Generate requirements.txt
pip freeze > requirements.txt

# Find unused dependencies
pip-check

# Security audit
pip-audit

# Run API demo
./demo_api.sh

# Validate API docs
./validate_api_docs.sh
```

### API Testing Commands

```bash
# Health check
curl -s http://localhost:5001/

# Get products
curl -s http://localhost:5001/api/v1/products | jq

# Register user
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Login user
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Create product (with auth)
curl -X POST http://localhost:5001/api/v1/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Product","price":29.99,"category":"Test"}'

# Advanced search
curl -s "http://localhost:5001/api/v2/search?q=coffee&category=Food" | jq
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

### Common Fixes

1. **Port Already in Use**:
   ```bash
   # Find process using port 5001
   lsof -i :5001

   # Kill process
   kill -9 PID

   # Or use different port
   export PORT=5002
   python app_production.py
   ```

2. **Virtual Environment Issues**:
   ```bash
   # Recreate virtual environment
   rm -rf venv
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

3. **Firebase Connection Issues**:
   ```bash
   # Check credentials file
   ls -la firebase-credentials.json

   # Verify environment variables
   echo $FIREBASE_PROJECT_ID

   # Test connection
   python -c "from utils.firebase_utils import FirebaseUtils; fb=FirebaseUtils(); print('Connected!')"
   ```

4. **Import Errors**:
   ```bash
   # Check Python path
   python -c "import sys; print(sys.path)"

   # Install missing dependencies
   pip install -r requirements.txt

   # Check specific import
   python -c "import flask_limiter; print('OK')"
   ```

### Development Workflow

1. **Feature Development**:
   ```bash
   # Create feature branch
   git checkout -b feature/new-endpoint

   # Make changes and test
   python app_production.py
   pytest tests/

   # Format and lint
   black . && flake8 .

   # Commit and push
   git add .
   git commit -m "Add new endpoint"
   git push origin feature/new-endpoint
   ```

2. **Bug Investigation**:
   ```bash
   # Check logs
   tail -f logs/app.log

   # Debug mode
   export FLASK_DEBUG=1
   python app_production.py

   # Run specific test
   pytest tests/test_specific.py::test_function -v -s
   ```

3. **Performance Testing**:
   ```bash
   # Start load testing
   locust -f locustfile.py --host=http://localhost:5001

   # Monitor resources
   htop

   # Check memory usage
   ps aux | grep python
   ```

## Environment Setup

### First Time Setup
```bash
# Clone repository
git clone <repository-url>
cd RetailGenie/backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up Firebase credentials
# Copy firebase-credentials.json to backend directory

# Initialize database
python -c "from app_production import create_app; app=create_app(); app.test_client().post('/api/admin/init-db')"

# Start development server
./start_production.sh
```

### Environment Variables
```bash
# Create .env file
cat > .env << EOF
FLASK_ENV=production
PORT=5001
FIREBASE_PROJECT_ID=your-project-id
CORS_ORIGINS=http://localhost:3000,https://yourdomain.com
OPENAI_API_KEY=your-openai-key
EOF
```

## Useful Tools

### API Documentation
- **OpenAPI Spec**: `api-spec.yaml`
- **Postman Collection**: `postman-collection.json`
- **Validation**: `./validate_api_docs.sh`
- **Demo**: `./demo_api.sh`

### Testing Tools
- **Unit Tests**: `pytest tests/`
- **Load Testing**: `locust -f locustfile.py`
- **API Testing**: Postman collection or cURL commands

### Code Quality
- **Formatting**: `black .`
- **Linting**: `flake8 .`
- **Type Checking**: `mypy .`
- **Security**: `bandit -r .`

### Database Management
- **Migrations**: `python migrations/create_migration.py`
- **Backup**: `python backup.py`
- **Restore**: `python backup.py --restore backup_file.json`

## Production Checklist

Before deploying to production:

- [ ] All tests pass (`pytest tests/`)
- [ ] Code is formatted (`black .`)
- [ ] No linting errors (`flake8 .`)
- [ ] Type checking passes (`mypy .`)
- [ ] Security scan clean (`bandit -r .`)
- [ ] API documentation updated
- [ ] Environment variables configured
- [ ] Firebase credentials set up
- [ ] SSL certificates configured
- [ ] Backup strategy in place
- [ ] Monitoring configured
- [ ] Load testing completed

## Support

For issues or questions:
1. Check this quick reference
2. Review `PRODUCTION_IMPLEMENTATION_COMPLETE.md`
3. Check API documentation in `api-spec.yaml`
4. Run diagnostic commands above
5. Check logs in `logs/` directory
