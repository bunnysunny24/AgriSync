import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MarketPrediction = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('daily');
  const navigate = useNavigate();
  
  // Animation on component mount
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  // Mock market data (you'll replace with your actual data)
  const commodities = [
    { id: 1, name: "Rice", currentPrice: "₹2,450", prediction: "↑ ₹2,580", change: "+5.3%" },
    { id: 2, name: "Wheat", currentPrice: "₹2,100", prediction: "↑ ₹2,250", change: "+7.1%" },
    { id: 3, name: "Corn", currentPrice: "₹1,850", prediction: "↓ ₹1,780", change: "-3.8%" },
    { id: 4, name: "Soybeans", currentPrice: "₹3,620", prediction: "↑ ₹3,750", change: "+3.6%" },
    { id: 5, name: "Cotton", currentPrice: "₹5,780", prediction: "↓ ₹5,680", change: "-1.7%" }
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-smart-green to-green-900 p-6 overflow-hidden">
      {/* Background particles */}
      <div className="fixed inset-0 z-0 opacity-10">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: `${Math.random() * 8 + 2}px`,
              height: `${Math.random() * 8 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>
      
      {/* Main content */}
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header with back button */}
        <header className="flex items-center mb-8 pt-6">
          <button 
            onClick={() => navigate('/')}
            className={`mr-4 text-white hover:text-smart-yellow transition-colors duration-300 transform ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
            style={{ transition: 'all 0.6s ease-out' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
          
          <div className={`transition-all duration-1000 transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
            <p className="text-gray-200 uppercase tracking-wider text-sm mb-1 relative inline-block">
              PRICE FORECAST & ANALYTICS
            </p>
            <h1 className="text-white text-3xl md:text-4xl font-bold relative inline-block">
              Market Prediction
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-smart-yellow transform scale-x-0 origin-left transition-transform duration-700" 
                style={{ transform: isLoaded ? 'scaleX(1)' : 'scaleX(0)' }}
              ></div>
            </h1>
          </div>
        </header>

        {/* Time period tabs */}
        <div 
          className={`mb-8 bg-black bg-opacity-25 backdrop-blur-sm rounded-full inline-flex transition-all duration-700 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
          style={{ transitionDelay: '200ms' }}
        >
          {['daily', 'weekly', 'monthly', 'yearly'].map((tab) => (
            <button
              key={tab}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === tab 
                  ? 'bg-smart-yellow text-smart-green' 
                  : 'text-white hover:bg-white hover:bg-opacity-10'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Main grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Graph area - left side (2/3 width on large screens) */}
          <div 
            className="lg:col-span-2 bg-gray-800 bg-opacity-25 backdrop-blur-sm rounded-lg p-6 shadow-lg"
            style={{ 
              transform: isLoaded ? 'translateY(0)' : 'translateY(50px)',
              opacity: isLoaded ? 1 : 0,
              transition: 'all 0.6s ease-out',
              transitionDelay: '300ms'
            }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-white text-xl font-bold">Price Trends</h2>
              <div className="flex space-x-2">
                <button className="px-3 py-1 bg-smart-green text-white text-sm rounded transition-all duration-300 hover:bg-opacity-90">Export</button>
                <button className="px-3 py-1 bg-gray-700 text-white text-sm rounded transition-all duration-300 hover:bg-opacity-90">Filter</button>
              </div>
            </div>
            
            {/* Placeholder for your graph */}
            <div className="bg-black bg-opacity-30 rounded-lg h-64 md:h-96 flex items-center justify-center">
              <div className="text-gray-400 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 text-smart-yellow" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-lg">Your Price Trend Chart Will Go Here</p>
                <p className="text-sm opacity-70 mt-2">Add your data visualization component</p>
              </div>
            </div>
            
            {/* Date range selector */}
            <div className="mt-6 flex flex-wrap justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="flex items-center bg-black bg-opacity-30 rounded-lg p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white text-sm">Mar 01, 2025</span>
                </div>
                <span className="text-gray-400">to</span>
                <div className="flex items-center bg-black bg-opacity-30 rounded-lg p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white text-sm">Mar 09, 2025</span>
                </div>
              </div>
              
              <div className="mt-4 sm:mt-0">
                <select className="bg-black bg-opacity-30 text-white rounded-lg p-2 text-sm border border-gray-700 focus:outline-none focus:ring-2 focus:ring-smart-yellow">
                  <option>All Commodities</option>
                  <option>Rice</option>
                  <option>Wheat</option>
                  <option>Corn</option>
                  <option>Soybeans</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Right side - commodity predictions */}
          <div 
            className="bg-gray-800 bg-opacity-25 backdrop-blur-sm rounded-lg p-6 shadow-lg"
            style={{ 
              transform: isLoaded ? 'translateY(0)' : 'translateY(50px)',
              opacity: isLoaded ? 1 : 0,
              transition: 'all 0.6s ease-out',
              transitionDelay: '400ms'
            }}
          >
            <h2 className="text-white text-xl font-bold mb-6">Price Predictions</h2>
            
            <div className="space-y-4">
              {commodities.map((commodity) => (
                <div 
                  key={commodity.id}
                  className="bg-black bg-opacity-30 rounded-lg p-4 hover:bg-smart-yellow hover:bg-opacity-10 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-white font-medium">{commodity.name}</h3>
                    <span className={`text-sm px-2 py-1 rounded ${commodity.change.startsWith('+') ? 'bg-green-500 bg-opacity-20 text-green-400' : 'bg-red-500 bg-opacity-20 text-red-400'}`}>
                      {commodity.change}
                    </span>
                  </div>
                  
                  <div className="mt-2 flex justify-between">
                    <div>
                      <p className="text-gray-400 text-xs">Current</p>
                      <p className="text-white font-bold">{commodity.currentPrice}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-xs">Prediction</p>
                      <p className={`font-bold ${commodity.prediction.startsWith('↑') ? 'text-green-400' : 'text-red-400'}`}>
                        {commodity.prediction}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-6 py-3 bg-smart-yellow text-smart-green font-medium rounded-lg transition-all duration-300 hover:bg-opacity-90 flex items-center justify-center">
              <span>View Full Report</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Market news section */}
        <div 
          className="mt-8 bg-gray-800 bg-opacity-25 backdrop-blur-sm rounded-lg p-6 shadow-lg"
          style={{ 
            transform: isLoaded ? 'translateY(0)' : 'translateY(50px)',
            opacity: isLoaded ? 1 : 0,
            transition: 'all 0.6s ease-out',
            transitionDelay: '500ms'
          }}
        >
          <h2 className="text-white text-xl font-bold mb-6">Market News & Insights</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-black bg-opacity-30 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="h-32 bg-gray-700 relative">
                  <div className="absolute inset-0 flex items-center justify-center text-smart-yellow">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="p-4">
                  <span className="inline-block px-2 py-1 bg-smart-yellow bg-opacity-20 text-smart-yellow text-xs rounded mb-2">Market Insight</span>
                  <h3 className="text-white font-medium mb-2">Monsoon forecast impacts grain prices</h3>
                  <p className="text-gray-400 text-sm">Early monsoon predictions show favorable rainfall, potentially increasing crop yields...</p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-gray-500 text-xs">Mar 8, 2025</span>
                    <button className="text-smart-yellow hover:text-white transition-colors duration-300 text-sm">Read More</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Future price predictions */}
        <div 
          className="mt-8 bg-gray-800 bg-opacity-25 backdrop-blur-sm rounded-lg p-6 shadow-lg"
          style={{ 
            transform: isLoaded ? 'translateY(0)' : 'translateY(50px)',
            opacity: isLoaded ? 1 : 0,
            transition: 'all 0.6s ease-out',
            transitionDelay: '600ms'
          }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white text-xl font-bold">Future Price Projections</h2>
            <div className="flex space-x-2">
              <select className="bg-black bg-opacity-30 text-white rounded-lg p-2 text-sm border border-gray-700 focus:outline-none focus:ring-2 focus:ring-smart-yellow">
                <option>3 Months</option>
                <option>6 Months</option>
                <option>1 Year</option>
              </select>
            </div>
          </div>
          
          {/* Placeholder for your future projections graph */}
          <div className="bg-black bg-opacity-30 rounded-lg h-48 flex items-center justify-center">
            <div className="text-gray-400 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 text-smart-yellow" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
              <p className="text-lg">Your Future Projections Chart Will Go Here</p>
              <p className="text-sm opacity-70 mt-2">Add your forecast visualization component</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating action button */}
      <div 
        className={`fixed bottom-6 right-6 z-20 transition-all duration-700 transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        style={{ transitionDelay: '700ms' }}
      >
        <button className="w-14 h-14 rounded-full bg-smart-yellow text-smart-green flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Add CSS animation keyframes */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
          100% { transform: translateY(0) rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default MarketPrediction;