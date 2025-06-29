#!/bin/bash

# RetailGenie API Demo Script
echo "🎬 RetailGenie API Demo"
echo "======================"
echo ""

API_BASE="http://localhost:5001"

# Check if API is running
echo "🔍 Checking API status..."
if ! curl -s "$API_BASE/" > /dev/null; then
    echo "❌ API is not running. Please start it first:"
    echo "   ./start_production.sh"
    exit 1
fi

echo "✅ API is running!"
echo ""

# Health check
echo "🏥 Health Check:"
curl -s "$API_BASE/health" | jq '.status, .database_status'
echo ""

# API Info
echo "📚 API Version Info:"
echo "V1 Status:" $(curl -s "$API_BASE/api/v1/info" | jq -r '.status')
echo "V2 Status:" $(curl -s "$API_BASE/api/v2/info" | jq -r '.status')
echo ""

# Get products
echo "🛍️  Sample Products:"
curl -s "$API_BASE/api/v1/products?limit=3" | jq '.products[] | {name: .name, price: .price, category: .category}'
echo ""

# Register a test user
echo "👤 User Registration Demo:"
REGISTER_RESPONSE=$(curl -s -X POST "$API_BASE/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@retailgenie.com",
    "password": "demo123456",
    "name": "Demo User"
  }')

if echo "$REGISTER_RESPONSE" | jq -e '.token' > /dev/null 2>&1; then
    echo "✅ User registered successfully!"
    TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.token')
else
    echo "⚠️  User might already exist, trying login..."
    # Try login instead
    LOGIN_RESPONSE=$(curl -s -X POST "$API_BASE/api/auth/login" \
      -H "Content-Type: application/json" \
      -d '{
        "email": "demo@retailgenie.com",
        "password": "demo123456"
      }')

    if echo "$LOGIN_RESPONSE" | jq -e '.token' > /dev/null 2>&1; then
        echo "✅ User logged in successfully!"
        TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token')
    else
        echo "❌ Authentication failed"
        echo "$LOGIN_RESPONSE" | jq '.'
        exit 1
    fi
fi
echo ""

# Test authenticated endpoint
echo "🔐 Authenticated Request - Create Product:"
CREATE_RESPONSE=$(curl -s -X POST "$API_BASE/api/v1/products" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Demo Product",
    "price": 29.99,
    "category": "Demo",
    "description": "A sample product created during demo",
    "in_stock": true,
    "stock_quantity": 10
  }')

if echo "$CREATE_RESPONSE" | jq -e '.id' > /dev/null 2>&1; then
    echo "✅ Product created successfully!"
    PRODUCT_ID=$(echo "$CREATE_RESPONSE" | jq -r '.id')
    echo "   Product ID: $PRODUCT_ID"
else
    echo "⚠️  Product creation response:"
    echo "$CREATE_RESPONSE" | jq '.'
fi
echo ""

# Test V2 Search
echo "🔍 Advanced Search (V2):"
curl -s "$API_BASE/api/v2/search?q=coffee&category=Food" | jq '.results[] | {name: .name, relevance: .relevance_score}'
echo ""

# Test AI Chat
echo "🤖 AI Assistant Demo:"
AI_RESPONSE=$(curl -s -X POST "$API_BASE/api/v1/ai/chat" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What products do you recommend for someone who likes coffee?"
  }')
echo "$AI_RESPONSE" | jq '.response'
echo ""

# Test Analytics
echo "📊 Analytics Dashboard:"
curl -s "$API_BASE/api/v1/analytics/dashboard" \
  -H "Authorization: Bearer $TOKEN" | jq '{total_products: .total_products, total_sales: .total_sales}'
echo ""

# Rate limiting demo
echo "⚡ Rate Limiting Demo (making 5 quick requests):"
for i in {1..5}; do
    echo -n "Request $i: "
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$API_BASE/")
    echo "HTTP $STATUS"
    sleep 0.1
done
echo ""

echo "🎉 Demo completed successfully!"
echo ""
echo "📖 Try these endpoints yourself:"
echo "   Health: curl $API_BASE/health"
echo "   Products: curl $API_BASE/api/v1/products"
echo "   API Info: curl $API_BASE/api/v2/info"
echo ""
echo "📚 Full documentation available at:"
echo "   OpenAPI Spec: ./api-spec.yaml"
echo "   Postman Collection: ./postman-collection.json"
echo "   Implementation Guide: ./PRODUCTION_IMPLEMENTATION_COMPLETE.md"
