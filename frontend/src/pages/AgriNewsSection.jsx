import React, { useState, useEffect } from 'react';

const AgriNewsSection = () => {
  const articles = [
    {
      id: 1,
      image: "news1.jpg", 
      date: "3 Sep, 2023",
      author: "Kevin Martin",
      comments: 2,
      title: "Taking seamless key indicators offline to",
      description: "Exploring how agricultural indicators can be tracked and monitored without constant internet connectivity."
    },
    {
      id: 2,
      image: "news2.webp", 
      date: "3 Sep, 2023",
      author: "Kevin Martin",
      comments: 3,
      title: "Override the digital divide with additional",
      description: "Strategies for farmers to bridge technology gaps in modern agricultural practices."
    },
    {
      id: 3,
      image: "news3.jpg", 
      date: "3 Sep, 2023",
      author: "Kevin Martin",
      comments: 1,
      title: "Agriculture Matters to the Future of next",
      description: "How sustainable farming practices are shaping the future of agriculture and food security."
    }
  ];

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById('news-section');
      if (element) {
        const position = element.getBoundingClientRect();
        if (position.top < window.innerHeight * 0.75) {
          setIsVisible(true);
        }
      }
    };

    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div id="news-section" className="relative py-16 bg-smart-green">
      <div className="max-w-6xl mx-auto px-4">
        <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h3 className="text-smart-yellow font-semibold mb-2 tracking-wider uppercase">
            FROM THE BLOG
          </h3>
          <h2 className="text-4xl font-bold text-white mb-4 relative inline-block">
            News & Articles
            <span className="absolute -bottom-2 left-0 h-1 w-full bg-smart-yellow"></span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <div 
              key={article.id}
              className={`bg-white rounded-lg overflow-hidden shadow-lg transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className="relative overflow-hidden h-56">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute bottom-4 left-4">
                  <div className="bg-smart-yellow text-smart-green px-3 py-1 text-sm font-medium rounded">
                    {article.date}
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white">
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-smart-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-gray-400">by {article.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-smart-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    <span className="text-gray-400">{article.comments} Comments</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-3 text-gray-800 hover:text-smart-yellow transition-colors duration-300">
                  {article.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgriNewsSection;