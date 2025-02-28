import pandas as pd
import matplotlib.pyplot as plt

# Load data
data = pd.read_csv("data/processed_data.csv")

# Plot trend of modal price over time
plt.figure(figsize=(10, 5))
if "Variety" in data.columns:
    for variety in data["Variety"].unique():
        subset = data[data["Variety"] == variety]
        plt.plot(subset["Reported Date"], subset["Modal Price (Rs./Quintal)"], label=variety)
else:
    print("⚠️ Warning: 'Variety' column not found in the dataset. Skipping visualization.")


plt.xlabel("Date")
plt.ylabel("Modal Price (Rs./Quintal)")
plt.title("Crop Price Trends Over Time")
plt.legend()
plt.show()
