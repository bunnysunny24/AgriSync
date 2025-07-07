// API Configuration
const API_CONFIG = {
  // Production API URL (your deployed backend)
  PRODUCTION_URL: "https://agrisync-f1ut.onrender.com",
  
  // Development API URL (for local development)
  DEVELOPMENT_URL: "http://localhost:8000",
  
  // Get the current API URL based on environment
  getApiUrl: () => {
    // Check if we're in production
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      return API_CONFIG.PRODUCTION_URL;
    }
    
    // Use development URL for local development
    return API_CONFIG.DEVELOPMENT_URL;
  }
};

// Export the API URL
export const API_URL = API_CONFIG.getApiUrl();

// Export individual endpoints
export const ENDPOINTS = {
  PREDICT_DISEASE: `${API_URL}/predict`,
  PREDICT_SOIL: `${API_URL}/predict-soil`,
  MARKET_PREDICTIONS: `${API_URL}/market-predictions`,
  HEALTH_CHECK: `${API_URL}/health`,
  DETAILED_HEALTH: `${API_URL}/healthz`
};

export default API_CONFIG;
