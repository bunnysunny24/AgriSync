import React from 'react';

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

  return (
    <div className="w-full bg-smart-green py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-gray-300 uppercase tracking-wider text-sm mb-2">FROM THE BLOG</p>
          <h2 className="text-white text-4xl font-bold">News & Articles</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((article) => (
            <div key={article.id} className="bg-smart-green rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer border border-gray-700">
              <div className="relative">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-52 object-cover"
                />
                <div className="absolute bottom-3 right-3 bg-smart-yellow text-smart-green text-xs px-2 py-1 rounded">
                  {article.date}
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-center justify-between text-gray-400 text-sm mb-3">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    <span>by {article.author}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                    </svg>
                    <span>{article.comments} Comments</span>
                  </div>
                </div>
                
                <h3 className="text-white font-bold text-lg mb-2">{article.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgriNewsSection;