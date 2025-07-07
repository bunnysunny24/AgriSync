import cv2
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing.image import img_to_array
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "models", "plantdoc_best.keras")

# Global model variable for lazy loading
_model = None

def load_model():
    """Load the plant disease model lazily"""
    global _model
    if _model is None:
        try:
            logger.info(f"Loading plant disease model from: {MODEL_PATH}")
            _model = tf.keras.models.load_model(MODEL_PATH)
            logger.info("Plant disease model loaded successfully")
        except Exception as e:
            logger.error(f"Failed to load plant disease model: {str(e)}")
            raise e
    return _model


CLASS_LABELS = [
    "Apple leaf", "Tomato leaf", "Bell_pepper leaf", "Peach leaf", "Soyabean leaf",
    "Strawberry leaf", "Grape leaf", "Apple rust", "Tomato blight", "Powdery mildew",
    "Early blight", "Bacterial spot", "Septoria leaf spot", "Leaf curl", "Late blight",
    "Nutrient deficiency", "Black spot", "Anthracnose", "Fungal infection"
]


HEALTHY_CLASSES = {"Apple leaf", "Tomato leaf", "Bell_pepper leaf", "Peach leaf", "Soyabean leaf", "Strawberry leaf", "Grape leaf"}

def predict_disease(image_path):
    try:
        # Load model on first use
        model = load_model()
        
        image_path = os.path.normpath(image_path)

        if not os.path.exists(image_path):
            return {"error": f"Image file not found -> {image_path}"}

        img = cv2.imread(image_path)

        if img is None:
            return {"error": f"Could not load image -> {image_path}"}

        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        img = cv2.resize(img, (224, 224))  
        img = img_to_array(img) / 255.0    
        img = np.expand_dims(img, axis=0)  
        prediction = model.predict(img)
        predicted_class = CLASS_LABELS[np.argmax(prediction)]
        confidence = float(np.max(prediction))  

        
        health_status = "HEALTHY" if predicted_class in HEALTHY_CLASSES else "DISEASED"

        return {
            "class": predicted_class,
            "confidence": round(confidence, 4),
            "status": health_status
        }

    except Exception as e:
        logger.error(f"Plant disease prediction error: {str(e)}")
        return {"error": str(e)}


if __name__ == "__main__":
    image_path = r"PlantDoc-Dataset\trial_image2.jpg"
    result = predict_disease(image_path)
    print(result)  
