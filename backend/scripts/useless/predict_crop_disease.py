import cv2
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing.image import img_to_array

# Load trained model
MODEL_PATH = "models/crop_model.h5"
model = tf.keras.models.load_model(MODEL_PATH)

# Define class labels (adjust based on dataset)
CLASS_LABELS = ["Healthy", "Bacterial Spot", "Early Blight", "Late Blight", "Leaf Mold", "Mosaic Virus"]

def predict_disease(image_path):
    try:
        # Load and preprocess image
        img = cv2.imread(image_path)
        img = cv2.resize(img, (128, 128))
        img = img_to_array(img) / 255.0
        img = np.expand_dims(img, axis=0)

        # Make prediction
        prediction = model.predict(img)
        predicted_class = CLASS_LABELS[np.argmax(prediction)]

        print(f"🟢 Predicted Disease: {predicted_class} (Confidence: {np.max(prediction):.2f})")

    except Exception as e:
        print(f"❌ Error: {e}")

# Example usage
image_path = "test_images/diseased_leaf.jpg"  # Change this to your image path
predict_disease(image_path)
