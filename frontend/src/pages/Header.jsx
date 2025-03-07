import React, { useState } from 'react';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  
  return (
    <header className="bg-[#334b35] text-white py-4 px-4 md:px-10">
      <div className="flex justify-between items-center">
        <div className="text-2xl font-bold">Smart Agro.</div>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden focus:outline-none" 
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
        
        {/* Desktop menu */}
        <ul className="hidden md:flex list-none">
          <li className="ml-6"><a href="#home" className="text-white no-underline text-sm hover:opacity-80 transition-opacity duration-300">Home</a></li>
          <li className="ml-6"><a href="#about" className="text-white no-underline text-sm hover:opacity-80 transition-opacity duration-300">About Us</a></li>
          <li className="ml-6"><a href="#products" className="text-white no-underline text-sm hover:opacity-80 transition-opacity duration-300">Our Products</a></li>
          <li className="ml-6"><a href="#projects" className="text-white no-underline text-sm hover:opacity-80 transition-opacity duration-300">Projects</a></li>
          <li className="ml-6"><a href="#services" className="text-white no-underline text-sm hover:opacity-80 transition-opacity duration-300">Services</a></li>
          <li className="ml-6"><a href="#news" className="text-white no-underline text-sm hover:opacity-80 transition-opacity duration-300">News</a></li>
          <li className="ml-6"><a href="#contact" className="text-white no-underline text-sm hover:opacity-80 transition-opacity duration-300">Contact Us</a></li>
        </ul>
      </div>
      
      {/* Mobile menu */}
      {menuOpen && (
        <ul className="mt-4 md:hidden flex flex-col space-y-2">
          <li><a href="#home" className="block py-2 text-white no-underline text-sm hover:opacity-80 transition-opacity duration-300">Home</a></li>
          <li><a href="#about" className="block py-2 text-white no-underline text-sm hover:opacity-80 transition-opacity duration-300">About Us</a></li>
          <li><a href="#products" className="block py-2 text-white no-underline text-sm hover:opacity-80 transition-opacity duration-300">Our Products</a></li>
          <li><a href="#projects" className="block py-2 text-white no-underline text-sm hover:opacity-80 transition-opacity duration-300">Projects</a></li>
          <li><a href="#services" className="block py-2 text-white no-underline text-sm hover:opacity-80 transition-opacity duration-300">Services</a></li>
          <li><a href="#news" className="block py-2 text-white no-underline text-sm hover:opacity-80 transition-opacity duration-300">News</a></li>
          <li><a href="#contact" className="block py-2 text-white no-underline text-sm hover:opacity-80 transition-opacity duration-300">Contact Us</a></li>
        </ul>
      )}
    </header>
  );
};

export default Header;