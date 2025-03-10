import React, { useState, useEffect } from 'react';
import { Cloud, Sun, Sunrise, Sunset, Moon, Wind, Droplets, ThermometerSun, Umbrella, CloudRain, CloudLightning, CloudSnow } from 'lucide-react';

const weatherData = [
  {
    date: "2025-03-08",
    temperature: 17.5,
    details: {
      morning: "16.0°C",
      afternoon: "18.5°C",
      evening: "17.2°C",
      night: "15.8°C"
    },
    humidity: "65%",
    wind: "12 km/h",
    precipitation: "10%",
    description: "Partly cloudy with mild temperatures throughout the day.",
    condition: "partly-cloudy"
  },
  {
    date: "2025-03-09",
    temperature: 17.57,
    details: {
      morning: "16.2°C",
      afternoon: "18.6°C",
      evening: "17.1°C",
      night: "16.0°C"
    },
    humidity: "68%",
    wind: "10 km/h",
    precipitation: "15%",
    description: "Mostly sunny with scattered clouds in the afternoon.",
    condition: "mostly-sunny"
  },
  {
    date: "2025-03-10",
    temperature: 17.58,
    details: {
      morning: "16.4°C",
      afternoon: "18.4°C",
      evening: "17.3°C",
      night: "16.1°C"
    },
    humidity: "70%",
    wind: "8 km/h",
    precipitation: "20%",
    description: "Pleasant day with light breeze and increasing clouds by evening.",
    condition: "cloudy"
  },
  {
    date: "2025-03-11",
    temperature: 17.76,
    details: {
      morning: "16.6°C",
      afternoon: "18.8°C",
      evening: "17.5°C",
      night: "16.3°C"
    },
    humidity: "67%",
    wind: "14 km/h",
    precipitation: "25%",
    description: "Mild with gentle winds and possible light showers.",
    condition: "light-rain"
  },
  {
    date: "2025-03-12",
    temperature: 17.97,
    details: {
      morning: "17.0°C",
      afternoon: "19.0°C",
      evening: "17.8°C",
      night: "16.7°C"
    },
    humidity: "65%",
    wind: "11 km/h",
    precipitation: "15%",
    description: "Pleasant temperatures with partly cloudy skies.",
    condition: "partly-cloudy"
  },
  {
    date: "2025-03-13",
    temperature: 18.5,
    details: {
      morning: "17.5°C",
      afternoon: "19.5°C",
      evening: "18.2°C",
      night: "17.0°C"
    },
    humidity: "62%",
    wind: "9 km/h",
    precipitation: "5%",
    description: "Warm and sunny throughout the day with clear evening.",
    condition: "sunny"
  },
  {
    date: "2025-03-14",
    temperature: 18.5,
    details: {
      morning: "17.6°C",
      afternoon: "19.4°C",
      evening: "18.1°C",
      night: "17.2°C"
    },
    humidity: "63%",
    wind: "10 km/h",
    precipitation: "10%",
    description: "Pleasant with gentle breezes and scattered clouds.",
    condition: "mostly-sunny"
  }
];

