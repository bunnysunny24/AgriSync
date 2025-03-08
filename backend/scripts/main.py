from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import os
import shutil
from predict_plantdoc import predict_disease  # ✅ Import only this!

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
async def predict(file: UploadFile = File(...)):
    try:
        # ✅ Create temp folder (if not exists)
        temp_dir = "temp_uploads"
        os.makedirs(temp_dir, exist_ok=True)

        # ✅ Save uploaded image temporarily
        file_path = os.path.join(temp_dir, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # ✅ Call `predict_disease()` function
        result = predict_disease(file_path)

        # ✅ Cleanup: Remove temp file after prediction
        os.remove(file_path)

        return result  # ✅ Send prediction result to frontend

    except Exception as e:
        return {"error": str(e)}

# ✅ Run FastAPI (only for local testing)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
