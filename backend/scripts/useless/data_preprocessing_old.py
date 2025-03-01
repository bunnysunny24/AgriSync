import pandas as pd
import os

# Define file paths
file_paths = {
    "banana": "data/banana.csv",
    "onion": "data/onion.csv",
    "tomato": "data/tomato.csv",
    "wheat": "data/wheat.csv",
    "carrot": "data/carrot.csv"
}

# Process each file separately
for crop, path in file_paths.items():
    try:
        # Load dataset
        data = pd.read_csv(path)

        # Convert date column to DateTime format
        data["Reported Date"] = pd.to_datetime(data["Reported Date"], format="%d %b %Y", errors="coerce")

        # Remove rows where date conversion failed
        data = data.dropna(subset=["Reported Date"])

        # Create 'Days' column (number of days since first date)
        data["Days"] = (data["Reported Date"] - data["Reported Date"].min()).dt.days

        # ✅ Create Rolling Average Price for Trend Analysis (30-day window)
        data["Rolling_Modal_Price"] = data["Modal Price (Rs./Quintal)"].rolling(window=30, min_periods=1).mean()

        # ✅ Add Lag Features (Past 1 month, 2 months)
        data["Lag_1_Month"] = data["Modal Price (Rs./Quintal)"].shift(30).fillna(method="bfill")
        data["Lag_2_Months"] = data["Modal Price (Rs./Quintal)"].shift(60).fillna(method="bfill")

        # ✅ Calculate Price Change Rate
        data["Price_Change_Rate"] = data["Modal Price (Rs./Quintal)"].pct_change().fillna(0)

        # ✅ Fill missing numeric values with median
        numeric_cols = data.select_dtypes(include=["number"]).columns
        data[numeric_cols] = data[numeric_cols].fillna(data[numeric_cols].median())

        # ✅ Keep 'Variety' as a string
        data["Variety"] = data["Variety"].astype(str)

        # ✅ One-hot encode categorical columns (excluding 'Variety')
        categorical_columns = ["State Name", "District Name", "Market Name"]
        data = pd.get_dummies(data, columns=categorical_columns, drop_first=True)

        # ✅ Create new features
        data["Price Range"] = data["Max Price (Rs./Quintal)"] - data["Min Price (Rs./Quintal)"]
        data["Demand Indicator"] = data["Arrivals (Tonnes)"] / (data["Modal Price (Rs./Quintal)"] + 1)

        # ✅ Save cleaned data
        os.makedirs("processed_data", exist_ok=True)
        processed_file = f"processed_data/{crop}_processed.csv"
        data.to_csv(processed_file, index=False)

        print(f"✅ Processed data saved: {processed_file}")

    except Exception as e:
        print(f"❌ Error processing {crop}: {e}")
