import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, TrendingUp, ArrowRight, Search, Calendar, Download, Filter, AlertTriangle, Zap, Info } from 'lucide-react';
import axios from 'axios';
import { ENDPOINTS } from '../config/api';

const predictionData = [
  {
    crop: "banana",
    unit: "Rs./Dozen",
    image: "/banana_prediction_20250309_181240.png",
    predictions: [
      { date: "2025-03-16", price: 15.01 },
      { date: "2025-03-23", price: 15.01 },
      { date: "2025-03-30", price: 18.0 },
      { date: "2025-04-06", price: 18.0 }
    ],
    trend: "up",
    category: "fruit",
    recommendation: "Prices expected to rise by 20% in coming weeks. Consider delaying harvest if possible to maximize profits. Good time for banana farmers to secure forward contracts."
  },
  {
    crop: "onion",
    unit: "Rs./Kg",
    image: "/onion_prediction_20250309_182306.png",
    predictions: [
      { date: "2025-03-16", price: 21.74 },
      { date: "2025-03-23", price: 21.93 },
      { date: "2025-03-30", price: 22.1 },
      { date: "2025-04-06", price: 23.0 }
    ],
    trend: "up",
    category: "vegetable",
    recommendation: "Steady price increase trend suggests holding inventory if storage conditions permit. Moderate upward trajectory indicates stable demand - plan regular market supply."
  },
  {
    crop: "tomato",
    unit: "Rs./Kg",
    image: "/tomato_prediction_20250309_182307.png",
    predictions: [
      { date: "2025-03-16", price: 12.91 },
      { date: "2025-03-23", price: 12.86 },
      { date: "2025-03-30", price: 12.92 },
      { date: "2025-04-06", price: 12.95 }
    ],
    trend: "stable",
    category: "vegetable",
    recommendation: "Price stability indicates balanced market. Focus on quality over quantity to secure premium pricing. Consider local direct-to-consumer sales for better margins."
  },
  {
    crop: "wheat",
    unit: "Rs./Kg",
    image: "/wheat_prediction_20250309_182307.png",
    predictions: [
      { date: "2025-03-16", price: 44.13 },
      { date: "2025-03-23", price: 44.18 },
      { date: "2025-03-30", price: 45.0 },
      { date: "2025-04-06", price: 48.47 }
    ],
    trend: "up",
    category: "grain",
    recommendation: "Sharp price increase expected in early April. Consider futures contracts to lock in higher prices. Good opportunity for wheat farmers to plan expanded planting for next season."
  },
  {
    crop: "carrot",
    unit: "Rs./Kg",
    image: "/carrot_prediction_20250309_182308.png",
    predictions: [
      { date: "2025-03-16", price: 14.96 },
      { date: "2025-03-23", price: 15.95 },
      { date: "2025-03-30", price: 17.5 },
      { date: "2025-04-06", price: 18.0 }
    ],
    trend: "up",
    category: "vegetable",
    recommendation: "Strong upward trend of 20%+ indicates high demand. Consider staggered harvesting to benefit from peak prices. Good time to explore value-added products like pre-cut carrots."
  },
  {
    crop: "potato",
    unit: "Rs./Kg",
    image: "/potato_prediction_20250309_182310.png",
    predictions: [
      { date: "2025-03-16", price: 19.25 },
      { date: "2025-03-23", price: 19.50 },
      { date: "2025-03-30", price: 19.75 },
      { date: "2025-04-06", price: 20.25 }
    ],
    trend: "up",
    category: "vegetable",
    recommendation: "Modest price growth indicates steady demand. Consider cold storage for gradual market release if facilities available. Good time to establish direct relationships with restaurants and food processors."
  },
  {
    crop: "rice",
    unit: "Rs./Kg",
    image: "/rice_prediction_20250309_182312.png",
    predictions: [
      { date: "2025-03-16", price: 55.10 },
      { date: "2025-03-23", price: 54.90 },
      { date: "2025-03-30", price: 54.85 },
      { date: "2025-04-06", price: 54.50 }
    ],
    trend: "down",
    category: "grain",
    recommendation: "Slight downward trend suggests selling sooner rather than later. Consider value-addition like organic or specialty rice varieties to maintain profits despite price decline."
  }
];

