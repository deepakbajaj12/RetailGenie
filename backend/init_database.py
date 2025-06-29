#!/usr/bin/env python3
"""
Database Initialization Script for RetailGenie
"""
import os
import sys
from datetime import datetime

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from utils.firebase_utils import FirebaseUtils


def initialize_database():
    """Initialize the database with sample data"""
    print("🔥 Initializing RetailGenie Database...")

    try:
        # Initialize Firebase
        firebase = FirebaseUtils()

        if not firebase.db:
            print("❌ Firebase connection failed. Using mock database.")
            return False

        print("✅ Firebase connected successfully!")
        print(f"📊 Project: {os.getenv('FIREBASE_PROJECT_ID', 'Unknown')}")

        # Sample products data
        sample_products = [
            {
                "name": "Wireless Bluetooth Headphones",
                "price": 79.99,
                "category": "Electronics",
                "description": "High-quality wireless headphones with noise cancellation",
                "in_stock": True,
                "sku": "WBH-001",
                "created_at": datetime.utcnow().isoformat() + "Z",
                "updated_at": datetime.utcnow().isoformat() + "Z",
            },
            {
                "name": "Smart Fitness Watch",
                "price": 199.99,
                "category": "Electronics",
                "description": "Advanced fitness tracking with heart rate monitoring",
                "in_stock": True,
                "sku": "SFW-002",
                "created_at": datetime.utcnow().isoformat() + "Z",
                "updated_at": datetime.utcnow().isoformat() + "Z",
            },
            {
                "name": "Organic Coffee Beans",
                "price": 24.99,
                "category": "Food & Beverage",
                "description": "Premium organic coffee beans, medium roast",
                "in_stock": False,
                "sku": "OCB-003",
                "created_at": datetime.utcnow().isoformat() + "Z",
                "updated_at": datetime.utcnow().isoformat() + "Z",
            },
            {
                "name": "Eco-Friendly Water Bottle",
                "price": 19.99,
                "category": "Lifestyle",
                "description": "Stainless steel water bottle with insulation",
                "in_stock": True,
                "sku": "EWB-004",
                "created_at": datetime.utcnow().isoformat() + "Z",
                "updated_at": datetime.utcnow().isoformat() + "Z",
            },
            {
                "name": "Gaming Mechanical Keyboard",
                "price": 129.99,
                "category": "Electronics",
                "description": "RGB backlit mechanical keyboard for gaming",
                "in_stock": True,
                "sku": "GMK-005",
                "created_at": datetime.utcnow().isoformat() + "Z",
                "updated_at": datetime.utcnow().isoformat() + "Z",
            },
        ]

        # Clear existing products (if any)
        print("🧹 Clearing existing products...")
        existing_products = firebase.get_all_documents("products")
        for product in existing_products:
            if "id" in product:
                firebase.delete_document("products", product["id"])

        # Create sample products
        print("📦 Creating sample products...")
        created_products = []

        for i, product in enumerate(sample_products, 1):
            product_id = firebase.create_document("products", product)
            product["id"] = product_id
            created_products.append(product)
            print(f"   ✅ Created: {product['name']} (ID: {product_id})")

        # Sample users
        sample_users = [
            {
                "email": "admin@retailgenie.com",
                "name": "Admin User",
                "role": "admin",
                "created_at": datetime.utcnow().isoformat() + "Z",
                "is_active": True,
            },
            {
                "email": "john.doe@example.com",
                "name": "John Doe",
                "role": "user",
                "created_at": datetime.utcnow().isoformat() + "Z",
                "is_active": True,
            },
        ]

        # Create sample users
        print("👥 Creating sample users...")
        created_users = []

        for user in sample_users:
            user_id = firebase.create_document("users", user)
            user["id"] = user_id
            created_users.append(user)
            print(f"   ✅ Created: {user['name']} ({user['email']})")

        # Sample feedback
        if created_products:
            print("💬 Creating sample feedback...")
            sample_feedback = [
                {
                    "product_id": created_products[0]["id"],  # Wireless Headphones
                    "rating": 5,
                    "comment": "Amazing sound quality and comfortable fit!",
                    "user_name": "Alice Johnson",
                    "created_at": datetime.utcnow().isoformat() + "Z",
                },
                {
                    "product_id": created_products[0]["id"],  # Wireless Headphones
                    "rating": 4,
                    "comment": "Great headphones, battery life could be better.",
                    "user_name": "Bob Smith",
                    "created_at": datetime.utcnow().isoformat() + "Z",
                },
                {
                    "product_id": created_products[1]["id"],  # Smart Watch
                    "rating": 5,
                    "comment": "Perfect for tracking my workouts!",
                    "user_name": "Carol Davis",
                    "created_at": datetime.utcnow().isoformat() + "Z",
                },
            ]

            for feedback in sample_feedback:
                feedback_id = firebase.create_document("feedback", feedback)
                print(f"   ✅ Created feedback: {feedback['comment'][:30]}...")

        print("\n🎉 Database initialization completed successfully!")
        print(f"📊 Summary:")
        print(f"   - Products: {len(created_products)}")
        print(f"   - Users: {len(created_users)}")
        print(f"   - Feedback: {len(sample_feedback)}")

        return True

    except Exception as e:
        print(f"❌ Error initializing database: {str(e)}")
        return False


if __name__ == "__main__":
    success = initialize_database()
    sys.exit(0 if success else 1)
