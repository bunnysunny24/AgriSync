import joblib
import numpy as np
import pandas as pd
from datetime import datetime

# Define models
models = {
    "banana": "models/banana_model.pkl",
    "onion": "models/onion_model.pkl",
    "tomato": "models/tomato_model.pkl",
    "wheat": "models/wheat_model.pkl",
    "carrot": "models/carrot_model.pkl"
}

def predict_price(crop, arrivals, min_price, max_price):
    try:
        # Load model
        model = joblib.load(models[crop])

        # Compute extra features
        price_range = max_price - min_price
        demand_indicator = arrivals / (min_price + 1)

        # ✅ Get latest processed data to calculate "Days"
        data = pd.read_csv(f"processed_data/{crop}_processed.csv")
        latest_date = pd.to_datetime(data["Reported Date"]).max()
        today_date = pd.to_datetime(datetime.today().strftime("%Y-%m-%d"))
        days_since_start = (today_date - latest_date).days  # Calculate "Days"

        # Define feature names (Must match training)
        feature_names = ["Days", "Arrivals (Tonnes)", "Min Price (Rs./Quintal)", "Max Price (Rs./Quintal)", "Price Range", "Demand Indicator"]

        # Convert input to DataFrame
        input_data = pd.DataFrame([[days_since_start, arrivals, min_price, max_price, price_range, demand_indicator]], columns=feature_names)

        # Predict
        predicted_price = model.predict(input_data)[0]  # Rs. per Quintal (100 Kg)

        # ✅ Convert Prices
        if crop == "banana":
            price_per_dozen = (predicted_price / 100) * 1.5  # Approx 1.5 kg per dozen bananas
            return f"{predicted_price} Rs./Quintal ({price_per_dozen:.2f} Rs./Dozen)"
        else:
            price_per_kg = predicted_price / 100  # Convert Rs./Quintal to Rs./Kg
            return f"{predicted_price} Rs./Quintal ({price_per_kg:.2f} Rs./Kg)"

    except Exception as e:
        return f"❌ Error: {e}"

# Example Predictions
for crop in models.keys():
    pred = predict_price(crop, arrivals=100, min_price=2000, max_price=2500)
    print(f"Predicted Price for {crop.capitalize()}: {pred}")
