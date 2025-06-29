#!/bin/bash

# RetailGenie Development Utilities
# Quick access to common development commands

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
API_BASE="http://localhost:5001"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

echo_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

echo_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

echo_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to check if API is running
check_api() {
    if curl -s "$API_BASE/" > /dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Health check command
health_check() {
    echo_info "Checking API health..."

    if ! check_api; then
        echo_error "API is not running. Start it with: ./start_production.sh"
        return 1
    fi

    echo_success "API is running!"
    echo_info "Health Status:"
    curl -s "$API_BASE/health" | jq -r '"Database: " + .database_status + ", Environment: " + .environment'

    echo_info "System Metrics:"
    curl -s "$API_BASE/metrics" | jq '.system | "CPU: " + (.cpu_percent|tostring) + "%, Memory: " + (.memory_usage_mb|tostring) + "MB"'
}

# Performance test command
performance_test() {
    echo_info "Running performance tests..."

    if ! check_api; then
        echo_error "API is not running. Start it with: ./start_production.sh"
        return 1
    fi

    # Get auth token (using demo user)
    echo_info "Getting auth token..."
    TOKEN=$(curl -s -X POST "$API_BASE/api/auth/login" \
        -H "Content-Type: application/json" \
        -d '{"email":"demo@retailgenie.com","password":"demo123456"}' | jq -r '.token')

    if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then
        echo_warning "No auth token available. Creating demo user..."
        curl -s -X POST "$API_BASE/api/auth/register" \
            -H "Content-Type: application/json" \
            -d '{"email":"demo@retailgenie.com","password":"demo123456","name":"Demo User"}' > /dev/null

        TOKEN=$(curl -s -X POST "$API_BASE/api/auth/login" \
            -H "Content-Type: application/json" \
            -d '{"email":"demo@retailgenie.com","password":"demo123456"}' | jq -r '.token')
    fi

    if [ "$TOKEN" != "null" ] && [ -n "$TOKEN" ]; then
        echo_success "Auth token obtained"

        # Run database performance test
        echo_info "Testing database performance..."
        curl -s -X POST "$API_BASE/api/admin/performance/test" \
            -H "Authorization: Bearer $TOKEN" \
            -H "Content-Type: application/json" \
            -d '{"type":"database"}' | jq '.results'

        # Run memory test
        echo_info "Testing memory usage..."
        curl -s -X POST "$API_BASE/api/admin/performance/test" \
            -H "Authorization: Bearer $TOKEN" \
            -H "Content-Type: application/json" \
            -d '{"type":"memory"}' | jq '.results'
    else
        echo_error "Failed to get auth token"
        return 1
    fi
}

# Diagnostics command
run_diagnostics() {
    echo_info "Running comprehensive diagnostics..."

    if ! check_api; then
        echo_error "API is not running. Start it with: ./start_production.sh"
        return 1
    fi

    # Get auth token
    TOKEN=$(curl -s -X POST "$API_BASE/api/auth/login" \
        -H "Content-Type: application/json" \
        -d '{"email":"demo@retailgenie.com","password":"demo123456"}' | jq -r '.token')

    if [ "$TOKEN" != "null" ] && [ -n "$TOKEN" ]; then
        echo_success "Running diagnostics..."
        curl -s "$API_BASE/api/admin/diagnostics" \
            -H "Authorization: Bearer $TOKEN" | jq '.'
    else
        echo_error "Failed to get auth token for diagnostics"
        return 1
    fi
}

# Load test command
load_test() {
    echo_info "Running load test..."

    if ! check_api; then
        echo_error "API is not running. Start it with: ./start_production.sh"
        return 1
    fi

    echo_info "Testing with 10 concurrent requests..."
    for i in {1..10}; do
        curl -s "$API_BASE/api/v1/products?limit=5" > /dev/null &
    done
    wait
    echo_success "Load test completed"

    echo_info "Response times:"
    for i in {1..5}; do
        curl -s -w "Request $i: %{total_time}s\n" -o /dev/null "$API_BASE/api/v1/products?limit=1"
    done
}

# Batch create test
batch_test() {
    echo_info "Testing batch operations..."

    if ! check_api; then
        echo_error "API is not running. Start it with: ./start_production.sh"
        return 1
    fi

    # Get auth token
    TOKEN=$(curl -s -X POST "$API_BASE/api/auth/login" \
        -H "Content-Type: application/json" \
        -d '{"email":"demo@retailgenie.com","password":"demo123456"}' | jq -r '.token')

    if [ "$TOKEN" != "null" ] && [ -n "$TOKEN" ]; then
        echo_info "Creating batch of test products..."
        curl -s -X POST "$API_BASE/api/v1/products/batch" \
            -H "Authorization: Bearer $TOKEN" \
            -H "Content-Type: application/json" \
            -d '{
                "products": [
                    {"name": "Batch Test Product 1", "price": 19.99, "category": "Test"},
                    {"name": "Batch Test Product 2", "price": 29.99, "category": "Test"},
                    {"name": "Batch Test Product 3", "price": 39.99, "category": "Test"}
                ]
            }' | jq '.message, .count'
        echo_success "Batch operation completed"
    else
        echo_error "Failed to get auth token for batch test"
        return 1
    fi
}

# Show help
show_help() {
    echo "RetailGenie Development Utilities"
    echo "================================="
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  health          - Check API health and status"
    echo "  performance     - Run performance tests"
    echo "  diagnostics     - Run comprehensive diagnostics"
    echo "  load-test       - Run simple load test"
    echo "  batch-test      - Test batch operations"
    echo "  help            - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 health"
    echo "  $0 performance"
    echo "  $0 diagnostics"
}

# Main command dispatcher
case "$1" in
    "health")
        health_check
        ;;
    "performance")
        performance_test
        ;;
    "diagnostics")
        run_diagnostics
        ;;
    "load-test")
        load_test
        ;;
    "batch-test")
        batch_test
        ;;
    "help"|"--help"|"-h"|"")
        show_help
        ;;
    *)
        echo_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac
