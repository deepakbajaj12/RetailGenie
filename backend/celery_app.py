#!/usr/bin/env python3
"""
Celery Configuration for RetailGenie API
Background task processing with Redis broker
"""

import os
from datetime import timedelta

from celery import Celery


def make_celery(app=None):
    """Create and configure Celery instance"""

    # Celery configuration
    celery_config = {
        "broker_url": os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/0"),
        "result_backend": os.getenv(
            "CELERY_RESULT_BACKEND", "redis://localhost:6379/0"
        ),
        "task_serializer": "json",
        "accept_content": ["json"],
        "result_serializer": "json",
        "timezone": "UTC",
        "enable_utc": True,
        # Task routing
        "task_routes": {
            "celery_app.send_email_async": {"queue": "email"},
            "celery_app.generate_report_async": {"queue": "reports"},
            "celery_app.sync_inventory_async": {"queue": "inventory"},
            "celery_app.cleanup_logs_async": {"queue": "maintenance"},
        },
        # Beat schedule for periodic tasks
        "beat_schedule": {
            "daily-report": {
                "task": "celery_app.generate_daily_report",
                "schedule": timedelta(hours=24),
                "args": (),
            },
            "cleanup-logs": {
                "task": "celery_app.cleanup_logs_async",
                "schedule": timedelta(hours=6),
                "args": (),
            },
        },
        # Task time limits
        "task_soft_time_limit": 300,  # 5 minutes
        "task_time_limit": 600,  # 10 minutes
        # Worker configuration
        "worker_prefetch_multiplier": 1,
        "worker_max_tasks_per_child": 1000,
    }

    # Create Celery instance
    celery = Celery("retailgenie")
    celery.conf.update(celery_config)

    # Configure Flask app context if provided
    if app:

        class ContextTask(celery.Task):
            """Make celery tasks work with Flask app context"""

            def __call__(self, *args, **kwargs):
                with app.app_context():
                    return self.run(*args, **kwargs)

        celery.Task = ContextTask

    return celery


# Create celery instance
celery = make_celery()


# Background task definitions
@celery.task(bind=True, name="celery_app.send_email_async")
def send_email_async(self, recipient, subject, body, email_type="notification"):
    """
    Send email asynchronously

    Args:
        recipient (str): Email recipient
        subject (str): Email subject
        body (str): Email body
        email_type (str): Type of email (notification, report, alert)
    """
    try:
        # Simulate email sending process
        import random
        import time

        # Log task start
        print(f"📧 Sending {email_type} email to {recipient}")
        print(f"   Subject: {subject}")

        # Simulate email processing time
        processing_time = random.uniform(1, 3)
        for i in range(int(processing_time)):
            time.sleep(1)
            self.update_state(
                state="PROGRESS",
                meta={
                    "current": i + 1,
                    "total": int(processing_time),
                    "status": "Sending...",
                },
            )

        # Simulate email sending
        # In production, integrate with services like SendGrid, AWS SES, etc.
        email_data = {
            "recipient": recipient,
            "subject": subject,
            "body": body,
            "email_type": email_type,
            "sent_at": time.time(),
            "status": "sent",
        }

        print(f"✅ Email sent successfully to {recipient}")

        return {
            "status": "SUCCESS",
            "message": f"Email sent to {recipient}",
            "email_data": email_data,
        }

    except Exception as e:
        print(f"❌ Email sending failed: {str(e)}")
        self.update_state(
            state="FAILURE", meta={"error": str(e), "status": "Failed to send email"}
        )
        raise


@celery.task(bind=True, name="celery_app.generate_report_async")
def generate_report_async(self, report_type, date_range=None, user_id=None):
    """
    Generate reports asynchronously

    Args:
        report_type (str): Type of report (sales, inventory, analytics)
        date_range (dict): Date range for report
        user_id (str): User requesting the report
    """
    try:
        import json
        import time
        from datetime import datetime, timedelta

        print(f"📊 Generating {report_type} report...")

        # Simulate report generation process
        total_steps = 5
        for step in range(total_steps):
            time.sleep(2)  # Simulate processing time

            self.update_state(
                state="PROGRESS",
                meta={
                    "current": step + 1,
                    "total": total_steps,
                    "status": f"Processing {report_type} data...",
                },
            )

        # Generate mock report data
        report_data = {
            "report_type": report_type,
            "generated_at": datetime.now().isoformat(),
            "date_range": date_range
            or {
                "start": (datetime.now() - timedelta(days=30)).isoformat(),
                "end": datetime.now().isoformat(),
            },
            "user_id": user_id,
            "data": {
                "total_products": 150,
                "total_sales": 75000,
                "avg_order_value": 85.50,
                "top_categories": ["Electronics", "Clothing", "Food"],
            },
        }

        # Save report to file (in production, save to database or cloud storage)
        report_filename = (
            f"report_{report_type}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        )

        print(f"✅ {report_type.title()} report generated successfully")

        return {
            "status": "SUCCESS",
            "message": f"{report_type.title()} report generated",
            "report_data": report_data,
            "filename": report_filename,
        }

    except Exception as e:
        print(f"❌ Report generation failed: {str(e)}")
        self.update_state(
            state="FAILURE",
            meta={"error": str(e), "status": "Failed to generate report"},
        )
        raise


@celery.task(bind=True, name="celery_app.sync_inventory_async")
def sync_inventory_async(self, inventory_source="external_api"):
    """
    Synchronize inventory data asynchronously

    Args:
        inventory_source (str): Source of inventory data
    """
    try:
        import random
        import time

        print(f"🔄 Syncing inventory from {inventory_source}...")

        # Simulate inventory sync process
        total_products = random.randint(50, 200)

        for i in range(total_products):
            if i % 10 == 0:  # Update progress every 10 items
                self.update_state(
                    state="PROGRESS",
                    meta={
                        "current": i,
                        "total": total_products,
                        "status": f"Syncing product {i}/{total_products}",
                    },
                )

            time.sleep(0.1)  # Simulate processing time per product

        sync_result = {
            "inventory_source": inventory_source,
            "products_synced": total_products,
            "sync_time": time.time(),
            "status": "completed",
        }

        print(f"✅ Inventory sync completed: {total_products} products")

        return {
            "status": "SUCCESS",
            "message": f"Inventory synced from {inventory_source}",
            "sync_result": sync_result,
        }

    except Exception as e:
        print(f"❌ Inventory sync failed: {str(e)}")
        self.update_state(
            state="FAILURE",
            meta={"error": str(e), "status": "Failed to sync inventory"},
        )
        raise


@celery.task(name="celery_app.cleanup_logs_async")
def cleanup_logs_async(days_to_keep=30):
    """
    Clean up old log files asynchronously

    Args:
        days_to_keep (int): Number of days to keep logs
    """
    try:
        import os
        import time
        from datetime import datetime, timedelta

        print(f"🧹 Cleaning up logs older than {days_to_keep} days...")

        # Simulate log cleanup
        cleanup_date = datetime.now() - timedelta(days=days_to_keep)
        logs_cleaned = 0

        # In production, scan actual log directories
        log_dirs = ["logs/", "reports/", "temp/"]

        for log_dir in log_dirs:
            if os.path.exists(log_dir):
                # Simulate cleanup process
                time.sleep(1)
                logs_cleaned += 10  # Mock cleanup count

        print(f"✅ Log cleanup completed: {logs_cleaned} files cleaned")

        return {
            "status": "SUCCESS",
            "message": f"Cleaned up {logs_cleaned} old log files",
            "cleanup_date": cleanup_date.isoformat(),
            "logs_cleaned": logs_cleaned,
        }

    except Exception as e:
        print(f"❌ Log cleanup failed: {str(e)}")
        raise


@celery.task(name="celery_app.generate_daily_report")
def generate_daily_report():
    """Generate daily report - periodic task"""
    try:
        from datetime import datetime, timedelta

        print("📅 Generating daily report...")

        # Call the main report generation task
        yesterday = datetime.now() - timedelta(days=1)
        date_range = {
            "start": yesterday.replace(hour=0, minute=0, second=0).isoformat(),
            "end": yesterday.replace(hour=23, minute=59, second=59).isoformat(),
        }

        # Chain the report generation task
        result = generate_report_async.delay("daily", date_range, "system")

        print(f"✅ Daily report task queued: {result.id}")

        return {
            "status": "SUCCESS",
            "message": "Daily report generation queued",
            "task_id": result.id,
        }

    except Exception as e:
        print(f"❌ Daily report scheduling failed: {str(e)}")
        raise


# Utility functions for task management
def get_task_status(task_id):
    """Get status of a background task"""
    task = celery.AsyncResult(task_id)

    if task.state == "PENDING":
        response = {"state": task.state, "status": "Task is waiting to be processed"}
    elif task.state == "PROGRESS":
        response = {
            "state": task.state,
            "current": task.info.get("current", 0),
            "total": task.info.get("total", 1),
            "status": task.info.get("status", "Processing..."),
        }
    elif task.state == "SUCCESS":
        response = {"state": task.state, "result": task.info}
    else:  # FAILURE
        response = {"state": task.state, "error": str(task.info)}

    return response


def cancel_task(task_id):
    """Cancel a background task"""
    celery.control.revoke(task_id, terminate=True)
    return {"status": "cancelled", "task_id": task_id}


if __name__ == "__main__":
    # Start Celery worker
    celery.start()
