# Inventory Demand API

This project provides a Flask API for predicting inventory demand using a pre-trained LSTM model. The API includes an endpoint that accepts the last 10 days of inventory demand data and returns the predicted demand for the next day.

## Project Structure

```
inventory-demand-api
├── src
│   ├── predict_demand.py       # Flask blueprint for demand prediction
│   └── utils
│       └── model_loader.py      # Utility functions for loading models
├── requirements.txt             # Project dependencies
└── README.md                    # Project documentation
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd inventory-demand-api
   ```

2. Install the required packages:
   ```
   pip install -r requirements.txt
   ```

## Usage

1. Start the Flask API:
   ```
   python -m flask run
   ```

2. Send a POST request to the `/predict-demand` endpoint with the last 10 days of inventory demand data in JSON format. The expected format is:
   ```json
   {
       "last_10_days": [value1, value2, value3, value4, value5, value6, value7, value8, value9, value10]
   }
   ```

3. The API will respond with the predicted inventory demand for the next day in JSON format:
   ```json
   {
       "predicted_demand": value
   }
   ```

## License

This project is licensed under the MIT License.