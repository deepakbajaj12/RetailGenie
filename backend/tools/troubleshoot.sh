#!/bin/bash

# RetailGenie Troubleshooting Script
# Automated fixes for common issues

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
API_PORT=5001

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

# Fix port issues
fix_port_issue() {
    echo_info "Checking for port conflicts on $API_PORT..."

    PID=$(lsof -ti:$API_PORT 2>/dev/null)

    if [ -n "$PID" ]; then
        echo_warning "Port $API_PORT is being used by process $PID"
        echo_info "Process details:"
        ps -p $PID -o pid,ppid,cmd

        read -p "Kill this process? (y/N): " confirm
        if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]; then
            kill -9 $PID
            echo_success "Process $PID killed"
        else
            echo_info "Using alternative port 5002"
            export PORT=5002
            echo_success "Port changed to 5002"
        fi
    else
        echo_success "Port $API_PORT is available"
    fi
}

# Fix virtual environment issues
fix_venv_issue() {
    echo_info "Checking virtual environment..."

    if [ ! -d "venv" ]; then
        echo_warning "Virtual environment not found. Creating new one..."
        python3 -m venv venv
        echo_success "Virtual environment created"
    fi

    echo_info "Activating virtual environment..."
    source venv/bin/activate

    echo_info "Checking Python version..."
    python --version

    echo_info "Installing/updating requirements..."
    pip install -r requirements.txt

    echo_success "Virtual environment fixed"
}

# Fix Firebase connection issues
fix_firebase_issue() {
    echo_info "Checking Firebase connection..."

    if [ ! -f "firebase-credentials.json" ]; then
        echo_warning "Firebase credentials file not found"
        echo_info "Please place your firebase-credentials.json file in the backend directory"
        echo_info "Or set FIREBASE_PROJECT_ID environment variable to use mock database"
        return 1
    fi

    echo_info "Testing Firebase connection..."
    python -c "
try:
    from utils.firebase_utils import FirebaseUtils
    fb = FirebaseUtils()
    print('✅ Firebase connection successful')
except Exception as e:
    print(f'❌ Firebase connection failed: {e}')
    exit(1)
"

    if [ $? -eq 0 ]; then
        echo_success "Firebase connection working"
    else
        echo_error "Firebase connection failed"
        echo_info "Check your firebase-credentials.json file and FIREBASE_PROJECT_ID"
        return 1
    fi
}

# Fix import errors
fix_import_errors() {
    echo_info "Checking for import errors..."

    # Test critical imports
    python -c "
import sys
critical_imports = [
    'flask',
    'flask_cors',
    'flask_limiter',
    'firebase_admin',
    'psutil',
    'dotenv'
]

failed_imports = []
for module in critical_imports:
    try:
        __import__(module)
        print(f'✅ {module}')
    except ImportError as e:
        print(f'❌ {module}: {e}')
        failed_imports.append(module)

if failed_imports:
    print(f'\\n❌ Failed imports: {failed_imports}')
    print('Run: pip install -r requirements.txt')
    exit(1)
else:
    print('\\n✅ All critical imports successful')
"

    if [ $? -ne 0 ]; then
        echo_error "Import errors found. Installing missing packages..."
        pip install -r requirements.txt
        echo_success "Packages installed"
    fi
}

# Fix permissions
fix_permissions() {
    echo_info "Fixing file permissions..."

    chmod +x start_production.sh
    chmod +x demo_api.sh
    chmod +x dev_utils.sh
    chmod +x validate_api_docs.sh

    echo_success "File permissions fixed"
}

# Run system diagnostics
run_system_diagnostics() {
    echo_info "Running system diagnostics..."

    echo_info "System Information:"
    echo "OS: $(uname -s)"
    echo "Python: $(python --version)"
    echo "Memory: $(free -h | awk '/^Mem:/ {print $2}')"
    echo "Disk: $(df -h . | awk 'NR==2 {print $4}')"

    echo_info "Process Information:"
    echo "PID: $$"
    echo "User: $(whoami)"
    echo "Working Directory: $(pwd)"

    echo_info "Environment Variables:"
    echo "FLASK_ENV: ${FLASK_ENV:-not set}"
    echo "PORT: ${PORT:-not set}"
    echo "FIREBASE_PROJECT_ID: ${FIREBASE_PROJECT_ID:-not set}"

    echo_success "System diagnostics completed"
}

# Complete health check
complete_health_check() {
    echo_info "Running complete health check..."

    # Check all components
    fix_permissions
    fix_venv_issue
    fix_import_errors
    fix_firebase_issue
    fix_port_issue

    echo_info "Testing API startup..."
    timeout 10 python app_production.py &
    PID=$!
    sleep 5

    if kill -0 $PID 2>/dev/null; then
        echo_success "API starts successfully"
        kill $PID 2>/dev/null
    else
        echo_error "API failed to start"
        return 1
    fi

    echo_success "All health checks passed!"
}

# Show help
show_help() {
    echo "RetailGenie Troubleshooting Script"
    echo "=================================="
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  port            - Fix port conflicts"
    echo "  venv            - Fix virtual environment issues"
    echo "  firebase        - Fix Firebase connection issues"
    echo "  imports         - Fix Python import errors"
    echo "  permissions     - Fix file permissions"
    echo "  diagnostics     - Run system diagnostics"
    echo "  health          - Run complete health check"
    echo "  help            - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 health       # Run all checks"
    echo "  $0 port         # Fix port conflicts"
    echo "  $0 venv         # Fix virtual environment"
}

# Main command dispatcher
case "$1" in
    "port")
        fix_port_issue
        ;;
    "venv")
        fix_venv_issue
        ;;
    "firebase")
        fix_firebase_issue
        ;;
    "imports")
        fix_import_errors
        ;;
    "permissions")
        fix_permissions
        ;;
    "diagnostics")
        run_system_diagnostics
        ;;
    "health")
        complete_health_check
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
