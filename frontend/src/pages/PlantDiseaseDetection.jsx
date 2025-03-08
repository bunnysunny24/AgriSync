import React, { useState, useRef } from "react";
import axios from "axios";

const PlantDiseaseDetection = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [detectionResult, setDetectionResult] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef(null);

  // Handle file upload
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setDetectionResult("");
    }
  };

  // Send image to FastAPI for analysis
  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setDetectionResult("");

    const formData = new FormData();
    formData.append("file", selectedImage);

    try {
      const response = await axios.post("http://127.0.0.1:8000/predict", formData, {
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
    <div className="w-full min-h-screen bg-gray-900 p-6 flex flex-col items-center justify-center text-white">
      <h1 className="text-3xl font-bold mb-6">🌿 Plant Disease Detection</h1>

      {/* Image Preview */}
      <div className="mb-6 w-64 h-64 bg-gray-700 flex items-center justify-center rounded-lg overflow-hidden">
        {previewUrl ? (
          <img src={previewUrl} alt="Selected plant" className="w-full h-full object-cover" />
        ) : (
          <p className="text-gray-400">Upload an image to begin</p>
        )}
      </div>

      {/* Upload and Analyze Buttons */}
      <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} ref={fileInputRef} />
      <button
        onClick={() => fileInputRef.current.click()}
        className="bg-green-600 text-white px-4 py-2 rounded-lg mb-4"
      >
        Upload Image
      </button>

      <button
        onClick={analyzeImage}
        disabled={!selectedImage || isAnalyzing}
        className={`px-4 py-2 rounded-lg ${
          !selectedImage ? "bg-gray-500 cursor-not-allowed" : "bg-yellow-500"
        }`}
      >
        {isAnalyzing ? "Analyzing..." : "Analyze Image"}
      </button>

      {/* Display Results */}
      {detectionResult && (
        <div className="mt-6 p-4 w-80 bg-gray-800 rounded-lg">
          {detectionResult.error ? (
            <p className="text-red-500">⚠ {detectionResult.error}</p>
          ) : (
            <>
              <p className="text-lg font-bold">Prediction: {detectionResult.class}</p>
              <p>Confidence: {(detectionResult.confidence * 100).toFixed(2)}%</p>
              <p className={detectionResult.status === "HEALTHY" ? "text-green-400" : "text-red-400"}>
                Status: {detectionResult.status}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default PlantDiseaseDetection;
