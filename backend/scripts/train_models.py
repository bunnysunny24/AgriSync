import pandas as pd
import joblib
import os
from sklearn.model_selection import TimeSeriesSplit
from xgboost import XGBRegressor
from sklearn.metrics import mean_absolute_error

# Define processed file paths
processed_files = {
    "banana": "processed_data/banana_processed.csv",
    "onion": "processed_data/onion_processed.csv",
    "tomato": "processed_data/tomato_processed.csv",
    "wheat": "processed_data/wheat_processed.csv",
    "carrot": "processed_data/carrot_processed.csv"
}

# Train models separately
for crop, path in processed_files.items():
    try:
        # Load dataset
        data = pd.read_csv(path)

        # Convert date column to numerical format (number of days since first date)
        data["Reported Date"] = pd.to_datetime(data["Reported Date"])
        data["Days"] = (data["Reported Date"] - data["Reported Date"].min()).dt.days
        data["Month"] = data["Reported Date"].dt.month  # ✅ Capture seasonality

        # ✅ Use a larger rolling window (30 days)
        if "Rolling_Modal_Price" not in data.columns:
            data["Rolling_Modal_Price"] = data["Modal Price (Rs./Quintal)"].rolling(window=30, min_periods=1).mean()

        # ✅ Add Lag Features (Past 1 month, 2 months)
        data["Lag_1_Month"] = data["Modal Price (Rs./Quintal)"].shift(30).fillna(method="bfill")
        data["Lag_2_Months"] = data["Modal Price (Rs./Quintal)"].shift(60).fillna(method="bfill")

        # ✅ Calculate Price Change Rate
        data["Price_Change_Rate"] = data["Modal Price (Rs./Quintal)"].pct_change().fillna(0)

        # Select Features & Target
        features = ["Days", "Month", "Arrivals (Tonnes)", "Min Price (Rs./Quintal)", "Max Price (Rs./Quintal)", 
                    "Price Range", "Demand Indicator", "Rolling_Modal_Price", "Lag_1_Month", "Lag_2_Months", "Price_Change_Rate"]
        target = "Modal Price (Rs./Quintal)"

        X = data[features]
        y = data[target]

        # ✅ Use Time Series Cross Validation instead of train_test_split
        tscv = TimeSeriesSplit(n_splits=5)
        for train_index, test_index in tscv.split(X):
            X_train, X_test = X.iloc[train_index], X.iloc[test_index]
            y_train, y_test = y.iloc[train_index], y.iloc[test_index]

        # Train model using XGBoost
        model = XGBRegressor(n_estimators=300, learning_rate=0.03, objective="reg:squarederror", random_state=42)
        model.fit(X_train, y_train)

        # Evaluate model
        y_pred = model.predict(X_test)
        mae = mean_absolute_error(y_test, y_pred)
        print(f"✅ {crop.upper()} Model Trained! MAE: {mae}")

        # Save model
        os.makedirs("models", exist_ok=True)
        model_file = f"models/{crop}_model.pkl"
        joblib.dump(model, model_file)
        print(f"✅ Model saved: {model_file}")

    except Exception as e:
        print(f"❌ Error training model for {crop}: {e}")
