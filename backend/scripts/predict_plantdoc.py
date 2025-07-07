import cv2
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing.image import img_to_array
import os
import json
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Model paths in order of preference (latest to oldest)
MODEL_PATHS = [
    os.path.join(os.path.dirname(__file__), "..", "models", "plantdoc_optimized_v2.keras"),
    os.path.join(os.path.dirname(__file__), "..", "models", "plantdoc_optimized_ema.keras"),
    os.path.join(os.path.dirname(__file__), "..", "models", "plantdoc_optimized.keras"),
    os.path.join(os.path.dirname(__file__), "..", "models", "plantdoc_best.keras"),
    os.path.join(os.path.dirname(__file__), "..", "models", "best_plantdoc_model.keras")
]

# Global model variable for lazy loading
_model = None

def load_model():
    """Load the plant disease model lazily with fallback options"""
    global _model
    if _model is None:
        last_error = None
        
        for model_path in MODEL_PATHS:
            if os.path.exists(model_path):
                try:
                    logger.info(f"Attempting to load plant disease model from: {model_path}")
                    _model = tf.keras.models.load_model(model_path)
                    logger.info(f"✅ Plant disease model loaded successfully from: {os.path.basename(model_path)}")
                    return _model
                except Exception as e:
                    logger.warning(f"⚠️ Failed to load {os.path.basename(model_path)}: {str(e)}")
                    last_error = e
                    continue
            else:
                logger.info(f"Model not found: {os.path.basename(model_path)}")
        
        # If all models failed to load
        if last_error:
            logger.error(f"Failed to load any plant disease model. Last error: {str(last_error)}")
            raise last_error
        else:
            raise FileNotFoundError("No plant disease models found")
    
# Global variables for lazy loading
_model = None
_class_names = None

def load_class_names():
    """Load class names from JSON file"""
    global _class_names
    if _class_names is None:
        class_names_path = os.path.join(os.path.dirname(__file__), "..", "models", "plantdoc_class_names.json")
        
        if os.path.exists(class_names_path):
            try:
                with open(class_names_path, 'r') as f:
                    _class_names = json.load(f)
                logger.info(f"Loaded {len(_class_names)} class names from JSON file")
            except Exception as e:
                logger.warning(f"Failed to load class names from JSON: {str(e)}")
                _class_names = get_fallback_class_names()
        else:
            logger.warning("Class names JSON file not found, using fallback")
            _class_names = get_fallback_class_names()
    
    return _class_names

def get_fallback_class_names():
    """Fallback class names in case JSON file is not available"""
    return [
        "Apple leaf", "Apple rust leaf", "Apple Scab Leaf", "Bell_pepper leaf", "Bell_pepper leaf spot",
        "Blueberry leaf", "Cherry leaf", "Corn Gray leaf spot", "Corn leaf blight", "Corn rust leaf",
        "grape leaf", "grape leaf black rot", "Peach leaf", "Potato leaf early blight", "Potato leaf late blight",
        "Raspberry leaf", "Soyabean leaf", "Squash Powdery mildew leaf", "Strawberry leaf", "Tomato Early blight leaf",
        "Tomato leaf", "Tomato leaf bacterial spot", "Tomato leaf late blight", "Tomato leaf mosaic virus",
        "Tomato leaf yellow virus", "Tomato mold leaf", "Tomato Septoria leaf spot"
    ]

def get_healthy_classes():
    """Get list of healthy plant classes"""
    return {
        "Apple leaf", "Bell_pepper leaf", "Blueberry leaf", "Cherry leaf", "grape leaf",
        "Peach leaf", "Raspberry leaf", "Soyabean leaf", "Strawberry leaf", "Tomato leaf"
    }

def predict_disease(image_path):
    try:
        # Load model and class names on first use
        model = load_model()
        class_names = load_class_names()
        healthy_classes = get_healthy_classes()
        
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
        predicted_class = class_names[np.argmax(prediction)]
        confidence = float(np.max(prediction))  

        
        health_status = "HEALTHY" if predicted_class in healthy_classes else "DISEASED"

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
