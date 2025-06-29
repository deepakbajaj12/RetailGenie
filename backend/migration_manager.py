"""
Database Migration Manager for RetailGenie
Handles schema versioning, migration execution, and rollback
"""

import importlib.util
import json
import logging
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

from utils.firebase_utils import FirebaseUtils

logger = logging.getLogger(__name__)


class MigrationManager:
    """Manages database schema migrations and versioning"""

    def __init__(self, migrations_dir: str = "migrations"):
        self.firebase = FirebaseUtils()
        self.migrations_dir = Path(migrations_dir)
        self.migrations_collection = "_migrations"

        if not self.firebase.db:
            raise RuntimeError(
                "Firebase not initialized. Cannot create migration manager."
            )

        # Ensure migrations directory exists
        self.migrations_dir.mkdir(exist_ok=True)

    def get_migration_status(self) -> Dict[str, Any]:
        """Get current migration status and version"""
        try:
            migrations = self.firebase.get_documents(self.migrations_collection)

            if not migrations:
                return {
                    "current_version": "0.0",
                    "migrations_applied": 0,
                    "last_migration": None,
                    "status": "no_migrations",
                }

            # Get the latest migration
            latest_migration = max(migrations, key=lambda x: x.get("executed_at", ""))

            return {
                "current_version": latest_migration.get("version", "0.0"),
                "migrations_applied": len(migrations),
                "last_migration": latest_migration.get("migration_id"),
                "last_executed": latest_migration.get("executed_at"),
                "status": latest_migration.get("status", "unknown"),
            }

        except Exception as e:
            logger.error(f"Error getting migration status: {str(e)}")
            return {
                "current_version": "unknown",
                "migrations_applied": 0,
                "last_migration": None,
                "status": "error",
                "error": str(e),
            }

    def list_available_migrations(self) -> List[Dict[str, Any]]:
        """List all available migration files"""
        migrations = []

        for migration_file in self.migrations_dir.glob("*.py"):
            if migration_file.name.startswith("__"):
                continue

            try:
                # Extract version and description from filename
                name = migration_file.stem
                parts = name.split("_", 1)
                version = parts[0] if len(parts) > 0 else "unknown"
                description = (
                    parts[1].replace("_", " ").title()
                    if len(parts) > 1
                    else "No description"
                )

                migrations.append(
                    {
                        "filename": migration_file.name,
                        "filepath": str(migration_file),
                        "migration_id": name,
                        "version": version,
                        "description": description,
                        "size": migration_file.stat().st_size,
                        "modified": datetime.fromtimestamp(
                            migration_file.stat().st_mtime
                        ).isoformat(),
                    }
                )

            except Exception as e:
                logger.warning(
                    f"Could not process migration file {migration_file}: {str(e)}"
                )

        return sorted(migrations, key=lambda x: x["version"])

    def list_applied_migrations(self) -> List[Dict[str, Any]]:
        """List all applied migrations from database"""
        try:
            migrations = self.firebase.get_documents(self.migrations_collection)
            return sorted(migrations, key=lambda x: x.get("executed_at", ""))
        except Exception as e:
            logger.error(f"Error listing applied migrations: {str(e)}")
            return []

    def is_migration_applied(self, migration_id: str) -> bool:
        """Check if a specific migration has been applied"""
        try:
            applied_migrations = self.list_applied_migrations()
            return any(
                m.get("migration_id") == migration_id for m in applied_migrations
            )
        except Exception:
            return False

    def run_migration(self, migration_file: str) -> bool:
        """
        Execute a specific migration file

        Args:
            migration_file: Path to the migration file

        Returns:
            True if migration was successful
        """
        try:
            migration_path = Path(migration_file)
            if not migration_path.exists():
                # Try relative to migrations directory
                migration_path = self.migrations_dir / migration_file
                if not migration_path.exists():
                    raise FileNotFoundError(
                        f"Migration file not found: {migration_file}"
                    )

            migration_id = migration_path.stem

            # Check if already applied
            if self.is_migration_applied(migration_id):
                logger.warning(f"Migration {migration_id} has already been applied")
                return True

            logger.info(f"Running migration: {migration_id}")

            # Load and execute the migration module
            spec = importlib.util.spec_from_file_location(migration_id, migration_path)
            if not spec or not spec.loader:
                raise ImportError(f"Could not load migration module: {migration_file}")

            migration_module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(migration_module)

            # Execute the migrate function
            if hasattr(migration_module, "migrate"):
                success = migration_module.migrate()

                if success:
                    logger.info(f"✅ Migration {migration_id} completed successfully")
                    return True
                else:
                    logger.error(f"❌ Migration {migration_id} failed")
                    return False
            else:
                raise AttributeError(
                    f"Migration {migration_id} does not have a migrate() function"
                )

        except Exception as e:
            logger.error(f"❌ Error running migration {migration_file}: {str(e)}")
            return False

    def run_pending_migrations(self) -> Dict[str, Any]:
        """Run all pending migrations"""
        available_migrations = self.list_available_migrations()
        applied_migrations = {
            m.get("migration_id") for m in self.list_applied_migrations()
        }

        pending_migrations = [
            m
            for m in available_migrations
            if m["migration_id"] not in applied_migrations
        ]

        if not pending_migrations:
            logger.info("No pending migrations found")
            return {
                "status": "up_to_date",
                "pending_count": 0,
                "applied_count": 0,
                "failed_count": 0,
            }

        logger.info(f"Found {len(pending_migrations)} pending migrations")

        results = {
            "status": "completed",
            "pending_count": len(pending_migrations),
            "applied_count": 0,
            "failed_count": 0,
            "applied_migrations": [],
            "failed_migrations": [],
        }

        for migration in pending_migrations:
            success = self.run_migration(migration["filepath"])

            if success:
                results["applied_count"] += 1
                results["applied_migrations"].append(migration["migration_id"])
            else:
                results["failed_count"] += 1
                results["failed_migrations"].append(migration["migration_id"])

        if results["failed_count"] > 0:
            results["status"] = "partial_failure"

        logger.info(
            f"""
        🎯 Migration Summary:
        ✅ Applied: {results['applied_count']} migrations
        ❌ Failed: {results['failed_count']} migrations
        📊 Total pending: {results['pending_count']} migrations
        """
        )

        return results

    def create_migration_template(self, name: str, description: str = "") -> str:
        """Create a new migration file template"""
        # Generate version number
        existing_migrations = self.list_available_migrations()
        if existing_migrations:
            last_version = existing_migrations[-1]["version"]
            try:
                # Extract numeric part and increment
                if last_version.startswith("v"):
                    version_num = int(last_version[1:]) + 1
                    new_version = f"v{version_num}"
                else:
                    new_version = "v2"
            except ValueError:
                new_version = "v2"
        else:
            new_version = "v1"

        # Create filename
        clean_name = name.lower().replace(" ", "_").replace("-", "_")
        filename = f"{new_version}_{clean_name}.py"
        filepath = self.migrations_dir / filename

        # Create template content
        template = f'''"""
{description or f"Migration: {name}"}
Version: {new_version}
Created: {datetime.now(timezone.utc).isoformat()}
"""

from datetime import datetime, timezone
from utils.firebase_utils import FirebaseUtils
import logging

logger = logging.getLogger(__name__)


def migrate():
    """Execute the migration"""
    firebase = FirebaseUtils()

    if not firebase.db:
        logger.error("Firebase not initialized. Cannot run migration.")
        return False

    logger.info("Starting migration: {name}")

    try:
        # TODO: Add your migration logic here

        # Example: Create a new collection
        # firebase.create_document("new_collection", {{"initialized": True}})

        # Example: Update existing documents
        # documents = firebase.get_documents("existing_collection")
        # for doc in documents:
        #     firebase.update_document("existing_collection", doc["id"], {{"new_field": "default_value"}})

        logger.info("✅ Migration completed successfully")
        return True

    except Exception as e:
        logger.error(f"❌ Migration failed: {{str(e)}}")
        return False


def rollback():
    """Rollback the migration (optional)"""
    firebase = FirebaseUtils()

    if not firebase.db:
        logger.error("Firebase not initialized. Cannot rollback migration.")
        return False

    logger.info("Starting rollback: {name}")

    try:
        # TODO: Add your rollback logic here

        logger.info("✅ Rollback completed successfully")
        return True

    except Exception as e:
        logger.error(f"❌ Rollback failed: {{str(e)}}")
        return False


if __name__ == '__main__':
    # Configure logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )

    success = migrate()
    if success:
        print("🎉 Migration completed successfully!")
        exit(0)
    else:
        print("⚠️ Migration failed. Check logs for details.")
        exit(1)
'''

        # Write the template file
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(template)

        logger.info(f"✅ Migration template created: {filepath}")
        return str(filepath)


