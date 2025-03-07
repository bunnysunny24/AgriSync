import React from 'react';

const AgriDashboard = () => {
  return (
    <div className="w-full min-h-screen bg-smart-green p-6">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12 pt-6">
          <p className="text-gray-200 uppercase tracking-wider text-sm mb-2">SMART AGRICULTURAL TOOLS</p>
          <h1 className="text-white text-4xl font-bold">Smart Farming Dashboard</h1>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {/* Market Prediction */}
          <div className="bg-gray-800 bg-opacity-25 rounded-lg p-6 flex flex-col items-center transition-all hover:bg-smart-yellow hover:text-smart-green cursor-pointer">
            <div className="w-16 h-16 mb-4 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-12 h-12 text-smart-yellow">
                <path d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
              </svg>
            </div>
            <h3 className="font-bold text-lg text-center text-white">Market Prediction</h3>
          </div>

          {/* Plant Disease Detection */}
          <div className="bg-gray-800 bg-opacity-25 rounded-lg p-6 flex flex-col items-center transition-all hover:bg-smart-yellow hover:text-smart-green cursor-pointer">
            <div className="w-16 h-16 mb-4 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-12 h-12 text-smart-yellow">
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 className="font-bold text-lg text-center text-white">Plant Disease Detection</h3>
          </div>

          {/* Weather Prediction */}
          <div className="bg-gray-800 bg-opacity-25 rounded-lg p-6 flex flex-col items-center transition-all hover:bg-smart-yellow hover:text-smart-green cursor-pointer">
            <div className="w-16 h-16 mb-4 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-12 h-12 text-smart-yellow">
                <path d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <h3 className="font-bold text-lg text-center text-white">Weather Prediction</h3>
          </div>

          {/* Alerts */}
          <div className="bg-gray-800 bg-opacity-25 rounded-lg p-6 flex flex-col items-center transition-all hover:bg-smart-yellow hover:text-smart-green cursor-pointer">
            <div className="w-16 h-16 mb-4 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-12 h-12 text-smart-yellow">
                <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h3 className="font-bold text-lg text-center text-white">Alerts</h3>
          </div>

          {/* Storage */}
          <div className="bg-gray-800 bg-opacity-25 rounded-lg p-6 flex flex-col items-center transition-all hover:bg-smart-yellow hover:text-smart-green cursor-pointer">
            <div className="w-16 h-16 mb-4 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-12 h-12 text-smart-yellow">
                <path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <h3 className="font-bold text-lg text-center text-white">Storage</h3>
          </div>

          {/* Marketplace */}
          <div className="bg-gray-800 bg-opacity-25 rounded-lg p-6 flex flex-col items-center transition-all hover:bg-smart-yellow hover:text-smart-green cursor-pointer">
            <div className="w-16 h-16 mb-4 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-12 h-12 text-smart-yellow">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-lg text-center text-white">Marketplace</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgriDashboard;