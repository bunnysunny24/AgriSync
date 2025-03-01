import cv2
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing.image import img_to_array
import preprocess_plantdoc  # Load class labels

# Load trained model
MODEL_PATH = "models/plantdoc_model.h5"
model = tf.keras.models.load_model(MODEL_PATH)

# Get class labels
CLASS_LABELS = list(preprocess_plantdoc.train_data.class_indices.keys())

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
image_path = "PlantDoc-Dataset/test/Tomato Early blight leaf/Tomato Early blight leaf (1).jpg"  
predict_disease(image_path)
