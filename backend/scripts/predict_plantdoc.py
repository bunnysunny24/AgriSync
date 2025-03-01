import cv2
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing.image import img_to_array
import preprocess_plantdoc  # Load class labels
import os

# Load trained model
MODEL_PATH = "models/plantdoc_mobilenet.keras"
model = tf.keras.models.load_model(MODEL_PATH)

# Get class labels
CLASS_LABELS = list(preprocess_plantdoc.train_data.class_indices.keys())

# ✅ Define Healthy Classes
HEALTHY_CLASSES = {"Apple leaf", "Tomato leaf", "Bell_pepper leaf", "Peach leaf", "Soyabean leaf", "Strawberry leaf", "Grape leaf"}

def predict_disease(image_path):
    try:
        # ✅ Fix path issue (use raw string or replace backslashes)
        image_path = os.path.normpath(image_path)  # Standardizes path format

        # ✅ Check if file exists
        if not os.path.exists(image_path):
            print(f"❌ Error: Image file not found -> {image_path}")
            return
        
        # Load image
        img = cv2.imread(image_path)

        # ✅ Check if image was loaded correctly
        if img is None:
            print(f"❌ Error: Could not load image -> {image_path}")
            return

        # Preprocess image
        img = cv2.resize(img, (224, 224))  # ✅ Fix: Match model input shape
        img = img_to_array(img) / 255.0    # Normalize
        img = np.expand_dims(img, axis=0)  # Expand dimensions for batch

        # Make prediction
        prediction = model.predict(img)
        predicted_class = CLASS_LABELS[np.argmax(prediction)]
        confidence = np.max(prediction)

        # ✅ Check if the predicted class is healthy
        if predicted_class in HEALTHY_CLASSES:
            print(f"✅ The plant is **HEALTHY** ({predicted_class}) - Confidence: {confidence:.2f}")
        else:
            print(f"⚠️ The plant is **DISEASED**: {predicted_class} - Confidence: {confidence:.2f}")

    except Exception as e:
        print(f"❌ Error: {e}")

# ✅ Example usage (Fix path issue)
image_path = r"PlantDoc-Dataset\trial_image1.jpg"  # Use raw string or forward slashes
predict_disease(image_path)
