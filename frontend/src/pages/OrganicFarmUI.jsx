import React from 'react';

const OrganicFarmUI = () => {
  return (
    <div className="bg-smart-green min-h-screen w-full p-4 md:p-8 flex items-center justify-center">
      <div className="max-w-5xl w-full p-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left side with image */}
          <div className="md:w-1/2">
            <div className="bg-black bg-opacity-10 rounded-lg overflow-hidden">
              <img 
                src="farms.avif" 
                alt="Farmers in corn field at sunset"
                className="w-full h-auto"
              />
            </div>
            
            {/* Stats box - now positioned below the image */}
            <div className="bg-smart-green text-white rounded-lg p-4 mt-4 border border-gray-600 flex items-center gap-3 max-w-xs">
              <div className="bg-smart-yellow rounded-full p-2 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-smart-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <div>
                <div className="text-3xl font-bold">86,700</div>
                <div className="text-sm text-gray-300">Successfully Project Completed</div>
              </div>
            </div>
          </div>
          
          {/* Right side with text content */}
          <div className="md:w-1/2 text-white">
            <div className="text-green-300 mb-2 uppercase tracking-wide font-medium">OUR INTRODUCTION</div>
            
            <h1 className="text-5xl font-bold mb-8 leading-tight">
              Pure Agriculture and<br />
              Organic Form
            </h1>
            
            <h3 className="text-smart-yellow text-xl font-medium mb-4">We're Leader in Agriculture Market</h3>
            
            <p className="text-gray-200 mb-12">
              There are many variations of passages of available but the majority have suffered 
              alteration in some form, by injected humour or randomised words even slightly believable.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="bg-smart-yellow rounded-full p-1 w-6 h-6 flex items-center justify-center mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-smart-green" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-white">Organic food contains more vitamins</div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-smart-yellow rounded-full p-1 w-6 h-6 flex items-center justify-center mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-smart-green" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-white">Eat organic because supply meets demand</div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-smart-yellow rounded-full p-1 w-6 h-6 flex items-center justify-center mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-smart-green" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-white">Organic food is never irradiated</div>
              </div>
            </div>
            
            <div className="mt-4">
              <button className="bg-smart-yellow text-smart-green font-bold py-3 px-6 rounded-md hover:bg-opacity-90 transition-all duration-300 flex items-center gap-2">
                Learn More
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganicFarmUI;