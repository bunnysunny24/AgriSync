import tensorflow as tf
import numpy as np
from PIL import Image
import os

# ✅ Path to the saved model
MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "models", "soil_classifier.keras")

# ✅ Class names (must match training data)
CLASS_NAMES = ['Alluvial soil', 'Black Soil', 'Clay soil', 'Red soil']

# ✅ Image input settings
IMG_SIZE = (180, 180)

# ✅ Soil Information Database
SOIL_INFO = {
    "Alluvial soil": {
        "crops": ["Wheat", "Rice", "Sugarcane", "Pulses", "Oilseeds"],
        "care": [
            "Maintain proper drainage to avoid waterlogging.",
            "Use crop rotation to maintain fertility.",
            "Add organic compost and green manure periodically."
        ],
        "notes": "Highly fertile and found in river plains. Suitable for intensive farming."
    },
    "Black Soil": {
        "crops": ["Cotton", "Soybean", "Millets", "Groundnut", "Sunflower"],
        "care": [
            "Avoid over-irrigation as it retains moisture well.",
            "Apply gypsum if alkalinity increases.",
            "Ensure deep plowing to break compact layers."
        ],
        "notes": "Also known as Regur soil, it is rich in lime, iron, and magnesium."
    },
    "Clay soil": {
        "crops": ["Paddy", "Potato", "Broccoli", "Cabbage", "Lettuce"],
        "care": [
            "Improve aeration by adding sand or compost.",
            "Avoid walking on wet clay soil to prevent compaction.",
            "Practice mulching to preserve moisture."
        ],
        "notes": "Heavy and retains water; ideal for crops needing more water."
    },
    "Red soil": {
        "crops": ["Millets", "Groundnut", "Potatoes", "Fruits like Mango & Guava"],
        "care": [
            "Use fertilizers rich in nitrogen, phosphorus, and potassium.",
            "Improve moisture retention by adding organic matter.",
            "Practice contour farming on slopes."
        ],
        "notes": "Low in nutrients but good for crops with proper management."
    }
}

def load_and_prepare_image(image_path):
    try:
        img = Image.open(image_path).convert("RGB")
        print(f"🖼️ Original image size: {img.size}")
        img = img.resize(IMG_SIZE)
        print(f"📏 Resized to: {IMG_SIZE}")
        img_array = np.array(img) / 255.0
        print(f"📊 Image array shape after normalization: {img_array.shape}")
        return np.expand_dims(img_array, axis=0)
    except Exception as e:
        print(f"❌ Failed to process image: {e}")
        return None


def predict_soil_type(image_path):
    print(f"🔍 Predicting soil type for: {image_path}")

    img_tensor = load_and_prepare_image(image_path)
    if img_tensor is None:
        print("❌ Image preprocessing failed.")
        return None

    print("📦 Loading model...")
    if not os.path.exists(MODEL_PATH):
        print(f"❌ Model not found at {MODEL_PATH}")
        return None

    try:
        model = tf.keras.models.load_model(MODEL_PATH)
        print("✅ Model loaded successfully.")
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        return None

    try:
        print(f"🧪 Model input shape: {model.input_shape}")
        print(f"🧪 Model output shape: {model.output_shape}")
        print(f"🧪 Image tensor shape: {img_tensor.shape}")

        prediction = model.predict(img_tensor)[0]
        predicted_index = int(np.argmax(prediction))
        confidence = float(prediction[predicted_index]) * 100
        predicted_class = CLASS_NAMES[predicted_index]

        print(f"✅ Prediction: {predicted_class} ({confidence:.2f}%)")
        print(f"📊 Raw prediction values: {prediction}")
    except Exception as e:
        print(f"❌ Prediction failed: {e}")
        return None