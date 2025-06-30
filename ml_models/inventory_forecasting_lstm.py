import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
import joblib
import os

# 📊 1. Generate Dummy Inventory Demand Data (simulate 100 days)
np.random.seed(42)
data = np.random.randint(50, 200, size=(100,))
df = pd.DataFrame(data, columns=['demand'])

# 📏 2. Scale data between 0 and 1
scaler = MinMaxScaler()
scaled_data = scaler.fit_transform(df)

# 💾 Save the scaler for API use
scaler_path = os.path.join(os.path.dirname(__file__), 'scaler.save')
joblib.dump(scaler, scaler_path)
print(f"✅ Scaler saved as {scaler_path}")

# 🪄 3. Create sequences (last 10 days to predict next day)
X = []
y = []
window_size = 10

for i in range(window_size, len(scaled_data)):
    X.append(scaled_data[i - window_size:i, 0])
    y.append(scaled_data[i, 0])

X, y = np.array(X), np.array(y)

# 🤖 4. Reshape for LSTM input: (samples, time_steps, features)
X = np.reshape(X, (X.shape[0], X.shape[1], 1))

# 🏗️ 5. Build LSTM model
model = Sequential()
model.add(LSTM(50, return_sequences=False, input_shape=(X.shape[1], 1)))
model.add(Dense(1))

model.compile(optimizer='adam', loss='mean_squared_error')
model.fit(X, y, epochs=30, batch_size=8)
model_path = os.path.join(os.path.dirname(__file__), 'demand_model.h5')
model.save(model_path)
print(f"✅ Model saved as {model_path}")

# 🔮 6. Predict next day demand
last_10_days = scaled_data[-window_size:]
input_data = np.reshape(last_10_days, (1, window_size, 1))
predicted_scaled = model.predict(input_data)
predicted_demand = scaler.inverse_transform(predicted_scaled)

print(f"📦 Predicted inventory demand for next day: {predicted_demand[0][0]:.2f} units")

# 📉 7. Plot actual vs. predicted (for last few days)
predicted_all = model.predict(X)
actual_demand = scaler.inverse_transform(y.reshape(-1, 1))
predicted_demand_all = scaler.inverse_transform(predicted_all)

plt.plot(actual_demand, label='Actual Demand')
plt.plot(predicted_demand_all, label='Predicted Demand')
plt.title('Inventory Demand Forecasting')
plt.xlabel('Days')
plt.ylabel('Demand')
plt.legend()
plt.grid(True)
plt.show()