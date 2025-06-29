#!/bin/bash

# RetailGenie Database Management Script
# Comprehensive database operations for development and production

set -e

# Configuration
BACKUP_DIR="backups"
MIGRATIONS_DIR="migrations"
LOG_FILE="database_operations.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

# Print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
    log "SUCCESS: $1"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
    log "ERROR: $1"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    log "WARNING: $1"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
    log "INFO: $1"
}

# Help function
show_help() {
    cat << EOF
🔧 RetailGenie Database Management Tool

USAGE:
    ./db_manager.sh [COMMAND] [OPTIONS]

COMMANDS:
    init                 - Initialize database with schema
    migrate             - Run pending migrations
    backup [collection] - Backup database (all or specific collection)
    restore <file>      - Restore from backup file
    status              - Show database and migration status
    clean               - Clean old backups (keep last 10)

    # Migration commands
    create-migration <name> [description] - Create new migration template
    list-migrations     - List available migrations
    migration-status    - Show migration status

    # Backup commands
    list-backups        - List available backups
    backup-all          - Backup all collections

    # Development commands
    reset-dev           - Reset development database (DANGEROUS)
    setup-test          - Setup test database

EXAMPLES:
    ./db_manager.sh init                    # Initialize database
    ./db_manager.sh migrate                 # Run migrations
    ./db_manager.sh backup products         # Backup products collection
    ./db_manager.sh backup-all              # Backup entire database
    ./db_manager.sh restore backup_products_20240101_120000.json
    ./db_manager.sh create-migration "add user preferences"
    ./db_manager.sh status                  # Show status

OPTIONS:
    -h, --help          Show this help message
    -v, --verbose       Verbose output
    -q, --quiet         Quiet mode (errors only)

ENVIRONMENT:
    FIREBASE_PROJECT_ID     Firebase project ID
    TESTING                 Set to 'true' for test mode
EOF
}

# Check dependencies
check_dependencies() {
    local missing_deps=()

    if ! command -v python3 &> /dev/null; then
        missing_deps+=("python3")
    fi

    if ! python3 -c "import firebase_admin" &> /dev/null; then
        missing_deps+=("firebase-admin")
    fi

    if [ ${#missing_deps[@]} -ne 0 ]; then
        print_error "Missing dependencies: ${missing_deps[*]}"
        print_info "Install missing dependencies and try again"
        exit 1
    fi
}

# Initialize database
init_database() {
    print_info "Initializing RetailGenie database..."

    if [ -f "$MIGRATIONS_DIR/v1_initial_schema.py" ]; then
        python3 "$MIGRATIONS_DIR/v1_initial_schema.py"
        if [ $? -eq 0 ]; then
            print_status "Database initialized successfully"
        else
            print_error "Database initialization failed"
            exit 1
        fi
    else
        print_error "Initial schema migration not found"
        exit 1
    fi
}

# Run migrations
run_migrations() {
    print_info "Running database migrations..."

    python3 migration_manager.py migrate
    if [ $? -eq 0 ]; then
        print_status "Migrations completed successfully"
    else
        print_error "Migration failed"
        exit 1
    fi
}

# Backup operations
backup_database() {
    local collection=${1:-"all"}
    print_info "Starting database backup: $collection"

    if [ "$collection" = "all" ]; then
        python3 backup.py all
    else
        python3 backup.py "$collection"
    fi

    if [ $? -eq 0 ]; then
        print_status "Backup completed successfully"
    else
        print_error "Backup failed"
        exit 1
    fi
}

# Restore operations
restore_database() {
    local backup_file="$1"

    if [ -z "$backup_file" ]; then
        print_error "Backup file not specified"
        echo "Usage: $0 restore <backup_file>"
        exit 1
    fi

    if [ ! -f "$backup_file" ]; then
        print_error "Backup file not found: $backup_file"
        exit 1
    fi

    print_warning "This will restore data from: $backup_file"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo

    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_info "Restore cancelled"
        exit 0
    fi

    print_info "Restoring database from: $backup_file"
    python3 backup.py restore "$backup_file"

    if [ $? -eq 0 ]; then
        print_status "Restore completed successfully"
    else
        print_error "Restore failed"
        exit 1
    fi
}

# Show status
show_status() {
    print_info "RetailGenie Database Status"
    echo "================================"

    # Migration status
    echo -e "\n${BLUE}📊 Migration Status:${NC}"
    python3 migration_manager.py status

    # Backup status
    echo -e "\n${BLUE}💾 Recent Backups:${NC}"
    python3 backup.py list | head -10

    # Environment info
    echo -e "\n${BLUE}🔧 Environment:${NC}"
    echo "  Firebase Project: ${FIREBASE_PROJECT_ID:-'Not set'}"
    echo "  Testing Mode: ${TESTING:-'false'}"
    echo "  Backup Directory: $BACKUP_DIR"
    echo "  Migrations Directory: $MIGRATIONS_DIR"
}

# Clean old backups
clean_backups() {
    print_info "Cleaning old backups..."

    if [ ! -d "$BACKUP_DIR" ]; then
        print_warning "Backup directory not found"
        return
    fi

    # Keep last 10 backups of each type
    for pattern in "backup_*.json" "backup_summary_*.json"; do
        files=($(ls -t "$BACKUP_DIR"/$pattern 2>/dev/null))
        if [ ${#files[@]} -gt 10 ]; then
            for ((i=10; i<${#files[@]}; i++)); do
                print_info "Removing old backup: ${files[i]}"
                rm "${files[i]}"
            done
        fi
    done

    print_status "Backup cleanup completed"
}

# Development reset (DANGEROUS)
reset_dev_database() {
    if [ "$TESTING" != "true" ] && [ "$FIREBASE_PROJECT_ID" != "test-project" ]; then
        print_error "This command is only allowed in test/development mode"
        print_error "Set TESTING=true or use test-project to proceed"
        exit 1
    fi

    print_warning "This will DELETE ALL DATA in the development database!"
    print_warning "Project: ${FIREBASE_PROJECT_ID:-'Not set'}"
    read -p "Type 'DELETE' to confirm: " -r

    if [ "$REPLY" != "DELETE" ]; then
        print_info "Reset cancelled"
        exit 0
    fi

    print_info "Resetting development database..."

    # Create backup before reset
    backup_database "all"

    # Reset collections (implementation depends on your needs)
    # This is a placeholder - implement based on your requirements
    print_warning "Reset functionality not fully implemented"
    print_info "Manual reset required - delete collections via Firebase Console"
}

# Setup test database
setup_test_database() {
    export TESTING=true
    export FIREBASE_PROJECT_ID="test-project"

    print_info "Setting up test database..."
    init_database

    # Add test data (optional)
    print_info "Test database setup completed"
}

# Main script logic
main() {
    # Create necessary directories
    mkdir -p "$BACKUP_DIR"
    mkdir -p "$MIGRATIONS_DIR"

    # Check dependencies
    check_dependencies

    # Parse command line arguments
    case "${1:-help}" in
        "init")
            init_database
            ;;
        "migrate")
            run_migrations
            ;;
        "backup")
            backup_database "$2"
            ;;
        "backup-all")
            backup_database "all"
            ;;
        "restore")
            restore_database "$2"
            ;;
        "status")
            show_status
            ;;
        "clean")
            clean_backups
            ;;
        "create-migration")
            if [ -z "$2" ]; then
                print_error "Migration name required"
                echo "Usage: $0 create-migration <name> [description]"
                exit 1
            fi
            python3 migration_manager.py create "$2" "$3"
            ;;
        "list-migrations")
            python3 migration_manager.py list
            ;;
        "migration-status")
            python3 migration_manager.py status
            ;;
        "list-backups")
            python3 backup.py list
            ;;
        "reset-dev")
            reset_dev_database
            ;;
        "setup-test")
            setup_test_database
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        *)
            print_error "Unknown command: $1"
            echo "Use '$0 help' for usage information"
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
