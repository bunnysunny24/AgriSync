import joblib
import numpy as np
import pandas as pd
from datetime import datetime, timedelta


models = {
    "banana": "models/banana_model.pkl",
    "onion": "models/onion_model.pkl",
    "tomato": "models/tomato_model.pkl",
    "wheat": "models/wheat_model.pkl",
    "carrot": "models/carrot_model.pkl"
}

FEATURE_NAMES = [
    "Days", "Month", "Arrivals (Tonnes)", "Min Price (Rs./Quintal)", "Max Price (Rs./Quintal)",
    "Price Range", "Demand Indicator", "Rolling_Modal_Price", "Lag_1_Month", "Lag_2_Months", "Price_Change_Rate"
]

def predict_future_prices(crop, weeks_ahead=5):
    try:
        model = joblib.load(models[crop])
        data = pd.read_csv(f"processed_data/{crop}_processed.csv")
        data["Reported Date"] = pd.to_datetime(data["Reported Date"])  # Convert to datetime
        
        last_date = data["Reported Date"].dropna().max()
        last_day_num = (last_date - data["Reported Date"].min()).days

        future_dates = [last_date + timedelta(weeks=i) for i in range(1, weeks_ahead + 1)]
        future_days = np.array([last_day_num + (i * 7) for i in range(1, weeks_ahead + 1)])

        arrivals_median = data["Arrivals (Tonnes)"].median()
        min_price_median = data["Min Price (Rs./Quintal)"].median()
        max_price_median = data["Max Price (Rs./Quintal)"].median()
        price_range_median = max_price_median - min_price_median
        demand_indicator_median = arrivals_median / (min_price_median + 1)

        rolling_price_median = data["Rolling_Modal_Price"].median()
        lag_1_month_median = data["Lag_1_Month"].median()
        lag_2_months_median = data["Lag_2_Months"].median()
        price_change_rate_median = data["Price_Change_Rate"].median()

        demand_variation = np.linspace(0.95, 1.05, weeks_ahead)  
        price_change_variation = np.linspace(-0.02, 0.02, weeks_ahead)  

        input_data = pd.DataFrame({
            "Days": future_days,
            "Month": [d.month for d in future_dates], 
            "Arrivals (Tonnes)": arrivals_median * demand_variation,  
            "Min Price (Rs./Quintal)": min_price_median * demand_variation,
            "Max Price (Rs./Quintal)": max_price_median * demand_variation,
            "Price Range": price_range_median * demand_variation,
            "Demand Indicator": demand_indicator_median * demand_variation,
            "Rolling_Modal_Price": rolling_price_median * demand_variation,
            "Lag_1_Month": lag_1_month_median * demand_variation,
            "Lag_2_Months": lag_2_months_median * demand_variation,
            "Price_Change_Rate": price_change_rate_median + price_change_variation  
        }, columns=FEATURE_NAMES) 

        predicted_prices = model.predict(input_data)

        if crop == "banana":
            predicted_prices_per_kg = predicted_prices / 100  
            predicted_prices_per_dozen = predicted_prices_per_kg * 1.5  
        else:
            predicted_prices_per_kg = predicted_prices / 100  

        print(f"\n📊 Predicted Prices for {crop.capitalize()} for Next {weeks_ahead} Weeks:")
        for i in range(weeks_ahead):
            if crop == "banana":
                print(f"{future_dates[i].strftime('%Y-%m-%d')}: {predicted_prices_per_dozen[i]:.2f} Rs./Dozen")
            else:
                print(f"{future_dates[i].strftime('%Y-%m-%d')}: {predicted_prices_per_kg[i]:.2f} Rs./Kg")

    except Exception as e:
        print(f"❌ Error predicting prices for {crop}: {e}")

for crop in models.keys():
    predict_future_prices(crop, weeks_ahead=5)
