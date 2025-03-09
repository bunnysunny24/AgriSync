from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import shutil
from scripts.predict_plantdoc import predict_disease
try:
    from scripts.predict_with_graph import get_price_predictions
    print("✅ Successfully imported get_price_predictions()")
except Exception as e:
    print("❌ Failed to import get_price_predictions:", e)


app = FastAPI()

# ✅ Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for now
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Define and mount static graph folder
GRAPH_DIR = r"D:\Bunny\AgriSync\backend\scripts\predicted_graphs"
os.makedirs(GRAPH_DIR, exist_ok=True)
app.mount("/graphs", StaticFiles(directory=GRAPH_DIR), name="graphs")

# ✅ Health Check
@app.get("/health")
def health_check():
    return {"status": "API is running"}

# ✅ Disease Prediction (image upload)
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

# ✅ Market Predictions
print("🟢 Registering /market-predictions route")
@app.get("/market-predictions")
def get_predictions_for_graph():
    try:
        results = get_price_predictions()
        return {"status": "success", "data": results}
    except Exception as e:
        return {"status": "error", "message": str(e)}
    
    
@app.on_event("startup")
async def list_routes():
    print("\n📋 Registered Routes:")
    for route in app.routes:
        print(f"➡️  {route.path}")