def main():
    """Command-line interface for migration management"""
    import sys

    # Configure logging
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    )

    manager = MigrationManager()

    if len(sys.argv) < 2:
        print(
            """
Database Migration Manager

Usage:
  python migration_manager.py status          - Show migration status
  python migration_manager.py list           - List available migrations
  python migration_manager.py applied        - List applied migrations
  python migration_manager.py run <file>     - Run specific migration
  python migration_manager.py migrate        - Run all pending migrations
  python migration_manager.py create <name>  - Create new migration template
        """
        )
        return

    command = sys.argv[1]

    if command == "status":
        status = manager.get_migration_status()
        print(
            f"""
📊 Migration Status:
  Current Version: {status['current_version']}
  Migrations Applied: {status['migrations_applied']}
  Last Migration: {status.get('last_migration', 'None')}
  Status: {status['status']}
        """
        )

    elif command == "list":
        migrations = manager.list_available_migrations()
        print(f"\n📋 Available Migrations ({len(migrations)}):")
        for migration in migrations:
            print(f"  - {migration['migration_id']}: {migration['description']}")

    elif command == "applied":
        migrations = manager.list_applied_migrations()
        print(f"\n✅ Applied Migrations ({len(migrations)}):")
        for migration in migrations:
            print(
                f"  - {migration.get('migration_id', 'Unknown')}: "
                f"{migration.get('executed_at', 'Unknown time')}"
            )

    elif command == "run" and len(sys.argv) > 2:
        migration_file = sys.argv[2]
        success = manager.run_migration(migration_file)
        if success:
            print("✅ Migration completed successfully!")
        else:
            print("❌ Migration failed. Check logs for details.")

    elif command == "migrate":
        results = manager.run_pending_migrations()
        if results["status"] == "up_to_date":
            print("✅ Database is up to date!")
        elif results["status"] == "completed":
            print(
                f"✅ All migrations completed! Applied {results['applied_count']} migrations."
            )
        else:
            print(
                f"⚠️ Migrations completed with errors. "
                f"Applied: {results['applied_count']}, Failed: {results['failed_count']}"
            )

    elif command == "create" and len(sys.argv) > 2:
        name = sys.argv[2]
        description = sys.argv[3] if len(sys.argv) > 3 else ""
        filepath = manager.create_migration_template(name, description)
        print(f"✅ Migration template created: {filepath}")

    else:
        print("❌ Unknown command. Use 'python migration_manager.py' for help.")


if __name__ == "__main__":
    main()
