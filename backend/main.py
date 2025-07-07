"""
AgriSync Backend API
Main FastAPI application
"""
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import shutil
import uuid
from PIL import Image
from fastapi.responses import JSONResponse
import io
import numpy as np
from tensorflow.keras.models import load_model
import json
import sys

# Add scripts directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'scripts'))

# Import prediction functions
from predict_plantdoc import predict_disease
from predict_with_graph import get_price_predictions
from predict_soil import predict_soil_type

app = FastAPI(title="AgriSync API", version="1.0.0")

# ✅ CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://superb-patience-production.up.railway.app",  # Your deployed frontend
        "http://localhost:5173",  # For local development
        "http://localhost:3000",   # Alternative local dev port
        "*"  # For testing - remove in production
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Mount graph images folder
GRAPH_DIR = os.path.join(os.path.dirname(__file__), "scripts", "predicted_graphs")
os.makedirs(GRAPH_DIR, exist_ok=True)
app.mount("/graphs", StaticFiles(directory=GRAPH_DIR), name="graphs")

# ✅ Root endpoint
@app.get("/")
def root():
    return {"message": "AgriSync API is running", "status": "healthy", "version": "1.0.0"}

# ✅ Health check routes
@app.get("/health")
def health_check():
    return {"status": "API is running"}

@app.get("/healthz")
def health_check_render():
    return {"status": "healthy", "message": "AgriSync API is running"}

# ✅ Plant Disease Prediction
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        temp_dir = "temp_uploads"
        os.makedirs(temp_dir, exist_ok=True)

        file_path = os.path.join(temp_dir, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        result = predict_disease(file_path)
        os.remove(file_path)
        return result
    except Exception as e:
        return {"error": str(e)}

# ✅ Market Price Prediction
@app.get("/market-predictions")
def get_predictions_for_graph():
    try:
        results = get_price_predictions()
        return {"status": "success", "data": results}
    except Exception as e:
        return {"status": "error", "message": str(e)}

# ✅ Soil Type Prediction
MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "soil_classifier.keras")
LABELS_PATH = os.path.join(os.path.dirname(__file__), "models", "class_names.json")

try:
    model = load_model(MODEL_PATH)
    with open(LABELS_PATH, "r") as f:
        class_names = json.load(f)
    print("📚 Loaded class names:", class_names)
except Exception as e:
    print(f"❌ Error loading soil model: {e}")
    model = None
    class_names = []

IMG_SIZE = (180, 180)

soil_info = {
    "Clay soil": {
        "notes": "Clay soil retains water and is rich in nutrients but can be dense.",
        "crops": ["Rice", "Broccoli", "Cabbage"],
        "care": ["Improve drainage", "Avoid overwatering", "Add compost"],
    },
    "Sandy soil": {
        "notes": "Sandy soil has large particles and drains quickly.",
        "crops": ["Carrots", "Peanuts", "Watermelon"],
        "care": ["Add organic matter", "Mulch frequently", "Fertilize regularly"],
    },
    "Loamy soil": {
        "notes": "Loamy soil is ideal for most plants, with a balanced texture and nutrients.",
        "crops": ["Tomatoes", "Wheat", "Sugarcane"],
        "care": ["Maintain pH level", "Use organic fertilizers", "Avoid compaction"],
    },
}

@app.post("/predict-soil")
async def predict_soil(file: UploadFile = File(...)):
    try:
        if model is None:
            return {"error": "Soil classifier model not loaded"}
            
        image = Image.open(file.file).convert("RGB")
        image = image.resize(IMG_SIZE)
        image_array = np.expand_dims(np.array(image) / 255.0, axis=0)
        print("🖼️ Processed image shape:", image_array.shape)

        prediction = model.predict(image_array)[0]
        print("🔍 Raw prediction probabilities:", prediction)
        predicted_index = np.argmax(prediction)
        predicted_class = class_names[predicted_index]
        confidence = float(prediction[predicted_index]) * 100

        # 🔍 Debugging log
        print("🔍 Raw prediction:", prediction)
        print("📌 Predicted index:", predicted_index)
        print("📌 Predicted class:", predicted_class)
        print("📈 Confidence:", confidence)

        info = soil_info.get(predicted_class, {
            "notes": "No additional info available.",
            "crops": [],
            "care": [],
        })

        return {
            "prediction": predicted_class,
            "confidence": confidence,
            "notes": info["notes"],
            "crops": info["crops"],
            "care": info["care"]
        }

    except Exception as e:
        return {"error": str(e)}

# ✅ Print all registered routes on startup
@app.on_event("startup")
async def startup_event():
    print("\n📋 AgriSync API Starting...")
    print("📋 Registered Routes:")
    for route in app.routes:
        if hasattr(route, 'path'):
            print(f"➡️  {route.path}")
    print("✅ AgriSync API is ready!")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
