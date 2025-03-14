from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import shutil
from scripts.predict_plantdoc import predict_disease
from scripts.predict_with_graph import get_price_predictions
from scripts.predict_soil import predict_soil_type
import uuid
from PIL import Image
from fastapi.responses import JSONResponse
import io
import numpy as np
from tensorflow.keras.models import load_model
import json


app = FastAPI()

# ✅ CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ⚠️ Only for testing, not in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ✅ Mount graph images folder
GRAPH_DIR = r"D:\Bunny\AgriSync\backend\scripts\predicted_graphs"
os.makedirs(GRAPH_DIR, exist_ok=True)
app.mount("/graphs", StaticFiles(directory=GRAPH_DIR), name="graphs")

# ✅ Health check route
@app.get("/health")
def health_check():
    return {"status": "API is running"}

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
MODEL_PATH = r"D:\Bunny\AgriSync\backend\models\soil_classifier.keras"
LABELS_PATH = r"D:\Bunny\AgriSync\backend\models\class_names.json"
model = load_model(MODEL_PATH)

with open(LABELS_PATH, "r") as f:
    class_names = json.load(f)

print("📚 Loaded class names:", class_names)
    
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
    # Add more if needed
}

@app.post("/predict-soil")
async def predict_soil(file: UploadFile = File(...)):
    try:
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


# ✅ Print all registered routes
@app.on_event("startup")
async def list_routes():
    print("\n📋 Registered Routes:")
    for route in app.routes:
        print(f"➡️  {route.path}")
