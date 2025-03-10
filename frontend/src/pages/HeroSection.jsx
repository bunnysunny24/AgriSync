import React, { useEffect, useState } from 'react';

const HeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section 
      className="relative min-h-screen bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage: "url('/farm.avif')",
        backgroundPosition: `center ${scrollPosition * 0.5}px`
      }}
    >
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-white opacity-20 animate-float"
            style={{
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 15 + 10}s`,
              animationDelay: `${Math.random() * 5}s`
            }}
          ></div>
        ))}
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent"></div>
      
      <div className="relative z-10 container mx-auto h-screen flex items-center">
        <div className={`max-w-2xl text-white p-6 md:p-10 transform transition-all duration-1000 ${isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}>
          <p className={`text-base md:text-lg mb-2 font-medium tracking-wider transition-all duration-700 delay-100 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <span className="inline-block relative">
              <span className="relative z-10">Original & Natural</span>
              <span className="absolute bottom-0 left-0 w-full h-1 bg-[#f7c35f] transform origin-left transition-all duration-500 delay-300 scale-x-0 group-hover:scale-x-100"></span>
            </span>
          </p>
          
          <h1 className={`text-4xl md:text-6xl font-bold text-[#f7c35f] mb-2 transition-all duration-700 delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <span className="inline-block overflow-hidden">
              <span className="inline-block animate-shimmer bg-gradient-to-r from-[#f7c35f] via-yellow-200 to-[#f7c35f] bg-clip-text">Agriculture</span>
            </span>{' '}
            <span className="inline-block overflow-hidden relative">
              <span className="inline-block">Matter</span>
              <span className="absolute bottom-0 left-0 w-0 h-1 bg-white transition-all duration-700 ease-in-out group-hover:w-full"></span>
            </span>
          </h1>
          
          <h2 className={`text-2xl md:text-4xl mb-4 md:mb-6 font-light transition-all duration-700 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            Good <span className="text-[#f7c35f] font-normal">production</span>
          </h2>
          
          <p className={`text-sm md:text-base leading-relaxed mb-6 md:mb-8 max-w-md opacity-90 transition-all duration-700 delay-400 ${isLoaded ? 'translate-y-0 opacity-90' : 'translate-y-4 opacity-0'}`}>
            Dissuade ecstatic and properly saw entirely sir why laughter endeavor. In
            on my jointure homage margaret suitable he speedily. Experience the natural
            goodness with sustainable farming practices that respect the earth.
          </p>
          
          <div className={`flex space-x-4 transition-all duration-700 delay-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <button className="group relative bg-[#f7c35f] border-none text-gray-800 py-3 px-6 md:py-4 md:px-8 font-bold rounded-lg hover:bg-opacity-90 transition-all duration-300 uppercase text-sm overflow-hidden transform hover:scale-105 hover:shadow-lg">
              <span className="relative z-10">Discover More</span>
              <span className="absolute inset-0 h-full w-0 bg-white bg-opacity-30 transition-all duration-300 group-hover:w-full"></span>
              <span className="absolute -right-4 top-0 h-16 w-16 translate-x-8 -translate-y-4 transform rotate-45 bg-white opacity-10 transition-transform duration-700 group-hover:translate-x-4"></span>
            </button>
            
            <button className="group relative bg-transparent border-2 border-white text-white py-3 px-6 md:py-4 md:px-8 font-bold rounded-lg hover:bg-white hover:text-gray-800 transition-all duration-300 uppercase text-sm transform hover:scale-105">
              <span className="relative z-10">Learn More</span>
            </button>
          </div>
          
          <div className={`absolute bottom-10 left-10 transition-all duration-1000 delay-1000 ${isLoaded ? 'opacity-70' : 'opacity-0'}`}>
            <div className="flex flex-col items-center">
              <span className="text-xs uppercase tracking-widest mb-2">Scroll Down</span>
              <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center p-1">
                <div className="w-1 h-2 bg-white rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className={`absolute top-40 right-10 md:right-40 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 transform transition-all duration-1000 delay-700 ${isLoaded ? 'translate-y-0 opacity-100 rotate-0' : 'translate-y-10 opacity-0 rotate-12'}`}>
          <div className="relative">
            <div className="text-[#f7c35f] font-bold text-4xl md:text-5xl">100%</div>
            <div className="text-white text-sm md:text-base">Organic Products</div>
            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#f7c35f] flex items-center justify-center animate-pulse">
              <span className="text-xs text-black font-bold">!</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const styles = `
@keyframes float {
  0%, 100% {
    transform: translateY(0) translateX(0);
  }
  25% {
    transform: translateY(-20px) translateX(10px);
  }
  50% {
    transform: translateY(-10px) translateX(-15px);
  }
  75% {
    transform: translateY(-25px) translateX(15px);
  }
}

@keyframes shimmer {
  0% {
    background-position: -100% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.animate-float {
  animation: float linear infinite;
}

.animate-shimmer {
  animation: shimmer 3s infinite;
  background-size: 200% 100%;
}
`;

const StyleTag = () => (
  <style dangerouslySetInnerHTML={{ __html: styles }} />
);

const EnhancedHeroSection = () => (
  <>
    <StyleTag />
    <HeroSection />
  </>
);

export default EnhancedHeroSection;