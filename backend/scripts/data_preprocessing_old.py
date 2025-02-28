import pandas as pd
import glob

def load_and_preprocess_data():
    # Load all CSV files
    file_paths = ["data/banana.csv", "data/onion.csv", "data/tomato.csv", "data/wheat.csv", "data/carrot.csv"]
    df_list = [pd.read_csv(file) for file in file_paths]
    
    # Combine into a single DataFrame
    data = pd.concat(df_list, ignore_index=True)

    # Convert date column to DateTime format
    data["Reported Date"] = pd.to_datetime(data["Reported Date"], format="%d %b %Y", errors='coerce')

    # Fill missing values only for numeric columns
    numeric_cols = data.select_dtypes(include=['number']).columns
    data[numeric_cols] = data[numeric_cols].fillna(data[numeric_cols].median())

    # ✅ Keep 'Variety' as a string before encoding other categorical columns
    data["Variety"] = data["Variety"].astype(str)

    # ✅ One-hot encode categorical columns (excluding 'Variety')
    data = pd.get_dummies(data, columns=["State Name", "District Name", "Market Name"], drop_first=True)

    # Create new features
    data["Price Range"] = data["Max Price (Rs./Quintal)"] - data["Min Price (Rs./Quintal)"]
    data["Demand Indicator"] = data["Arrivals (Tonnes)"] / (data["Modal Price (Rs./Quintal)"] + 1)

    # Save cleaned data
    data.to_csv("data/processed_data.csv", index=False)
    print("✅ Data preprocessing complete. Processed data saved!")

if __name__ == "__main__":
    load_and_preprocess_data()
