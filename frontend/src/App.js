import React, { useEffect, useState } from 'react';
import "./App.css";
import Header from './pages/Header';
import HeroSection from './pages/HeroSection';
import Agriinfo from './pages/OrganicFarmUI';
import Dashboard from './pages/AgriDashboard';
import News from './pages/AgriNewsSection';
import PlantDiseaseDetection from './pages/PlantDiseaseDetection';
import MarketPrediction from './pages/MarketPrediction';
import WeatherForecast from './pages/WeatherForecast';
import StorageForm from "./components/StorageForm";  // ✅ Check this path
import Marketplace from "./components/Marketplace"; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  // Add state to track if components are loaded
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Set components as loaded after initial render
    setLoaded(true);
    
    // Function to check if an element is in the viewport
    const checkVisibility = () => {
      const sections = document.querySelectorAll('.scroll-reveal');
      const windowHeight = window.innerHeight;
      
      sections.forEach(section => {
        const boundingRect = section.getBoundingClientRect();
        // Make the threshold higher so elements appear earlier
        if (boundingRect.top < windowHeight * 0.85) {
          section.classList.add('visible');
        }
      });
    };
    
    // Run initial check after a short delay to ensure proper rendering
    setTimeout(checkVisibility, 100);
    
    // Add scroll listener with throttling for performance
    let scrollTimeout;
    const handleScroll = () => {
      if (!scrollTimeout) {
        scrollTimeout = setTimeout(() => {
          checkVisibility();
          scrollTimeout = null;
        }, 10);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Clean up
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  return (
    <Router>
      <div className={`App ${loaded ? 'app-loaded' : ''}`}>
        {/* Header with explicit high z-index */}
        <div className="header-container">
          <Header />
        </div>
        
        {/* Content container */}
        <Routes>
          <Route path="/disease-detection" element={<PlantDiseaseDetection />} />
          <Route path="/market-predection" element={<MarketPrediction />} />
          <Route path="/weather-predection" element={<WeatherForecast />} />
          <Route path="/StorageForm" element={<StorageForm />} />
          <Route path="/Marketplace" element={<Marketplace />} />
          <Route path="/" element={
            <div className="content-container">
              {/* Pre-load all components but keep them hidden until scrolled to */}
              <div className="scroll-reveal">
                <HeroSection />
              </div>
              <div className="scroll-reveal">
                <Agriinfo />
              </div>
              <div className="scroll-reveal">
                <Dashboard />
              </div>
              <div className="scroll-reveal">
                <News />
              </div>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;