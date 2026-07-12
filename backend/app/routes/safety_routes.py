from flask import Blueprint, jsonify, request
import logging
import random
from datetime import datetime, timezone

logger = logging.getLogger(__name__)
safety_bp = Blueprint("safety", __name__)


@safety_bp.route("/biometric-verify", methods=["POST"])
def biometric_verify():
    """Verify facial or palm biometric checkout"""
    try:
        data = request.get_json(silent=True) or {}
        bio_type = data.get("type", "face")

        # Simple simulated biometric verification
        confidence = round(random.uniform(0.92, 0.99), 4)
        verified = True

        return (
            jsonify(
                {
                    "verified": verified,
                    "userId": "usr_dev_12345",
                    "confidence": confidence,
                    "message": f"Biometric {bio_type} verification successful",
                }
            ),
            200,
        )
    except Exception as e:
        logger.error(f"Biometric verify error: {str(e)}")
        return jsonify({"error": "Biometric verification failed"}), 500


@safety_bp.route("/sentiment", methods=["GET"])
def get_sentiment():
    """Get real-time store sentiment metrics"""
    try:
        score = round(random.uniform(0.1, 0.8), 2)
        moods = ["Happy", "Neutral", "Happy", "Happy", "Unhappy"]
        mood = random.choice(moods) if score > 0.3 else "Neutral"

        return (
            jsonify(
                {
                    "overall_score": score,
                    "mood": mood,
                    "active_shoppers": random.randint(15, 80),
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                }
            ),
            200,
        )
    except Exception as e:
        logger.error(f"Sentiment error: {str(e)}")
        return jsonify({"error": "Failed to retrieve store sentiment"}), 500


@safety_bp.route("/emergency", methods=["POST"])
def trigger_emergency():
    """Trigger emergency command/alert"""
    try:
        data = request.get_json(silent=True) or {}
        alert_type = data.get("type", "Other")
        location = data.get("location", "Store Floor")
        severity = data.get("severity", "Medium")

        alert_id = f"alert_{int(datetime.now(timezone.utc).timestamp())}"

        logger.warning(
            f"🚨 EMERGENCY ALERT TRIGGERED: Type={alert_type}, Location={location}, Severity={severity}"
        )

        return (
            jsonify(
                {
                    "status": "triggered",
                    "alert_id": alert_id,
                    "message": f"Emergency alert for {alert_type} in {location} dispatched successfully",
                }
            ),
            201,
        )
    except Exception as e:
        logger.error(f"Emergency dispatch error: {str(e)}")
        return jsonify({"error": "Failed to trigger emergency dispatch"}), 500


@safety_bp.route("/cold-chain", methods=["GET"])
def get_cold_chain():
    """Get cold chain temperature/sensor metrics"""
    try:
        metrics = [
            {
                "id": "CC-ZONE-A",
                "zone": "Frozen Food Aisles",
                "temperature": round(random.uniform(-22.0, -18.0), 1),
                "humidity": round(random.uniform(40.0, 50.0), 1),
                "status": "Normal",
                "last_updated": datetime.now(timezone.utc).isoformat(),
            },
            {
                "id": "CC-ZONE-B",
                "zone": "Dairy Walk-In Refrigerator",
                "temperature": round(random.uniform(2.0, 4.5), 1),
                "humidity": round(random.uniform(80.0, 90.0), 1),
                "status": "Normal",
                "last_updated": datetime.now(timezone.utc).isoformat(),
            },
            {
                "id": "CC-ZONE-C",
                "zone": "Produce Chilled Displays",
                "temperature": round(random.uniform(4.0, 8.0), 1),
                "humidity": round(random.uniform(85.0, 95.0), 1),
                "status": "Normal",
                "last_updated": datetime.now(timezone.utc).isoformat(),
            },
        ]
        return jsonify(metrics), 200
    except Exception as e:
        logger.error(f"Cold chain error: {str(e)}")
        return jsonify({"error": "Failed to retrieve cold chain metrics"}), 500


@safety_bp.route("/waste", methods=["GET"])
def get_waste():
    """Get smart waste system metrics"""
    try:
        metrics = [
            {
                "id": "BIN-001",
                "category": "Recyclable",
                "weight_kg": round(random.uniform(5.0, 15.0), 1),
                "fill_level": random.randint(20, 60),
                "location": "Main Entrance",
            },
            {
                "id": "BIN-002",
                "category": "Compost",
                "weight_kg": round(random.uniform(2.0, 10.0), 1),
                "fill_level": random.randint(10, 40),
                "location": "Deli/Cafe Seating",
            },
            {
                "id": "BIN-003",
                "category": "Landfill",
                "weight_kg": round(random.uniform(8.0, 25.0), 1),
                "fill_level": random.randint(30, 85),
                "location": "Back of Store",
            },
        ]
        return jsonify(metrics), 200
    except Exception as e:
        logger.error(f"Waste metrics error: {str(e)}")
        return jsonify({"error": "Failed to retrieve waste metrics"}), 500
