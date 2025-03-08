import React, { useState, useRef } from 'react';

const PlantDiseaseDetection = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [detectionResult, setDetectionResult] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // Animation on component mount
  React.useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Handle file upload
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);
      setDetectionResult("");
    }
  };

  // Handle camera capture
  const handleCameraCapture = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);
      setDetectionResult("");
    }
  };

  // Simulate disease detection
  const analyzeImage = () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    setDetectionResult("");
    
    // Simulate API call delay
    setTimeout(() => {
      const possibleResults = [
        "Healthy plant detected. No signs of disease.",
        "Early signs of powdery mildew detected. Recommended treatment: Apply neem oil spray.",
        "Detected leaf spot disease. Severity: Medium. Remove affected leaves and improve air circulation.",
        "Warning: Late blight detected. This is a serious disease that spreads quickly. Immediate action required.",
        "Nutrient deficiency detected. Plant shows signs of nitrogen deficiency. Recommended: Apply balanced fertilizer."
      ];
      
      const result = possibleResults[Math.floor(Math.random() * possibleResults.length)];
      setDetectionResult(result);
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-smart-green to-green-900 p-6 overflow-hidden">
      {/* Background particles */}
      <div className="fixed inset-0 z-0 opacity-10">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: `${Math.random() * 8 + 2}px`,
              height: `${Math.random() * 8 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>
      
      {/* Main content */}
      <div className="max-w-4xl mx-auto relative z-10">
        <header className="text-center mb-8 pt-6">
          <div 
            className={`transition-all duration-1000 transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}
          >
            <p className="text-gray-200 uppercase tracking-wider text-sm mb-2 relative inline-block">
              SMART AGRICULTURAL TOOLS
            </p>
            <h1 className="text-white text-4xl md:text-5xl font-bold relative inline-block">
              Plant Disease Detection
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-smart-yellow transform scale-x-0 origin-left transition-transform duration-700" 
                style={{ transform: isLoaded ? 'scaleX(1)' : 'scaleX(0)' }}
              ></div>
            </h1>
          </div>
        </header>

        <div className="bg-gray-800 bg-opacity-25 backdrop-blur-sm rounded-lg p-6 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column - Upload and Camera options */}
            <div 
              className={`transition-all duration-700 transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: '200ms' }}
            >
              <h2 className="text-white text-xl font-semibold mb-4">Upload Plant Image</h2>
              
              {/* Image preview area */}
              <div className="mb-6 w-full aspect-square bg-black bg-opacity-30 rounded-lg flex items-center justify-center overflow-hidden">
                {previewUrl ? (
                  <img 
                    src={previewUrl} 
                    alt="Selected plant" 
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <div className="text-gray-400 text-center p-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-2 text-smart-yellow" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                    <p>Selected image will appear here</p>
                  </div>
                )}
              </div>
              
              {/* Upload buttons */}
              <div className="flex flex-col space-y-4">
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFileChange}
                  ref={fileInputRef}
                />
                <button 
                  onClick={() => fileInputRef.current.click()}
                  className="w-full py-3 bg-smart-yellow text-smart-green text-sm font-bold rounded-lg transition-all duration-300 hover:bg-opacity-90 flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  Upload Image
                </button>
                
                <input 
                  type="file" 
                  accept="image/*" 
                  capture="environment" 
                  className="hidden" 
                  onChange={handleCameraCapture}
                  ref={cameraInputRef}
                />
                <button 
                  onClick={() => cameraInputRef.current.click()}
                  className="w-full py-3 bg-gray-700 text-white text-sm font-bold rounded-lg transition-all duration-300 hover:bg-gray-600 flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-smart-yellow" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                  Use Camera
                </button>
              </div>
            </div>
            
            {/* Right column - Analysis results */}
            <div 
              className={`transition-all duration-700 transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: '400ms' }}
            >
              <h2 className="text-white text-xl font-semibold mb-4">Detection Results</h2>
              
              {/* Analysis button */}
              <button 
                onClick={analyzeImage}
                disabled={!selectedImage || isAnalyzing}
                className={`w-full py-3 mb-6 text-sm font-bold rounded-lg transition-all duration-300 flex items-center justify-center ${
                  !selectedImage || isAnalyzing 
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                    : 'bg-smart-green text-white hover:bg-opacity-90'
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing Image...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-smart-yellow" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9 9a2 2 0 114 0 2 2 0 01-4 0z" />
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a4 4 0 00-3.446 6.032l-2.261 2.26a1 1 0 101.414 1.415l2.261-2.261A4 4 0 1011 5z" clipRule="evenodd" />
                    </svg>
                    Analyze Image
                  </>
                )}
              </button>
              
              {/* Results area */}
              <div className="w-full h-64 bg-black bg-opacity-30 rounded-lg p-4 overflow-y-auto">
                {detectionResult ? (
                  <div className="text-white">
                    <h3 className="text-smart-yellow font-bold mb-2">Analysis Results:</h3>
                    <p>{detectionResult}</p>
                    
                    {detectionResult.includes("Healthy") && (
                      <div className="mt-4 p-2 bg-green-900 bg-opacity-50 rounded">
                        <p className="text-green-400">✓ Your plant appears to be healthy!</p>
                      </div>
                    )}
                    
                    {detectionResult.includes("Warning") && (
                      <div className="mt-4 p-2 bg-red-900 bg-opacity-50 rounded">
                        <p className="text-red-400">⚠ Immediate attention required!</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400 text-center">
                    <p>{selectedImage ? "Click 'Analyze Image' to detect plant diseases" : "Upload or capture an image to begin analysis"}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Back button */}
          <div 
            className={`mt-8 text-center transition-all duration-700 transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: '600ms' }}
          >
            <button 
              onClick={() => window.close()} 
              className="inline-flex items-center text-smart-yellow hover:text-white transition-colors duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
      
      {/* Add CSS animation keyframes */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
          100% { transform: translateY(0) rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default PlantDiseaseDetection;