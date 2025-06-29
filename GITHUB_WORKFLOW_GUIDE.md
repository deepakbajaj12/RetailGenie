# GitHub Workflow Configuration Guide

This document outlines the GitHub workflow setup that implements the Git workflow conventions described in the instruction manual.

## 🎯 **Workflow Features Implemented**

### **1. Branch Protection & Naming**
- ✅ **Automatic validation** of branch naming conventions
- ✅ **Support for feature branches**: `feature/product-recommendations`
- ✅ **Commit message validation** following conventional commits
- ✅ **Pull request requirements** for main/develop branches

### **2. Commit Message Conventions**
The workflow validates commit messages follow this format:
```
type(scope): description

Types supported:
- feat: new feature
- fix: bug fix
- docs: documentation changes
- style: formatting changes
- refactor: code refactoring
- test: adding tests
- chore: maintenance tasks
```

### **3. Pre-commit Hook Integration**
- ✅ **Automated code formatting** with Black
- ✅ **Linting** with Flake8
- ✅ **Type checking** with MyPy
- ✅ **Import sorting** with isort
- ✅ **Security scanning** with safety and bandit

## 🚀 **Workflow Jobs**

### **1. Validation Job**
```yaml
validate:
  - Branch naming validation
  - Commit message format checking
  - Only runs on pull requests
```

### **2. Code Quality Job**
```yaml
code-quality:
  - Pre-commit hooks execution
  - Code formatting checks
  - Linting and type checking
  - Import sorting validation
```

### **3. Testing Jobs**
```yaml
test:
  - Multi-Python version testing (3.11, 3.12)
  - Unit and integration tests
  - Coverage reporting
  - Parallel test execution

security-scan:
  - Dependency vulnerability scanning
  - Code security analysis
  - SARIF report generation
```

### **4. Performance & Integration**
```yaml
performance-tests:
  - Load testing with Locust
  - Performance benchmarking
  - Only on performance-labeled PRs

integration-tests:
  - API endpoint testing
  - Database integration tests
  - Service connectivity checks
```

### **5. Deployment Validation**
```yaml
deploy:
  - Docker image building
  - Container health checks
  - Smoke testing
  - Environment-specific deployment
```

## 📋 **Usage Examples**

### **Creating a Feature Branch**
```bash
# Follow the naming convention
git checkout -b feature/product-recommendations

# Make changes with proper commit messages
git add .
git commit -m "feat: implement product recommendations API"

# Push and create PR
git push origin feature/product-recommendations
```

### **Commit Message Examples**
```bash
# New feature
git commit -m "feat(products): add search functionality with filters"

# Bug fix
git commit -m "fix(auth): resolve token expiration issue"

# Documentation
git commit -m "docs(api): update endpoint documentation"

# Refactoring
git commit -m "refactor(utils): optimize database query performance"

# Tests
git commit -m "test(products): add unit tests for CRUD operations"
```

### **Pre-commit Setup Locally**
```bash
# Install pre-commit
pip install pre-commit

# Install hooks (automatic on first commit)
pre-commit install

# Run hooks manually
pre-commit run --all-files
```

## 🔧 **Configuration Files**

### **`.pre-commit-config.yaml`**
```yaml
repos:
  - repo: https://github.com/psf/black
    rev: 24.8.0
    hooks:
      - id: black
        language_version: python3
        args: ['--line-length=88']

  - repo: https://github.com/pycqa/flake8
    rev: 7.1.1
    hooks:
      - id: flake8
        args: ['--max-line-length=88', '--ignore=E203,W503']

  - repo: https://github.com/pre-commit/mirrors-mypy
    rev: v1.11.2
    hooks:
      - id: mypy
        args: ['--ignore-missing-imports']
```

### **Workflow Triggers**
```yaml
on:
  push:
    branches: [ main, develop, 'feature/**', 'fix/**' ]
  pull_request:
    branches: [ main, develop ]
  workflow_dispatch: # Manual trigger
```

## 📊 **Quality Gates**

### **Required Checks for PRs**
- ✅ Branch naming convention
- ✅ Commit message format
- ✅ Code quality (formatting, linting)
- ✅ All tests passing
- ✅ Security scan clean
- ✅ Coverage threshold met

### **Deployment Requirements**
- ✅ All quality gates passed
- ✅ Integration tests successful
- ✅ Docker build successful
- ✅ Smoke tests passing

## 🔄 **CI/CD Pipeline**

### **GitHub Actions**

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

### **Automated Testing**

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

## 🎯 **Benefits**

1. **Consistency**: Enforced coding standards and commit formats
2. **Quality**: Automated testing and security scanning
3. **Reliability**: Comprehensive validation before deployment
4. **Efficiency**: Parallel job execution and caching
5. **Transparency**: Detailed reporting and notifications

## 🚀 **Next Steps**

1. **Set up branch protection rules** in GitHub repository settings
2. **Configure required status checks** for PRs
3. **Add deployment secrets** for production environments
4. **Set up notifications** for team collaboration
5. **Configure code coverage** requirements

The GitHub workflow is now fully integrated with the Git workflow conventions, providing automated quality assurance and deployment validation for the RetailGenie project.
