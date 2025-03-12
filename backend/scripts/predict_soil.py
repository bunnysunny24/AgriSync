import tensorflow as tf
import numpy as np
from PIL import Image
import os

# ✅ Path to the saved model
MODEL_PATH = r"D:\Bunny\AgriSync\backend\models\soil_classifier.keras"

# ✅ Class names in order (must match training data order)
CLASS_NAMES = ['Alluvial soil', 'Black Soil', 'Clay soil', 'Red soil']

# ✅ Image input settings
IMG_SIZE = (180, 180)

def load_and_prepare_image(image_path):
    try:
        img = Image.open(image_path).convert("RGB")  # Ensure RGB
        img = img.resize(IMG_SIZE)
        img_array = np.array(img) / 255.0  # Normalize
        return np.expand_dims(img_array, axis=0)
    except Exception as e:
        print(f"❌ Failed to process image: {e}")
        return None

def predict_soil_type(image_path):
    print(f"🔍 Predicting soil type for: {image_path}")

    # Load and preprocess image
    img_tensor = load_and_prepare_image(image_path)
    if img_tensor is None:
        return

    # Load model
    print("📦 Loading model...")
    model = tf.keras.models.load_model(MODEL_PATH)

    # Predict
    prediction = model.predict(img_tensor)[0]
    predicted_index = np.argmax(prediction)
    confidence = prediction[predicted_index] * 100
    predicted_class = CLASS_NAMES[predicted_index]

    print(f"\n🌱 Predicted Soil Type: {predicted_class}")
    print(f"🔬 Confidence: {confidence:.2f}%")

if __name__ == "__main__":
    # 👉 Update this path to your test image
    SAMPLE_IMAGE_PATH = r"D:\Bunny\AgriSync\backend\Soil\test\Black Soil\Black_1.jpg"
    predict_soil_type(SAMPLE_IMAGE_PATH)
