# RetailGenie API Documentation Guide

## 🚀 Quick Start

Welcome to the RetailGenie API! This guide will help you get started with our comprehensive retail management API that includes AI-powered recommendations, inventory management, and real-time analytics.

### 📋 Table of Contents

1. [Authentication](#authentication)
2. [API Versions](#api-versions)
3. [Rate Limiting](#rate-limiting)
4. [Error Handling](#error-handling)
5. [Pagination](#pagination)
6. [Core Endpoints](#core-endpoints)
7. [Advanced Features](#advanced-features)
8. [Code Examples](#code-examples)
9. [Testing](#testing)
10. [Support](#support)

## 🔐 Authentication

The RetailGenie API uses JWT (JSON Web Token) authentication for secure access to protected endpoints.

### Getting Started

1. **Register a new account** or **login** to get your JWT token
2. **Include the token** in the Authorization header for authenticated requests

### Example Authentication Flow

```bash
# 1. Register a new user
curl -X POST "https://api.retailgenie.com/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "developer@example.com",
    "password": "SecurePass123!",
    "name": "Developer Name"
  }'

# Response includes your JWT token
{
  "message": "User registered successfully",
  "user": {
    "id": "user-123",
    "email": "developer@example.com",
    "name": "Developer Name"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

# 2. Use the token for authenticated requests
curl -X GET "https://api.retailgenie.com/api/v1/products" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### JavaScript Example

```javascript
// Register/Login and store token
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'your@email.com',
    password: 'your-password'
  })
});

const { token } = await response.json();
localStorage.setItem('authToken', token);

// Use token for API calls
const apiCall = async (endpoint) => {
  const token = localStorage.getItem('authToken');
  const response = await fetch(endpoint, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.json();
};
```

## 📈 API Versions

RetailGenie supports multiple API versions to ensure backward compatibility and smooth migrations.

### Available Versions

- **v1** (Stable): `/api/v1/` - Production-ready, stable endpoints
- **v2** (Enhanced): `/api/v2/` - Latest features with enhanced functionality

### Version Differences

| Feature | v1 | v2 |
|---------|----|----|
| Basic CRUD | ✅ | ✅ |
| Advanced Search | ❌ | ✅ |
| AI Recommendations | ✅ | ✅ Enhanced |
| Analytics | Basic | ✅ Advanced |
| Real-time Updates | ❌ | ✅ |

### Migration Guide

```bash
# v1 - Basic product listing
GET /api/v1/products

# v2 - Enhanced with sorting and analytics
GET /api/v2/products?sort_by=price&sort_order=asc&include_analytics=true
```

## ⚡ Rate Limiting

API requests are rate-limited to ensure fair usage and system stability.

### Rate Limits

- **Authenticated Users**: 1000 requests/hour
- **Unauthenticated Users**: 100 requests/hour

### Rate Limit Headers

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

### Handling Rate Limits

```javascript
const handleRateLimit = async (response) => {
  if (response.status === 429) {
    const resetTime = response.headers.get('X-RateLimit-Reset');
    const waitTime = resetTime * 1000 - Date.now();

    console.log(`Rate limited. Waiting ${waitTime}ms`);
    await new Promise(resolve => setTimeout(resolve, waitTime));

    // Retry the request
    return fetch(url, options);
  }
  return response;
};
```

## 🚨 Error Handling

All API endpoints return consistent error responses with detailed information.

### Error Response Format

```json
{
  "error": "Resource not found",
  "status_code": 404,
  "timestamp": "2023-01-15T10:30:00Z",
  "path": "/api/products/invalid-id",
  "request_id": "req-123-abc",
  "details": {
    "resource_type": "product",
    "resource_id": "invalid-id"
  }
}
```

### Common HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Authentication required |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

### Error Handling Best Practices

```javascript
const apiRequest = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const error = await response.json();
      throw new APIError(error.error, response.status, error.request_id);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

class APIError extends Error {
  constructor(message, status, requestId) {
    super(message);
    this.status = status;
    this.requestId = requestId;
  }
}
```

## 📄 Pagination

List endpoints support cursor-based pagination for efficient data retrieval.

### Pagination Parameters

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

### Pagination Response

```json
{
  "products": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8,
    "has_next": true,
    "has_prev": false
  }
}
```

### Pagination Example

```javascript
const getAllProducts = async () => {
  let allProducts = [];
  let page = 1;
  let hasNext = true;

  while (hasNext) {
    const response = await fetch(`/api/v2/products?page=${page}&limit=50`);
    const data = await response.json();

    allProducts = [...allProducts, ...data.products];
    hasNext = data.pagination.has_next;
    page++;
  }

  return allProducts;
};
```

## 🛍️ Core Endpoints

### Products

#### List Products

```http
GET /api/v2/products?category=Electronics&in_stock=true&sort_by=price&sort_order=asc
```

**Parameters:**
- `category` (string): Filter by category
- `search` (string): Search term
- `in_stock` (boolean): Filter by stock status
- `min_price`, `max_price` (number): Price range
- `sort_by` (string): Sort field (name, price, created_at, rating)
- `sort_order` (string): Sort order (asc, desc)

#### Get Product

```http
GET /api/v2/products/{product_id}?include_recommendations=true
```

#### Create Product

```http
POST /api/v2/products
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "name": "Wireless Headphones",
  "price": 79.99,
  "category": "Electronics",
  "description": "High-quality wireless headphones",
  "in_stock": true,
  "stock_quantity": 50,
  "tags": ["wireless", "audio", "bluetooth"],
  "manufacturer": "TechCorp"
}
```

### Search

#### Advanced Search

```http
GET /api/v2/search?q=wireless%20headphones&filters={"price_range":[20,200]}
```

### AI Assistant

#### Chat with AI

```http
POST /api/v1/ai/chat
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "message": "I need wireless headphones under $100",
  "context": {
    "user_preferences": {
      "budget": 100,
      "category": "Electronics"
    }
  }
}
```

### Analytics

#### Get Dashboard

```http
GET /api/v1/analytics/dashboard?period=week
Authorization: Bearer YOUR_TOKEN
```

## 🎯 Advanced Features

### Real-time Updates with WebSockets

```javascript
import io from 'socket.io-client';

const socket = io('https://api.retailgenie.com');

// Listen for product updates
socket.on('product:updated', (product) => {
  console.log('Product updated:', product);
  updateProductInUI(product);
});

// Listen for inventory changes
socket.on('inventory:low_stock', (alert) => {
  console.log('Low stock alert:', alert);
  showLowStockAlert(alert);
});

// Join product-specific room
socket.emit('join_room', `product:${productId}`);
```

### Webhooks

Configure webhooks to receive real-time notifications:

```json
{
  "url": "https://your-app.com/webhooks/retailgenie",
  "events": ["product.updated", "order.created", "inventory.low_stock"],
  "secret": "your-webhook-secret"
}
```

### Background Tasks

Submit long-running tasks for asynchronous processing:

```http
POST /api/v2/tasks/bulk-import
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "file_url": "https://your-storage.com/products.csv",
  "options": {
    "validate_only": false,
    "notification_email": "admin@yourstore.com"
  }
}
```

## 💻 Code Examples

### Complete Product Management Example

```javascript
class RetailGenieAPI {
  constructor(baseUrl, token) {
    this.baseUrl = baseUrl;
    this.token = token;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`API Error: ${error.error}`);
    }

    return response.json();
  }

  // Product methods
  async getProducts(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/api/v2/products?${params}`);
  }

  async getProduct(id, options = {}) {
    const params = new URLSearchParams(options);
    return this.request(`/api/v2/products/${id}?${params}`);
  }

  async createProduct(productData) {
    return this.request('/api/v2/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  }

  async updateProduct(id, updateData) {
    return this.request(`/api/v2/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });
  }

  async deleteProduct(id) {
    return this.request(`/api/v2/products/${id}`, {
      method: 'DELETE'
    });
  }

  // Search methods
  async search(query, filters = {}) {
    const params = new URLSearchParams({ q: query, ...filters });
    return this.request(`/api/v2/search?${params}`);
  }

  // AI methods
  async chatWithAI(message, context = {}) {
    return this.request('/api/v1/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, context })
    });
  }

  // Analytics methods
  async getDashboard(period = 'week') {
    return this.request(`/api/v1/analytics/dashboard?period=${period}`);
  }
}

