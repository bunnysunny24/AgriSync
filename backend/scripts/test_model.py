import joblib
import numpy as np
import pandas as pd

# Load model
model = joblib.load("models/crop_demand_model.pkl")

# Define test cases
test_cases = [
    (150, 1800, 2200),
    (100, 2000, 2500),
    (200, 1500, 1800)
]

# Feature names (same as in training)
feature_names = ["Arrivals (Tonnes)", "Min Price (Rs./Quintal)", "Max Price (Rs./Quintal)", "Price Range", "Demand Indicator"]

# Run predictions
for test in test_cases:
    arrivals, min_price, max_price = test
    price_range = max_price - min_price
    demand_indicator = arrivals / (min_price + 1)

    # Convert input into a DataFrame with feature names
    input_data = pd.DataFrame([[arrivals, min_price, max_price, price_range, demand_indicator]], columns=feature_names)

    # Predict price
    predicted_price = model.predict(input_data)
    print(f"Test Input: {test} → Predicted Modal Price: {predicted_price[0]}")
