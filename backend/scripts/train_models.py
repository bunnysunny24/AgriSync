import pandas as pd
import joblib
import os
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
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

        # Select Features & Target
        features = ["Days", "Arrivals (Tonnes)", "Min Price (Rs./Quintal)", "Max Price (Rs./Quintal)", "Price Range", "Demand Indicator"]
        target = "Modal Price (Rs./Quintal)"

        X = data[features]
        y = data[target]

        # Train-test split
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        # Train model
        model = RandomForestRegressor(n_estimators=100, random_state=42)
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
