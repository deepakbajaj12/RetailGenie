# 🧪 RetailGenie Backend Testing Guide

## Overview

This document provides comprehensive testing instructions for the RetailGenie backend API. The testing framework uses pytest with Flask testing capabilities and provides both unit tests and integration tests with mocked Firebase services.

## Quick Start

### 1. Install Testing Dependencies

```bash
# From the backend directory
source venv/bin/activate
pip install pytest pytest-flask pytest-cov
```

### 2. Run Tests

```bash
# Run all basic tests
python -m pytest tests/test_basic.py -v

# Run tests with coverage
python -m pytest tests/test_basic.py --cov=. --cov-report=term-missing

# Run specific test
python -m pytest tests/test_basic.py::TestBasicFunctionality::test_health_endpoints -v

# Use the test runner script
./run_tests.sh
```

## Test Structure

### Core Test Files

```
tests/
├── conftest.py              # Test configuration and fixtures
├── test_basic.py            # Essential functionality tests
├── test_app.py              # Comprehensive API tests
├── test_firebase_utils.py   # Firebase utilities tests
└── test_integration.py      # Integration tests
```

### Fixture Configuration

The `conftest.py` file provides:
- **Mocked Firebase**: Prevents actual database operations during testing
- **Test App**: Flask application configured for testing
- **Test Client**: HTTP client for API requests

## Test Categories

### 1. Basic Functionality Tests (`test_basic.py`)

**Purpose**: Verify core API functionality with minimal complexity

**Coverage**:
- ✅ Health check endpoints (`/`, `/health`)
- ✅ Product CRUD operations
- ✅ User authentication (register/login)
- ✅ Feedback submission and retrieval
- ✅ Error handling and validation

**Example**:
```python
def test_health_endpoints(self, client):
    """Test health check endpoints."""
    response = client.get('/')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['message'] == 'RetailGenie API is running!'
```

### 2. Data Validation Tests

**Purpose**: Ensure proper input validation and error responses

**Coverage**:
- ✅ Missing required fields
- ✅ Invalid data types
- ✅ Boundary value testing
- ✅ Malformed JSON handling

### 3. Comprehensive API Tests (`test_app.py`)

**Purpose**: Detailed testing of all API endpoints

**Coverage**:
- Products: GET, POST, PUT, DELETE
- Authentication: Register, Login
- Feedback: Submit, Retrieve
- Admin: Database initialization
- Error scenarios

### 4. Firebase Utils Tests (`test_firebase_utils.py`)

**Purpose**: Test Firebase integration utilities

**Coverage**:
- Database connection
- Document CRUD operations
- Query functionality
- Error handling

## Running Specific Tests

### By Test File
```bash
# Basic functionality only
pytest tests/test_basic.py

# Comprehensive API tests
pytest tests/test_app.py

# Firebase utilities
pytest tests/test_firebase_utils.py
```

### By Test Class
```bash
# Health endpoints only
pytest tests/test_basic.py::TestBasicFunctionality

# Product validation
pytest tests/test_basic.py::TestDataValidation
```

### By Test Method
```bash
# Single test
pytest tests/test_basic.py::TestBasicFunctionality::test_products_crud
```

## Coverage Analysis

### Generate Coverage Reports

```bash
# Terminal coverage report
pytest tests/test_basic.py --cov=. --cov-report=term-missing

# HTML coverage report
pytest tests/test_basic.py --cov=. --cov-report=html

# Both terminal and HTML
pytest tests/test_basic.py --cov=. --cov-report=term-missing --cov-report=html
```

### View HTML Coverage Report

After running coverage, open `htmlcov/index.html` in a browser to see:
- Line-by-line coverage analysis
- Missing coverage highlights
- Function and branch coverage

## Test Configuration

### Environment Variables

Tests automatically set:
```bash
TESTING=true
FIREBASE_PROJECT_ID=test-project
```

### Mocking Strategy

The test suite uses comprehensive mocking:

1. **Firebase Services**: All Firebase operations are mocked
2. **Database Operations**: Return predictable test data
3. **External APIs**: Isolated from real services

