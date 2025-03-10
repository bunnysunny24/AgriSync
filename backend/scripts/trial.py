import pandas as pd

banana_raw = pd.read_csv("data/banana.csv")
onion_raw = pd.read_csv("data/onion.csv")

print("🍌 Banana Raw Data:")
print(banana_raw.head())

print("\n🧅 Onion Raw Data:")
print(onion_raw.head())

print("\nMissing Values in Banana:")
print(banana_raw.isna().sum())

print("\nMissing Values in Onion:")
print(onion_raw.isna().sum())
