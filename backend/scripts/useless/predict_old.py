import joblib
import numpy as np
import pandas as pd

# Load trained model
model = joblib.load("models/crop_demand_model.pkl")

def predict_demand(arrivals, min_price, max_price):
    price_range = max_price - min_price
    demand_indicator = arrivals / (min_price + 1)  # Avoid division by zero

    # Define feature names exactly as in training
    feature_names = ["Arrivals (Tonnes)", "Min Price (Rs./Quintal)", "Max Price (Rs./Quintal)", "Price Range", "Demand Indicator"]
    
    # Convert input to a DataFrame with correct feature names
    input_data = pd.DataFrame([[arrivals, min_price, max_price, price_range, demand_indicator]], columns=feature_names)

    # Make prediction
    predicted_price = model.predict(input_data)
    return predicted_price[0]

# Example Usage
if __name__ == "__main__":
    predicted_value = predict_demand(arrivals=100, min_price=2000, max_price=2500)
    print(f"Predicted Modal Price: {predicted_value}")
