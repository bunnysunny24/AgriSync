"""
Simple fallback soil classifier for compatibility
This creates a basic model that should work with any TensorFlow version
"""
import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
import json
import os

def create_simple_soil_model():
    """Create a simple soil classification model"""
    
    # Define class names
    class_names = ["Alluvial soil", "Black Soil", "Clay soil", "Red soil"]
    
    # Use MobileNetV2 as base (more compatible)
    base_model = MobileNetV2(
        weights='imagenet',
        include_top=False,
        input_shape=(180, 180, 3)
    )
    
    # Freeze base model
    base_model.trainable = False
    
    # Add custom classification layers
    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dropout(0.5)(x)
    x = Dense(128, activation='relu')(x)
    x = Dropout(0.3)(x)
    predictions = Dense(len(class_names), activation='softmax')(x)
    
    # Create the model
    model = Model(inputs=base_model.input, outputs=predictions)
    
    # Compile the model
    model.compile(
        optimizer='adam',
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    return model, class_names

def save_fallback_model():
    """Save a simple fallback model"""
    print("🔧 Creating fallback soil classification model...")
    
    model, class_names = create_simple_soil_model()
    
    # Define paths
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    models_dir = os.path.join(backend_dir, "models")
    os.makedirs(models_dir, exist_ok=True)
    
    model_path = os.path.join(models_dir, "soil_classifier_fallback.keras")
    labels_path = os.path.join(models_dir, "class_names.json")
    
    # Save model using newer format
    try:
        model.save(model_path, save_format='keras')
        print(f"✅ Fallback model saved: {model_path}")
    except Exception as e:
        print(f"❌ Error saving model: {e}")
        return False
    
    # Save class names
    try:
        with open(labels_path, 'w') as f:
            json.dump(class_names, f)
        print(f"✅ Class names saved: {labels_path}")
    except Exception as e:
        print(f"❌ Error saving class names: {e}")
        return False
    
    print("✅ Fallback model created successfully!")
    return True

if __name__ == "__main__":
    save_fallback_model()
