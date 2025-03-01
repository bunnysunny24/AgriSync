import requests
import os
import pandas as pd
from datetime import datetime

# ✅ OpenWeatherMap API Key
API_KEY = #"972c0e29b63fc85cd2fc3e1a945d8111"
CITY = "New Delhi"
URL = f"http://api.openweathermap.org/data/2.5/weather?q={CITY}&appid={API_KEY}&units=metric"

# ✅ Fetch Weather Data
def get_weather():
    try:
        response = requests.get(URL)
        data = response.json()

        if response.status_code == 200:
            weather_info = {
                "City": CITY,
                "Temperature (°C)": data["main"]["temp"],
                "Humidity (%)": data["main"]["humidity"],
                "Wind Speed (m/s)": data["wind"]["speed"],
                "Pressure (hPa)": data["main"]["pressure"],
                "Weather Condition": data["weather"][0]["main"],
                "Description": data["weather"][0]["description"],
                "Date": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }

            df = pd.DataFrame([weather_info])
            os.makedirs("weather_data", exist_ok=True)
            df.to_csv("weather_data/latest_weather.csv", index=False)
            
            print("✅ Weather Data Fetched and Saved!")
            return weather_info
        else:
            print("❌ Error fetching weather data:", data)
    
    except Exception as e:
        print(f"❌ Error: {e}")

# ✅ Run the function
if __name__ == "__main__":
    get_weather()
