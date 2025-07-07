"""
AgriSync Backend API - Minimal Version
This version starts without loading any models to ensure deployment success
"""
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="AgriSync API", version="1.0.0")

# ✅ CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://superb-patience-production.up.railway.app",
        "http://localhost:5173",
        "http://localhost:3000",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
    return {"status": "healthy", "message": "AgriSync API is running"}

# ✅ Model status endpoint
@app.get("/models/status")
def model_status():
    return {
        "soil_model": "not_loaded",
        "plant_disease_model": "not_loaded", 
        "price_prediction_model": "not_loaded",
        "message": "Models will be loaded on first use"
    }

# ✅ Placeholder endpoints that return appropriate messages
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    return {
        "message": "Plant disease prediction service is temporarily unavailable",
        "class": "Service unavailable",
        "confidence": 0.0,
        "status": "UNAVAILABLE"
    }

@app.get("/market-predictions")
def get_predictions_for_graph():
    return {
        "status": "unavailable",
        "message": "Market prediction service is temporarily unavailable",
        "data": []
    }

@app.post("/predict-soil")
async def predict_soil(file: UploadFile = File(...)):
    return {
        "message": "Soil prediction service is temporarily unavailable",
        "prediction": "Service unavailable",
        "confidence": 0.0,
        "notes": "Service is temporarily unavailable",
        "crops": [],
        "care": []
    }

@app.on_event("startup")
async def startup_event():
    logger.info("🚀 AgriSync API (Minimal Version) Starting...")
    logger.info("📋 Registered Routes:")
    for route in app.routes:
        if hasattr(route, 'path'):
            logger.info(f"➡️  {route.path}")
    logger.info("✅ AgriSync API is ready!")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
