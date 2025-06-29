# 🗄️ Database Migration & Backup System

## 📋 **Overview**

RetailGenie includes a comprehensive database migration and backup system for Firestore, providing schema versioning, automated backups, and safe database operations.

## 🛠️ **Core Components**

### **1. Migration Manager** (`migration_manager.py`)
- **Schema versioning** with automatic tracking
- **Migration templates** for consistent development
- **Rollback capabilities** for safe operations
- **Status tracking** and migration history

### **2. Backup System** (`backup.py`)
- **Automated backups** of collections and documents
- **Selective restore** capabilities
- **Backup metadata** and validation
- **Compression and archiving** support

### **3. Database Manager** (`db_manager.sh`)
- **Unified CLI** for all database operations
- **Environment safety** checks
- **Automated workflows** for common tasks
- **Production-ready** scripts

## 🚀 **Quick Start**

### **Initialize Database**
```bash
# Initialize with schema
./db_manager.sh init

# Check status
./db_manager.sh status
```

### **Create and Run Migrations**
```bash
# Create new migration
./db_manager.sh create-migration "add user analytics"

# Run pending migrations
./db_manager.sh migrate

# Check migration status
./db_manager.sh migration-status
```

### **Backup Operations**
```bash
# Backup entire database
./db_manager.sh backup-all

# Backup specific collection
./db_manager.sh backup products

# List available backups
./db_manager.sh list-backups

# Restore from backup
./db_manager.sh restore backup_products_20250629_120000.json
```

## 📚 **Detailed Usage**

### **Migration System**

#### **Creating Migrations**
```python
# Use the migration manager
python migration_manager.py create "add user preferences" "Add user personalization settings"

# Or use the CLI wrapper
./db_manager.sh create-migration "add user preferences"
```

#### **Migration Template Structure**
```python
def migrate():
    """Execute the migration"""
    firebase = FirebaseUtils()

    # Your migration logic here
    # - Create collections
    # - Update documents
    # - Add indexes

    return True  # Return success status

def rollback():
    """Rollback the migration (optional)"""
    firebase = FirebaseUtils()

    # Your rollback logic here
    # - Remove collections
    # - Revert document changes

    return True
```

#### **Available Migration Commands**
```bash
python migration_manager.py status          # Show current status
python migration_manager.py list           # List available migrations
python migration_manager.py applied        # List applied migrations
python migration_manager.py run <file>     # Run specific migration
python migration_manager.py migrate        # Run all pending migrations
python migration_manager.py create <name>  # Create new migration template
```

### **Backup System**

#### **Backup Operations**
```python
from backup import DatabaseBackup

# Create backup instance
backup_util = DatabaseBackup()

# Backup single collection
backup_util.backup_collection('products')

# Backup all collections
backup_util.backup_all_collections()

# List available backups
backups = backup_util.list_backups()

# Restore from backup
backup_util.restore_collection('backup_products_20250629_120000.json')
```

#### **Backup File Structure**
```json
{
    "collection": "products",
    "timestamp": "2025-06-29T12:00:00Z",
    "document_count": 150,
    "documents": [...],
    "metadata": {
        "backup_version": "1.0",
        "firebase_project": "retailgenie-prod",
        "backup_type": "full_collection"
    }
}
```

## 🔧 **Database Manager CLI**

### **Core Commands**
```bash
./db_manager.sh init                    # Initialize database with schema
./db_manager.sh migrate                 # Run pending migrations
./db_manager.sh status                  # Show database status
./db_manager.sh backup [collection]     # Backup database
./db_manager.sh restore <file>          # Restore from backup
./db_manager.sh clean                   # Clean old backups
```

### **Migration Commands**
```bash
./db_manager.sh create-migration <name> [description]  # Create migration
./db_manager.sh list-migrations                        # List migrations
./db_manager.sh migration-status                       # Migration status
```

### **Development Commands**
```bash
./db_manager.sh setup-test             # Setup test database
./db_manager.sh reset-dev              # Reset development database (DANGEROUS)
```

## 📊 **Schema Management**

### **Collection Schema Example**
```python
# Example migration for creating a new collection
def migrate():
    firebase = FirebaseUtils()

    # Define collection schema
    schema = {
        'initialized': True,
        'version': '2.0',
        'schema_version': 2,
        'description': 'User preferences and settings',
        'fields': {
            'user_id': 'string (required, unique)',
            'theme': 'string (light/dark/auto)',
            'language': 'string (en/es/fr/de)',
            'notification_preferences': 'object',
            'created_at': 'timestamp',
            'updated_at': 'timestamp'
        },
        'indexes': ['user_id', 'theme'],
        'created_at': datetime.now(timezone.utc).isoformat()
    }

    # Create collection
    doc_id = firebase.create_document('user_preferences', schema)
    return bool(doc_id)
```

### **Standard Collections**
- **`products`** - Product catalog and inventory
- **`users`** - User accounts and authentication
- **`feedback`** - User feedback and reviews
- **`orders`** - Order management and tracking
- **`analytics`** - Analytics data and metrics
- **`recommendations`** - AI-generated recommendations
- **`categories`** - Product categories and taxonomy
- **`_migrations`** - Migration tracking (system)

