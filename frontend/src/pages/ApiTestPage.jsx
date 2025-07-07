import React, { useState, useEffect } from 'react';
import { testApiConnection, quickHealthCheck } from '../config/apiTest';
import { API_URL, ENDPOINTS } from '../config/api';

const ApiTestPage = () => {
  const [testResults, setTestResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [healthStatus, setHealthStatus] = useState(null);

  useEffect(() => {
    // Quick health check on component mount
    const checkHealth = async () => {
      const health = await quickHealthCheck();
      setHealthStatus(health);
    };
    checkHealth();
  }, []);

  const runTests = async () => {
    setIsLoading(true);
    try {
      const results = await testApiConnection();
      setTestResults(results);
    } catch (error) {
      console.error('Test failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-green-400';
      case 'failed': return 'text-red-400';
      case 'testing': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return '✅';
      case 'failed': return '❌';
      case 'testing': return '⏳';
      default: return '⚪';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-white mb-4">🧪 API Connection Test</h1>
          
          <div className="mb-6">
            <h2 className="text-xl text-white mb-2">Configuration</h2>
            <div className="bg-gray-700 rounded p-4">
              <p className="text-gray-300">
                <strong>API URL:</strong> 
                <span className="ml-2 text-blue-400">{API_URL}</span>
              </p>
              <p className="text-gray-300 mt-2">
                <strong>Quick Health Check:</strong> 
                {healthStatus ? (
                  <span className={`ml-2 ${healthStatus.success ? 'text-green-400' : 'text-red-400'}`}>
                    {healthStatus.success ? '✅ API is running' : '❌ API is not responding'}
                  </span>
                ) : (
                  <span className="ml-2 text-yellow-400">⏳ Checking...</span>
                )}
              </p>
            </div>
          </div>

          <button
            onClick={runTests}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '⏳ Running Tests...' : '🧪 Run Full API Test'}
          </button>
        </div>

        {testResults && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Test Results</h2>
            
            <div className="space-y-4">
              <div className="bg-gray-700 rounded p-4">
                <h3 className="text-lg font-semibold text-white mb-2">
                  {getStatusIcon(testResults.health.status)} Health Check
                </h3>
                <p className={`text-sm ${getStatusColor(testResults.health.status)}`}>
                  Status: {testResults.health.status}
                </p>
                {testResults.health.response && (
                  <pre className="text-xs bg-gray-600 p-2 rounded mt-2 text-gray-300">
                    {JSON.stringify(testResults.health.response, null, 2)}
                  </pre>
                )}
                {testResults.health.error && (
                  <p className="text-red-400 text-sm mt-2">Error: {testResults.health.error}</p>
                )}
              </div>

              <div className="bg-gray-700 rounded p-4">
                <h3 className="text-lg font-semibold text-white mb-2">
                  {getStatusIcon(testResults.healthz.status)} Detailed Health Check
                </h3>
                <p className={`text-sm ${getStatusColor(testResults.healthz.status)}`}>
                  Status: {testResults.healthz.status}
                </p>
                {testResults.healthz.response && (
                  <pre className="text-xs bg-gray-600 p-2 rounded mt-2 text-gray-300">
                    {JSON.stringify(testResults.healthz.response, null, 2)}
                  </pre>
                )}
                {testResults.healthz.error && (
                  <p className="text-red-400 text-sm mt-2">Error: {testResults.healthz.error}</p>
                )}
              </div>

              <div className="bg-gray-700 rounded p-4">
                <h3 className="text-lg font-semibold text-white mb-2">
                  {getStatusIcon(testResults.marketPredictions.status)} Market Predictions
                </h3>
                <p className={`text-sm ${getStatusColor(testResults.marketPredictions.status)}`}>
                  Status: {testResults.marketPredictions.status}
                </p>
                {testResults.marketPredictions.response && (
                  <pre className="text-xs bg-gray-600 p-2 rounded mt-2 text-gray-300 max-h-40 overflow-y-auto">
                    {JSON.stringify(testResults.marketPredictions.response, null, 2)}
                  </pre>
                )}
                {testResults.marketPredictions.error && (
                  <p className="text-red-400 text-sm mt-2">Error: {testResults.marketPredictions.error}</p>
                )}
              </div>

              <div className="bg-gray-700 rounded p-4">
                <h3 className="text-lg font-semibold text-white mb-2">
                  {getStatusIcon(testResults.predict.status)} Plant Disease Prediction Endpoint
                </h3>
                <p className={`text-sm ${getStatusColor(testResults.predict.status)}`}>
                  Status: {testResults.predict.status}
                </p>
                {testResults.predict.response && (
                  <p className="text-gray-300 text-sm mt-2">{testResults.predict.response}</p>
                )}
                {testResults.predict.error && (
                  <p className="text-red-400 text-sm mt-2">Error: {testResults.predict.error}</p>
                )}
              </div>

              <div className="bg-gray-700 rounded p-4">
                <h3 className="text-lg font-semibold text-white mb-2">
                  {getStatusIcon(testResults.predictSoil.status)} Soil Prediction Endpoint
                </h3>
                <p className={`text-sm ${getStatusColor(testResults.predictSoil.status)}`}>
                  Status: {testResults.predictSoil.status}
                </p>
                {testResults.predictSoil.response && (
                  <p className="text-gray-300 text-sm mt-2">{testResults.predictSoil.response}</p>
                )}
                {testResults.predictSoil.error && (
                  <p className="text-red-400 text-sm mt-2">Error: {testResults.predictSoil.error}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiTestPage;
