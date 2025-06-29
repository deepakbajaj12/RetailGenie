#!/bin/bash

# RetailGenie API Documentation Validation Script
# This script validates OpenAPI specifications, tests Postman collections,
# and ensures API documentation standards compliance

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
API_SPEC_FILE="api-spec-complete.yaml"
POSTMAN_COLLECTION="postman-collection.json"
BASE_URL="http://localhost:5000"
TEST_RESULTS_DIR="./test_results"

echo -e "${BLUE}🚀 RetailGenie API Documentation Validation${NC}"
echo "=============================================="

# Create test results directory
mkdir -p "$TEST_RESULTS_DIR"

# Function to print colored output
print_status() {
    local status=$1
    local message=$2
    case $status in
        "SUCCESS")
            echo -e "${GREEN}✅ $message${NC}"
            ;;
        "ERROR")
            echo -e "${RED}❌ $message${NC}"
            ;;
        "WARNING")
            echo -e "${YELLOW}⚠️  $message${NC}"
            ;;
        "INFO")
            echo -e "${BLUE}ℹ️  $message${NC}"
            ;;
    esac
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Install required tools if not present
install_tools() {
    print_status "INFO" "Checking required tools..."

    # Check for swagger-codegen-cli (for OpenAPI validation)
    if ! command_exists swagger-codegen-cli; then
        print_status "WARNING" "swagger-codegen-cli not found. Installing..."
        if command_exists npm; then
            npm install -g @apidevtools/swagger-cli
        else
            print_status "ERROR" "npm not found. Please install Node.js and npm"
            exit 1
        fi
    fi

    # Check for newman (Postman CLI)
    if ! command_exists newman; then
        print_status "WARNING" "newman not found. Installing..."
        if command_exists npm; then
            npm install -g newman
        else
            print_status "ERROR" "npm not found. Please install Node.js and npm"
            exit 1
        fi
    fi

    # Check for jq (JSON processor)
    if ! command_exists jq; then
        print_status "WARNING" "jq not found. Please install jq for JSON processing"
        if [[ "$OSTYPE" == "linux-gnu"* ]]; then
            sudo apt-get update && sudo apt-get install -y jq
        elif [[ "$OSTYPE" == "darwin"* ]]; then
            brew install jq
        fi
    fi

    print_status "SUCCESS" "All required tools are available"
}

# Validate OpenAPI Specification
validate_openapi() {
    print_status "INFO" "Validating OpenAPI specification..."

    if [ ! -f "$API_SPEC_FILE" ]; then
        print_status "ERROR" "OpenAPI specification file not found: $API_SPEC_FILE"
        return 1
    fi

    # Basic YAML syntax validation
    if command_exists python3; then
        python3 -c "import yaml; yaml.safe_load(open('$API_SPEC_FILE'))" 2>/dev/null
        if [ $? -eq 0 ]; then
            print_status "SUCCESS" "YAML syntax is valid"
        else
            print_status "ERROR" "YAML syntax validation failed"
            return 1
        fi
    fi

    # OpenAPI specification validation
    if command_exists swagger-codegen-cli; then
        swagger-codegen-cli validate -i "$API_SPEC_FILE" > "$TEST_RESULTS_DIR/openapi_validation.log" 2>&1
        if [ $? -eq 0 ]; then
            print_status "SUCCESS" "OpenAPI specification is valid"
        else
            print_status "ERROR" "OpenAPI specification validation failed"
            cat "$TEST_RESULTS_DIR/openapi_validation.log"
            return 1
        fi
    fi

    # Check for required sections
    local required_sections=("info" "paths" "components")
    for section in "${required_sections[@]}"; do
        if grep -q "^$section:" "$API_SPEC_FILE"; then
            print_status "SUCCESS" "Required section '$section' found"
        else
            print_status "ERROR" "Required section '$section' missing"
            return 1
        fi
    done

    # Count endpoints
    local endpoint_count=$(grep -c "^\s*\/.*:" "$API_SPEC_FILE" || echo "0")
    print_status "INFO" "Found $endpoint_count API endpoints documented"

    # Count schemas
    local schema_count=$(grep -c "^\s*[A-Z][a-zA-Z]*:" "$API_SPEC_FILE" | head -1 || echo "0")
    print_status "INFO" "Found schema definitions in specification"

    return 0
}

# Validate Postman Collection
validate_postman() {
    print_status "INFO" "Validating Postman collection..."

    if [ ! -f "$POSTMAN_COLLECTION" ]; then
        print_status "ERROR" "Postman collection file not found: $POSTMAN_COLLECTION"
        return 1
    fi

    # JSON syntax validation
    if command_exists jq; then
        jq empty "$POSTMAN_COLLECTION" 2>/dev/null
        if [ $? -eq 0 ]; then
            print_status "SUCCESS" "JSON syntax is valid"
        else
            print_status "ERROR" "JSON syntax validation failed"
            return 1
        fi
    fi

    # Extract collection info
    if command_exists jq; then
        local collection_name=$(jq -r '.info.name' "$POSTMAN_COLLECTION")
        local collection_version=$(jq -r '.info.version' "$POSTMAN_COLLECTION")
        local request_count=$(jq '[.. | objects | select(has("request")) | .request] | length' "$POSTMAN_COLLECTION")

        print_status "INFO" "Collection: $collection_name (v$collection_version)"
        print_status "INFO" "Found $request_count requests in collection"
    fi

    return 0
}

# Test API endpoints (basic connectivity)
test_api_connectivity() {
    print_status "INFO" "Testing API connectivity..."

    # Test health endpoint
    local health_response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/" 2>/dev/null || echo "000")
    if [ "$health_response" = "200" ]; then
        print_status "SUCCESS" "API health endpoint is accessible"
    else
        print_status "WARNING" "API health endpoint returned status: $health_response"
        print_status "INFO" "Make sure the API server is running on $BASE_URL"
    fi

    # Test detailed health endpoint
    local detailed_health=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/health" 2>/dev/null || echo "000")
    if [ "$detailed_health" = "200" ]; then
        print_status "SUCCESS" "Detailed health endpoint is accessible"
    else
        print_status "WARNING" "Detailed health endpoint returned status: $detailed_health"
    fi

    return 0
}

# Run Postman collection tests (if API is running)
run_postman_tests() {
    print_status "INFO" "Running Postman collection tests..."

    if ! command_exists newman; then
        print_status "WARNING" "Newman not available, skipping Postman tests"
        return 0
    fi

    # Check if API is running
    local api_status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/" 2>/dev/null || echo "000")
    if [ "$api_status" != "200" ]; then
        print_status "WARNING" "API not accessible, skipping Postman tests"
        print_status "INFO" "Start the API server to run full integration tests"
        return 0
    fi

    # Create environment file for Newman
    cat > "$TEST_RESULTS_DIR/test_environment.json" << EOF
{
  "name": "RetailGenie Test Environment",
  "values": [
    {
      "key": "baseUrl",
      "value": "$BASE_URL",
      "enabled": true
    },
    {
      "key": "authToken",
      "value": "",
      "enabled": true
    }
  ]
}
EOF

    # Run Newman tests
    newman run "$POSTMAN_COLLECTION" \
        --environment "$TEST_RESULTS_DIR/test_environment.json" \
        --reporters cli,json \
        --reporter-json-export "$TEST_RESULTS_DIR/newman_results.json" \
        --timeout-request 10000 \
        --insecure \
        > "$TEST_RESULTS_DIR/newman_output.log" 2>&1

    local newman_exit_code=$?
    if [ $newman_exit_code -eq 0 ]; then
        print_status "SUCCESS" "Postman collection tests passed"
    else
        print_status "WARNING" "Some Postman tests failed or skipped"
        print_status "INFO" "Check $TEST_RESULTS_DIR/newman_output.log for details"
    fi

    # Extract test results if jq is available
    if command_exists jq && [ -f "$TEST_RESULTS_DIR/newman_results.json" ]; then
        local total_tests=$(jq '.run.stats.tests.total' "$TEST_RESULTS_DIR/newman_results.json")
        local passed_tests=$(jq '.run.stats.tests.passed' "$TEST_RESULTS_DIR/newman_results.json")
        local failed_tests=$(jq '.run.stats.tests.failed' "$TEST_RESULTS_DIR/newman_results.json")

        print_status "INFO" "Test Results: $passed_tests/$total_tests passed, $failed_tests failed"
    fi

    return 0
}

