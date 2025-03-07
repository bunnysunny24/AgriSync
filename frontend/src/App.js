import React from 'react';
import "./App.css";
import Header from './pages/Header';
import HeroSection from './pages/HeroSection';
import Agriinfo from './pages/OrganicFarmUI';
import Dashboard from './pages/AgriDashboard';
import News from './pages/AgriNewsSection';

function App() {
  return (
    <div className="font-sans">
      <Header />
      <HeroSection />
      <Agriinfo />
      <Dashboard />
      <News />
    </div>
  );
}

export default App;