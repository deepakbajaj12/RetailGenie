#!/usr/bin/env python3
"""
RetailGenie WebSocket Application
Real-time features with Flask-SocketIO
"""

import json
import os
import sys
import time
from datetime import datetime, timezone

from flask import Flask, request
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room, leave_room, rooms

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

# Initialize SocketIO with CORS support
socketio = SocketIO(
    app,
    cors_allowed_origins="*",
    logger=True,
    engineio_logger=True,
    async_mode="threading",
)

# Initialize Firebase
firebase = FirebaseUtils()

# Connected users tracking
connected_users = {}
active_rooms = {
    "general": set(),
    "admin": set(),
    "notifications": set(),
    "inventory_updates": set(),
}


# WebSocket event handlers
@socketio.on("connect")
def handle_connect(auth):
    """Handle client connection"""
    client_id = request.sid
    user_info = {
        "client_id": client_id,
        "connected_at": datetime.now(timezone.utc).isoformat(),
        "ip_address": request.environ.get(
            "HTTP_X_FORWARDED_FOR", request.environ.get("REMOTE_ADDR")
        ),
        "user_agent": request.headers.get("User-Agent", "Unknown"),
    }

    connected_users[client_id] = user_info

    print(f"🔌 Client connected: {client_id}")

    # Send welcome message
    emit(
        "response",
        {
            "type": "welcome",
            "message": "Connected to RetailGenie WebSocket",
            "client_id": client_id,
            "server_time": datetime.now(timezone.utc).isoformat(),
            "available_rooms": list(active_rooms.keys()),
        },
    )

    # Notify other clients
    emit(
        "user_connected",
        {
            "client_id": client_id,
            "timestamp": user_info["connected_at"],
            "total_users": len(connected_users),
        },
        broadcast=True,
        include_self=False,
    )


@socketio.on("disconnect")
def handle_disconnect():
    """Handle client disconnection"""
    client_id = request.sid

    if client_id in connected_users:
        user_info = connected_users.pop(client_id)
        print(f"🔌 Client disconnected: {client_id}")

        # Remove from all rooms
        for room_name, room_users in active_rooms.items():
            if client_id in room_users:
                room_users.remove(client_id)

        # Notify other clients
        emit(
            "user_disconnected",
            {
                "client_id": client_id,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "total_users": len(connected_users),
            },
            broadcast=True,
        )


@socketio.on("join_room")
def handle_join_room(data):
    """Handle room joining"""
    client_id = request.sid
    room_name = data.get("room", "general")

    if room_name not in active_rooms:
        emit(
            "error",
            {
                "message": f'Room "{room_name}" does not exist',
                "available_rooms": list(active_rooms.keys()),
            },
        )
        return

    join_room(room_name)
    active_rooms[room_name].add(client_id)

    print(f"🏠 Client {client_id} joined room: {room_name}")

    emit(
        "room_joined",
        {
            "room": room_name,
            "message": f"Joined room: {room_name}",
            "room_users": len(active_rooms[room_name]),
        },
    )

    # Notify others in the room
    emit(
        "user_joined_room",
        {
            "client_id": client_id,
            "room": room_name,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "room_users": len(active_rooms[room_name]),
        },
        room=room_name,
        include_self=False,
    )


@socketio.on("leave_room")
def handle_leave_room(data):
    """Handle room leaving"""
    client_id = request.sid
    room_name = data.get("room", "general")

    if room_name in active_rooms and client_id in active_rooms[room_name]:
        leave_room(room_name)
        active_rooms[room_name].remove(client_id)

        print(f"🏠 Client {client_id} left room: {room_name}")

        emit("room_left", {"room": room_name, "message": f"Left room: {room_name}"})

        # Notify others in the room
        emit(
            "user_left_room",
            {
                "client_id": client_id,
                "room": room_name,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "room_users": len(active_rooms[room_name]),
            },
            room=room_name,
        )


@socketio.on("send_message")
def handle_message(data):
    """Handle chat messages"""
    client_id = request.sid
    room_name = data.get("room", "general")
    message = data.get("message", "")
    message_type = data.get("type", "chat")

    if not message.strip():
        emit("error", {"message": "Message cannot be empty"})
        return

    message_data = {
        "client_id": client_id,
        "room": room_name,
        "message": message,
        "type": message_type,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }

    print(f"💬 Message in {room_name} from {client_id}: {message}")

    # Broadcast message to room
    emit("message_received", message_data, room=room_name)


