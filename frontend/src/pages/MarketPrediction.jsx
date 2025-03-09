import React from "react";

const predictionData = [
  {
    crop: "banana",
    unit: "Rs./Dozen",
    image: "/banana_prediction_20250309_181240.png",
    predictions: [
      { date: "2025-03-16", price: 15.01 },
      { date: "2025-03-23", price: 15.01 },
      { date: "2025-03-30", price: 18.0 },
      { date: "2025-04-06", price: 18.0 }
    ]
  },
  {
    crop: "onion",
    unit: "Rs./Kg",
    image: "/onion_prediction_20250309_182306.png",
    predictions: [
      { date: "2025-03-16", price: 21.74 },
      { date: "2025-03-23", price: 21.93 },
      { date: "2025-03-30", price: 22.1 },
      { date: "2025-04-06", price: 23.0 }
    ]
  },
  {
    crop: "tomato",
    unit: "Rs./Kg",
    image: "/tomato_prediction_20250309_182307.png",
    predictions: [
      { date: "2025-03-16", price: 12.91 },
      { date: "2025-03-23", price: 12.86 },
      { date: "2025-03-30", price: 12.92 },
      { date: "2025-04-06", price: 12.95 }
    ]
  },
  {
    crop: "wheat",
    unit: "Rs./Kg",
    image: "/wheat_prediction_20250309_182307.png",
    predictions: [
      { date: "2025-03-16", price: 44.13 },
      { date: "2025-03-23", price: 44.18 },
      { date: "2025-03-30", price: 45.0 },
      { date: "2025-04-06", price: 48.47 }
    ]
  },
  {
    crop: "carrot",
    unit: "Rs./Kg",
    image: "/carrot_prediction_20250309_182308.png",
    predictions: [
      { date: "2025-03-16", price: 14.96 },
      { date: "2025-03-23", price: 15.95 },
      { date: "2025-03-30", price: 17.5 },
      { date: "2025-04-06", price: 18.0 }
    ]
  }
];

const MarketPrediction = () => {
  return (
    <div style={{ padding: "20px", backgroundColor: "#111", color: "#fff" }}>
      <h2>📊 Market Predictions with Graphs</h2>

      {predictionData.map((item) => (
        <div
          key={item.crop}
          style={{
            marginBottom: "30px",
            padding: "20px",
            border: "1px solid #333",
            borderRadius: "8px",
            backgroundColor: "#1c1c1c"
          }}
        >
          <h3 style={{ color: "#f0db4f" }}>
            {item.crop.toUpperCase()} ({item.unit})
          </h3>

          <img
            src={item.image}
            alt={`${item.crop} prediction graph`}
            style={{
              width: "100%",
              maxWidth: "600px",
              marginTop: "10px",
              borderRadius: "8px"
            }}
          />

          <ul style={{ marginTop: "15px" }}>
            {item.predictions.map((pred, idx) => (
              <li key={idx}>
                {pred.date}: <strong>₹{pred.price} Rs./Kg</strong>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default MarketPrediction;
