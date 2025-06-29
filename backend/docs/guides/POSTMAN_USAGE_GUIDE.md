# How Postman is Used in RetailGenie Backend

## 📋 **Overview**

Postman is extensively used in the RetailGenie backend for **API testing, documentation, and development workflow**. We have a comprehensive Postman collection with 28+ requests covering all API endpoints.

## 🚀 **Postman Collection Features**

### **1. Complete API Coverage**
The collection includes all 25+ API endpoints:
- ✅ Health & System endpoints
- ✅ Authentication (Register/Login)
- ✅ Products CRUD (V1 & V2)
- ✅ Search & Discovery
- ✅ AI Assistant & Recommendations
- ✅ Analytics & Feedback
- ✅ Admin Operations
- ✅ WebSocket Statistics

### **2. Organized Structure**
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

### **3. Environment Variables**
```json
{
  "baseUrl": "http://localhost:5000",
  "authToken": "{{JWT_TOKEN}}",
  "testProductId": "{{PRODUCT_ID}}",
  "testUserId": "{{USER_ID}}"
}
```

## 🔧 **How to Use Postman with RetailGenie**

### **Step 1: Import the Collection**
```bash
# File location
/workspaces/RetailGenie/backend/postman-collection.json

# Import methods:
1. File > Import > Choose file
2. Drag and drop the JSON file
3. Import from URL (if hosted)
```

### **Step 2: Set Up Environment**
```bash
# Create new environment with:
baseUrl: http://localhost:5001  # (or your API URL)
authToken: (leave empty initially)
testProductId: (leave empty initially)
testUserId: (leave empty initially)
```

### **Step 3: Start the API**
```bash
cd /workspaces/RetailGenie/backend
./start_production.sh
# API will start on http://localhost:5001
```

### **Step 4: Test Authentication**
```bash
# 1. Run "Register User" request
POST {{baseUrl}}/api/auth/register
{
  "email": "test@example.com",
  "password": "password123",
  "name": "Test User"
}

# 2. Copy the token from response
# 3. Set authToken variable in environment
```

## 📝 **Practical Usage Examples**

### **1. Development Testing**
```bash
# Test all endpoints during development
1. Health Check → Verify API is running
2. Register User → Get authentication token
3. Create Product → Test CRUD operations
4. Get Products → Verify data retrieval
5. Search Products → Test filtering
```

### **2. API Documentation**
The collection serves as **interactive documentation**:
- Each request has detailed descriptions
- Request/response examples
- Parameter explanations
- Authentication requirements

### **3. Automated Testing**
```javascript
// Example test script in Postman
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has required fields", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('products');
    pm.expect(jsonData).to.have.property('pagination');
});

// Set variables for next requests
if (pm.response.code === 201) {
    const response = pm.response.json();
    pm.environment.set("testProductId", response.id);
}
```

### **4. Environment Management**
```bash
# Multiple environments supported:
- Development: http://localhost:5001
- Staging: https://staging-api.retailgenie.com
- Production: https://api.retailgenie.com

# Switch environments easily for testing
```

## 🎯 **Specific Use Cases**

### **1. Frontend Development**
```bash
# Frontend developers use Postman to:
- Understand API structure
- Test authentication flow
- Verify response formats
- Debug API issues
- Generate code snippets
```

### **2. QA Testing**
```bash
# QA team uses collection for:
- Manual testing of all endpoints
- Regression testing
- Performance testing
- Error scenario testing
- Integration testing
```

### **3. API Documentation**
```bash
# Collection serves as living documentation:
- Auto-generated docs from collection
- Request/response examples
- Parameter descriptions
- Authentication guides
```

### **4. CI/CD Integration**
```bash
# Newman (Postman CLI) for automation:
npm install -g newman

# Run collection in CI/CD
newman run postman-collection.json \
  --environment production.json \
  --reporters cli,json
```

## 🛠️ **Advanced Features Used**

### **1. Pre-request Scripts**
```javascript
// Automatically get auth token
if (!pm.environment.get("authToken")) {
    // Auto-login before authenticated requests
    pm.sendRequest({
        url: pm.environment.get("baseUrl") + "/api/auth/login",
        method: "POST",
        header: {"Content-Type": "application/json"},
        body: {
            mode: "raw",
            raw: JSON.stringify({
                email: "test@example.com",
                password: "password123"
            })
        }
    }, function (err, res) {
        if (res && res.json().token) {
            pm.environment.set("authToken", res.json().token);
        }
    });
}
```

### **2. Test Scripts**
```javascript
// Comprehensive test validation
pm.test("Response time is acceptable", function () {
    pm.expect(pm.response.responseTime).to.be.below(2000);
});

pm.test("Has required security headers", function () {
    pm.expect(pm.response.headers.get("X-Request-ID")).to.exist;
    pm.expect(pm.response.headers.get("X-Response-Time")).to.exist;
});
```

### **3. Dynamic Variables**
```javascript
// Generate test data dynamically
const testEmail = "test+" + Math.random().toString(36).substring(7) + "@example.com";
pm.environment.set("testEmail", testEmail);
```

## 📊 **Testing Workflow**

### **Daily Development**
```bash
1. Start API: ./start_production.sh
2. Open Postman collection
3. Run "Health Check" folder
4. Test new endpoints
5. Update collection as needed
```

### **Pre-deployment Testing**
```bash
1. Run entire collection
2. Check all tests pass
3. Verify response times
4. Test error scenarios
5. Export results
```

### **Production Monitoring**
```bash
1. Monitor endpoints
2. Performance testing
3. Health checks
4. Integration testing
```

## 🔍 **Available Test Scripts**

### **Command Line Testing**
```bash
# Quick Postman tests using Newman
./validate_api_docs.sh  # Includes Postman validation

# Manual Newman run
newman run postman-collection.json \
  --environment environment.json \
  --delay-request 500 \
  --reporters cli,html
```

### **Integration with Dev Tools**
```bash
# Used with other scripts
./dev_utils.sh health     # Uses similar tests
./demo_api.sh            # Uses Postman-style requests
./troubleshoot.sh        # Validates API connectivity
```

## 📈 **Benefits for RetailGenie**

### **1. Development Speed**
- Rapid API testing during development
- Instant feedback on changes
- Easy debugging of issues

### **2. Documentation**
- Self-documenting API
- Always up-to-date examples
- Easy onboarding for new developers

### **3. Quality Assurance**
- Comprehensive test coverage
- Automated regression testing
- Consistent testing procedures

### **4. Collaboration**
- Shared collection across team
- Version controlled with git
- Environment-specific testing

## 🎯 **Getting Started Guide**

### **Quick Start (5 minutes)**
```bash
1. cd /workspaces/RetailGenie/backend
2. ./start_production.sh
3. Open Postman
4. Import postman-collection.json
5. Set baseUrl to http://localhost:5001
6. Run "API Health Check"
7. Run "Register User" and copy token
8. Set authToken variable
9. Test any endpoint!
```

### **Full Setup (15 minutes)**
```bash
1. Import collection and environment
2. Configure all environment variables
3. Run authentication flow
4. Test all endpoint folders
5. Set up automated tests
6. Configure Newman for CI/CD
```

**The Postman collection is a critical tool for RetailGenie backend development, testing, and documentation! 🚀**
