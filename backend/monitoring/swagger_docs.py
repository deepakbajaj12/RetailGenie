#!/usr/bin/env python3
"""
RetailGenie API with Swagger Documentation
Complete API documentation using Flask-RESTX
"""

import os
import sys
from datetime import datetime, timezone

from flask import Flask, request
from flask_cors import CORS
from flask_restx import Api, Namespace, Resource, fields

# Add the project root to Python path
current_dir = (
    os.path.dirname(os.path.abspath(__file__))
    if "__file__" in globals()
    else os.getcwd()
)
sys.path.insert(0, current_dir)

from config import Config
from utils.firebase_utils import FirebaseUtils

# Initialize Flask app
app = Flask(__name__)
app.config.from_object(Config)

# Enable CORS
CORS(app, origins=["*"])

# Initialize API with Swagger documentation
api = Api(
    app,
    version="2.0.0",
    title="RetailGenie API",
    description="Comprehensive retail management API with advanced features",
    doc="/docs/",
    prefix="/api",
    contact="support@retailgenie.com",
    license="MIT",
    license_url="https://opensource.org/licenses/MIT",
)

# Initialize Firebase
firebase = FirebaseUtils()

# Define API models for Swagger documentation
product_model = api.model(
    "Product",
    {
        "id": fields.String(readonly=True, description="Product unique identifier"),
        "name": fields.String(
            required=True, description="Product name", example="Organic Coffee Beans"
        ),
        "price": fields.Float(
            required=True, description="Product price", example=24.99
        ),
        "category": fields.String(description="Product category", example="Food"),
        "description": fields.String(
            description="Product description", example="Premium organic coffee beans"
        ),
        "in_stock": fields.Boolean(description="Product availability", example=True),
        "stock_quantity": fields.Integer(description="Available quantity", example=100),
        "sku": fields.String(description="Product SKU", example="FOOD-001"),
        "images": fields.List(fields.String, description="Product images"),
        "tags": fields.List(fields.String, description="Product tags"),
        "specifications": fields.Raw(description="Product specifications"),
        "created_at": fields.String(readonly=True, description="Creation timestamp"),
        "updated_at": fields.String(readonly=True, description="Last update timestamp"),
    },
)

product_input_model = api.model(
    "ProductInput",
    {
        "name": fields.String(
            required=True, description="Product name", example="Organic Coffee Beans"
        ),
        "price": fields.Float(
            required=True, description="Product price", example=24.99
        ),
        "category": fields.String(description="Product category", example="Food"),
        "description": fields.String(
            description="Product description", example="Premium organic coffee beans"
        ),
        "in_stock": fields.Boolean(description="Product availability", example=True),
        "stock_quantity": fields.Integer(description="Available quantity", example=100),
        "sku": fields.String(description="Product SKU", example="FOOD-001"),
        "images": fields.List(fields.String, description="Product images"),
        "tags": fields.List(fields.String, description="Product tags"),
        "specifications": fields.Raw(description="Product specifications"),
    },
)

product_update_model = api.model(
    "ProductUpdate",
    {
        "name": fields.String(description="Product name"),
        "price": fields.Float(description="Product price"),
        "category": fields.String(description="Product category"),
        "description": fields.String(description="Product description"),
        "in_stock": fields.Boolean(description="Product availability"),
        "stock_quantity": fields.Integer(description="Available quantity"),
        "sku": fields.String(description="Product SKU"),
        "images": fields.List(fields.String, description="Product images"),
        "tags": fields.List(fields.String, description="Product tags"),
        "specifications": fields.Raw(description="Product specifications"),
    },
)

pagination_model = api.model(
    "Pagination",
    {
        "page": fields.Integer(description="Current page number", example=1),
        "limit": fields.Integer(description="Items per page", example=20),
        "total_pages": fields.Integer(description="Total number of pages", example=5),
        "total_items": fields.Integer(description="Total number of items", example=100),
        "has_next": fields.Boolean(description="Has next page", example=True),
        "has_prev": fields.Boolean(description="Has previous page", example=False),
    },
)

product_list_model = api.model(
    "ProductList",
    {
        "products": fields.List(
            fields.Nested(product_model), description="List of products"
        ),
        "pagination": fields.Nested(
            pagination_model, description="Pagination information"
        ),
        "filters": fields.Raw(description="Applied filters"),
        "version": fields.String(description="API version", example="2.0.0"),
    },
)

error_model = api.model(
    "Error",
    {
        "error": fields.String(
            description="Error message", example="Product not found"
        ),
        "code": fields.Integer(description="Error code", example=404),
        "timestamp": fields.String(description="Error timestamp"),
        "version": fields.String(description="API version"),
    },
)

