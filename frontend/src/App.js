import React from 'react';
import "./App.css";
import Header from './pages/Header';
import HeroSection from './pages/HeroSection';
import Agriinfo from './pages/OrganicFarmUI';

function App() {
  return (
    <div className="font-sans">
      <Header />
      <HeroSection />
      <Agriinfo />
    </div>
  );
}

export default App;