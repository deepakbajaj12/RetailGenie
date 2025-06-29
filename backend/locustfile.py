"""
Load testing configuration for RetailGenie API using Locust
Run with: locust -f locustfile.py --host=http://localhost:5000
"""

import json
import random

from locust import HttpUser, between, task


class RetailGenieUser(HttpUser):
    wait_time = between(1, 3)

    def on_start(self):
        """Called when a simulated user starts executing tasks"""
        # Simulate user authentication if needed
        pass

    @task(3)
    def get_products(self):
        """Get all products - most common operation"""
        self.client.get("/api/products")

    @task(2)
    def get_single_product(self):
        """Get a specific product"""
        product_id = random.randint(1, 100)
        self.client.get(f"/api/products/{product_id}")

    @task(1)
    def search_products(self):
        """Search products by category"""
        categories = ["electronics", "clothing", "books", "home"]
        category = random.choice(categories)
        self.client.get(f"/api/products?category={category}")

    @task(1)
    def get_recommendations(self):
        """Get product recommendations"""
        user_id = random.randint(1, 50)
        self.client.get(f"/api/recommendations/{user_id}")

    @task(1)
    def create_product(self):
        """Create a new product - admin operation"""
        product_data = {
            "name": f"Test Product {random.randint(1, 1000)}",
            "price": round(random.uniform(10.0, 500.0), 2),
            "category": random.choice(["electronics", "clothing", "books"]),
            "description": "Load test product",
        }

        response = self.client.post(
            "/api/products",
            data=json.dumps(product_data),
            headers={"Content-Type": "application/json"},
        )

        # Store product ID for potential future operations
        if response.status_code == 201:
            try:
                product_id = response.json().get("id")
                if product_id:
                    # Optionally test update/delete with some probability
                    if random.random() < 0.1:  # 10% chance
                        self.update_product(product_id)
            except:
                pass

    def update_product(self, product_id):
        """Update a product"""
        update_data = {"price": round(random.uniform(10.0, 500.0), 2)}

        self.client.put(
            f"/api/products/{product_id}",
            data=json.dumps(update_data),
            headers={"Content-Type": "application/json"},
        )


class AdminUser(HttpUser):
    """Simulates admin users with higher privileges"""

    wait_time = between(2, 5)
    weight = 1  # Lower weight = fewer admin users

    @task(2)
    def manage_products(self):
        """Admin product management operations"""
        self.client.get("/api/admin/products")

    @task(1)
    def view_analytics(self):
        """View analytics dashboard"""
        self.client.get("/api/analytics/dashboard")

    @task(1)
    def manage_users(self):
        """User management operations"""
        self.client.get("/api/admin/users")


class RegularUser(HttpUser):
    """Simulates regular customer users"""

    wait_time = between(1, 2)
    weight = 9  # Higher weight = more regular users

    @task(5)
    def browse_products(self):
        """Browse product catalog"""
        self.client.get("/api/products")

    @task(3)
    def view_product_details(self):
        """View specific product details"""
        product_id = random.randint(1, 100)
        self.client.get(f"/api/products/{product_id}")

    @task(2)
    def get_recommendations(self):
        """Get personalized recommendations"""
        user_id = random.randint(1, 100)
        self.client.get(f"/api/recommendations/{user_id}")

    @task(1)
    def search_products(self):
        """Search for products"""
        search_terms = ["phone", "laptop", "book", "shirt", "headphones"]
        term = random.choice(search_terms)
        self.client.get(f"/api/products?search={term}")


# Performance test scenarios
class PerformanceTestUser(HttpUser):
    """Heavy load testing scenarios"""

    wait_time = between(0.5, 1)

    @task
    def stress_test_endpoint(self):
        """Stress test the most critical endpoints"""
        endpoints = [
            "/api/products",
            "/api/recommendations/1",
            "/api/analytics/popular",
        ]
        endpoint = random.choice(endpoints)
        self.client.get(endpoint)
