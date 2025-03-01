import pandas as pd
import matplotlib.pyplot as plt

# Define file paths for each crop dataset
file_paths = {
    "Banana": "data/banana.csv",
    "Onion": "data/onion.csv",
    "Tomato": "data/tomato.csv",
    "Wheat": "data/wheat.csv",
    "Carrot": "data/carrot.csv"
}

# Loop through each file and generate a separate graph
for crop, path in file_paths.items():
    try:
        # Load dataset
        data = pd.read_csv(path)

        # Convert date column to datetime format
        data["Reported Date"] = pd.to_datetime(data["Reported Date"], format="%d %b %Y", errors="coerce")

        # Check if 'Variety' and 'Modal Price (Rs./Quintal)' exist
        if "Variety" in data.columns and "Modal Price (Rs./Quintal)" in data.columns:
            plt.figure(figsize=(10, 5))

            # Plot price trends for each variety in the dataset
            for variety in data["Variety"].unique():
                subset = data[data["Variety"] == variety]
                plt.plot(subset["Reported Date"], subset["Modal Price (Rs./Quintal)"], label=variety)

            # Graph settings
            plt.xlabel("Date")
            plt.ylabel("Modal Price (Rs./Quintal)")
            plt.title(f"Crop Price Trends Over Time - {crop}")
            plt.legend()
            plt.xticks(rotation=45)
            plt.grid(True)
            plt.show()
        else:
            print(f"⚠️ Warning: Missing columns in {crop} dataset. Skipping visualization.")

    except Exception as e:
        print(f"❌ Error processing {crop}: {e}")
