"""
Database backup utilities for RetailGenie Firestore
Comprehensive backup and restore functionality
"""

import json
import logging
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

from utils.firebase_utils import FirebaseUtils

logger = logging.getLogger(__name__)


class DatabaseBackup:
    """Comprehensive database backup and restore utilities"""

    def __init__(self, backup_dir: str = "backups"):
        self.firebase = FirebaseUtils()
        self.backup_dir = Path(backup_dir)
        self.backup_dir.mkdir(exist_ok=True)

        if not self.firebase.db:
            raise RuntimeError(
                "Firebase not initialized. Cannot create backup utility."
            )

    def backup_collection(
        self, collection_name: str, include_metadata: bool = True
    ) -> str:
        """
        Backup a single collection to JSON file

        Args:
            collection_name: Name of the Firestore collection
            include_metadata: Whether to include backup metadata

        Returns:
            Path to the backup file
        """
        try:
            logger.info(f"Starting backup of collection: {collection_name}")

            # Get all documents from the collection
            documents = self.firebase.get_documents(collection_name)

            backup_data = {
                "collection": collection_name,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "document_count": len(documents),
                "documents": documents,
            }

            if include_metadata:
                backup_data["metadata"] = {
                    "backup_version": "1.0",
                    "firebase_project": os.getenv("FIREBASE_PROJECT_ID", "unknown"),
                    "backup_type": "full_collection",
                    "compression": "none",
                }

            # Generate filename
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"backup_{collection_name}_{timestamp}.json"
            filepath = self.backup_dir / filename

            # Write backup file
            with open(filepath, "w", encoding="utf-8") as f:
                json.dump(backup_data, f, indent=2, ensure_ascii=False)

            logger.info(f"✅ Backup created: {filepath}")
            logger.info(f"📊 Backed up {len(documents)} documents")

            return str(filepath)

        except Exception as e:
            logger.error(f"❌ Error backing up collection {collection_name}: {str(e)}")
            raise

    def backup_all_collections(
        self, exclude_collections: Optional[List[str]] = None
    ) -> Dict[str, str]:
        """
        Backup all collections in the database

        Args:
            exclude_collections: List of collection names to exclude

        Returns:
            Dictionary mapping collection names to backup file paths
        """
        exclude_collections = exclude_collections or ["_migrations"]

        # Standard collections to backup
        collections = [
            "products",
            "users",
            "feedback",
            "orders",
            "analytics",
            "recommendations",
            "categories",
        ]

        # Filter out excluded collections
        collections = [c for c in collections if c not in exclude_collections]

        backup_results = {}
        failed_backups = []

        logger.info(f"Starting full database backup for {len(collections)} collections")

        for collection in collections:
            try:
                backup_path = self.backup_collection(collection)
                backup_results[collection] = backup_path
            except Exception as e:
                logger.error(f"Failed to backup collection {collection}: {str(e)}")
                failed_backups.append(collection)

        # Create summary file
        self._create_backup_summary(backup_results, failed_backups)

        logger.info(
            f"""
        🎯 Backup Summary:
        ✅ Successfully backed up: {len(backup_results)} collections
        ❌ Failed: {len(failed_backups)} collections
        📁 Backup directory: {self.backup_dir}
        """
        )

        return backup_results

    def restore_collection(
        self, backup_file: str, target_collection: Optional[str] = None
    ) -> bool:
        """
        Restore a collection from backup file

        Args:
            backup_file: Path to the backup JSON file
            target_collection: Target collection name (defaults to original)

        Returns:
            True if restore was successful
        """
        try:
            logger.info(f"Starting restore from: {backup_file}")

            with open(backup_file, "r", encoding="utf-8") as f:
                backup_data = json.load(f)

            collection_name = target_collection or backup_data["collection"]
            documents = backup_data["documents"]

            logger.info(
                f"Restoring {len(documents)} documents to collection: {collection_name}"
            )

            # Restore documents
            success_count = 0
            failure_count = 0

            for doc in documents:
                try:
                    # Remove the 'id' field if present (Firestore will auto-generate)
                    doc_data = {k: v for k, v in doc.items() if k != "id"}

                    doc_id = self.firebase.create_document(collection_name, doc_data)
                    if doc_id:
                        success_count += 1
                    else:
                        failure_count += 1

                except Exception as e:
                    logger.error(f"Failed to restore document: {str(e)}")
                    failure_count += 1

            logger.info(
                f"""
            🎯 Restore Summary:
            ✅ Successfully restored: {success_count} documents
            ❌ Failed: {failure_count} documents
            📊 Total: {len(documents)} documents
            """
            )

            return failure_count == 0

        except Exception as e:
            logger.error(f"❌ Error restoring from {backup_file}: {str(e)}")
            return False

    def list_backups(self) -> List[Dict[str, Any]]:
        """List all available backup files with metadata"""
        backups = []

        for backup_file in self.backup_dir.glob("backup_*.json"):
            try:
                with open(backup_file, "r", encoding="utf-8") as f:
                    data = json.load(f)

                backups.append(
                    {
                        "filename": backup_file.name,
                        "filepath": str(backup_file),
                        "collection": data.get("collection", "unknown"),
                        "timestamp": data.get("timestamp", "unknown"),
                        "document_count": data.get("document_count", 0),
                        "size_mb": backup_file.stat().st_size / (1024 * 1024),
                    }
                )
            except Exception as e:
                logger.warning(f"Could not read backup file {backup_file}: {str(e)}")

        return sorted(backups, key=lambda x: x["timestamp"], reverse=True)

    def _create_backup_summary(
        self, successful_backups: Dict[str, str], failed_backups: List[str]
    ):
        """Create a summary file for the backup operation"""
        summary = {
            "backup_session": {
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "total_collections": len(successful_backups) + len(failed_backups),
                "successful_backups": len(successful_backups),
                "failed_backups": len(failed_backups),
                "status": "success" if not failed_backups else "partial_failure",
            },
            "successful_collections": list(successful_backups.keys()),
            "failed_collections": failed_backups,
            "backup_files": successful_backups,
        }

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        summary_file = self.backup_dir / f"backup_summary_{timestamp}.json"

        with open(summary_file, "w", encoding="utf-8") as f:
            json.dump(summary, f, indent=2, ensure_ascii=False)

        logger.info(f"📋 Backup summary saved: {summary_file}")


def backup_collection(collection_name: str) -> str:
    """Standalone function to backup a single collection"""
    backup_util = DatabaseBackup()
    return backup_util.backup_collection(collection_name)


def backup_all() -> Dict[str, str]:
    """Standalone function to backup all collections"""
    backup_util = DatabaseBackup()
    return backup_util.backup_all_collections()


if __name__ == "__main__":
    import sys

    # Configure logging
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    )

    backup_util = DatabaseBackup()

    if len(sys.argv) > 1:
        if sys.argv[1] == "all":
            print("🚀 Starting full database backup...")
            results = backup_util.backup_all_collections()
            print(f"✅ Backup completed! {len(results)} collections backed up.")
        elif sys.argv[1] == "list":
            print("📋 Available backups:")
            backups = backup_util.list_backups()
            for backup in backups[:10]:  # Show last 10 backups
                print(
                    f"  - {backup['filename']}: {backup['collection']} "
                    f"({backup['document_count']} docs, {backup['size_mb']:.2f}MB)"
                )
        elif sys.argv[1] == "restore" and len(sys.argv) > 2:
            print(f"📥 Restoring from: {sys.argv[2]}")
            success = backup_util.restore_collection(sys.argv[2])
            if success:
                print("✅ Restore completed successfully!")
            else:
                print("❌ Restore failed. Check logs for details.")
        else:
            # Backup specific collection
            collection = sys.argv[1]
            print(f"🚀 Starting backup of collection: {collection}")
            backup_path = backup_util.backup_collection(collection)
            print(f"✅ Backup completed: {backup_path}")
    else:
        # Default: backup all collections
        print("🚀 Starting full database backup...")
        results = backup_util.backup_all_collections()
        print(f"✅ Backup completed! {len(results)} collections backed up.")

        # Show available backups
        print("\n📋 Recent backups:")
        backups = backup_util.list_backups()
        for backup in backups[:5]:  # Show last 5 backups
            print(
                f"  - {backup['filename']}: {backup['collection']} "
                f"({backup['document_count']} docs, {backup['size_mb']:.2f}MB)"
            )
