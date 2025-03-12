import tensorflow as tf
import numpy as np
from PIL import Image
import os

# ✅ Path to the saved model
MODEL_PATH = r"D:\Bunny\AgriSync\backend\models\soil_classifier.keras"

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
        img = img.resize(IMG_SIZE)
        img_array = np.array(img) / 255.0
        return np.expand_dims(img_array, axis=0)
    except Exception as e:
        print(f"❌ Failed to process image: {e}")
        return None

def predict_soil_type(image_path):
    print(f"🔍 Predicting soil type for: {image_path}")

    img_tensor = load_and_prepare_image(image_path)
    if img_tensor is None:
        return

    print("📦 Loading model...")
    model = tf.keras.models.load_model(MODEL_PATH)

    prediction = model.predict(img_tensor)[0]
    predicted_index = np.argmax(prediction)
    confidence = prediction[predicted_index] * 100
    predicted_class = CLASS_NAMES[predicted_index]

    print(f"\n🌱 Predicted Soil Type: {predicted_class}")
    print(f"🔬 Confidence: {confidence:.2f}%")

    # 🎯 Recommendation Section
    soil_data = SOIL_INFO.get(predicted_class)
    if soil_data:
        print(f"\n🧠 About {predicted_class}: {soil_data['notes']}")
        print("\n✅ Suitable Crops:")
        for crop in soil_data['crops']:
            print(f"  - {crop}")

        print("\n🛠️  Soil Care Tips:")
        for tip in soil_data['care']:
            print(f"  • {tip}")
    else:
        print("ℹ️ No info available for this soil type.")

if __name__ == "__main__":
    # 🔁 Change this path to test another image
    SAMPLE_IMAGE_PATH = r"D:\Bunny\AgriSync\backend\Soil\test\Black Soil\Black_1.jpg"
    predict_soil_type(SAMPLE_IMAGE_PATH)
