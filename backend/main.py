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
import json
import sys
import traceback
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Add scripts directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'scripts'))

# Global variables for lazy loading
soil_model = None
class_names = None
plantdoc_predict_func = None
price_predict_func = None

app = FastAPI(title="AgriSync API", version="1.0.0")

# ✅ Lazy loading functions
def load_soil_model():
    """Load soil classification model lazily"""
    global soil_model, class_names
    if soil_model is None:
        try:
            from tensorflow.keras.models import load_model
            MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "soil_classifier.keras")
            LABELS_PATH = os.path.join(os.path.dirname(__file__), "models", "class_names.json")
            
            logger.info(f"Loading soil model from: {MODEL_PATH}")
            soil_model = load_model(MODEL_PATH)
            
            with open(LABELS_PATH, "r") as f:
                class_names = json.load(f)
            
            logger.info(f"Loaded soil model with classes: {class_names}")
            
        except Exception as e:
            logger.error(f"Failed to load soil model: {str(e)}")
            raise e
    
    return soil_model, class_names

def load_plantdoc_predictor():
    """Load plant disease predictor lazily"""
    global plantdoc_predict_func
    if plantdoc_predict_func is None:
        try:
            from predict_plantdoc import predict_disease
            plantdoc_predict_func = predict_disease
            logger.info("Loaded plant disease predictor")
        except Exception as e:
            logger.error(f"Failed to load plant disease predictor: {str(e)}")
            raise e
    
    return plantdoc_predict_func

def load_price_predictor():
    """Load price predictor lazily"""
    global price_predict_func
    if price_predict_func is None:
        try:
            from predict_with_graph import get_price_predictions
            price_predict_func = get_price_predictions
            logger.info("Loaded price predictor")
        except Exception as e:
            logger.error(f"Failed to load price predictor: {str(e)}")
            raise e
    
    return price_predict_func

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
def health_check_detailed():
    """Detailed health check with model status"""
    status = {
        "status": "healthy",
        "message": "AgriSync API is running",
        "version": "1.0.0",
        "models": {
            "soil_model": soil_model is not None,
            "plantdoc_predictor": plantdoc_predict_func is not None,
            "price_predictor": price_predict_func is not None
        }
    }
    return status

# ✅ Plant Disease Prediction
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        # Load predictor on first use
        predict_func = load_plantdoc_predictor()
        
        temp_dir = "temp_uploads"
        os.makedirs(temp_dir, exist_ok=True)

        file_path = os.path.join(temp_dir, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        result = predict_func(file_path)
        
        # Clean up
        if os.path.exists(file_path):
            os.remove(file_path)
            
        return result
    except Exception as e:
        logger.error(f"Plant disease prediction error: {str(e)}")
        logger.error(traceback.format_exc())
        return {
            "error": f"Plant disease prediction failed: {str(e)}",
            "prediction": "Unable to predict",
            "confidence": 0.0
        }

# ✅ Market Price Prediction
@app.get("/market-predictions")
def get_predictions_for_graph():
    try:
        # Load predictor on first use
        predict_func = load_price_predictor()
        results = predict_func()
        return {"status": "success", "data": results}
    except Exception as e:
        logger.error(f"Market prediction error: {str(e)}")
        logger.error(traceback.format_exc())
        return {
            "status": "error", 
            "message": f"Market prediction failed: {str(e)}",
            "data": []
        }

# ✅ Soil Type Prediction
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
        # Load model on first use
        model, class_names = load_soil_model()
        
        image = Image.open(file.file).convert("RGB")
        image = image.resize(IMG_SIZE)
        image_array = np.expand_dims(np.array(image) / 255.0, axis=0)
        logger.info(f"Processed image shape: {image_array.shape}")

        prediction = model.predict(image_array)[0]
        logger.info(f"Raw prediction probabilities: {prediction}")
        predicted_index = np.argmax(prediction)
        predicted_class = class_names[predicted_index]
        confidence = float(prediction[predicted_index]) * 100

        # 🔍 Debugging log
        logger.info(f"Predicted index: {predicted_index}")
        logger.info(f"Predicted class: {predicted_class}")
        logger.info(f"Confidence: {confidence}")

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
        logger.error(f"Soil prediction error: {str(e)}")
        logger.error(traceback.format_exc())
        return {
            "error": f"Soil prediction failed: {str(e)}",
        }

    except Exception as e:
        logger.error(f"Soil prediction error: {str(e)}")
        logger.error(traceback.format_exc())
        return {
            "error": f"Soil prediction failed: {str(e)}",
            "prediction": "Unable to predict",
            "confidence": 0.0,
            "notes": "Error occurred during prediction",
            "crops": [],
            "care": []
        }

# ✅ Print all registered routes on startup
@app.on_event("startup")
async def startup_event():
    logger.info("\n📋 AgriSync API Starting...")
    logger.info("📋 Registered Routes:")
    for route in app.routes:
        if hasattr(route, 'path'):
            logger.info(f"➡️  {route.path}")
    
    # Try to load models on startup (optional - will load on first use if this fails)
    try:
        logger.info("🔄 Attempting to pre-load models...")
        
        # Try to load soil model
        try:
            load_soil_model()
            logger.info("✅ Soil model loaded successfully")
        except Exception as e:
            logger.warning(f"⚠️ Could not pre-load soil model: {e}")
        
        # Try to load plant disease predictor
        try:
            load_plantdoc_predictor()
            logger.info("✅ Plant disease predictor loaded successfully")
        except Exception as e:
            logger.warning(f"⚠️ Could not pre-load plant disease predictor: {e}")
        
        # Try to load price predictor
        try:
            load_price_predictor()
            logger.info("✅ Price predictor loaded successfully")
        except Exception as e:
            logger.warning(f"⚠️ Could not pre-load price predictor: {e}")
            
    except Exception as e:
        logger.warning(f"⚠️ Model pre-loading failed: {e}")
        logger.info("📝 Models will be loaded on first use")
    
    logger.info("✅ AgriSync API is ready!")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