health_model = api.model(
    "Health",
    {
        "status": fields.String(description="Health status", example="healthy"),
        "version": fields.String(description="API version", example="2.0.0"),
        "database_status": fields.String(
            description="Database status", example="connected"
        ),
        "timestamp": fields.String(description="Response timestamp"),
        "environment": fields.String(description="Environment", example="development"),
    },
)

# Create namespaces for better organization
health_ns = Namespace("health", description="Health check operations")
products_ns = Namespace("products", description="Product management operations")
admin_ns = Namespace("admin", description="Administrative operations")

api.add_namespace(health_ns)
api.add_namespace(products_ns)
api.add_namespace(admin_ns)


# Health endpoints
@health_ns.route("/")
class HealthCheck(Resource):
    @health_ns.doc("get_health_status")
    @health_ns.marshal_with(health_model)
    def get(self):
        """Get API health status"""
        try:
            # Test database connectivity
            db_status = "connected"
            try:
                firebase.db.collection("health_check").limit(1).get()
            except Exception:
                db_status = "disconnected"

            return {
                "status": "healthy",
                "version": "2.0.0",
                "database_status": db_status,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "environment": os.getenv("FLASK_ENV", "production"),
            }
        except Exception as e:
            api.abort(503, f"Health check failed: {str(e)}")


# Product endpoints
@products_ns.route("/")
class ProductList(Resource):
    @products_ns.doc("get_all_products")
    @products_ns.marshal_with(product_list_model)
    @products_ns.param("page", "Page number", type=int, default=1)
    @products_ns.param("limit", "Items per page", type=int, default=20)
    @products_ns.param("category", "Filter by category", type=str)
    @products_ns.param(
        "sort_by", "Sort by field", type=str, enum=["name", "price", "created_at"]
    )
    @products_ns.param("sort_order", "Sort order", type=str, enum=["asc", "desc"])
    @products_ns.param("in_stock_only", "Show only in-stock products", type=bool)
    def get(self):
        """Get all products with filtering and pagination"""
        try:
            # Get query parameters
            page = request.args.get("page", 1, type=int)
            limit = request.args.get("limit", 20, type=int)
            category = request.args.get("category")
            sort_by = request.args.get("sort_by", "name")
            sort_order = request.args.get("sort_order", "asc")
            in_stock_only = request.args.get("in_stock_only", False, type=bool)

            # Validate parameters
            if page < 1 or limit < 1 or limit > 100:
                api.abort(400, "Invalid pagination parameters")

            if sort_by not in ["name", "price", "created_at"]:
                sort_by = "name"

            if sort_order not in ["asc", "desc"]:
                sort_order = "asc"

            # Get products from database
            products = firebase.get_all_documents("products")

            # Apply filters
            if category:
                products = [
                    p
                    for p in products
                    if p.get("category", "").lower() == category.lower()
                ]

            if in_stock_only:
                products = [p for p in products if p.get("in_stock", False)]

            # Sort products
            reverse = sort_order == "desc"
            if sort_by == "price":
                products = sorted(
                    products, key=lambda x: x.get("price", 0), reverse=reverse
                )
            elif sort_by == "created_at":
                products = sorted(
                    products, key=lambda x: x.get("created_at", ""), reverse=reverse
                )
            else:
                products = sorted(
                    products, key=lambda x: x.get("name", ""), reverse=reverse
                )

            # Pagination
            total_items = len(products)
            total_pages = (total_items + limit - 1) // limit
            start_idx = (page - 1) * limit
            end_idx = start_idx + limit
            paginated_products = products[start_idx:end_idx]

            return {
                "products": paginated_products,
                "pagination": {
                    "page": page,
                    "limit": limit,
                    "total_pages": total_pages,
                    "total_items": total_items,
                    "has_next": page < total_pages,
                    "has_prev": page > 1,
                },
                "filters": {
                    "category": category,
                    "sort_by": sort_by,
                    "sort_order": sort_order,
                    "in_stock_only": in_stock_only,
                },
                "version": "2.0.0",
            }

        except Exception as e:
            api.abort(500, f"Failed to retrieve products: {str(e)}")

    @products_ns.doc("create_product")
    @products_ns.expect(product_input_model)
    @products_ns.marshal_with(product_model, code=201)
    def post(self):
        """Create a new product"""
        try:
            data = request.json

            # Validate required fields
            if not data.get("name") or not data.get("price"):
                api.abort(400, "Name and price are required")

            # Add timestamps
            data["created_at"] = datetime.now(timezone.utc).isoformat()
            data["updated_at"] = datetime.now(timezone.utc).isoformat()

            # Create product
            result = firebase.create_document("products", data)

            if isinstance(result, dict):
                return result, 201
            else:
                # Get the created product
                product = firebase.get_document("products", result)
                return product, 201

        except Exception as e:
            api.abort(500, f"Failed to create product: {str(e)}")