// Usage example
const api = new RetailGenieAPI('https://api.retailgenie.com', 'your-jwt-token');

// Create a new product
const newProduct = await api.createProduct({
  name: 'Smart Watch',
  price: 199.99,
  category: 'Electronics',
  description: 'Feature-rich smartwatch with health monitoring'
});

// Search for products
const searchResults = await api.search('wireless headphones', {
  category: 'Electronics',
  max_price: 100
});

// Get AI recommendations
const aiResponse = await api.chatWithAI(
  'Recommend headphones for gaming under $150'
);
```

### Python SDK Example

```python
import requests
from typing import Dict, List, Optional

class RetailGenieAPI:
    def __init__(self, base_url: str, token: str):
        self.base_url = base_url
        self.headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }

    def _request(self, method: str, endpoint: str, **kwargs) -> Dict:
        url = f"{self.base_url}{endpoint}"
        response = requests.request(method, url, headers=self.headers, **kwargs)
        response.raise_for_status()
        return response.json()

    def get_products(self, **filters) -> Dict:
        """Get products with optional filtering"""
        return self._request('GET', '/api/v2/products', params=filters)

    def create_product(self, product_data: Dict) -> Dict:
        """Create a new product"""
        return self._request('POST', '/api/v2/products', json=product_data)

    def search(self, query: str, **filters) -> Dict:
        """Search products"""
        params = {'q': query, **filters}
        return self._request('GET', '/api/v2/search', params=params)

    def chat_with_ai(self, message: str, context: Optional[Dict] = None) -> Dict:
        """Chat with AI assistant"""
        data = {'message': message}
        if context:
            data['context'] = context
        return self._request('POST', '/api/v1/ai/chat', json=data)

