import joblib
import numpy as np
import pandas as pd
from datetime import datetime, timedelta

# Define models
models = {
    "banana": "models/banana_model.pkl",
    "onion": "models/onion_model.pkl",
    "tomato": "models/tomato_model.pkl",
    "wheat": "models/wheat_model.pkl",
    "carrot": "models/carrot_model.pkl"
}

def predict_price(crop, arrivals, min_price, max_price, days_ahead=35):
    try:
        print(f"\n📊 Predicting prices for {crop.capitalize()}...")

        # Load model
        model = joblib.load(models[crop])

        # Load processed data
        data = pd.read_csv(f"processed_data/{crop}_processed.csv")
        data["Reported Date"] = pd.to_datetime(data["Reported Date"])

        latest_date = data["Reported Date"].max()
        first_date = data["Reported Date"].min()
        last_day_num = (latest_date - first_date).days

        # ✅ Generate future dates
        future_dates = [latest_date + timedelta(days=i) for i in range(1, days_ahead + 1)]
        future_days = np.array([last_day_num + i for i in range(1, days_ahead + 1)])
        future_months = np.array([date.month for date in future_dates])

        # Use median values for other features
        arrivals_median = data["Arrivals (Tonnes)"].median()
        min_price_median = data["Min Price (Rs./Quintal)"].median()
        max_price_median = data["Max Price (Rs./Quintal)"].median()
        price_range_median = max_price_median - min_price_median
        demand_indicator_median = arrivals_median / (min_price_median + 1)

        # ✅ Use most recent rolling price and lag prices
        rolling_modal_price = data["Rolling_Modal_Price"].iloc[-1]
        lag_1_month = data["Lag_1_Month"].iloc[-1]
        lag_2_months = data["Lag_2_Months"].iloc[-1]
        price_change_rate = data["Price_Change_Rate"].iloc[-1]

        # Prepare input data
        feature_names = ["Days", "Month", "Arrivals (Tonnes)", "Min Price (Rs./Quintal)", "Max Price (Rs./Quintal)", 
                         "Price Range", "Demand Indicator", "Rolling_Modal_Price", "Lag_1_Month", "Lag_2_Months", "Price_Change_Rate"]

        input_data = pd.DataFrame({
            "Days": future_days,
            "Month": future_months,
            "Arrivals (Tonnes)": [arrivals_median] * days_ahead,
            "Min Price (Rs./Quintal)": [min_price_median] * days_ahead,
            "Max Price (Rs./Quintal)": [max_price_median] * days_ahead,
            "Price Range": [price_range_median] * days_ahead,
            "Demand Indicator": [demand_indicator_median] * days_ahead,
            "Rolling_Modal_Price": [rolling_modal_price] * days_ahead,
            "Lag_1_Month": [lag_1_month] * days_ahead,
            "Lag_2_Months": [lag_2_months] * days_ahead,
            "Price_Change_Rate": [price_change_rate] * days_ahead
        }, columns=feature_names)

        predicted_prices = model.predict(input_data)

        print(f"\n📊 Predicted Prices for {crop.capitalize()} for Next 5 Weeks:")
        for i in range(0, days_ahead, 7):
            print(f"{future_dates[i].strftime('%Y-%m-%d')}: {predicted_prices[i]:.2f} Rs./Kg")

    except Exception as e:
        print(f"❌ Error predicting prices for {crop}: {e}")

# Run predictions
for crop in models.keys():
    predict_price(crop, arrivals=100, min_price=2000, max_price=2500, days_ahead=35)
