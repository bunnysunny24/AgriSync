import React, { useState, useEffect } from 'react';

const OrganicFarmUI = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [statsCount, setStatsCount] = useState(0);
  const [activeFeature, setActiveFeature] = useState(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const interval = setInterval(() => {
      setStatsCount(prev => {
        if (prev < 86700) return prev + 867;
        clearInterval(interval);
        return 86700;
      });
    }, 30);
    
    return () => clearInterval(interval);
  }, []);

  const features = [
    "Organic food contains more vitamins",
    "Eat organic because supply meets demand",
    "Organic food is never irradiated"
  ];

  return (
    <div className="bg-gradient-to-b from-smart-green to-green-900 min-h-screen w-full p-4 md:p-8 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-16 -left-16 w-64 h-64 bg-yellow-400 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-green-300 rounded-full opacity-10 blur-3xl"></div>
      </div>
      
      <div className="max-w-5xl w-full p-4 relative z-10">
        <div 
          className={`flex flex-col md:flex-row gap-8 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div 
            className="md:w-1/2 transition-all duration-700 delay-300"
            style={{ 
              transform: isVisible ? 'translateX(0)' : 'translateX(-50px)',
              opacity: isVisible ? 1 : 0 
            }}
          >
            <div 
              className="bg-black bg-opacity-10 rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <img 
                src="farms.avif" 
                alt="Farmers in corn field at sunset"
                className={`w-full h-auto transition-all duration-700 ${isHovering ? 'scale-110' : 'scale-100'}`}
              />
            </div>
            
            <div 
              className="bg-smart-green text-white rounded-lg p-4 mt-4 border border-gray-600 flex items-center gap-3 max-w-xs transform hover:scale-105 transition-all duration-300 shadow-lg"
              style={{ 
                transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                opacity: isVisible ? 1 : 0,
                transitionDelay: '600ms',
                transitionProperty: 'all',
                transitionDuration: '700ms'
              }}
            >
              <div className="bg-smart-yellow rounded-full p-2 flex items-center justify-center animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-smart-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <div>
                <div className="text-3xl font-bold">{statsCount.toLocaleString()}</div>
                <div className="text-sm text-gray-300">Successfully Project Completed</div>
              </div>
            </div>
          </div>
          
          <div 
            className="md:w-1/2 text-white"
            style={{ 
              transform: isVisible ? 'translateX(0)' : 'translateX(50px)',
              opacity: isVisible ? 1 : 0,
              transitionDelay: '300ms',
              transitionProperty: 'all',
              transitionDuration: '700ms'
            }}
          >
            <div 
              className="text-green-300 mb-2 uppercase tracking-wide font-medium relative overflow-hidden inline-block"
              style={{ 
                transitionDelay: '800ms',
                transitionProperty: 'all',
                transitionDuration: '700ms'
              }}
            >
              <span className="relative z-10">OUR INTRODUCTION</span>
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-300 transform translate-x-full transition-transform duration-500"></span>
            </div>
            
            <h1 
              className="text-5xl font-bold mb-8 leading-tight"
              style={{ 
                transitionDelay: '900ms',
                transitionProperty: 'all',
                transitionDuration: '700ms'
              }}
            >
              <span className="inline-block hover:text-smart-yellow transition-colors duration-300">Pure Agriculture and</span><br />
              <span className="inline-block hover:text-smart-yellow transition-colors duration-300">Organic Form</span>
            </h1>
            
            <h3 
              className="text-smart-yellow text-xl font-medium mb-4 transform hover:translate-x-1 transition-transform duration-300"
              style={{ 
                transitionDelay: '1000ms',
                transitionProperty: 'all',
                transitionDuration: '700ms'
              }}
            >
              We're Leader in Agriculture Market
            </h3>
            
            <p 
              className="text-gray-200 mb-12"
              style={{ 
                transitionDelay: '1100ms',
                transitionProperty: 'all',
                transitionDuration: '700ms'
              }}
            >
              There are many variations of passages of available but the majority have suffered 
              alteration in some form, by injected humour or randomised words even slightly believable.
            </p>
            
            <div 
              className="space-y-4 mb-8"
              style={{ 
                transitionDelay: '1200ms',
                transitionProperty: 'all',
                transitionDuration: '700ms'
              }}
            >
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className={`flex items-start gap-3 p-2 rounded-md transition-all duration-300 ${activeFeature === index ? 'bg-black bg-opacity-20' : ''}`}
                  onMouseEnter={() => setActiveFeature(index)}
                  onMouseLeave={() => setActiveFeature(null)}
                  style={{ 
                    transform: isVisible ? 'translateX(0)' : 'translateX(30px)',
                    opacity: isVisible ? 1 : 0,
                    transitionDelay: `${1300 + index * 100}ms`,
                    transitionProperty: 'all',
                    transitionDuration: '700ms'
                  }}
                >
                  <div className={`bg-smart-yellow rounded-full p-1 w-6 h-6 flex items-center justify-center mt-1 transition-transform duration-300 ${activeFeature === index ? 'scale-125' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-smart-green" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-white">{feature}</div>
                </div>
              ))}
            </div>
            
            <div 
              className="mt-4"
              style={{ 
                transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                opacity: isVisible ? 1 : 0,
                transitionDelay: '1600ms',
                transitionProperty: 'all',
                transitionDuration: '700ms'
              }}
            >
              <button className="bg-smart-yellow text-smart-green font-bold py-3 px-6 rounded-md hover:bg-opacity-90 transition-all duration-300 flex items-center gap-2 relative overflow-hidden group shadow-lg hover:shadow-xl">
                <span className="relative z-10">Learn More</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span className="absolute inset-0 bg-white transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100 opacity-10"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganicFarmUI;