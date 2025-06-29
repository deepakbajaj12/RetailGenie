#!/bin/bash

# RetailGenie Load Testing Script
# Usage: ./load_test.sh [scenario] [host] [users] [duration]

set -e

# Configuration
DEFAULT_HOST="http://localhost:5000"
DEFAULT_USERS=10
DEFAULT_DURATION="60s"
DEFAULT_SCENARIO="regular"

# Parse arguments
SCENARIO=${1:-$DEFAULT_SCENARIO}
HOST=${2:-$DEFAULT_HOST}
USERS=${3:-$DEFAULT_USERS}
DURATION=${4:-$DEFAULT_DURATION}

echo "🚀 Starting RetailGenie Load Testing"
echo "📊 Scenario: $SCENARIO"
echo "🌐 Host: $HOST"
echo "👥 Users: $USERS"
echo "⏱️  Duration: $DURATION"
echo "=====================================>"

# Ensure locust is installed
if ! command -v locust &> /dev/null; then
    echo "Installing locust..."
    pip install locust
fi

# Run different test scenarios
case $SCENARIO in
    "regular")
        echo "Running regular user load test..."
        locust -f locustfile.py \
               --host=$HOST \
               --users=$USERS \
               --spawn-rate=2 \
               --run-time=$DURATION \
               --headless \
               --only-summary \
               RegularUser
        ;;

    "admin")
        echo "Running admin user load test..."
        locust -f locustfile.py \
               --host=$HOST \
               --users=$USERS \
               --spawn-rate=1 \
               --run-time=$DURATION \
               --headless \
               --only-summary \
               AdminUser
        ;;

    "mixed")
        echo "Running mixed user load test..."
        locust -f locustfile.py \
               --host=$HOST \
               --users=$USERS \
               --spawn-rate=2 \
               --run-time=$DURATION \
               --headless \
               --only-summary
        ;;

    "performance")
        echo "Running performance stress test..."
        locust -f locustfile.py \
               --host=$HOST \
               --users=$USERS \
               --spawn-rate=5 \
               --run-time=$DURATION \
               --headless \
               --only-summary \
               PerformanceTestUser
        ;;

    "interactive")
        echo "Starting interactive load test..."
        echo "Open browser to http://localhost:8089 for web UI"
        locust -f locustfile.py --host=$HOST
        ;;

    *)
        echo "❌ Unknown scenario: $SCENARIO"
        echo "Available scenarios: regular, admin, mixed, performance, interactive"
        exit 1
        ;;
esac

echo ""
echo "✅ Load testing completed!"
echo "📋 Check the output above for performance metrics"

# Generate a simple report
echo ""
echo "📊 Quick Performance Analysis:"
echo "- Response times should be < 1000ms for 95th percentile"
echo "- Error rate should be < 1%"
echo "- Throughput should handle expected concurrent users"
echo ""
echo "💡 Tips:"
echo "- Run tests against staging environment first"
echo "- Monitor server resources during testing"
echo "- Compare results across different scenarios"
