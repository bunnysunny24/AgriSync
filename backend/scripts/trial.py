import pandas as pd

# Load raw data
banana_raw = pd.read_csv("data/banana.csv")
onion_raw = pd.read_csv("data/onion.csv")

# Print first few rows
print("🍌 Banana Raw Data:")
print(banana_raw.head())

print("\n🧅 Onion Raw Data:")
print(onion_raw.head())

# Check missing values
print("\nMissing Values in Banana:")
print(banana_raw.isna().sum())

print("\nMissing Values in Onion:")
print(onion_raw.isna().sum())
