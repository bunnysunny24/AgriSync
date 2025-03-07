import React, { useState, useEffect } from 'react';

const AgriNewsSection = () => {
  // Sample news articles data
  const articles = [
    {
      id: 1,
      image: "/api/placeholder/400/320",
      date: "3 Sep, 2023",
      author: "Kevin Martin",
      comments: 2,
      title: "Taking seamless key indicators offline to",
      description: "Exploring how agricultural indicators can be tracked and monitored without constant internet connectivity."
    },
    {
      id: 2,
      image: "/api/placeholder/400/320",
      date: "3 Sep, 2023",
      author: "Kevin Martin",
      comments: 3,
      title: "Override the digital divide with additional",
      description: "Strategies for farmers to bridge technology gaps in modern agricultural practices."
    },
    {
      id: 3,
      image: "/api/placeholder/400/320",
      date: "3 Sep, 2023",
      author: "Kevin Martin",
      comments: 1,
      title: "Agriculture Matters to the Future of next",
      description: "How sustainable farming practices are shaping the future of agriculture and food security."
    }
  ];

  // Animation states
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredArticle, setHoveredArticle] = useState(null);
  const [animateTitle, setAnimateTitle] = useState(false);

  // Trigger entrance animations on component mount
  useEffect(() => {
    setIsVisible(true);
    
    // Trigger title animation after a delay
    const titleTimer = setTimeout(() => {
      setAnimateTitle(true);
    }, 500);
    
    return () => clearTimeout(titleTimer);
  }, []);

  return (
    <div className="bg-gray-50 py-16">
      <div className={`max-w-6xl mx-auto px-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="text-center mb-12 relative overflow-hidden">
          <div className={`transition-all duration-700 transform ${animateTitle ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <h3 className="text-smart-yellow font-semibold mb-2 tracking-wide transition-all duration-500 hover:tracking-wider">
              FROM THE BLOG
            </h3>
          </div>
          
          <div className={`transition-all duration-700 delay-200 transform ${animateTitle ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <h2 className="text-4xl font-bold text-smart-green mb-4 relative inline-block">
              News & Articles
              <span className={`absolute bottom-0 left-1/4 h-1 bg-smart-yellow transition-all duration-1000 ease-in-out ${animateTitle ? 'w-1/2' : 'w-0'}`}></span>
            </h2>
          </div>
          
          <div className={`absolute -bottom-6 left-1/2 transform -translate-x-1/2 transition-opacity duration-1000 ${animateTitle ? 'opacity-10' : 'opacity-0'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24" className="text-smart-green">
              <path fill="currentColor" d="M7.5,4A5.5,5.5 0 0,1 13,9.5C13,11.39 12.12,13.05 10.77,14.14L15,18.35L13.58,19.77L9.38,15.54C8.29,16.12 7.08,16.5 5.78,16.5C2.58,16.5 0,13.91 0,10.71C0,7.5 2.58,4.92 5.78,4.92C6.08,4.92 6.38,4.95 6.67,5L7.5,4M5.78,6.92C3.68,6.92 2,8.6 2,10.71C2,12.81 3.68,14.5 5.78,14.5C7.89,14.5 9.56,12.81 9.56,10.71C9.56,8.6 7.89,6.92 5.78,6.92M16.63,9.45L21.49,9.88L19.18,13.24L20.22,18.01L16,15.5L11.81,18.01L12.83,13.25L10.5,9.87L15.38,9.47L16,5.03L16.63,9.45Z" />
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <div 
              key={article.id}
              className={`bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-700 transform hover:shadow-2xl ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ 
                transitionDelay: `${index * 200}ms`,
                transformOrigin: index % 2 === 0 ? 'bottom left' : 'bottom right'
              }}
              onMouseEnter={() => setHoveredArticle(article.id)}
              onMouseLeave={() => setHoveredArticle(null)}
            >
              <div className="relative overflow-hidden group">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-smart-green opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                <div className="absolute top-4 left-4 bg-smart-yellow text-smart-green px-3 py-1 rounded-full text-sm font-medium transform group-hover:scale-110 transition-transform duration-300">
                  {article.date}
                </div>
                <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
              </div>

              <div className="p-6 border-b-4 border-transparent hover:border-smart-yellow transition-all duration-300">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center space-x-1 group">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-smart-green group-hover:text-smart-yellow transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="group-hover:text-smart-green transition-colors duration-300">by {article.author}</span>
                  </div>
                  <div className="flex items-center space-x-1 group">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-smart-green group-hover:text-smart-yellow transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    <span className="group-hover:text-smart-green transition-colors duration-300">{article.comments} Comments</span>
                  </div>
                </div>

                <h3 className={`text-xl font-bold mb-3 transition-all duration-300 ${hoveredArticle === article.id ? 'text-smart-yellow' : 'text-smart-green'}`}>
                  {article.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-2">{article.description}</p>
                
                <button className="flex items-center text-smart-green font-medium group">
                  <span className="mr-2 transition-all duration-300 group-hover:text-smart-yellow group-hover:mr-3">Read More</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-smart-yellow transition-all duration-300 transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button className="bg-smart-green text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:bg-opacity-90 hover:shadow-xl relative overflow-hidden group">
            <span className="relative z-10">View All Articles</span>
            <span className="absolute top-0 left-0 w-full h-0 bg-smart-yellow transition-all duration-500 group-hover:h-full opacity-20"></span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgriNewsSection;