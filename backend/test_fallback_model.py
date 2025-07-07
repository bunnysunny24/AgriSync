#!/usr/bin/env python3
"""
Test script to verify the fallback soil model works correctly
"""

import os
import sys
import json
import numpy as np
from PIL import Image
import tensorflow as tf
from tensorflow.keras.models import load_model

def test_fallback_model():
    """Test the fallback soil model"""
    
    # Model paths
    FALLBACK_MODEL_PATH = os.path.join("models", "soil_classifier_fallback.keras")
    LABELS_PATH = os.path.join("models", "class_names.json")
    
    print("🧪 Testing fallback soil model...")
    
    # Check if files exist
    if not os.path.exists(FALLBACK_MODEL_PATH):
        print(f"❌ Fallback model not found: {FALLBACK_MODEL_PATH}")
        return False
    
    if not os.path.exists(LABELS_PATH):
        print(f"❌ Class names file not found: {LABELS_PATH}")
        return False
    
    try:
        # Load model
        print(f"📁 Loading model from: {FALLBACK_MODEL_PATH}")
        model = load_model(FALLBACK_MODEL_PATH)
        print("✅ Model loaded successfully")
        
        # Load class names
        with open(LABELS_PATH, "r") as f:
            class_names = json.load(f)
        print(f"✅ Class names loaded: {class_names}")
        
        # Test with a dummy image
        print("🔍 Testing with dummy image...")
        dummy_image = np.random.random((1, 180, 180, 3))  # Random RGB image
        
        # Make prediction
        prediction = model.predict(dummy_image, verbose=0)
        print(f"✅ Prediction shape: {prediction.shape}")
        print(f"✅ Raw prediction: {prediction[0]}")
        
        # Get predicted class
        predicted_index = np.argmax(prediction[0])
        predicted_class = class_names[predicted_index]
        confidence = float(prediction[0][predicted_index]) * 100
        
        print(f"✅ Predicted class: {predicted_class}")
        print(f"✅ Confidence: {confidence:.1f}%")
        
        # Test with multiple images
        print("🔍 Testing with multiple dummy images...")
        for i in range(3):
            dummy_image = np.random.random((1, 180, 180, 3))
            prediction = model.predict(dummy_image, verbose=0)
            predicted_index = np.argmax(prediction[0])
            predicted_class = class_names[predicted_index]
            confidence = float(prediction[0][predicted_index]) * 100
            print(f"  Test {i+1}: {predicted_class} ({confidence:.1f}%)")
        
        print("🎉 Fallback model test completed successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Error testing fallback model: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

def test_soil_info():
    """Test soil information database"""
    print("\n📚 Testing soil information database...")
    
    soil_info = {
        "Alluvial": {
            "notes": "Fertile soil formed by river deposits, excellent for agriculture.",
            "crops": ["Rice", "Wheat", "Corn", "Sugarcane", "Cotton"],
            "care": ["Ensure proper drainage", "Regular organic matter addition", "Monitor pH levels"]
        },
        "Black": {
            "notes": "Rich in clay and organic matter, retains moisture well.",
            "crops": ["Cotton", "Wheat", "Jowar", "Linseed", "Tobacco"],
            "care": ["Improve drainage", "Add organic compost", "Deep plowing recommended"]
        },
        "Clay": {
            "notes": "Dense soil with high water retention, can be challenging for some crops.",
            "crops": ["Rice", "Wheat", "Barley", "Oats"],
            "care": ["Improve drainage", "Add organic matter", "Avoid working when wet"]
        },
        "Red": {
            "notes": "Iron-rich soil, generally well-drained but may need nutrient supplementation.",
            "crops": ["Millet", "Groundnut", "Potato", "Tobacco", "Pulses"],
            "care": ["Add lime if acidic", "Regular fertilization", "Organic matter addition"]
        }
    }
    
    for soil_type, info in soil_info.items():
        print(f"✅ {soil_type}: {len(info['crops'])} crops, {len(info['care'])} care tips")
    
    print("🎉 Soil information database test completed!")

if __name__ == "__main__":
    print("🚀 Starting soil model tests...")
    
    # Change to backend directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    success = test_fallback_model()
    test_soil_info()
    
    if success:
        print("\n✅ All tests passed! The fallback soil model is ready.")
    else:
        print("\n❌ Some tests failed. Please check the issues above.")
        sys.exit(1)