# Usage
api = RetailGenieAPI('https://api.retailgenie.com', 'your-jwt-token')

# Create product
product = api.create_product({
    'name': 'Wireless Mouse',
    'price': 29.99,
    'category': 'Electronics'
})

# Search products
results = api.search('wireless mouse', category='Electronics')

# Get AI recommendations
response = api.chat_with_ai('I need a good wireless mouse for programming')
```

## 🧪 Testing

### Using Postman

1. **Import the collection**: Download and import `postman-collection.json`
2. **Set environment variables**:
   - `baseUrl`: Your API base URL
   - `authToken`: Your JWT token (auto-populated after login)

3. **Run test scenarios**:
   - Complete Product Workflow
   - Authentication Flow Test
   - Error Handling Tests

### Manual Testing with cURL

```bash
# Health check
curl -X GET "https://api.retailgenie.com/"

# Login and get token
TOKEN=$(curl -X POST "https://api.retailgenie.com/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}' \
  | jq -r '.token')

# Create product
curl -X POST "https://api.retailgenie.com/api/v2/products" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "price": 29.99,
    "category": "Electronics"
  }'

# Search products
curl -X GET "https://api.retailgenie.com/api/v2/search?q=wireless" \
  -H "Authorization: Bearer $TOKEN"
```

### Integration Testing

```javascript
// Jest/Node.js integration test example
const RetailGenieAPI = require('./retailgenie-api');

describe('RetailGenie API Integration', () => {
  let api;
  let testProductId;

  beforeAll(async () => {
    // Initialize API client
    api = new RetailGenieAPI(process.env.API_BASE_URL, process.env.API_TOKEN);
  });

  test('should create a product', async () => {
    const productData = {
      name: 'Test Product',
      price: 19.99,
      category: 'Test Category'
    };

    const result = await api.createProduct(productData);

    expect(result).toHaveProperty('id');
    expect(result.name).toBe(productData.name);

    testProductId = result.id;
  });

  test('should search for products', async () => {
    const results = await api.search('Test Product');

    expect(results).toHaveProperty('results');
    expect(results.results.length).toBeGreaterThan(0);
  });

  test('should get AI recommendations', async () => {
    const response = await api.chatWithAI('Recommend similar products');

    expect(response).toHaveProperty('response');
    expect(response.response).toBeTruthy();
  });

  afterAll(async () => {
    // Clean up test data
    if (testProductId) {
      await api.deleteProduct(testProductId);
    }
  });
});
```

## 📞 Support

### Documentation Resources

- **OpenAPI Specification**: Complete API reference with interactive docs
- **Postman Collection**: Ready-to-use API testing collection
- **Code Examples**: Sample implementations in multiple languages

### Getting Help

- **API Status**: Check real-time API status at `/health`
- **Rate Limits**: Monitor your usage with response headers
- **Error Tracking**: Use request IDs for debugging

### Best Practices

1. **Error Handling**: Always implement proper error handling
2. **Rate Limiting**: Respect rate limits and implement retry logic
3. **Caching**: Cache responses when appropriate to reduce API calls
4. **Security**: Never expose API tokens in client-side code
5. **Versioning**: Use specific API versions for production applications

### Community

- **GitHub Issues**: Report bugs and request features
- **Developer Forum**: Connect with other developers
- **API Updates**: Subscribe to API change notifications

## 🎉 Conclusion

The RetailGenie API provides a comprehensive set of tools for building modern retail applications. With features like AI-powered recommendations, real-time analytics, and advanced search capabilities, you can create rich, engaging shopping experiences for your users.

Start building today with our interactive documentation and comprehensive examples!

---

**API Version**: 2.1.0
**Last Updated**: $(date)
**Documentation**: https://docs.retailgenie.com
