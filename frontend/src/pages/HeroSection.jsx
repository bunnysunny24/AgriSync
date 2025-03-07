import React from 'react';

const HeroSection = () => {
  return (
    <section 
      className="relative min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url('https://source.unsplash.com/random/1600x900/?agricultural,fields')"
      }}
    >
      {/* Dark overlay for better text visibility */}
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      
      <div className="relative z-10 max-w-2xl text-white p-4 md:p-10 pt-20 md:pt-32">
        <p className="text-base md:text-lg mb-2">Original & Natural</p>
        <h1 className="text-3xl md:text-5xl font-bold text-[#f7c35f] mb-1">Agriculture Matter</h1>
        <h2 className="text-2xl md:text-4xl mb-3 md:mb-5">Good production</h2>
        <p className="text-xs md:text-sm leading-relaxed mb-4 md:mb-6 max-w-md">
          Dissuade ecstatic and properly saw entirely sir why laughter endeavor. In
          on my jointure homage margaret suitable he speedily.
        </p>
        <button className="bg-[#f7c35f] border-none text-gray-800 py-2 px-4 md:py-3 md:px-6 font-bold rounded hover:bg-opacity-90 transition-colors duration-300 uppercase text-xs md:text-sm">
          Discover More
        </button>
      </div>
    </section>
  );
};

export default HeroSection;