## 🔒 **Safety & Best Practices**

### **Environment Safety**
```bash
# Development mode
export TESTING=true
export FIREBASE_PROJECT_ID=test-project

# Production mode (default)
export FIREBASE_PROJECT_ID=retailgenie-prod
```

### **Pre-Migration Checklist**
1. ✅ **Backup database** before major migrations
2. ✅ **Test migrations** in development environment
3. ✅ **Review migration scripts** for correctness
4. ✅ **Check rollback procedures** are available
5. ✅ **Verify Firebase credentials** and permissions

### **Backup Strategy**
```bash
# Daily automated backup
0 2 * * * /path/to/db_manager.sh backup-all

# Weekly backup cleanup
0 3 * * 0 /path/to/db_manager.sh clean

# Pre-deployment backup
./db_manager.sh backup-all
```

## 📈 **Monitoring & Logging**

### **Migration Tracking**
All migrations are tracked in the `_migrations` collection:
```json
{
    "migration_id": "v2_add_user_preferences",
    "version": "2.0",
    "executed_at": "2025-06-29T12:00:00Z",
    "status": "completed",
    "created_collections": ["user_preferences"],
    "failed_collections": []
}
```

### **Backup Metadata**
Backup operations generate detailed logs and summaries:
```json
{
    "backup_session": {
        "timestamp": "2025-06-29T12:00:00Z",
        "total_collections": 7,
        "successful_backups": 7,
        "failed_backups": 0,
        "status": "success"
    },
    "backup_files": {...}
}
```

## 🚨 **Troubleshooting**

### **Common Issues**

#### **Migration Fails**
```bash
# Check migration status
./db_manager.sh migration-status

# View detailed logs
tail -f database_operations.log

# Run specific migration manually
python migrations/v1_initial_schema.py
```

#### **Backup/Restore Issues**
```bash
# List available backups
./db_manager.sh list-backups

# Validate backup file
python -c "import json; print(json.load(open('backup_file.json'))['document_count'])"

# Test restore in development
export TESTING=true
./db_manager.sh restore backup_file.json
```

#### **Firebase Connection Issues**
```bash
# Check credentials
echo $FIREBASE_PROJECT_ID
ls -la firebase-credentials.json

# Test connection
python -c "from utils.firebase_utils import FirebaseUtils; print('✅ Connected' if FirebaseUtils().db else '❌ Failed')"
```

## 🎯 **Production Deployment**

### **Pre-Deployment Steps**
1. **Backup production database**
   ```bash
   ./db_manager.sh backup-all
   ```

2. **Test migrations in staging**
   ```bash
   export FIREBASE_PROJECT_ID=retailgenie-staging
   ./db_manager.sh migrate
   ```

3. **Deploy to production**
   ```bash
   export FIREBASE_PROJECT_ID=retailgenie-prod
   ./db_manager.sh migrate
   ```

### **Post-Deployment Verification**
```bash
# Verify migration status
./db_manager.sh status

# Check data integrity
python -c "
from utils.firebase_utils import FirebaseUtils
fb = FirebaseUtils()
collections = ['products', 'users', 'orders']
for c in collections:
    docs = fb.get_documents(c)
    print(f'{c}: {len(docs)} documents')
"
```

## 📖 **Advanced Features**

### **Custom Migration Templates**
Create specialized migration templates for common operations:
```python
# Template for adding fields to existing documents
def migrate_add_field(collection_name, field_name, default_value):
    firebase = FirebaseUtils()
    documents = firebase.get_documents(collection_name)

    for doc in documents:
        if field_name not in doc:
            firebase.update_document(
                collection_name,
                doc['id'],
                {field_name: default_value}
            )
```

### **Backup Automation**
```bash
# Setup automated backups with cron
cat << EOF > /etc/cron.d/retailgenie-backup
# Daily backup at 2 AM
0 2 * * * /path/to/db_manager.sh backup-all

# Weekly cleanup on Sunday at 3 AM
0 3 * * 0 /path/to/db_manager.sh clean
EOF
```

### **Data Validation**
```python
# Add validation to migrations
def validate_data_integrity():
    firebase = FirebaseUtils()

    # Check required collections exist
    required_collections = ['products', 'users', 'orders']
    for collection in required_collections:
        docs = firebase.get_documents(collection)
        assert len(docs) > 0, f"Collection {collection} is empty"

    return True
```

## 🎉 **Ready for Production**

Your RetailGenie database migration and backup system is now **production-ready** with:

- ✅ **Schema versioning** and migration tracking
- ✅ **Automated backup** and restore capabilities
- ✅ **Safety checks** and environment protection
- ✅ **Comprehensive CLI** for all operations
- ✅ **Monitoring and logging** for all activities
- ✅ **Rollback capabilities** for safe migrations
- ✅ **Production deployment** procedures

The system provides enterprise-grade database management capabilities ensuring data safety, schema consistency, and operational reliability.
