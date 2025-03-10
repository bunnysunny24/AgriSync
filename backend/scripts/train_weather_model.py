import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
import joblib
import os


df = pd.read_csv("data/historical_weather.csv")


df["Date"] = pd.to_datetime(df["Date"])
df["Days"] = (df["Date"] - df["Date"].min()).dt.days


features = ["Days", "Temperature (°C)", "Humidity (%)", "Wind Speed (m/s)", "Pressure (hPa)"]
target = "Temperature (°C)" 

X = df[features]
y = df[target]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestRegressor(n_estimators=200, random_state=42)
model.fit(X_train, y_train)

os.makedirs("models", exist_ok=True)
joblib.dump(model, "models/weather_forecast.pkl")
print("✅ Weather Forecasting Model Trained and Saved!")
