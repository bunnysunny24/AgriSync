import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ENDPOINTS } from "../config/api";

const PlantDiseaseDetection = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [detectionResult, setDetectionResult] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [diseases, setDiseases] = useState([
    { name: "Late Blight", count: 12 },
    { name: "Early Blight", count: 8 },
    { name: "Bacterial Spot", count: 5 },
    { name: "Healthy", count: 42 }
  ]);
  
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoaded(true);
    
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setDetectionResult("");
    }
  };

  const openCamera = async () => {
    try {
      const ipAddress = "10.9.143.196";
      const port = "4747";
      
      const droidcamUrl = `http://${ipAddress}:${port}/video`;
      
      if (!videoRef.current) {
        console.error("Video element is not available");
        alert("Camera initialization failed. Please try again.");
        return;
      }
      
      const testConnection = new Image();
      testConnection.onload = () => {
        console.log("DroidCam connection successful");

        if (videoRef.current) {
          videoRef.current.src = droidcamUrl;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play()
              .then(() => {
                setIsCameraOpen(true);
              })
              .catch(error => {
                console.error("Error playing DroidCam feed:", error);
                tryAlternativeUrl();
              });
          };
          
          videoRef.current.onerror = () => {
            console.error("Error loading DroidCam video feed");
            tryAlternativeUrl();
          };
        }
      };
      
      testConnection.onerror = () => {
        console.error("Could not connect to primary DroidCam URL");
        tryAlternativeUrl();
      };
      
      testConnection.src = `http://${ipAddress}:${port}/mjpegfeed?640x480`;
      
      const tryAlternativeUrl = () => {
        console.log("Trying alternative DroidCam URL format...");
        
        if (!videoRef.current) {
          console.error("Video element is not available during fallback");
          alert("Camera initialization failed. Please try again.");
          setIsCameraOpen(false);
          return;
        }
        
        const mjpegUrl = `http://${ipAddress}:${port}/mjpegfeed`;
        videoRef.current.src = mjpegUrl;
        
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play()
            .then(() => {
              setIsCameraOpen(true);
            })
            .catch(error => {
              console.error("Error playing alternative DroidCam feed:", error);
              tryThirdOption();
            });
        };
        
        videoRef.current.onerror = () => {
          console.error("Error loading alternative DroidCam feed");
          tryThirdOption();
        };
      };
      
      const tryThirdOption = () => {
        console.log("Trying third DroidCam URL format...");
        
        if (!videoRef.current) {
          console.error("Video element is not available during second fallback");
          alert("Camera initialization failed. Please try again.");
          setIsCameraOpen(false);
          return;
        }
        
        const webrtcUrl = `http://${ipAddress}:${port}/videofeed`;
        videoRef.current.src = webrtcUrl;
        
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play()
            .then(() => {
              setIsCameraOpen(true);
            })
            .catch(finalError => {
              console.error("All DroidCam connection attempts failed:", finalError);
              alert("Could not connect to DroidCam after multiple attempts. Please verify:\n1. DroidCam is running on your phone\n2. Your phone and computer are on the same network\n3. The IP address and port are correct (10.9.143.196:4747)\n4. No firewall is blocking the connection");
              closeCamera();
            });
        };
        
        videoRef.current.onerror = () => {
          console.error("All DroidCam connection attempts failed");
          alert("Could not connect to DroidCam after multiple attempts. Please verify your DroidCam settings and network connection.");
          closeCamera();
        };
      };
      
    } catch (error) {
      console.error("Error accessing DroidCam:", error);
      alert("Could not access DroidCam. Please check your connection and DroidCam settings.");
      closeCamera();
    }
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video || !canvas) {
      console.error("Video or canvas element is not available");
      return;
    }
    
    const context = canvas.getContext('2d');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    canvas.toBlob((blob) => {
      const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(blob));
      
      closeCamera();
    }, 'image/jpeg', 0.95);
  };

  const closeCamera = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.src = "";
      videoRef.current.load();
    }
    setIsCameraOpen(false);
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setDetectionResult("");

    const formData = new FormData();
    formData.append("file", selectedImage);

    try {
      const response = await axios.post(ENDPOINTS.PREDICT_DISEASE, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setDetectionResult(response.data);
    } catch (error) {
      setDetectionResult({ error: "Error analyzing image" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-smart-green to-green-900 p-6 overflow-hidden">
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
      
      <div className="max-w-6xl mx-auto relative z-10">
        <header className="text-center mb-8 pt-6">
          <div 
            className={`transition-all duration-1000 transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}
          >
            <button 
              onClick={() => navigate('/')}
              className="absolute left-4 top-4 text-white hover:text-smart-yellow transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            
            <p className="text-gray-200 uppercase tracking-wider text-sm mb-2 relative inline-block">
              SMART AGRICULTURAL TOOLS
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-smart-yellow transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
            </p>
            <br></br>
            <h1 className="text-white text-4xl md:text-5xl font-bold relative inline-block">
              Plant Disease Detection
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-smart-yellow transform scale-x-0 origin-left transition-transform duration-700" 
                style={{ transform: isLoaded ? 'scaleX(1)' : 'scaleX(0)' }}
              ></div>
            </h1>
          </div>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left section: Upload and camera controls */}
          <div 
            className={`bg-gray-800 bg-opacity-25 backdrop-blur-sm rounded-lg p-6 flex flex-col items-center transition-all duration-500 shadow-lg transform ${isLoaded ? 'translateY(0) opacity-100' : 'translateY(50px) opacity-0'}`}
            style={{ transitionDelay: '200ms' }}
          >
            <div className="relative w-full aspect-square mb-6 bg-black bg-opacity-30 rounded-lg overflow-hidden flex items-center justify-center">
              {isCameraOpen ? (
                <>
                  <video 
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="h-full w-full object-cover"
                  />
                  <canvas ref={canvasRef} className="hidden" />
                </>
              ) : previewUrl ? (
                <img src={previewUrl} alt="Selected plant" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-smart-yellow opacity-50 mb-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                  <p className="text-gray-300">Upload or capture an image to begin analysis</p>
                </div>
              )}
              
              {isAnalyzing && (
                <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-smart-yellow"></div>
                  <p className="absolute text-white mt-24">Analyzing...</p>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-3 gap-4 w-full">
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} ref={fileInputRef} />
              
              <button
                onClick={() => fileInputRef.current.click()}
                className="col-span-1 bg-black bg-opacity-30 hover:bg-opacity-50 text-white py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-300 group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-smart-yellow group-hover:scale-110 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                Upload
              </button>
              
              {isCameraOpen ? (
                <>
                  <button
                    onClick={captureImage}
                    className="col-span-1 bg-smart-yellow text-smart-green py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-300 hover:bg-opacity-90"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                    Capture
                  </button>
                  
                  <button
                    onClick={closeCamera}
                    className="col-span-1 bg-red-500 text-white py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-300 hover:bg-opacity-90"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={openCamera}
                    className="col-span-1 bg-black bg-opacity-30 hover:bg-opacity-50 text-white py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-300 group"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-smart-yellow group-hover:scale-110 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                    Camera
                  </button>
                  
                  <button
                    onClick={analyzeImage}
                    disabled={!selectedImage || isAnalyzing}
                    className={`col-span-1 py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-300 ${
                      !selectedImage || isAnalyzing
                        ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                        : "bg-smart-yellow text-smart-green hover:bg-opacity-90"
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6.625 2.655A9 9 0 0119 11a1 1 0 11-2 0 7 7 0 00-9.625-6.492 1 1 0 11-.75-1.853zM4.662 4.959A1 1 0 014.75 6.37 6.97 6.97 0 003 11a1 1 0 11-2 0 8.97 8.97 0 012.25-5.953 1 1 0 011.412-.088z" clipRule="evenodd" />
                      <path fillRule="evenodd" d="M5 11a5 5 0 1110 0 1 1 0 11-2 0 3 3 0 10-6 0c0 1.677-.345 3.276-.968 4.729a1 1 0 11-1.838-.789A9.964 9.964 0 005 11z" clipRule="evenodd" />
                    </svg>
                    Analyze
                  </button>
                </>
              )}
            </div>
            
            {detectionResult && !isCameraOpen && (
              <div className="mt-6 w-full bg-black bg-opacity-30 backdrop-blur-sm rounded-lg p-4 text-white animate-fadeIn">
                <h3 className="text-lg font-bold text-smart-yellow border-b border-gray-700 pb-2 mb-3">Analysis Results</h3>
                
                {detectionResult.error ? (
                  <div className="p-3 bg-red-900 bg-opacity-30 rounded-lg text-red-300">
                    <p className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {detectionResult.error}
                    </p>
                    <p className="text-sm mt-2">Please try again with a clearer image.</p>
                  </div>
                ) : (
                  <div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-black bg-opacity-30 p-3 rounded-lg">
                        <p className="text-gray-400 text-sm">Disease</p>
                        <p className="text-xl font-bold">{detectionResult.class}</p>
                      </div>
                      
                      <div className="bg-black bg-opacity-30 p-3 rounded-lg">
                        <p className="text-gray-400 text-sm">Confidence</p>
                        <p className="text-xl font-bold">{(detectionResult.confidence * 100).toFixed(1)}%</p>
                      </div>
                    </div>
                    
                    <div className="bg-black bg-opacity-30 p-3 rounded-lg flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${detectionResult.status === "HEALTHY" ? "bg-green-500" : "bg-red-500"}`}></div>
                      <p>Status: <span className={detectionResult.status === "HEALTHY" ? "text-green-400" : "text-red-400"}>{detectionResult.status}</span></p>
                    </div>
                    
                    {detectionResult.treatment && (
                      <div className="mt-4 bg-black bg-opacity-30 p-3 rounded-lg">
                        <p className="text-gray-400 text-sm mb-1">Recommended Treatment:</p>
                        <p>{detectionResult.treatment}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="flex flex-col gap-6">
            <div 
              className={`bg-gray-800 bg-opacity-25 backdrop-blur-sm rounded-lg p-6 transition-all duration-500 shadow-lg transform ${isLoaded ? 'translateY(0) opacity-100' : 'translateY(50px) opacity-0'}`}
              style={{ transitionDelay: '300ms' }}
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-smart-yellow" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                How It Works
              </h3>
              
              <div className="space-y-4 text-gray-200 text-sm">
                <p>Our AI-powered plant disease detection system uses computer vision to identify diseases in crops. The system is trained on thousands of images of healthy and diseased plants.</p>
                
                <div className="bg-black bg-opacity-30 p-3 rounded-lg">
                  <p className="font-medium mb-2">Simple 3-step process:</p>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Upload or capture a clear image of the affected plant</li>
                    <li>Our AI analyzes the image for disease patterns</li>
                    <li>Receive instant identification and treatment advice</li>
                  </ol>
                </div>
                
                <p>For best results, take close-up images of affected leaves or stems in good lighting conditions.</p>
              </div>
            </div>
            
            <div 
              className={`bg-gray-800 bg-opacity-25 backdrop-blur-sm rounded-lg p-6 transition-all duration-500 shadow-lg transform ${isLoaded ? 'translateY(0) opacity-100' : 'translateY(50px) opacity-0'}`}
              style={{ transitionDelay: '400ms' }}
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-smart-yellow" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                  <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                </svg>
                Recent Farm Statistics
              </h3>
              
              <div className="space-y-3">
                <p className="text-gray-300 text-sm mb-2">Common diseases detected on your farm:</p>
                
                {diseases.map((disease, index) => (
                  <div key={index} className="bg-black bg-opacity-30 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-white">{disease.name}</span>
                      <span className="text-sm text-gray-400">{disease.count} cases</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${disease.name === "Healthy" ? "bg-green-500" : "bg-red-500"}`} 
                        style={{ width: `${(disease.count / Math.max(...diseases.map(d => d.count))) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div 
        className={`fixed bottom-6 right-6 z-20 transition-all duration-700 transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        style={{ transitionDelay: '1000ms' }}
      >
        <button 
          onClick={() => navigate('/')}
          className="w-14 h-14 rounded-full bg-smart-yellow text-smart-green flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
          100% { transform: translateY(0) rotate(360deg); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default PlantDiseaseDetection;