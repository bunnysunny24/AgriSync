import React, { useState, useEffect } from 'react';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  
  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const menuItems = [
    { name: 'Home', icon: '🏠' },
    { name: 'About Us', icon: 'ℹ️' },
    { name: 'Our Products', icon: '🌱' },
    { name: 'Projects', icon: '📊' },
    { name: 'Services', icon: '🔧' },
    { name: 'News', icon: '📰' },
    { name: 'Contact Us', icon: '✉️' }
  ];
  
  return (
    <header className={`w-full z-50 transition-all duration-500 ${
      scrolled ? 'bg-[#263a28] shadow-lg py-2' : 'bg-[#334b35] py-4'
    } text-white px-6 md:px-16`}>
      <div className="flex items-center justify-between max-w-7xl mx-auto md:justify-start">
        {/* Logo with animation */}
        <div className="text-2xl font-bold relative overflow-hidden group md:mr-12">
          <div className="flex items-center">
            <span className="text-green-300 mr-2 transform transition-all duration-300 group-hover:rotate-12 group-hover:scale-125">🌿</span>
            <span className="inline-block relative">
              <span className="inline-block transition-all duration-500 group-hover:transform group-hover:translate-y-[-100%] group-hover:opacity-0">Agri</span>
              <span className="inline-block transition-all duration-500 group-hover:text-green-300">Sync</span>
              <span className="absolute left-0 top-0 text-green-300 transition-all duration-500 transform translate-y-[100%] opacity-0 group-hover:transform group-hover:translate-y-0 group-hover:opacity-100">Eco</span>
            </span>
          </div>
          <span className="absolute -bottom-1 left-0 w-0 h-1 bg-gradient-to-r from-green-300 to-green-100 transition-all duration-700 ease-in-out group-hover:w-full rounded-full"></span>
        </div>
        
        {/* Mobile menu button with animation */}
        <button 
          className="md:hidden focus:outline-none p-2 rounded-full bg-green-800 bg-opacity-30 hover:bg-opacity-70 transition-all duration-300 hover:scale-110" 
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <div className="w-6 h-6 relative flex justify-center items-center">
            <span className={`absolute h-0.5 w-5 bg-white transform transition-all duration-300 ease-in-out ${menuOpen ? 'rotate-45' : '-translate-y-1.5'}`}></span>
            <span className={`absolute h-0.5 w-5 bg-white transform transition-all duration-300 ease-in-out ${menuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
            <span className={`absolute h-0.5 w-5 bg-white transform transition-all duration-300 ease-in-out ${menuOpen ? '-rotate-45' : 'translate-y-1.5'}`}></span>
          </div>
        </button>
        
        {/* Desktop menu - horizontally aligned */}
        <nav className="hidden md:flex md:justify-between md:flex-grow">
          <ul className="flex items-center space-x-8">
            {menuItems.map((item, index) => (
              <li 
                key={index} 
                className="relative"
                onMouseEnter={() => setActiveItem(item.name)}
                onMouseLeave={() => setActiveItem(null)}
              >
                <a 
                  href={`#${item.name.toLowerCase().replace(/\s+/g, '')}`} 
                  className="text-white no-underline text-sm py-2 block hover:text-green-200 transition-all duration-300"
                >
                  <span className={`transition-all duration-300 ${
                    activeItem === item.name ? 'transform scale-110 text-green-200 font-medium' : ''
                  }`}>
                    {item.name}
                  </span>
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-green-300 transition-all duration-300 ${
                    activeItem === item.name ? 'w-full' : 'w-0'
                  }`}></span>
                </a>
              </li>
            ))}
          </ul>
          
          {/* Login button aligned to the right */}
          <div className="flex items-center">
            <button className="bg-green-600 hover:bg-green-500 px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400">
              Login
            </button>
          </div>
        </nav>
      </div>
      
      {/* Mobile menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
        menuOpen ? 'max-h-screen opacity-100 pt-6' : 'max-h-0 opacity-0'
      }`}>
        <ul className="flex flex-col">
          {menuItems.map((item, index) => (
            <li 
              key={index} 
              className={`transform transition-all duration-300 hover:bg-green-800 hover:bg-opacity-30 rounded-lg px-4 ${
                menuOpen ? `opacity-100 translate-x-0` : 'opacity-0 -translate-x-8'
              }`}
              style={{ transitionDelay: menuOpen ? `${index * 50}ms` : '0ms' }}
            >
              <a 
                href={`#${item.name.toLowerCase().replace(/\s+/g, '')}`} 
                className="block py-3 text-white no-underline text-sm hover:text-green-200 transition-all duration-300 flex items-center"
              >
                <span className="mr-3 text-green-300">{item.icon}</span>
                <span>{item.name}</span>
                <span className="ml-auto transform transition-all duration-300 opacity-0 hover:opacity-100">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </a>
            </li>
          ))}
          <li className="mt-4 px-4 pb-4">
            <button className="w-full bg-green-600 hover:bg-green-500 py-3 rounded-lg text-sm font-medium transition-all duration-300 hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400">
              Login
            </button>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;