const MarketPrediction = () => {
  const [expandedCard, setExpandedCard] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredData, setFilteredData] = useState(predictionData);
  const [isLoading, setIsLoading] = useState(true);
  const [showTips, setShowTips] = useState(false);
  const [notification, setNotification] = useState({ show: true, message: "New price predictions available for all crops!" });
  const [apiData, setApiData] = useState(null);
  const [apiError, setApiError] = useState(null);

  // Fetch market predictions from API
  useEffect(() => {
    const fetchMarketPredictions = async () => {
      try {
        const response = await axios.get(ENDPOINTS.MARKET_PREDICTIONS);
        if (response.data && response.data.status === 'success') {
          setApiData(response.data.data);
          console.log('✅ Market predictions loaded from API:', response.data.data);
        } else {
          console.warn('⚠️ API returned unexpected format, using static data');
          setApiError('API returned unexpected format');
        }
      } catch (error) {
        console.error('❌ Failed to fetch market predictions:', error);
        setApiError('Failed to fetch live data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarketPredictions();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [isLoading]);

  useEffect(() => {
    // Use API data if available, otherwise use static data
    const dataToFilter = apiData && apiData.length > 0 ? apiData : predictionData;
    
    const results = dataToFilter.filter((item) => {
      const matchesSearch = item.crop.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
    setFilteredData(results);
  }, [searchTerm, selectedCategory, apiData]);

  const toggleCard = (cropName) => {
    setExpandedCard(expandedCard === cropName ? null : cropName);
  };

  const calculateChange = (predictions) => {
    const firstPrice = predictions[0].price;
    const lastPrice = predictions[predictions.length - 1].price;
    const percentChange = ((lastPrice - firstPrice) / firstPrice) * 100;
    return percentChange.toFixed(2);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  const categories = [
    { id: 'all', name: 'All Crops' },
    { id: 'vegetable', name: 'Vegetables' },
    { id: 'fruit', name: 'Fruits' },
    { id: 'grain', name: 'Grains' }
  ];

  const getProjectedDifference = (predictions) => {
    const firstPrice = predictions[0].price;
    const lastPrice = predictions[predictions.length - 1].price;
    return (lastPrice - firstPrice).toFixed(2);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-smart-green bg-opacity-95 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-smart-yellow mb-4"></div>
          <p className="text-white text-lg">Loading market predictions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-smart-green bg-opacity-95 text-white">
      <div className="sticky top-0 z-50 bg-gray-900 shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="text-smart-yellow h-6 w-6" />
              <h1 className="text-2xl font-bold text-smart-yellow">KrishiPrice Forecast</h1>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search crops..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-800 rounded-lg text-white w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-smart-yellow"
                />
              </div>
              
              <div className="flex space-x-2 overflow-x-auto pb-1 md:pb-0">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all duration-300 ${
                      selectedCategory === category.id 
                        ? 'bg-smart-yellow text-gray-900 font-medium' 
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {notification.show && (
        <div className="bg-gray-800 border-l-4 border-smart-yellow animate-fadeIn">
          <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Zap className="text-smart-yellow h-5 w-5" />
              <p className="text-gray-200">{notification.message}</p>
              {apiData && apiData.length > 0 && (
                <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">LIVE DATA</span>
              )}
              {apiError && (
                <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs">USING CACHED DATA</span>
              )}
            </div>
            <button 
              onClick={() => setNotification({...notification, show: false})}
              className="text-gray-400 hover:text-white"
            >
              ×
            </button>
          </div>
        </div>
      )}
      
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold mb-1">Market Intelligence Dashboard</h2>
            <p className="text-gray-300 text-sm flex items-center">
              <Calendar className="h-4 w-4 mr-1" /> 
              Updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          
          <div className="flex mt-4 md:mt-0 space-x-3">
            <button 
              onClick={() => setShowTips(!showTips)}
              className="flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all duration-300"
            >
              <Info className="h-4 w-4 mr-2" />
              Farmer Tips
            </button>
            <button className="flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all duration-300">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </button>
          </div>
        </div>
        
        {showTips && (
          <div className="bg-gray-800 rounded-xl p-4 mb-8 animate-fadeIn">
            <h3 className="text-smart-yellow font-medium text-lg mb-3">How to Use This Forecast</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-900 p-3 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center">
                  <Filter className="h-4 w-4 mr-1 text-smart-yellow" /> Price Interpretation
                </h4>
                <p className="text-sm text-gray-300">Rising prices indicate increasing demand or limited supply. Consider timing your harvest or sales accordingly to maximize profits.</p>
              </div>
              <div className="bg-gray-900 p-3 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-smart-yellow" /> Seasonal Planning
                </h4>
                <p className="text-sm text-gray-300">Use the weekly forecast to plan your planting and harvesting schedule. Align your farm operations with projected market conditions.</p>
              </div>
              <div className="bg-gray-900 p-3 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1 text-smart-yellow" /> Risk Management
                </h4>
                <p className="text-sm text-gray-300">Diversify your crops based on price stability. Crops with stable prices offer reliable income, while those with rising prices offer growth potential.</p>
              </div>
            </div>
          </div>
        )}
        
        {filteredData.length === 0 ? (
          <div className="bg-gray-800 rounded-xl p-8 text-center animate-fadeIn">
            <Search className="h-12 w-12 mx-auto mb-4 text-gray-500" />
            <h3 className="text-xl font-medium mb-2">No crops found</h3>
            <p className="text-gray-400">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredData.map((item) => {
              const isExpanded = expandedCard === item.crop;
              const percentChange = calculateChange(item.predictions);
              const isPositiveChange = parseFloat(percentChange) > 0;
              const isNegativeChange = parseFloat(percentChange) < 0;
              const isStableChange = parseFloat(percentChange) === 0;
              
              return (
                <div 
                  key={item.crop}
                  className={`bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-800 transition-all duration-500 ease-in-out transform hover:shadow-xl ${isExpanded ? 'md:col-span-2 xl:col-span-3' : 'hover:scale-102'}`}
                >
                  <div 
                    className="p-4 cursor-pointer flex justify-between items-center bg-gray-800"
                    onClick={() => toggleCard(item.crop)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        isPositiveChange ? 'bg-green-900' : 
                        isNegativeChange ? 'bg-red-900' : 
                        'bg-yellow-900'
                      }`}>
                        {isPositiveChange ? 
                          <ChevronUp className="text-green-400 h-5 w-5" /> : 
                          isNegativeChange ?
                          <ChevronDown className="text-red-400 h-5 w-5" /> :
                          <ArrowRight className="text-yellow-400 h-5 w-5" />
                        }
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold capitalize">{item.crop}</h3>
                        <span className="text-xs text-gray-400 capitalize">{item.category}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className={`font-medium ${
                        isPositiveChange ? 'text-green-400' : 
                        isNegativeChange ? 'text-red-400' : 
                        'text-yellow-400'
                      }`}>
                        {isPositiveChange ? '+' : 
                         isNegativeChange ? '' : 
                         '±'}{percentChange}%
                      </span>
                      {isExpanded ? 
                        <ChevronUp className="h-5 w-5 text-gray-400 animate-bounce" /> : 
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      }
                    </div>
                  </div>
                  
                  <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-screen' : 'max-h-96'}`}>
                    <div className="p-4">
                      <div className="mb-4 overflow-hidden rounded-lg">
                        <img
                          src={item.image}
                          alt={`${item.crop} prediction graph`}
                          className="w-full rounded-lg shadow-md transform transition-transform duration-500 hover:scale-105"
                        />
                      </div>
                      
                      <div className="mt-6">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="text-smart-yellow text-lg font-medium">Price Forecast ({item.unit})</h4>
                          <div className="bg-gray-800 rounded-full px-3 py-1 text-sm">
                            {isPositiveChange ? 
                              <span className="text-green-400">Trending Up</span> : 
                              isNegativeChange ?
                              <span className="text-red-400">Trending Down</span> :
                              <span className="text-yellow-400">Stable</span>
                            }
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                          {item.predictions.map((pred, idx) => {
                            const isLast = idx === item.predictions.length - 1;
                            const prevPrice = idx > 0 ? item.predictions[idx-1].price : pred.price;
                            const priceDiff = pred.price - prevPrice;
                            const isPriceUp = priceDiff > 0;
                            const isPriceDown = priceDiff < 0;
                            const isPriceStable = priceDiff === 0;
                            
                            return (
                              <div 
                                key={idx}
                                className={`p-3 rounded-lg ${isLast ? 'border-2 border-smart-yellow bg-gray-800' : 'bg-gray-800'} transition-all duration-300 hover:shadow-lg transform hover:scale-105 ${isLast ? 'animate-pulse' : ''}`}
                              >
                                <p className="text-gray-400 text-sm">{formatDate(pred.date)}</p>
                                <div className="flex items-center mt-1">
                                  <span className="text-lg font-bold">₹{pred.price.toFixed(2)}</span>
                                  {idx > 0 && (
                                    <span className={`ml-2 text-xs ${
                                      isPriceUp ? 'text-green-400' : 
                                      isPriceDown ? 'text-red-400' : 
                                      'text-yellow-400'
                                    }`}>
                                      {isPriceUp ? '▲' : 
                                       isPriceDown ? '▼' : 
                                       '▬'} 
                                      {Math.abs(priceDiff).toFixed(2)}
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      
                      <div className="mt-6 bg-gray-800 rounded-lg p-4 animate-fadeIn">
                        <h4 className="text-smart-yellow font-medium mb-2 flex items-center">
                          <Info className="h-4 w-4 mr-2" /> 
                          Farmer Recommendation
                        </h4>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {item.recommendation}
                        </p>
                      </div>
                      
                      {isExpanded && (
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
                          <div className="bg-gray-800 rounded-lg p-4">
                            <h4 className="text-smart-yellow font-medium mb-3">Market Insights</h4>
                            
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">Price Trend</span>
                                <span className={`text-sm font-medium ${
                                  isPositiveChange ? 'text-green-400' : 
                                  isNegativeChange ? 'text-red-400' : 
                                  'text-yellow-400'
                                }`}>
                                  {isPositiveChange ? 'Upward' : isNegativeChange ? 'Downward' : 'Stable'}
                                </span>
                              </div>
                              
                              <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">Current Price</span>
                                <span className="text-sm font-medium">₹{item.predictions[0].price.toFixed(2)} {item.unit}</span>
                              </div>
                              
                              <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">Projected Price</span>
                                <span className="text-sm font-medium">₹{item.predictions[item.predictions.length-1].price.toFixed(2)} {item.unit}</span>
                              </div>
                              
                              <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">Expected Change</span>
                                <span className={`text-sm font-medium ${
                                  isPositiveChange ? 'text-green-400' : 
                                  isNegativeChange ? 'text-red-400' : 
                                  'text-yellow-400'
                                }`}>
                                  {getProjectedDifference(item.predictions) > 0 ? '+' : ''}
                                  ₹{getProjectedDifference(item.predictions)} {item.unit}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-gray-800 rounded-lg p-4">
                            <h4 className="text-smart-yellow font-medium mb-3">Action Plan</h4>
                            
                            <ul className="space-y-2 text-sm text-gray-300">
                              {isPositiveChange && (
                                <>
                                  <li className="flex items-start">
                                    <span className="text-green-400 mr-2">•</span>
                                    Consider delaying harvest/sales if possible
                                  </li>
                                  <li className="flex items-start">
                                    <span className="text-green-400 mr-2">•</span>
                                    Explore forward contracts at current rates
                                  </li>
                                  <li className="flex items-start">
                                    <span className="text-green-400 mr-2">•</span>
                                    Plan for increased production next season
                                  </li>
                                </>
                              )}
                              
                              {isNegativeChange && (
                                <>
                                  <li className="flex items-start">
                                    <span className="text-red-400 mr-2">•</span>
                                    Consider early sales to avoid further decline
                                  </li>
                                  <li className="flex items-start">
                                    <span className="text-red-400 mr-2">•</span>
                                    Explore value-added products to increase margins
                                  </li>
                                  <li className="flex items-start">
                                    <span className="text-red-400 mr-2">•</span>
                                    Consider crop diversification for next season
                                  </li>
                                </>
                              )}
                              
                              {isStableChange && (
                                <>
                                  <li className="flex items-start">
                                    <span className="text-yellow-400 mr-2">•</span>
                                    Focus on quality to attract premium buyers
                                  </li>
                                  <li className="flex items-start">
                                    <span className="text-yellow-400 mr-2">•</span>
                                    Maintain current production levels
                                  </li>
                                  <li className="flex items-start">
                                    <span className="text-yellow-400 mr-2">•</span>
                                    Consider direct marketing to increase margins
                                  </li>
                                </>
                              )}
                            </ul>
                          </div>
                          
                          <div className="md:col-span-2">
                            <button className="w-full py-3 bg-smart-yellow text-gray-900 rounded-lg font-medium hover:bg-yellow-500 transition-colors duration-300 flex justify-center items-center">
                              <Download className="h-4 w-4 mr-2" />
                              Download Detailed Report for {item.crop.charAt(0).toUpperCase() + item.crop.slice(1)}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        <div className="mt-12 bg-gray-800 rounded-xl p-6 animate-fadeIn">
          <h2 className="text-xl font-semibold text-smart-yellow mb-4">Market Outlook Summary</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-900 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Rising Crops</h3>
              <p className="text-sm text-gray-300 mb-3">These crops show significant price increases in the coming weeks.</p>
              <ul className="space-y-2">
                {filteredData
                  .filter(item => parseFloat(calculateChange(item.predictions)) > 5)
                  .slice(0, 3)
                  .map(item => (
                    <li key={item.crop} className="flex justify-between items-center text-sm">
                      <span className="capitalize">{item.crop}</span>
                      <span className="text-green-400">+{calculateChange(item.predictions)}%</span>
                    </li>
                  ))}
              </ul>
            </div>
            
            <div className="bg-gray-900 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Stable Crops</h3>
              <p className="text-sm text-gray-300 mb-3">These crops show relatively stable prices with minimal fluctuation.</p>
              <ul className="space-y-2">
                {filteredData
                  .filter(item => Math.abs(parseFloat(calculateChange(item.predictions))) <= 5)
                  .slice(0, 3)
                  .map(item => (
                    <li key={item.crop} className="flex justify-between items-center text-sm">
                      <span className="capitalize">{item.crop}</span>
                      <span className="text-yellow-400">±{calculateChange(item.predictions)}%</span>
                    </li>
                  ))}
              </ul>
            </div>
            
            <div className="bg-gray-900 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Declining Crops</h3>
              <p className="text-sm text-gray-300 mb-3">These crops show price decreases in the coming weeks.</p>
              <ul className="space-y-2">
                {filteredData
                  .filter(item => parseFloat(calculateChange(item.predictions)) < 0)
                  .slice(0, 3)
                  .map(item => (
                    <li key={item.crop} className="flex justify-between items-center text-sm">
                      <span className="capitalize">{item.crop}</span>
                      <span className="text-red-400">{calculateChange(item.predictions)}%</span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
          
          <div className="mt-6 text-sm text-gray-400">
            <p>Based on analysis of historical price data, current market conditions, weather forecasts, and supply-demand indicators.</p>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm">
            KrishiPrice Forecast provides AI-powered price predictions to help farmers make informed decisions.
            <br />Updated daily. Last update: March 9, 2025.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MarketPrediction;