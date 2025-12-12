from flask import Blueprint, jsonify
import random
from datetime import datetime, timedelta

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/api/analytics/dashboard', methods=['GET'])
def get_dashboard_data():
    # Mock data for the dashboard
    
    # 1. Sales Chart Data (Last 7 days)
    today = datetime.now()
    sales_data = []
    for i in range(6, -1, -1):
        date = today - timedelta(days=i)
        sales_data.append({
            "date": date.strftime("%a"), # Mon, Tue, etc.
            "revenue": random.randint(1000, 5000),
            "orders": random.randint(10, 50)
        })

    # 2. Summary Stats
    stats = {
        "total_revenue": sum(d["revenue"] for d in sales_data),
        "total_orders": sum(d["orders"] for d in sales_data),
        "active_products": 124, # Mock count
        "low_stock_count": 5
    }

    # 3. Low Stock Items (Mock)
    low_stock_items = [
        {"id": "1", "name": "Wireless Headphones", "stock": 2, "category": "Electronics", "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"},
        {"id": "2", "name": "Coffee Beans", "stock": 0, "category": "Food", "image_url": "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&q=80"},
        {"id": "3", "name": "Yoga Mat", "stock": 3, "category": "Fitness", "image_url": "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80"},
        {"id": "4", "name": "Smart Watch", "stock": 1, "category": "Electronics", "image_url": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80"},
        {"id": "5", "name": "Water Bottle", "stock": 4, "category": "Fitness", "image_url": "https://images.unsplash.com/photo-1602143407151-011141959845?w=800&q=80"}
    ]

    return jsonify({
        "sales_chart": sales_data,
        "stats": stats,
        "low_stock_items": low_stock_items
    })