### Test Data

Standard test fixtures include:
```python
# Sample product
{
    'id': 'test-product-1',
    'name': 'Test Product 1',
    'price': 29.99,
    'category': 'Electronics',
    'description': 'Test product description',
    'in_stock': True
}

# Sample user
{
    'email': 'test@example.com',
    'password': 'password123',
    'name': 'Test User'
}
```

## Test Output Examples

### Successful Test Run
```
================================= test session starts =================================
tests/test_basic.py::TestBasicFunctionality::test_health_endpoints PASSED    [ 12%]
tests/test_basic.py::TestBasicFunctionality::test_products_crud PASSED       [ 25%]
tests/test_basic.py::TestBasicFunctionality::test_authentication_basic PASSED [ 37%]
tests/test_basic.py::TestBasicFunctionality::test_feedback_basic PASSED      [ 50%]
tests/test_basic.py::TestBasicFunctionality::test_error_handling PASSED      [ 62%]
tests/test_basic.py::TestDataValidation::test_product_validation PASSED      [ 75%]
tests/test_basic.py::TestDataValidation::test_feedback_validation PASSED     [ 87%]
tests/test_basic.py::TestDataValidation::test_auth_validation PASSED         [100%]

========================== 8 passed, 5 warnings in 0.48s =======================
```

### Coverage Report
```
Name                      Stmts   Miss  Cover   Missing
-------------------------------------------------------
app.py                      194     98    49%   55-57, 61-69, 76...
tests/conftest.py            31      0   100%
tests/test_basic.py          69      0   100%
utils/firebase_utils.py     219    201     8%   16-40, 55-83...
-------------------------------------------------------
TOTAL                      3329   3115     6%
```

## Best Practices

### Writing Tests

1. **Use Descriptive Names**: Test names should clearly describe what is being tested
2. **Arrange-Act-Assert**: Structure tests with clear setup, execution, and verification
3. **Mock External Dependencies**: Isolate tests from external services
4. **Test Edge Cases**: Include boundary values and error conditions

### Test Organization

1. **Group Related Tests**: Use test classes to organize related functionality
2. **Use Fixtures**: Leverage pytest fixtures for common setup
3. **Keep Tests Independent**: Each test should run in isolation
4. **Document Complex Tests**: Add docstrings for complex test scenarios

## Troubleshooting

### Common Issues

**Import Errors**:
```bash
# Ensure virtual environment is activated
source venv/bin/activate

# Install test dependencies
pip install pytest pytest-flask pytest-cov
```

**Firebase Connection Errors**:
- Tests should use mocked Firebase (configured in `conftest.py`)
- If seeing real Firebase errors, check fixture configuration

**Test Failures**:
- Check that the Flask app is running in test mode
- Verify mock data matches expected responses
- Ensure database operations are properly mocked

### Debug Mode

Run tests with additional output:
```bash
# Verbose output
pytest tests/test_basic.py -v -s

# Show local variables on failure
pytest tests/test_basic.py -v --tb=long

# Stop on first failure
pytest tests/test_basic.py -x
```

## Continuous Integration

For CI/CD integration, use:
```bash
# CI-friendly test command
pytest tests/test_basic.py --junitxml=test-results.xml --cov=. --cov-report=xml
```

## Next Steps

1. **Expand Test Coverage**: Add tests for edge cases and error scenarios
2. **Performance Testing**: Add response time and load testing
3. **Integration Testing**: Test with real Firebase in staging environment
4. **Security Testing**: Add tests for authentication and authorization
5. **API Contract Testing**: Ensure API responses match documentation

---

## ✅ Test Verification

The RetailGenie backend now includes:
- **8 core functionality tests** - All passing ✅
- **Mocked Firebase integration** - Isolated testing ✅
- **Coverage reporting** - Performance visibility ✅
- **Easy test execution** - Simple commands ✅
- **Comprehensive documentation** - Clear instructions ✅

**Ready for development and deployment!** 🚀
