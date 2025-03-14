import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SoilPredictor() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [animateResult, setAnimateResult] = useState(false);

  // Create image preview when file is selected
  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null); // Clear previous results
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setResult(null); // Clear previous results
    }
  };

  const handleSubmit = async () => {
    if (!file) return alert("Please upload an image!");

    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:8000/predict-soil", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log("🔍 Backend response:", res.data); // debug output
      setResult(res.data);
      setAnimateResult(true);
    } catch (err) {
      console.error(err);
      alert("Prediction failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
        <div className="bg-smart-green text-white py-6 px-8 rounded-t-2xl">
          <h2 className="text-3xl font-bold flex items-center">
            <span className="animate-bounce mr-2">🌱</span> 
            Soil Type Predictor
            <span className="ml-2 text-smart-yellow">AI</span>
          </h2>
          <p className="mt-2 text-green-100 opacity-90">Upload a soil image for instant analysis and recommendations</p>
        </div>
        
        <div className="p-8">
          {/* Upload section */}
          <div 
            className="border-2 border-dashed border-green-300 rounded-xl p-6 text-center transition-all duration-300 hover:border-smart-yellow"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {!preview ? (
              <div className="space-y-4">
                <div className="text-5xl animate-pulse mx-auto">📸</div>
                <p className="text-gray-600">Drag & drop your soil image here or click to browse</p>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange}
                  className="hidden" 
                  id="fileInput" 
                />
                <button 
                  onClick={() => document.getElementById('fileInput').click()}
                  className="bg-smart-green text-white px-6 py-3 rounded-lg transform transition hover:scale-105 hover:bg-green-800"
                >
                  Select Image
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <img 
                    src={preview} 
                    alt="Soil preview" 
                    className="max-h-64 mx-auto rounded-lg shadow-md object-contain animate-fadeIn" 
                  />
                  <button 
                    onClick={() => {setFile(null); setPreview(null);}}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full w-8 h-8 flex items-center justify-center opacity-80 hover:opacity-100 transition"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-gray-700 font-medium">{file?.name}</p>
                <button 
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className={`w-full bg-smart-yellow text-smart-green font-bold px-6 py-3 rounded-lg transform transition hover:scale-105 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-yellow-400'}`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-smart-green" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing...
                    </span>
                  ) : (
                    'Predict Soil Type'
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Results section */}
          {result && (
            <div className={`mt-8 border border-green-200 rounded-xl p-6 bg-green-50 transition-all duration-500 ${animateResult ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'}`}>
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-smart-green">
                  Analysis Results
                </h3>
                <div className="bg-smart-yellow text-smart-green px-3 py-1 rounded-full font-medium animate-pulse">
                  {typeof result.confidence === 'number'
                    ? result.confidence.toFixed(0) + '% Confidence'
                    : result.confidence}
                </div>
              </div>

              <div className="mt-4 p-4 bg-white rounded-lg shadow-inner">
                <h3 className="text-xl font-bold flex items-center">
                  <span className="text-2xl mr-2">🧪</span> 
                  Predicted: <span className="text-smart-green ml-2">{result.prediction}</span>
                </h3>
              </div>

              {result.notes && (
                <div className="mt-4 p-4 bg-white rounded-lg shadow-inner transition-all duration-300 hover:shadow-md">
                  <h4 className="font-bold text-gray-700">About this soil:</h4>
                  <p className="mt-2 text-gray-600">{result.notes}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {result.crops && result.crops.length > 0 && (
                  <div className="p-4 bg-white rounded-lg shadow transition-all duration-300 hover:shadow-md">
                    <h4 className="font-bold text-gray-700 flex items-center">
                      <span className="text-xl mr-2">✅</span> 
                      Suitable Crops
                    </h4>
                    <ul className="mt-3 space-y-2">
                      {result.crops.map((crop, index) => (
                        <li 
                          key={crop} 
                          className="flex items-center text-gray-600 transition-all duration-300"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <span className="mr-2 text-green-500">•</span> {crop}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.care && result.care.length > 0 && (
                  <div className="p-4 bg-white rounded-lg shadow transition-all duration-300 hover:shadow-md">
                    <h4 className="font-bold text-gray-700 flex items-center">
                      <span className="text-xl mr-2">🛠️</span> 
                      Care Tips
                    </h4>
                    <ul className="mt-3 space-y-2">
                      {result.care.map((tip, index) => (
                        <li 
                          key={tip} 
                          className="flex items-center text-gray-600 transition-all duration-300"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <span className="mr-2 text-smart-yellow">•</span> {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="text-center mt-6 text-gray-500 text-sm">
        © 2025 Soil Predictor AI | Using advanced ML for accurate soil analysis
      </div>
    </div>
  );
}

export default SoilPredictor;