import joblib
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from datetime import datetime, timedelta

# Define models
models = {
    "banana": "models/banana_model.pkl",
    "onion": "models/onion_model.pkl",
    "tomato": "models/tomato_model.pkl",
    "wheat": "models/wheat_model.pkl",
    "carrot": "models/carrot_model.pkl"
}

def predict_future_prices(crop, days_ahead=30):
    try:
        # Load model
        model = joblib.load(models[crop])

        # Load processed data
        data = pd.read_csv(f"processed_data/{crop}_processed.csv")
        data["Reported Date"] = pd.to_datetime(data["Reported Date"])  # Convert to datetime
        
        # Handle missing dates
        if data["Reported Date"].isna().all():
            print(f"⚠️ Warning: No valid dates found for {crop}. Skipping prediction.")
            return None

        last_date = data["Reported Date"].dropna().max()

        # Ensure valid last date
        if pd.isna(last_date):
            print(f"⚠️ Warning: No valid last date for {crop}. Skipping prediction.")
            return None

        last_day_num = (last_date - data["Reported Date"].min()).days

        # ✅ Generate valid future dates (Fix NaT issue)
        future_dates = pd.date_range(start=last_date + timedelta(days=1), periods=days_ahead, freq='D')
        future_days = np.array([last_day_num + i for i in range(1, days_ahead + 1)])

        # Use median values for other features
        arrivals_median = data["Arrivals (Tonnes)"].median()
        min_price_median = data["Min Price (Rs./Quintal)"].median()
        max_price_median = data["Max Price (Rs./Quintal)"].median()
        price_range_median = max_price_median - min_price_median
        demand_indicator_median = arrivals_median / (min_price_median + 1)

        # Prepare input data
        feature_names = ["Days", "Arrivals (Tonnes)", "Min Price (Rs./Quintal)", "Max Price (Rs./Quintal)", "Price Range", "Demand Indicator"]
        input_data = pd.DataFrame({
            "Days": future_days,
            "Arrivals (Tonnes)": [arrivals_median] * days_ahead,
            "Min Price (Rs./Quintal)": [min_price_median] * days_ahead,
            "Max Price (Rs./Quintal)": [max_price_median] * days_ahead,
            "Price Range": [price_range_median] * days_ahead,
            "Demand Indicator": [demand_indicator_median] * days_ahead
        }, columns=feature_names)

        # Predict future prices
        predicted_prices = model.predict(input_data)

        # Plot past & future prices
        plt.figure(figsize=(10, 5))
        
        # Plot historical prices
        plt.plot(data["Reported Date"], data["Modal Price (Rs./Quintal)"], label="Historical Prices", marker="o")
        
        # Plot predicted future prices
        plt.plot(future_dates, predicted_prices, label="Predicted Prices", linestyle="dashed", marker="x", color="red")

        # Graph settings
        plt.xlabel("Date")
        plt.ylabel("Modal Price (Rs./Quintal)")
        plt.title(f"Predicted Price Trends for {crop.capitalize()}")
        plt.legend()
        plt.xticks(rotation=45)
        plt.grid(True)
        plt.show()

        return predicted_prices

    except Exception as e:
        print(f"❌ Error predicting future prices for {crop}: {e}")
        return None

# Example: Predict future prices for all crops
for crop in models.keys():
    print(f"📊 Predicting future prices for {crop}...")
    predict_future_prices(crop, days_ahead=30)
