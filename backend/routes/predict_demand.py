from flask import Blueprint, request, jsonify
import numpy as np
from sklearn.preprocessing import MinMaxScaler
import joblib
import os
from utils.firebase_utils import FirebaseUtils
from datetime import datetime

predict_demand_bp = Blueprint('predict_demand', __name__)

# Load model and scaler from absolute paths
model_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'ml_models', 'demand_model.h5'))
scaler_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'ml_models', 'scaler.save'))

# Initialize variables
model = None
scaler = None

try:
    from tensorflow.keras.models import load_model
    if os.path.exists(model_path):
        model = load_model(model_path)
    else:
        print(f"Warning: Model file not found at {model_path}")
except ImportError:
    print("TensorFlow not installed. ML features will be disabled/mocked.")
except Exception as e:
    print(f"Error loading TensorFlow model: {e}")

try:
    if os.path.exists(scaler_path):
        scaler = joblib.load(scaler_path)
    else:
        print(f"Warning: Scaler file not found at {scaler_path}")
except Exception as e:
    print(f"Error loading scaler: {e}")

firebase = FirebaseUtils()

@predict_demand_bp.route('/predict-demand', methods=['POST'])
def predict_demand():
    data = request.get_json()

    if not data or 'last_10_days' not in data or len(data['last_10_days']) != 10:
        return jsonify({'error': 'Invalid input. Provide 10 numbers under "last_10_days".'}), 400

    try:
        # Fallback logic if model is missing
        if model is None or scaler is None:
            # Simple heuristic: Average of last 10 days + 10% buffer
            last_10_days = data['last_10_days']
            avg_demand = sum(last_10_days) / len(last_10_days)
            predicted_value = round(avg_demand * 1.1, 2) # Mock logic
            safe_value = max(predicted_value, 0)
            
            # Log to Firebase (keep this as it's useful)
            firebase.log_prediction({
                "input": data['last_10_days'],
                "predicted_value": safe_value,
                "timestamp": datetime.now().isoformat(),
                "method": "heuristic_fallback"
            })
            
            return jsonify({
                'predicted_demand': safe_value, 
                'note': 'Prediction generated using heuristic fallback (ML model unavailable)'
            }), 200

        last_10_days = np.array(data['last_10_days']).reshape(-1, 1)
        scaled_data = scaler.transform(last_10_days)
        input_data = np.reshape(scaled_data, (1, 10, 1))

        predicted_scaled = model.predict(input_data)
        predicted_demand = scaler.inverse_transform(predicted_scaled)

        predicted_value = round(float(predicted_demand[0][0]), 2)
        safe_value = max(predicted_value, 0)

        # Log to Firebase
        firebase.log_prediction({
            "input": data['last_10_days'],
            "predicted_value": safe_value,
            "timestamp": datetime.now().isoformat()
        })

        return jsonify({'predicted_demand': safe_value}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500