from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import cv2
import tensorflow as tf
from tensorflow.keras.preprocessing.image import img_to_array
import os
from io import BytesIO
import preprocess_plantdoc  # Load class labels

# ✅ Load trained model
MODEL_PATH = "models/plantdoc_best.keras"
model = tf.keras.models.load_model(MODEL_PATH)

# ✅ Get class labels
CLASS_LABELS = list(preprocess_plantdoc.train_data.class_indices.keys())

# ✅ Define Healthy Classes
HEALTHY_CLASSES = {
    "Apple leaf", "Tomato leaf", "Bell_pepper leaf",
    "Peach leaf", "Soyabean leaf", "Strawberry leaf", "Grape leaf"
}

# ✅ Initialize FastAPI
app = FastAPI()

# ✅ Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to the frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Health Check Route
@app.get("/health")
async def health_check():
    return {"status": "API is running"}

# ✅ Prediction Endpoint
@app.post("/predict")
async def predict_disease(file: UploadFile = File(...)):
    try:
        # ✅ Read image file
        contents = await file.read()
        img_array = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)

        if img is None:
            return {"error": "Invalid image file"}

        # ✅ Preprocess image
        img = cv2.resize(img, (224, 224))
        img = img_to_array(img) / 255.0  # Normalize
        img = np.expand_dims(img, axis=0)  # Expand dimensions for batch

        # ✅ Make prediction
        prediction = model.predict(img)
        predicted_class = CLASS_LABELS[np.argmax(prediction)]
        confidence = float(np.max(prediction))

        # ✅ Determine health status
        health_status = "HEALTHY" if predicted_class in HEALTHY_CLASSES else "DISEASED"

        return {
            "class": predicted_class,
            "confidence": confidence,
            "status": health_status
        }

    except Exception as e:
        return {"error": str(e)}

# ✅ Run FastAPI (only needed for local testing)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
