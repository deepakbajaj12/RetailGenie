# 📋 Postman Step-by-Step Guide for RetailGenie Backend

## 🎯 **Overview**

This comprehensive guide will walk you through using Postman to test, document, and develop with the RetailGenie backend API. By the end of this guide, you'll be able to run complete API tests, manage authentication, and use Postman effectively for development.

---

## 📋 **Table of Contents**

1. [Prerequisites](#-prerequisites)
2. [Quick Setup (5 minutes)](#-quick-setup-5-minutes)
3. [Detailed Step-by-Step Setup](#-detailed-step-by-step-setup)
4. [Testing All Endpoints](#-testing-all-endpoints)
5. [Authentication Workflow](#-authentication-workflow)
6. [Advanced Features](#-advanced-features)
7. [Troubleshooting](#-troubleshooting)
8. [Best Practices](#-best-practices)

---

## 🛠️ **Prerequisites**

### **Required Software:**
- ✅ **Postman Application** - [Download here](https://www.postman.com/downloads/)
- ✅ **RetailGenie Backend** - Running on your local machine
- ✅ **Web Browser** - For viewing documentation

### **Files You'll Need:**
- 📁 `postman-collection.json` (34,895 bytes) - Located in `/workspaces/RetailGenie/backend/`
- 📁 Environment variables template (we'll create this)

---

## ⚡ **Quick Setup (5 minutes)**

### **Step 1: Start the API**
```bash
cd /workspaces/RetailGenie/backend
python app.py
# API will start on http://localhost:5000
```

### **Step 2: Import Collection**
1. Open Postman
2. Click **"Import"** (top-left)
3. Select **"Choose Files"**
4. Navigate to `/workspaces/RetailGenie/backend/postman-collection.json`
5. Click **"Import"**

### **Step 3: Create Environment**
1. Click **"Environments"** (left sidebar)
2. Click **"Create Environment"**
3. Name it: `RetailGenie Local`
4. Add these variables:
   ```
   baseUrl: http://localhost:5000
   authToken: (leave empty)
   testProductId: (leave empty)
   testUserId: (leave empty)
   ```
5. Click **"Save"**

### **Step 4: Test It Works**
1. Select `RetailGenie Local` environment (top-right dropdown)
2. Open collection → `🏥 Health & System` → `API Health Check`
3. Click **"Send"**
4. You should see: `Status: 200 OK` with healthy response

**🎉 You're ready to go!**

---

## 📚 **Detailed Step-by-Step Setup**

### **Phase 1: Environment Preparation**

#### **1.1 Start the RetailGenie API**
```bash
# Navigate to backend directory
cd /workspaces/RetailGenie/backend

# Check if API is already running
curl -s http://localhost:5000/health || echo "API not running"

# Start the API server
python app.py

# Verify it's running (in new terminal)
curl http://localhost:5000/health
```

**Expected Output:**
```json
{
  "database_status": "connected",
  "status": "healthy",
  "timestamp": "2025-06-29T..."
}
```

#### **1.2 Verify API Endpoints**
```bash
# Test available endpoints
curl http://localhost:5000/                    # API root
curl http://localhost:5000/health              # Health check
curl http://localhost:5000/api/products        # Products list
```

---

### **Phase 2: Postman Setup**

#### **2.1 Install and Open Postman**
1. Download from [postman.com](https://www.postman.com/downloads/)
2. Install and create account (or skip)
3. Open Postman application

#### **2.2 Import the RetailGenie Collection**

**Method 1: File Import**
1. Click **"Import"** button (top-left corner)
2. Select **"Choose Files"** tab
3. Browse to `/workspaces/RetailGenie/backend/postman-collection.json`
4. Click **"Open"**
5. Review import summary and click **"Import"**

**Method 2: Drag & Drop**
1. Open file manager and navigate to the backend folder
2. Drag `postman-collection.json` into Postman window
3. Confirm import

**What You'll See:**
```
📁 RetailGenie API Collection
├── 🏥 Health & System (4 requests)
├── 🔐 Authentication (2 requests)
├── 🛍️ Products V1 (5 requests)
├── 🛍️ Products V2 Enhanced (3 requests)
├── 🔍 Search & Discovery (2 requests)
├── 🤖 AI Assistant (2 requests)
├── 📊 Analytics (1 request)
├── 💬 Feedback (2 requests)
├── 🌐 WebSocket (1 request)
└── 👑 Admin (6 requests)
```

#### **2.3 Create Environment Variables**

1. Click **"Environments"** in left sidebar
2. Click **"+ Create Environment"**
3. Name: `RetailGenie Development`
4. Add these variables:

| Variable Name | Initial Value | Current Value | Description |
|---------------|---------------|---------------|-------------|
| `baseUrl` | `http://localhost:5000` | `http://localhost:5000` | API base URL |
| `authToken` | *(empty)* | *(empty)* | JWT authentication token |
| `testProductId` | *(empty)* | *(empty)* | Product ID for testing |
| `testUserId` | *(empty)* | *(empty)* | User ID for testing |

5. Click **"Save"**
6. Select this environment from dropdown (top-right)

---

### **Phase 3: Testing Basic Endpoints**

#### **3.1 Health Check Test**

1. Navigate to: `RetailGenie API Collection` → `🏥 Health & System` → `API Health Check`
2. Click **"Send"**

**Expected Response:**
```json
{
  "database_status": "connected",
  "firebase_project": "retailgenie-nayan-jain",
  "status": "healthy",
  "timestamp": "2025-06-29T18:59:16.123456+00:00"
}
```

**Status Indicators:**
- ✅ **200 OK** - API is healthy
- ❌ **Connection Error** - API not running
- ⚠️ **Other Status** - Check API logs

#### **3.2 API Root Test**

1. Navigate to: `🏥 Health & System` → `API Root`
2. Click **"Send"**

**Expected Response:**
```json
{
  "database": "Firebase Firestore",
  "message": "RetailGenie API is running!",
  "status": "success"
}
```

#### **3.3 Products List Test**

1. Navigate to: `🛍️ Products V1` → `Get All Products`
2. Click **"Send"**

**Expected Response:**
```json
{
  "count": 43,
  "products": [
    {
      "id": "...",
      "name": "Organic Coffee Beans",
      "price": 24.99,
      "category": "Food",
      "description": "...",
      "stock": 100
    }
    // ... more products
  ]
}
```

---

## 🔐 **Authentication Workflow**

### **Step 1: User Registration**

#### **4.1 Register a New User**
1. Navigate to: `🔐 Authentication` → `Register User`
2. Go to **"Body"** tab
3. Modify the JSON:
```json
{
  "email": "your-test-email@example.com",
  "password": "SecurePassword123!",
  "name": "Your Test Name"
}
```
4. Click **"Send"**

**Expected Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_12345",
    "email": "your-test-email@example.com",
    "name": "Your Test Name"
  }
}
```

#### **4.2 Save Authentication Token**
1. Copy the `token` value from the response
2. Go to **Environments** → `RetailGenie Development`
3. Set `authToken` variable to the copied token
4. Click **"Save"**

**Alternative: Auto-save with Test Script**
Add this to the **"Tests"** tab of Register User request:
```javascript
// Auto-save token to environment
if (pm.response.code === 200 || pm.response.code === 201) {
    const responseJson = pm.response.json();
    if (responseJson.token) {
        pm.environment.set("authToken", responseJson.token);
        console.log("Token saved to environment");
    }
}
```

### **Step 2: Using Authenticated Endpoints**

Now you can test authenticated endpoints like:
- Create Product
- Update Product
- Delete Product
- User Profile
- Admin Operations

The collection automatically uses `{{authToken}}` for authentication.

---

## 🧪 **Testing All Endpoints**

### **5.1 System & Health Endpoints**

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/` | GET | API root information | No |
| `/health` | GET | Health check with database status | No |
| `/api/system/info` | GET | System information | No |
| `/metrics` | GET | Performance metrics | No |

**Test Order:**
1. API Health Check → Should return `healthy`
2. API Root → Should return welcome message
3. System Info → Should return API version
4. Metrics → Should return performance data

### **5.2 Product Endpoints**

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/products` | GET | List all products | No |
| `/api/products` | POST | Create new product | Yes |
| `/api/products/{id}` | GET | Get specific product | No |
| `/api/products/{id}` | PUT | Update product | Yes |
| `/api/products/{id}` | DELETE | Delete product | Yes |

**Test Workflow:**
1. **Get All Products** → Note a product ID
2. **Get Product by ID** → Use noted ID
3. **Register User** → Get auth token
4. **Create Product** → Should work with auth
5. **Update Product** → Use created product ID
6. **Delete Product** → Clean up test data

### **5.3 Authentication Endpoints**

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/auth/register` | POST | Register new user | No |
| `/api/auth/login` | POST | Login existing user | No |
| `/api/auth/logout` | POST | Logout user | Yes |
| `/api/auth/profile` | GET | Get user profile | Yes |

### **5.4 Advanced Endpoints**

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/search` | GET | Search products | No |
| `/api/ai/chat` | POST | AI assistant | Yes |
| `/api/recommendations` | GET | Product recommendations | Yes |
| `/api/analytics` | GET | Analytics dashboard | Yes |
| `/api/feedback` | POST | Submit feedback | Yes |

---

## 🚀 **Advanced Features**

### **6.1 Collection Runner**

**Running Entire Collection:**
1. Right-click on `RetailGenie API Collection`
2. Select **"Run collection"**
3. Configure run settings:
   - Iterations: 1
   - Delay: 500ms
   - Data file: None (for now)
4. Click **"Run RetailGenie API Collection"**

**Expected Results:**
- All GET endpoints should pass
- POST endpoints might fail without proper auth
- View detailed results in runner

### **6.2 Environment Management**

**Create Multiple Environments:**

**Development Environment:**
```json
{
  "baseUrl": "http://localhost:5000",
  "authToken": "",
  "apiVersion": "v1"
}
```

**Staging Environment:**
```json
{
  "baseUrl": "https://staging-api.retailgenie.com",
  "authToken": "",
  "apiVersion": "v1"
}
```

**Production Environment:**
```json
{
  "baseUrl": "https://api.retailgenie.com",
  "authToken": "",
  "apiVersion": "v1"
}
```

### **6.3 Pre-request Scripts**

**Auto-Authentication Script:**
Add to collection **Pre-request Script**:
```javascript
// Auto-login if no token exists
if (!pm.environment.get("authToken")) {
    pm.sendRequest({
        url: pm.environment.get("baseUrl") + "/api/auth/login",
        method: "POST",
        header: {
            "Content-Type": "application/json"
        },
        body: {
            mode: "raw",
            raw: JSON.stringify({
                email: "default@example.com",
                password: "defaultpass123"
            })
        }
    }, function (err, res) {
        if (res && res.json().token) {
            pm.environment.set("authToken", res.json().token);
        }
    });
}
```

### **6.4 Test Scripts**

**Response Validation:**
```javascript
// Status code test
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

// Response time test
pm.test("Response time is less than 2000ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(2000);
});

// JSON structure test
pm.test("Response has required fields", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('status');
    pm.expect(jsonData).to.have.property('data');
});

// Business logic test
pm.test("Products array is not empty", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.products).to.be.an('array');
    pm.expect(jsonData.products.length).to.be.above(0);
});
```

---

## 🔧 **Troubleshooting**

### **Common Issues & Solutions**

#### **❌ Problem: Connection refused**
```
Error: connect ECONNREFUSED 127.0.0.1:5000
```
**Solution:**
```bash
# Check if API is running
curl http://localhost:5000/health

# Start API if not running
cd /workspaces/RetailGenie/backend
python app.py
```

#### **❌ Problem: 404 Not Found**
```
{
  "error": "Not Found",
  "status": 404
}
```
**Solution:**
- Check endpoint URL in request
- Verify API version (some endpoints might be `/api/v1/...`)
- Check if endpoint exists in API code

#### **❌ Problem: 401 Unauthorized**
```
{
  "error": "Unauthorized",
  "status": 401
}
```
**Solution:**
- Ensure `authToken` is set in environment
- Register/login to get valid token
- Check token hasn't expired

#### **❌ Problem: 500 Internal Server Error**
**Solution:**
- Check API server logs
- Verify database connection
- Check request payload format

### **Debug Checklist**

1. ✅ **API Server Running?**
   ```bash
   curl http://localhost:5000/health
   ```

2. ✅ **Environment Selected?**
   - Check top-right dropdown
   - Verify `baseUrl` is set

3. ✅ **Authentication Token Valid?**
   - Check token in environment
   - Try re-authenticating

4. ✅ **Request Format Correct?**
   - Verify Content-Type headers
   - Check JSON syntax in body

---

## 📋 **Best Practices**

### **7.1 Organization**

**Folder Structure:**
```
📁 RetailGenie API Collection
├── 📁 Auth & Users
├── 📁 Products & Inventory
├── 📁 Search & Discovery
├── 📁 AI & Recommendations
├── 📁 Analytics & Reports
├── 📁 Admin & Management
└── 📁 Health & Monitoring
```

**Naming Convention:**
- `GET Products List` ✅
- `POST Create Product` ✅
- `PUT Update Product by ID` ✅
- `DEL Remove Product` ✅

### **7.2 Documentation**

**Request Documentation:**
```markdown
# Get Product by ID

Retrieves detailed information about a specific product.

## Parameters
- `id` (path): Product ID (required)
- `include_related` (query): Include related products (optional)

## Example Response
```json
{
  "id": "prod_123",
  "name": "Sample Product",
  "price": 29.99
}
```

**Authentication Required:** Yes
**Rate Limit:** 100 requests/minute
```

### **7.3 Testing Strategy**

**Test Pyramid:**
1. **Unit Tests** (70%) - Individual endpoints
2. **Integration Tests** (20%) - Workflow testing
3. **E2E Tests** (10%) - Complete user journeys

**Test Categories:**
- 🟢 **Happy Path** - Normal successful requests
- 🟡 **Edge Cases** - Boundary conditions
- 🔴 **Error Cases** - Invalid inputs, auth failures

### **7.4 Environment Management**

**Environment Variables:**
- Use descriptive names: `{{baseUrl}}` not `{{url}}`
- Keep sensitive data secure
- Document all variables

**Environment Switching:**
- Development → Local testing
- Staging → Pre-deployment validation
- Production → Live API monitoring

---

## 📊 **Performance Testing**

### **8.1 Response Time Monitoring**

Add to collection **Tests**:
```javascript
// Log slow responses
if (pm.response.responseTime > 1000) {
    console.log(`Slow response: ${pm.info.requestName} took ${pm.response.responseTime}ms`);
}

// Set response time test
pm.test("Response time acceptable", function () {
    pm.expect(pm.response.responseTime).to.be.below(2000);
});
```

### **8.2 Load Testing with Collection Runner**

**Configuration:**
- Iterations: 100
- Delay: 100ms
- Run with different data sets

**Monitoring:**
- Response times
- Error rates
- Success percentage

---

## 📈 **Monitoring & Analytics**

### **9.1 Collection Analytics**

Track these metrics:
- **Success Rate** - % of passing tests
- **Response Times** - Average, min, max
- **Error Patterns** - Common failure points
- **Usage Patterns** - Most tested endpoints

### **9.2 API Health Monitoring**

Create monitoring collection:
```javascript
// Health check monitor
pm.test("API is healthy", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.status).to.eql("healthy");
    pm.expect(jsonData.database_status).to.eql("connected");
});
```

---

## 🎓 **Next Steps**

### **For Developers:**
1. ✅ Master basic CRUD operations
2. ✅ Implement authentication workflows
3. ✅ Create comprehensive test suites
4. ✅ Set up automated monitoring

### **For QA Engineers:**
1. ✅ Build regression test suites
2. ✅ Create data-driven tests
3. ✅ Implement performance benchmarks
4. ✅ Set up CI/CD integration

### **For API Documentation:**
1. ✅ Generate API docs from collection
2. ✅ Create interactive examples
3. ✅ Maintain version compatibility
4. ✅ Publish team documentation

---

## 🔗 **Resources**

### **Documentation:**
- [Postman Learning Center](https://learning.postman.com/)
- [RetailGenie API Documentation](./API_DOCUMENTATION_STANDARDS.md)
- [Environment Setup Guide](./DEV_QUICK_REFERENCE.md)

### **Files:**
- 📁 `postman-collection.json` - Main collection file
- 📁 `POSTMAN_USAGE_GUIDE.md` - Detailed usage guide
- 📁 `api-spec.yaml` - OpenAPI specification

### **Support:**
- Check `troubleshoot.sh` for automated diagnostics
- Review `DEV_QUICK_REFERENCE.md` for quick commands
- See `BACKEND_VERIFICATION_COMPLETE.md` for verification status

---

## ✅ **Completion Checklist**

**Setup Complete:**
- [ ] Postman installed and running
- [ ] RetailGenie collection imported
- [ ] Environment variables configured
- [ ] API server running locally
- [ ] Basic health check passing

**Authentication Working:**
- [ ] User registration successful
- [ ] JWT token saved to environment
- [ ] Authenticated endpoints accessible
- [ ] Token auto-refresh configured

**Testing Functional:**
- [ ] All GET endpoints tested
- [ ] CRUD operations verified
- [ ] Error handling tested
- [ ] Performance benchmarks established

**Advanced Features:**
- [ ] Collection runner configured
- [ ] Pre-request scripts active
- [ ] Test scripts validating responses
- [ ] Multiple environments set up

**🎉 Congratulations! You're now ready to use Postman effectively with RetailGenie backend!**

---

*Last updated: June 29, 2025*
*RetailGenie Backend API v2.1.0*
