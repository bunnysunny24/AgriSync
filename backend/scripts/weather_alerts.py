import pandas as pd

# ✅ Load the latest weather data
weather_df = pd.read_csv("weather_data/latest_weather.csv")
weather = weather_df.iloc[0]

# ✅ Alert System Logic
def check_weather_alerts():
    alerts = []
    
    if weather["Weather Condition"].lower() in ["storm", "thunderstorm", "hurricane"]:
        alerts.append("⚠️ **Storm Alert! Take precautions.**")
    
    if weather["Temperature (°C)"] > 40 and weather["Humidity (%)"] < 20:
        alerts.append("🔥 **Drought Alert! Extremely hot and dry conditions.**")
    
    if weather["Weather Condition"].lower() in ["rain", "heavy rain", "drizzle"] and weather["Humidity (%)"] > 90:
        alerts.append("🌊 **Flood Alert! Heavy rain detected. Stay safe.**")
    
    if not alerts:
        print("✅ No extreme weather conditions detected.")
    else:
        for alert in alerts:
            print(alert)

# ✅ Run the function
if __name__ == "__main__":
    check_weather_alerts()
