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

        # ✅ Ensure dates are sorted
        data = data.sort_values("Reported Date")

        # Handle missing dates
        if data["Reported Date"].isna().all():
            print(f"⚠️ Warning: No valid dates found for {crop}. Skipping prediction.")
            return None

        last_date = data["Reported Date"].dropna().max()
        first_date = data["Reported Date"].min()

        # Ensure valid last date
        if pd.isna(last_date):
            print(f"⚠️ Warning: No valid last date for {crop}. Skipping prediction.")
            return None

        last_day_num = (last_date - first_date).days

        # ✅ Generate future dates correctly
        future_dates = [last_date + timedelta(days=i) for i in range(1, days_ahead + 1)]
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

        # ✅ Convert predicted prices to Rs./Kg (except Banana which is Rs./Dozen)
        if crop == "banana":
            predicted_prices_converted = (predicted_prices / 100) * 1.5  # Approx 1.5 kg per dozen bananas
            price_unit = "Rs./Dozen"
        else:
            predicted_prices_converted = predicted_prices / 100  # Convert Rs./Quintal to Rs./Kg
            price_unit = "Rs./Kg"

        # ✅ Check if lengths match before plotting
        if len(future_dates) != len(predicted_prices_converted):
            print(f"⚠️ Warning: Mismatch in future dates and predictions for {crop}. Skipping plot.")
            return None

        # Plot past & future prices
        plt.figure(figsize=(10, 5))

        # Plot historical prices
        plt.plot(data["Reported Date"], data["Modal Price (Rs./Quintal)"] / 100, label="Historical Prices (Rs./Kg)", marker="o")

        # Plot predicted future prices
        plt.plot(future_dates, predicted_prices_converted, label=f"Predicted Prices ({price_unit})", linestyle="dashed", marker="x", color="red")

        # Graph settings
        plt.xlabel("Date")
        plt.ylabel(price_unit)
        plt.title(f"Predicted Price Trends for {crop.capitalize()}")
        plt.legend()
        plt.xticks(rotation=45)
        plt.grid(True)
        plt.show()

        return predicted_prices_converted

    except Exception as e:
        print(f"❌ Error predicting future prices for {crop}: {e}")
        return None

# Example: Predict future prices for all crops
for crop in models.keys():
    print(f"📊 Predicting future prices for {crop}...")
    predict_future_prices(crop, days_ahead=30)