@products_ns.route("/<string:product_id>")
class Product(Resource):
    @products_ns.doc("get_product")
    @products_ns.marshal_with(product_model)
    def get(self, product_id):
        """Get a specific product by ID"""
        try:
            product = firebase.get_document("products", product_id)
            if not product:
                api.abort(404, "Product not found")
            return product
        except Exception as e:
            api.abort(500, f"Failed to retrieve product: {str(e)}")

    @products_ns.doc("update_product")
    @products_ns.expect(product_update_model)
    @products_ns.marshal_with(product_model)
    def put(self, product_id):
        """Update a specific product"""
        try:
            # Check if product exists
            existing_product = firebase.get_document("products", product_id)
            if not existing_product:
                api.abort(404, "Product not found")

            data = request.json
            data["updated_at"] = datetime.now(timezone.utc).isoformat()

            # Update product
            firebase.update_document("products", product_id, data)

            # Return updated product
            updated_product = firebase.get_document("products", product_id)
            return updated_product

        except Exception as e:
            api.abort(500, f"Failed to update product: {str(e)}")

    @products_ns.doc("delete_product")
    def delete(self, product_id):
        """Delete a specific product"""
        try:
            # Check if product exists
            existing_product = firebase.get_document("products", product_id)
            if not existing_product:
                api.abort(404, "Product not found")

            # Delete product
            firebase.delete_document("products", product_id)

            return {"message": "Product deleted successfully"}, 204

        except Exception as e:
            api.abort(500, f"Failed to delete product: {str(e)}")


@products_ns.route("/search")
class ProductSearch(Resource):
    @products_ns.doc("search_products")
    @products_ns.param("query", "Search query", required=True)
    @products_ns.param("limit", "Maximum results", type=int, default=50)
    @products_ns.marshal_with(product_list_model)
    def get(self):
        """Search products by name, description, or category"""
        try:
            query = request.args.get("query", "").strip()
            limit = request.args.get("limit", 50, type=int)

            if not query:
                api.abort(400, "Search query is required")

            if limit > 100:
                limit = 100

            # Get all products
            products = firebase.get_all_documents("products")

            # Simple text search
            matching_products = []
            for product in products:
                if (
                    query.lower() in product.get("name", "").lower()
                    or query.lower() in product.get("description", "").lower()
                    or query.lower() in product.get("category", "").lower()
                ):
                    matching_products.append(product)

                if len(matching_products) >= limit:
                    break

            return {
                "products": matching_products,
                "pagination": {
                    "page": 1,
                    "limit": limit,
                    "total_pages": 1,
                    "total_items": len(matching_products),
                    "has_next": False,
                    "has_prev": False,
                },
                "filters": {"query": query, "limit": limit},
                "version": "2.0.0",
            }

        except Exception as e:
            api.abort(500, f"Search failed: {str(e)}")


# Admin endpoints
@admin_ns.route("/stats")
class AdminStats(Resource):
    @admin_ns.doc("get_admin_stats")
    def get(self):
        """Get administrative statistics"""
        try:
            products = firebase.get_all_documents("products")

            # Calculate statistics
            total_products = len(products)
            in_stock_products = len([p for p in products if p.get("in_stock", False)])
            categories = list(set(p.get("category", "Unknown") for p in products))

            return {
                "total_products": total_products,
                "in_stock_products": in_stock_products,
                "out_of_stock_products": total_products - in_stock_products,
                "categories": categories,
                "total_categories": len(categories),
                "timestamp": datetime.now(timezone.utc).isoformat(),
            }

        except Exception as e:
            api.abort(500, f"Failed to get statistics: {str(e)}")


# Error handlers
@api.errorhandler
def default_error_handler(e):
    """Default error handler"""
    return {
        "error": str(e),
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "version": "2.0.0",
    }, getattr(e, "code", 500)


if __name__ == "__main__":
    print("🚀 Starting RetailGenie API with Swagger Documentation")
    print("API Documentation: http://localhost:5002/docs/")
    print("API Base URL: http://localhost:5002/api/")

    app.run(host="0.0.0.0", port=5002, debug=True)
