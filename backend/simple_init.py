from datetime import datetime

from utils.firebase_utils import FirebaseUtils

# Initialize Firebase
firebase = FirebaseUtils()

if firebase.db:
    print("✅ Firebase connected successfully!")

    # Create a sample product
    product_data = {
        "name": "Test Product from Script",
        "price": 99.99,
        "category": "Test",
        "description": "A test product created via script",
        "in_stock": True,
        "created_at": datetime.utcnow().isoformat() + "Z",
    }

    product_id = firebase.create_document("products", product_data)
    print(f"✅ Created product with ID: {product_id}")

    # Test getting all products
    products = firebase.get_all_documents("products")
    print(f"✅ Found {len(products)} products in database")

else:
    print("❌ Firebase connection failed")