const WeatherForecast = () => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [animateCloud, setAnimateCloud] = useState(false);
  const [animationFrame, setAnimationFrame] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const formatDate = (dateString) => {
    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      setAnimateCloud(prev => !prev);
      setAnimationFrame(prev => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const today = weatherData[1]; 

  const getWeatherIcon = (condition, size = 24, animate = false) => {
    const props = { 
      size: size, 
      className: animate 
        ? `transition-all duration-700 ${animationFrame % 2 === 0 ? 'scale-105' : 'scale-100'} ${animationFrame === 3 ? 'rotate-6' : animationFrame === 1 ? 'rotate-354' : 'rotate-0'}`
        : '' 
    };
    
    switch(condition) {
      case 'sunny':
        return <Sun color="#f7c35f" {...props} />;
      case 'mostly-sunny':
        return (
          <div className="relative">
            <Sun color="#f7c35f" {...props} />
            <Cloud 
              color="#e5e7eb" 
              size={size * 0.65} 
              className={`absolute bottom-0 right-0 opacity-60 ${animate ? `transition-all duration-500 ${animateCloud ? 'translate-x-1' : 'translate-x-0'}` : ''}`} 
            />
          </div>
        );
      case 'partly-cloudy':
        return (
          <div className="relative">
            <Sun color="#f7c35f" {...props} className="opacity-90" />
            <Cloud 
              color="#9ca3af" 
              size={size * 0.8} 
              className={`absolute -bottom-1 -right-1 ${animate ? `transition-all duration-500 ${animateCloud ? 'translate-x-1' : 'translate-x-0'}` : ''}`} 
            />
          </div>
        );
      case 'cloudy':
        return <Cloud color="#9ca3af" {...props} />;
      case 'light-rain':
        return <CloudRain color="#6b7280" {...props} />;
      case 'rainy':
        return <Umbrella color="#6b7280" {...props} />;
      case 'stormy':
        return <CloudLightning color="#6b7280" {...props} />;
      case 'snowy':
        return <CloudSnow color="#e5e7eb" {...props} />;
      default:
        return <Cloud color="#9ca3af" {...props} />;
    }
  };

  return (
    <div className="min-h-screen font-sans bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className={`absolute top-10 left-10 opacity-5 transition-all duration-3000 ease-in-out ${animateCloud ? 'translate-x-10' : 'translate-x-0'}`}>
          <Cloud size={200} color="#334b35" />
        </div>
        <div className={`absolute bottom-20 right-20 opacity-5 transition-all duration-3000 ease-in-out delay-1000 ${animateCloud ? 'translate-x-10' : 'translate-x-0'}`}>
          <Cloud size={180} color="#334b35" />
        </div>
        <div className={`absolute top-1/3 right-1/3 opacity-5 transition-all duration-3000 ease-in-out delay-500 ${animateCloud ? 'translate-y-10' : 'translate-y-0'}`}>
          <Cloud size={150} color="#334b35" />
        </div>
        <div className={`absolute top-1/2 left-1/3 opacity-5 transition-all duration-3000 ease-in-out delay-1500 ${animateCloud ? 'translate-y-8' : 'translate-y-0'}`}>
          <Sun size={120} color="#f7c35f" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white rounded-lg p-4 text-smart-green flex justify-between items-center shadow-lg border-2 border-smart-green relative overflow-hidden mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-smart-yellow/20 to-transparent -translate-x-full animate-shimmer"></div>
          <h1 className="text-3xl font-bold flex items-center">
            <span className="text-smart-yellow mr-2">Weather</span> Forecast
            {getWeatherIcon('mostly-sunny', 36, true)}
          </h1>
          <div className="text-smart-green animate-pulse">
            <p className="text-lg font-medium">{currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
            <p className="text-xs">Last updated: Just now</p>
          </div>
        </div>

      
        <div className="bg-white shadow-lg p-6 mb-6 rounded-lg relative overflow-hidden transform transition-all duration-300 hover:scale-101 hover:shadow-xl">
          
          <div className="absolute inset-0 bg-gradient-to-br from-smart-yellow/5 to-smart-green/5 opacity-50"></div>
          
          <div className={`absolute top-2 right-2 opacity-10 transition-all duration-2000 ${animateCloud ? 'translate-x-4' : 'translate-x-0'}`}>
            <Cloud size={100} color="#334b35" />
          </div>
          <div className={`absolute bottom-2 left-10 opacity-10 transition-all duration-2000 delay-500 ${animateCloud ? 'translate-x-4' : 'translate-x-0'}`}>
            <Cloud size={80} color="#334b35" />
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center md:items-start relative z-10">
            <div className="mb-4 md:mb-0">
              <div className="inline-flex items-center px-3 py-1 mb-3 rounded-full bg-smart-green text-white text-sm animate-bounce-slow">
                <span className="mr-1">●</span> Live Weather
              </div>
              <h2 className="text-xl font-bold text-gray-800">Today - {formatDate(today.date)}</h2>
              <div className="flex items-center mt-2">
                <div className="mr-4">
                  {getWeatherIcon(today.condition, 48, true)}
                </div>
                <div>
                  <span className="text-4xl font-bold text-smart-green">{today.temperature.toFixed(1)}°C</span>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <span className="inline-flex items-center mr-2">
                      <Sun size={12} className="mr-1 text-smart-yellow" />
                      <span>Feels like {(today.temperature + 0.5).toFixed(1)}°C</span>
                    </span>
                    <span>|</span>
                    <span className="inline-flex items-center ml-2">
                      <Umbrella size={12} className="mr-1" />
                      <span>UV Index: Moderate</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className={`text-gray-600 mt-4 max-w-md relative overflow-hidden bg-gray-50 p-3 rounded-lg border-l-4 border-smart-yellow ${animationFrame % 3 === 0 ? 'border-opacity-100' : 'border-opacity-70'}`}>
                <p>{today.description}</p>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="flex items-center p-2 rounded-lg bg-blue-50 bg-opacity-50 hover:bg-opacity-80 transition-all">
                  <Droplets className="text-blue-500 mr-2" size={18} />
                  <span className="text-sm">Humidity: {today.humidity}</span>
                </div>
                <div className="flex items-center p-2 rounded-lg bg-gray-50 bg-opacity-50 hover:bg-opacity-80 transition-all">
                  <Wind className="text-gray-500 mr-2" size={18} />
                  <span className="text-sm">Wind: {today.wind}</span>
                </div>
                <div className="flex items-center p-2 rounded-lg bg-blue-50 bg-opacity-30 hover:bg-opacity-80 transition-all">
                  <Umbrella className="text-gray-500 mr-2" size={18} />
                  <span className="text-sm">Precip: {today.precipitation}</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 p-4 rounded-lg border border-gray-100 shadow-md bg-gradient-to-br from-white to-gray-50">
              <div className="flex flex-col items-center p-3 rounded-lg transition-all duration-300 hover:bg-smart-yellow/10 hover:scale-105">
                <Sunrise className="text-smart-yellow mb-2" size={28} />
                <p className="text-xs text-gray-500">Morning</p>
                <p className="font-bold text-smart-green">{today.details.morning}</p>
              </div>
              <div className="flex flex-col items-center p-3 rounded-lg transition-all duration-300 hover:bg-smart-yellow/10 hover:scale-105">
                <Sun className="text-smart-yellow mb-2" size={28} />
                <p className="text-xs text-gray-500">Afternoon</p>
                <p className="font-bold text-smart-green">{today.details.afternoon}</p>
              </div>
              <div className="flex flex-col items-center p-3 rounded-lg transition-all duration-300 hover:bg-smart-yellow/10 hover:scale-105">
                <Sunset className="text-smart-yellow mb-2" size={28} />
                <p className="text-xs text-gray-500">Evening</p>
                <p className="font-bold text-smart-green">{today.details.evening}</p>
              </div>
              <div className="flex flex-col items-center p-3 rounded-lg transition-all duration-300 hover:bg-smart-yellow/10 hover:scale-105">
                <Moon className="text-smart-yellow mb-2" size={28} />
                <p className="text-xs text-gray-500">Night</p>
                <p className="font-bold text-smart-green">{today.details.night}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl">
          <div className="bg-smart-green p-4 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-smart-yellow/10 to-transparent -translate-x-full animate-shimmer"></div>
            <h2 className="font-bold text-smart-yellow flex items-center">
              <span className="mr-2">7-Day Forecast</span> 
              <span className={`transition-all duration-300 ${animationFrame % 2 === 0 ? 'opacity-100' : 'opacity-70'}`}>📅</span>
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <div className="flex p-4 space-x-4">
              {weatherData.map((day, index) => (
                <div 
                  key={index}
                  className={`min-w-[140px] border rounded-lg cursor-pointer transition-all duration-300 ${
                    selectedDay === index 
                      ? 'border-smart-yellow shadow-md bg-gradient-to-b from-white to-gray-50 scale-105' 
                      : hoveredIndex === index 
                        ? 'border-gray-300 shadow-sm bg-gray-50/50' 
                        : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedDay(selectedDay === index ? null : index)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className={`bg-smart-green p-2 rounded-t-lg relative overflow-hidden ${
                    selectedDay === index ? 'bg-opacity-100' : 'bg-opacity-90'
                  }`}>
                    <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-smart-yellow/20 to-transparent -translate-x-full ${
                      selectedDay === index || hoveredIndex === index ? 'animate-shimmer' : ''
                    }`}></div>
                    <p className="text-white text-center text-sm font-medium relative z-10">{formatDate(day.date).split(',')[0]}</p>
                  </div>
                  <div className="p-3 text-center">
                    <div className={`text-2xl font-bold mb-2 text-smart-green transition-all duration-500 ${
                      selectedDay === index ? 'scale-110' : hoveredIndex === index ? 'scale-105' : ''
                    }`}>
                      {day.temperature.toFixed(1)}°C
                    </div>
                    <div className="flex justify-center mb-2">
                      {getWeatherIcon(day.condition, 32, selectedDay === index || hoveredIndex === index)}
                    </div>
                    <div className={`text-xs p-1 rounded transition-all duration-300 ${
                      selectedDay === index ? 'bg-smart-yellow/10 text-smart-green' : 'text-gray-500'
                    }`}>
                      {day.details.morning.split('°')[0]}° / {day.details.afternoon.split('°')[0]}°
                    </div>
                    <div className={`mt-2 text-xs transition-all duration-300 overflow-hidden ${
                      selectedDay === index || hoveredIndex === index ? 'max-h-10 opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                      <span className="text-gray-500">{day.precipitation} precip</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {selectedDay !== null && (
            <div className="border-t border-gray-200 animate-fadeIn">
              <div className="bg-gradient-to-br from-white to-gray-50 p-5 relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-32 h-32 opacity-5 transition-all duration-2000 ${animateCloud ? 'translate-x-4' : 'translate-x-0'}`}>
                  {getWeatherIcon(weatherData[selectedDay].condition, 128)}
                </div>
                
                <h3 className="font-bold text-smart-green text-xl mb-1">{formatDate(weatherData[selectedDay].date)}</h3>
                <div className="flex items-center mb-4">
                  <div className="mr-2">
                    {getWeatherIcon(weatherData[selectedDay].condition, 24, true)}
                  </div>
                  <p className="text-gray-600">{weatherData[selectedDay].description}</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 transform transition-all duration-300 hover:scale-105 hover:bg-smart-yellow/5">
                    <div className="flex items-center mb-2">
                      <Sunrise className="text-smart-yellow mr-2" size={18} />
                      <p className="text-xs text-gray-500">Morning</p>
                    </div>
                    <p className="font-bold text-smart-green">{weatherData[selectedDay].details.morning}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 transform transition-all duration-300 hover:scale-105 hover:bg-smart-yellow/5">
                    <div className="flex items-center mb-2">
                      <Sun className="text-smart-yellow mr-2" size={18} />
                      <p className="text-xs text-gray-500">Afternoon</p>
                    </div>
                    <p className="font-bold text-smart-green">{weatherData[selectedDay].details.afternoon}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 transform transition-all duration-300 hover:scale-105 hover:bg-smart-yellow/5">
                    <div className="flex items-center mb-2">
                      <Sunset className="text-smart-yellow mr-2" size={18} />
                      <p className="text-xs text-gray-500">Evening</p>
                    </div>
                    <p className="font-bold text-smart-green">{weatherData[selectedDay].details.evening}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 transform transition-all duration-300 hover:scale-105 hover:bg-smart-yellow/5">
                    <div className="flex items-center mb-2">
                      <Moon className="text-smart-yellow mr-2" size={18} />
                      <p className="text-xs text-gray-500">Night</p>
                    </div>
                    <p className="font-bold text-smart-green">{weatherData[selectedDay].details.night}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-5">
                  <div className="bg-blue-50 bg-opacity-40 p-3 rounded-lg flex items-center transform transition-all duration-300 hover:bg-blue-50">
                    <Droplets className="text-blue-500 mr-2" size={18} />
                    <div>
                      <p className="text-xs text-gray-500">Humidity</p>
                      <p className="font-medium text-gray-700">{weatherData[selectedDay].humidity}</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg flex items-center transform transition-all duration-300 hover:bg-gray-100">
                    <Wind className="text-gray-500 mr-2" size={18} />
                    <div>
                      <p className="text-xs text-gray-500">Wind Speed</p>
                      <p className="font-medium text-gray-700">{weatherData[selectedDay].wind}</p>
                    </div>
                  </div>
                  <div className="bg-blue-50 bg-opacity-30 p-3 rounded-lg flex items-center transform transition-all duration-300 hover:bg-blue-50">
                    <Umbrella className="text-gray-500 mr-2" size={18} />
                    <div>
                      <p className="text-xs text-gray-500">Precipitation</p>
                      <p className="font-medium text-gray-700">{weatherData[selectedDay].precipitation}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 p-3 bg-smart-green bg-opacity-5 rounded-lg border-l-2 border-smart-yellow">
                  <h4 className="text-sm font-medium text-smart-green mb-1">Weather Advisory</h4>
                  <p className="text-sm text-gray-600">
                    {weatherData[selectedDay].precipitation.replace('%', '') > 20 
                      ? "Light rain possible. Consider bringing an umbrella." 
                      : "No weather warnings. Enjoy your day!"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-6 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-smart-green p-4 text-white">
            <h2 className="font-bold text-smart-yellow">Weather Insights</h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 transform transition-all duration-300 hover:shadow-md hover:border-smart-yellow">
                <h3 className="text-smart-green font-medium mb-2 flex items-center">
                  <ThermometerSun size={18} className="mr-2" /> Temperature Trend
                </h3>
                <p className="text-sm text-gray-600">
                  Overall warming trend with temperatures rising from 17.5°C to 18.5°C over the week.
                </p>
                <div className="mt-2 h-6 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-smart-green to-smart-yellow rounded-full" 
                    style={{width: '75%'}}
                  ></div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 transform transition-all duration-300 hover:shadow-md hover:border-smart-yellow">
                <h3 className="text-smart-green font-medium mb-2 flex items-center">
                  <Umbrella size={18} className="mr-2" /> Precipitation
                </h3>
                <p className="text-sm text-gray-600">
                  Low chance of precipitation through the week. Best chance of rain on Tuesday (25%).
                </p>
                <div className="mt-2 h-6 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-400 rounded-full" 
                    style={{width: '25%'}}
                  ></div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 transform transition-all duration-300 hover:shadow-md hover:border-smart-yellow">
                <h3 className="text-smart-green font-medium mb-2 flex items-center">
                  <Wind size={18} className="mr-2" /> Wind Conditions
                </h3>
                <p className="text-sm text-gray-600">
                  Gentle breeze throughout the week, ranging from 8-14 km/h. Good conditions for outdoor activities.
                </p>
                <div className="mt-2 h-6 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gray-400 rounded-full" 
                    style={{width: '35%'}}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center text-gray-500 text-sm">
          <div className={`inline-block transform transition-all duration-1000 ${animateCloud ? 'rotate-1 scale-102' : 'rotate-0 scale-100'}`}>
            <p>Data updated: March 9, 2025 | All times local</p>
            <p className="mt-1 text-xs">Powered by WeatherWiz™</p>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite;
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .scale-101 {
          transform: scale(1.01);
        }
        .scale-102 {
          transform: scale(1.02);
        }
        .scale-105 {
          transform: scale(1.05);
        }
        .rotate-354 {
          transform: rotate(-6deg);
        }
      `}</style>
    </div>
  );
};

export default WeatherForecast;