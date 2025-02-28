from fastapi import FastAPI
import joblib
import numpy as np

# Load trained model
try:
    model = joblib.load("models/crop_demand_model.pkl")
    print("✅ Model loaded successfully!")
except Exception as e:
    print(f"❌ Error loading model: {e}")

# Initialize FastAPI app
app = FastAPI()

@app.get("/")
def home():
    return {"message": "Crop Demand Prediction API is running!"}

@app.get("/predict/")
def predict(arrivals: float, min_price: float, max_price: float):
    try:
        price_range = max_price - min_price
        demand_indicator = arrivals / (min_price + 1)
        input_data = np.array([[arrivals, min_price, max_price, price_range, demand_indicator]])

        predicted_price = model.predict(input_data)
        return {"predicted_modal_price": predicted_price[0]}
    except Exception as e:
        return {"error": str(e)}

# Run with: uvicorn scripts.api:app --reload
