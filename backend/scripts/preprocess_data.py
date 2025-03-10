import pandas as pd
import os

file_paths = {
    "banana": "data/banana.csv",
    "onion": "data/onion.csv",
    "tomato": "data/tomato.csv",
    "wheat": "data/wheat.csv",
    "carrot": "data/carrot.csv"
}


for crop, path in file_paths.items():
    try:

        data = pd.read_csv(path)


        data["Reported Date"] = data["Reported Date"].astype(str).str.strip().str.replace('"', '')


        date_formats = ["%d %b %Y", "%Y-%m-%d", "%m/%d/%Y", "%d-%m-%Y"]
        for fmt in date_formats:
            data["Reported Date"] = pd.to_datetime(data["Reported Date"], format=fmt, errors="coerce")
            if data["Reported Date"].notna().sum() > 0:
                print(f"✅ {crop.capitalize()} - Successfully converted dates using format: {fmt}")
                break  


        data = data.dropna(subset=["Reported Date"])


        if len(data) == 0:
            print(f"⚠️ Warning: No valid dates found for {crop}. Skipping processing.")
            continue  

        data["Days"] = (data["Reported Date"] - data["Reported Date"].min()).dt.days
        data["Price Range"] = data["Max Price (Rs./Quintal)"] - data["Min Price (Rs./Quintal)"]
        data["Demand Indicator"] = data["Arrivals (Tonnes)"] / (data["Modal Price (Rs./Quintal)"] + 1)

        data["Rolling_Modal_Price"] = data["Modal Price (Rs./Quintal)"].rolling(window=30, min_periods=1).mean()

        data["Lag_1_Month"] = data["Modal Price (Rs./Quintal)"].shift(30).bfill()
        data["Lag_2_Months"] = data["Modal Price (Rs./Quintal)"].shift(60).bfill()


        data["Price_Change_Rate"] = data["Modal Price (Rs./Quintal)"].pct_change().fillna(0)

        numeric_cols = data.select_dtypes(include=["number"]).columns
        data[numeric_cols] = data[numeric_cols].fillna(data[numeric_cols].median())


        os.makedirs("processed_data", exist_ok=True)
        processed_file = f"processed_data/{crop}_processed.csv"
        data.to_csv(processed_file, index=False)

        print(f"✅ Processed data saved: {processed_file}\n")

    except Exception as e:
        print(f"❌ Error processing {crop}: {e}")
