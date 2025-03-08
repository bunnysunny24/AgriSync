import cv2
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing.image import img_to_array
import os

# ✅ Load trained model
MODEL_PATH = r"D:\Bunny\AgriSync\backend\models\plantdoc_best.keras"
model = tf.keras.models.load_model(MODEL_PATH)

# ✅ Manually define class labels to remove dependency on `preprocess_plantdoc.py`
CLASS_LABELS = [
    "Apple leaf", "Tomato leaf", "Bell_pepper leaf", "Peach leaf", "Soyabean leaf",
    "Strawberry leaf", "Grape leaf", "Apple rust", "Tomato blight", "Powdery mildew",
    "Early blight", "Bacterial spot", "Septoria leaf spot", "Leaf curl", "Late blight",
    "Nutrient deficiency", "Black spot", "Anthracnose", "Fungal infection"
]

# ✅ Define Healthy Classes
HEALTHY_CLASSES = {"Apple leaf", "Tomato leaf", "Bell_pepper leaf", "Peach leaf", "Soyabean leaf", "Strawberry leaf", "Grape leaf"}

def predict_disease(image_path):
    try:
        # ✅ Standardize path format
        image_path = os.path.normpath(image_path)

        # ✅ Check if file exists
        if not os.path.exists(image_path):
            return {"error": f"Image file not found -> {image_path}"}

        # ✅ Load image
        img = cv2.imread(image_path)

        # ✅ Check if image was loaded correctly
        if img is None:
            return {"error": f"Could not load image -> {image_path}"}

        # ✅ Convert BGR → RGB (Fix for TensorFlow models)
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        # ✅ Preprocess image
        img = cv2.resize(img, (224, 224))  # Match model input shape
        img = img_to_array(img) / 255.0    # Normalize
        img = np.expand_dims(img, axis=0)  # Expand dimensions for batch

        # ✅ Make prediction
        prediction = model.predict(img)
        predicted_class = CLASS_LABELS[np.argmax(prediction)]
        confidence = float(np.max(prediction))  # Convert NumPy float to Python float

        # ✅ Check if the predicted class is healthy
        health_status = "HEALTHY" if predicted_class in HEALTHY_CLASSES else "DISEASED"

        return {
            "class": predicted_class,
            "confidence": round(confidence, 4),
            "status": health_status
        }

    except Exception as e:
        return {"error": str(e)}

# ✅ Example usage (for testing)
if __name__ == "__main__":
    image_path = r"PlantDoc-Dataset\trial_image2.jpg"
    result = predict_disease(image_path)
    print(result)  # Print JSON response
