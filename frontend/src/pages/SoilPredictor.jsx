import React, { useState } from 'react';
import axios from 'axios';

function SoilPredictor() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async () => {
    if (!file) return alert("Please upload an image!");

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
    } catch (err) {
      console.error(err);
      alert("Prediction failed.");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🌱 Soil Type Predictor</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleSubmit} style={{ marginTop: 10 }}>Predict</button>

      {result && (
        <div style={{ marginTop: 20 }}>
          <h3>Predicted Soil Type: {result.prediction}</h3>

          <p>
            Confidence: {typeof result.confidence === 'number'
              ? result.confidence.toFixed(2) + '%'
              : result.confidence}
          </p>

          {result.notes && (
            <p><strong>About:</strong> {result.notes}</p>
          )}

          {result.crops && result.crops.length > 0 && (
            <>
              <h4>✅ Suitable Crops:</h4>
              <ul>{result.crops.map(crop => <li key={crop}>{crop}</li>)}</ul>
            </>
          )}

          {result.care && result.care.length > 0 && (
            <>
              <h4>🛠️ Care Tips:</h4>
              <ul>{result.care.map(tip => <li key={tip}>{tip}</li>)}</ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default SoilPredictor;
