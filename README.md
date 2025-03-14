# 🌿 AgriSync: AI-Powered Smart Farming & Marketplace System

Welcome to **AgriSync**, a smart agriculture platform that leverages **AI/ML**, **Deep Learning**, and **Blockchain** to empower farmers with real-time insights, automate crop health monitoring, and provide transparent crop transactions.

🔗 GitHub: [https://github.com/bunnysunny24/AgriSync](https://github.com/bunnysunny24/AgriSync)

---

## 🌾 Project Overview

**AgriSync** is a full-stack system built for smart farming and crop traceability. It brings together:

- 🌿 AI-based **Plant Disease Detection** via images
- 📈 **Crop Price Prediction** based on historical data
- 🌦️ **Weather Forecasting & Alerts**
- 🌱 **Soil Quality Prediction**
- 🔗 **Blockchain Marketplace** for transparent crop transactions
- 🎨 A modern, user-friendly **React-based UI**

Farmers can make better decisions, detect diseases early, forecast crop prices, and sell safely using blockchain-backed records.

---

## ⚙️ How It Works

### 🧠 AI + ML Models
- **Plant Disease Detection**: Deep learning model (EfficientNetB4) classifies leaf diseases using uploaded images.
- **Price Prediction**: Machine learning models (Random Forest, XGBoost) trained on crop price data.
- **Weather Forecasting**: Uses time-series ML models to predict upcoming weather patterns.
- **Soil Quality Detection**: Classifies soil type using trained models based on NPK values and other soil parameters.

### 🔗 Blockchain Integration
- A smart contract (Solidity) enables **secure and transparent transactions** for crop selling.
- Farmers and buyers interact via a React UI, with Web3.js handling the contract calls.
- Transactions are stored on the **Ethereum** testnet (Ganache/Truffle), ensuring trust.

### 🌐 Frontend Interface
- Built using **React** and styled with **Tailwind CSS**.
- Farmers can:
  - Upload plant images
  - View predicted prices and weather alerts
  - See crop requests
  - List items for sale on the blockchain marketplace

---

## 🧰 Tech Stack

| Layer         | Technologies Used                                               |
|---------------|-----------------------------------------------------------------|
| **Frontend**  | React.js, Tailwind CSS, Web3.js                                 |
| **Backend**   | FastAPI, Python, Uvicorn                                        |
| **AI/ML**     | TensorFlow, Keras, Scikit-learn, XGBoost, OpenCV                |
| **Blockchain**| Solidity, Truffle, Ganache, Ethereum Testnet                    |
| **Data Tools**| Pandas, NumPy, Matplotlib                                       |

---

## 📦 Key Modules

- `predict_plantdoc.py`: Plant disease prediction
- `predict_with_graph.py`: Crop price prediction with graph generation
- `predict_weather.py`: Weather forecasting using ML
- `predict_soil.py`: Predicts soil type
- Smart contract: Crop listing, purchasing, and verification via blockchain

---

## 🧑‍🌾 Why AgriSync?

- Reduce crop loss with early disease detection
- Get real-time, data-backed market prices
- Sell crops confidently with blockchain traceability
- Empower farmers through AI-driven decisions

---

## 📍 Live Demo / GitHub

Check the repository and explore more:  
👉 [AgriSync GitHub Repo](https://github.com/bunnysunny24/AgriSync)

---

> **“AgriSync bridges AI and agriculture, creating a future-ready farming ecosystem.”**
