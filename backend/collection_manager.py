from utils.firebase_utils import FirebaseUtils

firebase = FirebaseUtils()

# Create sample product
product_data = {
    "name": "Sample Product",
    "price": 29.99,
    "category": "Electronics",
    "description": "This is a sample product",
    "in_stock": True,
    "created_at": "2024-01-01T00:00:00Z",
}

firebase.create_document("products", product_data)
print("Sample product created!")

# Create sample feedback
feedback_data = {
    "product_id": "sample-product-id",
    "rating": 5,
    "comment": "Great product!",
    "user_name": "Test User",
    "created_at": "2024-01-01T00:00:00Z",
}

firebase.create_document("feedback", feedback_data)
print("Sample feedback created!")