@socketio.on("product_update")
def handle_product_update(data):
    """Handle real-time product updates"""
    client_id = request.sid
    product_data = data.get("product", {})
    update_type = data.get("type", "update")  # create, update, delete

    try:
        # Process product update
        if update_type == "create":
            # Create new product
            result = firebase.create_document("products", product_data)
            product_id = result.get("id") if isinstance(result, dict) else result
        elif update_type == "update":
            # Update existing product
            product_id = product_data.get("id")
            if product_id:
                firebase.update_document("products", product_id, product_data)
            else:
                raise ValueError("Product ID required for update")
        elif update_type == "delete":
            # Delete product
            product_id = product_data.get("id")
            if product_id:
                firebase.delete_document("products", product_id)
            else:
                raise ValueError("Product ID required for deletion")

        # Broadcast update to inventory_updates room
        update_notification = {
            "type": update_type,
            "product": product_data,
            "updated_by": client_id,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }

        emit("product_updated", update_notification, room="inventory_updates")

        # Confirm to sender
        emit(
            "product_update_confirmed",
            {
                "status": "success",
                "type": update_type,
                "product_id": product_id,
                "message": f"Product {update_type} successful",
            },
        )

        print(
            f"📦 Product {update_type} by {client_id}: {product_data.get('name', 'Unknown')}"
        )

    except Exception as e:
        print(f"❌ Product update failed: {str(e)}")
        emit(
            "error",
            {
                "message": f"Product {update_type} failed: {str(e)}",
                "type": "product_update_error",
            },
        )


@socketio.on("request_live_data")
def handle_live_data_request(data):
    """Handle requests for live data updates"""
    client_id = request.sid
    data_type = data.get("type", "products")

    try:
        if data_type == "products":
            # Get latest products
            products = firebase.get_all_documents("products")
            emit(
                "live_data_update",
                {
                    "type": "products",
                    "data": products[:10],  # Send first 10 products
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                    "total_count": len(products),
                },
            )

        elif data_type == "stats":
            # Get system statistics
            products = firebase.get_all_documents("products")
            stats = {
                "total_products": len(products),
                "connected_users": len(connected_users),
                "active_rooms": {
                    room: len(users) for room, users in active_rooms.items()
                },
                "timestamp": datetime.now(timezone.utc).isoformat(),
            }
            emit(
                "live_data_update",
                {
                    "type": "stats",
                    "data": stats,
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                },
            )

        print(f"📊 Live data ({data_type}) sent to {client_id}")

    except Exception as e:
        print(f"❌ Live data request failed: {str(e)}")
        emit(
            "error",
            {
                "message": f"Failed to get live data: {str(e)}",
                "type": "live_data_error",
            },
        )


@socketio.on("ping")
def handle_ping():
    """Handle ping requests for connection testing"""
    emit(
        "pong",
        {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "message": "Connection is alive",
        },
    )


# Background task for periodic updates
def background_thread():
    """Send periodic updates to connected clients"""
    while True:
        socketio.sleep(30)  # Wait 30 seconds

        if connected_users:
            # Send periodic stats update
            stats = {
                "connected_users": len(connected_users),
                "active_rooms": {
                    room: len(users) for room, users in active_rooms.items()
                },
                "server_time": datetime.now(timezone.utc).isoformat(),
                "uptime": time.time(),
            }

            socketio.emit(
                "periodic_update",
                {"type": "server_stats", "data": stats},
                room="notifications",
            )


# REST API endpoints for WebSocket integration
@app.route("/")
def home():
    """WebSocket application info"""
    return {
        "message": "RetailGenie WebSocket Server",
        "version": "1.0.0",
        "websocket_url": "/socket.io",
        "connected_users": len(connected_users),
        "active_rooms": list(active_rooms.keys()),
        "features": [
            "Real-time messaging",
            "Product updates",
            "Live data streaming",
            "Room-based communication",
        ],
    }


@app.route("/ws-stats")
def websocket_stats():
    """Get WebSocket server statistics"""
    return {
        "connected_users": len(connected_users),
        "active_rooms": {room: len(users) for room, users in active_rooms.items()},
        "total_rooms": len(active_rooms),
        "server_time": datetime.now(timezone.utc).isoformat(),
    }


@app.route("/broadcast/<room_name>", methods=["POST"])
def broadcast_message(room_name):
    """Broadcast message to a specific room"""
    try:
        data = request.get_json()
        message = data.get("message", "")
        message_type = data.get("type", "system")

        if room_name not in active_rooms:
            return {"error": f'Room "{room_name}" does not exist'}, 404

        broadcast_data = {
            "type": message_type,
            "message": message,
            "room": room_name,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "source": "api",
        }

        socketio.emit("broadcast_message", broadcast_data, room=room_name)

        return {
            "status": "success",
            "message": f"Message broadcasted to room: {room_name}",
            "recipients": len(active_rooms[room_name]),
        }

    except Exception as e:
        return {"error": str(e)}, 500


# Start background thread
@socketio.on("connect")
def start_background_task():
    """Start background task on first connection"""
    global thread
    if not hasattr(start_background_task, "thread"):
        start_background_task.thread = socketio.start_background_task(background_thread)


if __name__ == "__main__":
    print("🚀 Starting RetailGenie WebSocket Server")
    print("Available rooms:", list(active_rooms.keys()))
    print("WebSocket URL: http://localhost:5001")

    socketio.run(app, host="0.0.0.0", port=5001, debug=True, allow_unsafe_werkzeug=True)
