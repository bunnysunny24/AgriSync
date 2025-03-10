import pandas as pd
import numpy as np
import joblib
from datetime import datetime, timedelta


model = joblib.load("models/weather_forecast.pkl")


future_dates = [datetime.now() + timedelta(days=i) for i in range(1, 8)]
future_days = [(date - datetime.now()).days for date in future_dates]


df = pd.read_csv("data/historical_weather.csv")
median_temp = df["Temperature (°C)"].median()
median_humidity = df["Humidity (%)"].median()
median_wind_speed = df["Wind Speed (m/s)"].median()
median_pressure = df["Pressure (hPa)"].median()


input_data = pd.DataFrame({
    "Days": future_days,
    "Temperature (°C)": [median_temp] * 7,
    "Humidity (%)": [median_humidity] * 7,
    "Wind Speed (m/s)": [median_wind_speed] * 7,
    "Pressure (hPa)": [median_pressure] * 7,
})


predicted_temps = model.predict(input_data)


print("\n📊 **7-Day Weather Forecast**")
for i in range(7):
    print(f"{future_dates[i].strftime('%Y-%m-%d')}: {predicted_temps[i]:.2f}°C")
