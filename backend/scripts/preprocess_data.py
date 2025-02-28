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

        # Ensure 'Reported Date' column exists
        if "Reported Date" not in data.columns:
            print(f"⚠️ Warning: 'Reported Date' column missing in {crop}. Skipping date processing.")
            continue

        # ✅ Remove quotes from 'Reported Date' before conversion
        data["Reported Date"] = data["Reported Date"].astype(str).str.replace('"', '', regex=True).str.strip()

        # ✅ Handle missing or empty date values
        if data["Reported Date"].isna().all():
            print(f"⚠️ Warning: All dates missing in {crop}. Skipping processing.")
            continue

        # ✅ Try multiple date formats to handle inconsistencies
        date_formats = ["%d %b %Y", "%Y-%m-%d", "%m/%d/%Y"]
        for fmt in date_formats:
            data["Reported Date"] = pd.to_datetime(data["Reported Date"], format=fmt, errors="coerce")

        # ✅ Fill missing dates using forward-fill (previous row's date)
        data["Reported Date"] = data["Reported Date"].fillna(method="ffill")

        # ✅ Drop rows where dates are still missing
        data = data.dropna(subset=["Reported Date"])

        # ✅ Create 'Days' column (number of days since first available date)
        data["Days"] = (data["Reported Date"] - data["Reported Date"].min()).dt.days

        # ✅ Fill missing numeric values with median
        numeric_cols = data.select_dtypes(include=['number']).columns
        data[numeric_cols] = data[numeric_cols].fillna(data[numeric_cols].median())

        # ✅ Keep 'Variety' as a string
        if "Variety" in data.columns:
            data["Variety"] = data["Variety"].astype(str)

        # ✅ One-hot encode categorical columns (excluding 'Variety')
        categorical_columns = ["State Name", "District Name", "Market Name"]
        data = pd.get_dummies(data, columns=categorical_columns, drop_first=True)

        # ✅ Feature Engineering
        data["Price Range"] = data["Max Price (Rs./Quintal)"] - data["Min Price (Rs./Quintal)"]
        data["Demand Indicator"] = data["Arrivals (Tonnes)"] / (data["Modal Price (Rs./Quintal)"] + 1)

        # ✅ Save processed data
        os.makedirs("processed_data", exist_ok=True)
        processed_file = f"processed_data/{crop}_processed.csv"
        data.to_csv(processed_file, index=False)

        print(f"✅ Processed data saved: {processed_file}")

    except Exception as e:
        print(f"❌ Error processing {crop}: {e}")