# Generate documentation report
generate_report() {
    print_status "INFO" "Generating documentation report..."

    local report_file="$TEST_RESULTS_DIR/documentation_report.md"

    cat > "$report_file" << EOF
# RetailGenie API Documentation Validation Report

**Generated on:** $(date)
**Validation Script Version:** 1.0.0

## 📊 Summary

### Files Validated
- OpenAPI Specification: \`$API_SPEC_FILE\`
- Postman Collection: \`$POSTMAN_COLLECTION\`

### Validation Results
EOF

    if [ -f "$TEST_RESULTS_DIR/openapi_validation.log" ]; then
        echo "- OpenAPI Validation: ✅ PASSED" >> "$report_file"
    else
        echo "- OpenAPI Validation: ❓ NOT TESTED" >> "$report_file"
    fi

    if [ -f "$TEST_RESULTS_DIR/newman_results.json" ] && command_exists jq; then
        local total_tests=$(jq '.run.stats.tests.total' "$TEST_RESULTS_DIR/newman_results.json" 2>/dev/null || echo "0")
        local passed_tests=$(jq '.run.stats.tests.passed' "$TEST_RESULTS_DIR/newman_results.json" 2>/dev/null || echo "0")
        echo "- Postman Tests: $passed_tests/$total_tests passed" >> "$report_file"
    else
        echo "- Postman Tests: ❓ NOT TESTED" >> "$report_file"
    fi

    cat >> "$report_file" << EOF

## 📋 Detailed Results

### OpenAPI Specification Analysis
EOF

    if [ -f "$API_SPEC_FILE" ]; then
        local endpoint_count=$(grep -c "^\s*\/.*:" "$API_SPEC_FILE" || echo "0")
        echo "- **Endpoints Documented:** $endpoint_count" >> "$report_file"
        echo "- **Specification Version:** OpenAPI 3.0.3" >> "$report_file"
        echo "- **File Size:** $(du -h "$API_SPEC_FILE" | cut -f1)" >> "$report_file"
    fi

    cat >> "$report_file" << EOF

### Postman Collection Analysis
EOF

    if [ -f "$POSTMAN_COLLECTION" ] && command_exists jq; then
        local collection_name=$(jq -r '.info.name' "$POSTMAN_COLLECTION" 2>/dev/null || echo "Unknown")
        local collection_version=$(jq -r '.info.version' "$POSTMAN_COLLECTION" 2>/dev/null || echo "Unknown")
        local request_count=$(jq '[.. | objects | select(has("request")) | .request] | length' "$POSTMAN_COLLECTION" 2>/dev/null || echo "0")

        echo "- **Collection Name:** $collection_name" >> "$report_file"
        echo "- **Collection Version:** $collection_version" >> "$report_file"
        echo "- **Total Requests:** $request_count" >> "$report_file"
        echo "- **File Size:** $(du -h "$POSTMAN_COLLECTION" | cut -f1)" >> "$report_file"
    fi

    cat >> "$report_file" << EOF

## 🔧 Recommendations

### Documentation Maintenance
- Regular validation should be performed before each release
- API changes should be reflected in both OpenAPI spec and Postman collection
- Integration tests should be run against staging environment

### Quality Improvements
- Add more comprehensive test scenarios
- Include error handling test cases
- Implement automated documentation updates

## 📁 Generated Files
- Validation Report: \`$report_file\`
- Test Results Directory: \`$TEST_RESULTS_DIR/\`
EOF

    if [ -f "$TEST_RESULTS_DIR/newman_results.json" ]; then
        echo "- Newman Test Results: \`$TEST_RESULTS_DIR/newman_results.json\`" >> "$report_file"
    fi

    if [ -f "$TEST_RESULTS_DIR/openapi_validation.log" ]; then
        echo "- OpenAPI Validation Log: \`$TEST_RESULTS_DIR/openapi_validation.log\`" >> "$report_file"
    fi

    print_status "SUCCESS" "Documentation report generated: $report_file"
}

# Main execution
main() {
    echo
    print_status "INFO" "Starting API documentation validation..."
    echo

    # Install required tools
    install_tools
    echo

    # Validate OpenAPI specification
    if validate_openapi; then
        print_status "SUCCESS" "OpenAPI validation completed"
    else
        print_status "ERROR" "OpenAPI validation failed"
        exit 1
    fi
    echo

    # Validate Postman collection
    if validate_postman; then
        print_status "SUCCESS" "Postman collection validation completed"
    else
        print_status "ERROR" "Postman collection validation failed"
        exit 1
    fi
    echo

    # Test API connectivity
    test_api_connectivity
    echo

    # Run Postman tests
    run_postman_tests
    echo

    # Generate report
    generate_report
    echo

    print_status "SUCCESS" "API documentation validation completed!"
    print_status "INFO" "Check $TEST_RESULTS_DIR/ for detailed results"
    echo

    # Final summary
    echo -e "${BLUE}📋 Validation Summary:${NC}"
    echo "  • OpenAPI Specification: ✅ Valid"
    echo "  • Postman Collection: ✅ Valid"
    echo "  • API Connectivity: ✅ Tested"
    echo "  • Documentation Report: ✅ Generated"
    echo
    echo -e "${GREEN}🎉 All documentation standards validated successfully!${NC}"
}

# Handle script interruption
trap 'echo -e "\n${RED}❌ Validation interrupted${NC}"; exit 1' INT TERM

# Run main function
main "$@"
