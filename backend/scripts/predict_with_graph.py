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

# Define the exact feature order used during training
FEATURE_NAMES = [
    "Days", "Month", "Arrivals (Tonnes)", "Min Price (Rs./Quintal)", "Max Price (Rs./Quintal)",
    "Price Range", "Demand Indicator", "Rolling_Modal_Price", "Lag_1_Month", "Lag_2_Months", "Price_Change_Rate"
]

def predict_future_prices_with_graph(crop, weeks_ahead=5):
    try:
        # Load model
        model = joblib.load(models[crop])

        # Load processed data
        data = pd.read_csv(f"processed_data/{crop}_processed.csv")
        data["Reported Date"] = pd.to_datetime(data["Reported Date"])  # Convert to datetime
        
        # ✅ Sort data by date before using it
        data = data.sort_values(by="Reported Date")

        # Handle missing dates
        last_date = data["Reported Date"].dropna().max()
        last_day_num = (last_date - data["Reported Date"].min()).days

        # Generate future dates
        future_dates = [last_date + timedelta(weeks=i) for i in range(1, weeks_ahead + 1)]
        future_days = np.array([last_day_num + (i * 7) for i in range(1, weeks_ahead + 1)])

        # Use median values for numerical features but introduce small variations
        arrivals_median = data["Arrivals (Tonnes)"].median()
        min_price_median = data["Min Price (Rs./Quintal)"].median()
        max_price_median = data["Max Price (Rs./Quintal)"].median()
        price_range_median = max_price_median - min_price_median
        demand_indicator_median = arrivals_median / (min_price_median + 1)

        rolling_price_median = data["Rolling_Modal_Price"].median()
        lag_1_month_median = data["Lag_1_Month"].median()
        lag_2_months_median = data["Lag_2_Months"].median()
        price_change_rate_median = data["Price_Change_Rate"].median()

        # ✅ Introduce Variations in Demand & Price Change for More Dynamic Predictions
        demand_variation = np.linspace(0.95, 1.05, weeks_ahead)  # Small fluctuations over time
        price_change_variation = np.linspace(-0.02, 0.02, weeks_ahead)  # Price change rate variation

        # Prepare input data with realistic future trends
        input_data = pd.DataFrame({
            "Days": future_days,
            "Month": [d.month for d in future_dates],  # Extract month from future dates
            "Arrivals (Tonnes)": arrivals_median * demand_variation,  # Apply demand variation
            "Min Price (Rs./Quintal)": min_price_median * demand_variation,
            "Max Price (Rs./Quintal)": max_price_median * demand_variation,
            "Price Range": price_range_median * demand_variation,
            "Demand Indicator": demand_indicator_median * demand_variation,
            "Rolling_Modal_Price": rolling_price_median * demand_variation,
            "Lag_1_Month": lag_1_month_median * demand_variation,
            "Lag_2_Months": lag_2_months_median * demand_variation,
            "Price_Change_Rate": price_change_rate_median + price_change_variation  # Apply change variation
        }, columns=FEATURE_NAMES)  # ✅ Ensure correct feature order

        # Predict future prices (in Rs./Quintal)
        predicted_prices = model.predict(input_data)

        # ✅ Convert Predictions to Correct Units
        if crop == "banana":
            # Convert Rs./Quintal → Rs./Kg → Rs./Dozen (1.5 Kg per dozen)
            predicted_prices_per_kg = predicted_prices / 100  
            predicted_prices_per_dozen = predicted_prices_per_kg * 1.5  
        else:
            # Convert Rs./Quintal → Rs./Kg
            predicted_prices_per_kg = predicted_prices / 100  

        # ✅ Separate Historical and Predicted Data
        historical_dates = data["Reported Date"]
        historical_prices = data["Modal Price (Rs./Quintal)"]

        future_df = pd.DataFrame({
            "Reported Date": future_dates,
            "Predicted Price": predicted_prices  # Keep in Rs./Quintal for consistency
        })

        # ✅ Plot Past & Future Prices
        plt.figure(figsize=(10, 5))

        # ✅ Plot historical prices as a solid blue line
        plt.plot(historical_dates, historical_prices, label="Historical Prices", color="blue", linestyle="-", marker="o")

        # ✅ Plot predicted prices as a **dotted red line**
        plt.plot(future_df["Reported Date"], future_df["Predicted Price"], label="Predicted Prices", linestyle="dotted", marker="x", color="red")

        # ✅ Ensure Predicted Red Cross is Visible
        plt.scatter(future_df["Reported Date"], future_df["Predicted Price"], color="red", marker="x", s=100, label="Future Predictions")

        # Graph settings
        plt.xlabel("Date")
        plt.ylabel("Modal Price (Rs./Quintal)")
        plt.title(f"Predicted Price Trends for {crop.capitalize()}")
        plt.legend()
        plt.xticks(rotation=45)
        plt.grid(True)
        plt.show()

        # Print Results
        print(f"\n📊 Predicted Prices for {crop.capitalize()} for Next {weeks_ahead} Weeks:")
        for i in range(weeks_ahead):
            if crop == "banana":
                print(f"{future_dates[i].strftime('%Y-%m-%d')}: {predicted_prices_per_dozen[i]:.2f} Rs./Dozen")
            else:
                print(f"{future_dates[i].strftime('%Y-%m-%d')}: {predicted_prices_per_kg[i]:.2f} Rs./Kg")

    except Exception as e:
        print(f"❌ Error predicting future prices for {crop}: {e}")

# Run Predictions for All Crops
for crop in models.keys():
    predict_future_prices_with_graph(crop, weeks_ahead=5)
