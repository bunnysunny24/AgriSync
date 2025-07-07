#!/usr/bin/env python3
"""
Model Compatibility Optimizer
Ensures models are saved in deployment-compatible formats and handles version compatibility
"""

import os
import json
import logging
import tensorflow as tf
from tensorflow import keras
from datetime import datetime
import warnings

warnings.filterwarnings('ignore')
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class ModelCompatibilityOptimizer:
    def __init__(self, models_dir="models"):
        self.models_dir = models_dir
        os.makedirs(models_dir, exist_ok=True)
        
    def optimize_for_deployment(self, model, model_name, class_names):
        """
        Optimize and save model for maximum deployment compatibility
        
        Args:
            model: Trained Keras model
            model_name: Name for saving the model
            class_names: List of class names
        """
        logger.info(f"🔧 Optimizing {model_name} for deployment...")
        
        # 1. Save in multiple formats for compatibility
        self._save_keras_format(model, model_name)
        self._save_savedmodel_format(model, model_name)
        self._save_weights_only(model, model_name)
        
        # 2. Save class names and metadata
        self._save_metadata(model_name, class_names, model)
        
        # 3. Create deployment test script
        self._create_test_script(model_name, class_names)
        
        logger.info(f"✅ {model_name} optimization completed!")
    
    def _save_keras_format(self, model, model_name):
        """Save in new Keras format (.keras)"""
        try:
            keras_path = os.path.join(self.models_dir, f"{model_name}.keras")
            model.save(keras_path, save_format='keras')
            logger.info(f"✅ Keras format saved: {keras_path}")
        except Exception as e:
            logger.error(f"❌ Keras format save failed: {e}")
    
    def _save_savedmodel_format(self, model, model_name):
        """Save in TensorFlow SavedModel format"""
        try:
            savedmodel_path = os.path.join(self.models_dir, f"{model_name}_savedmodel")
            model.save(savedmodel_path, save_format='tf')
            logger.info(f"✅ SavedModel format saved: {savedmodel_path}")
        except Exception as e:
            logger.error(f"❌ SavedModel format save failed: {e}")
    
    def _save_weights_only(self, model, model_name):
        """Save weights only for custom loading"""
        try:
            weights_path = os.path.join(self.models_dir, f"{model_name}_weights.h5")
            model.save_weights(weights_path)
            logger.info(f"✅ Weights saved: {weights_path}")
        except Exception as e:
            logger.error(f"❌ Weights save failed: {e}")
    
    def _save_metadata(self, model_name, class_names, model):
        """Save comprehensive metadata"""
        metadata = {
            'model_name': model_name,
            'class_names': class_names,
            'num_classes': len(class_names),
            'input_shape': list(model.input_shape[1:]),
            'output_shape': list(model.output_shape[1:]),
            'tensorflow_version': tf.__version__,
            'keras_version': tf.keras.__version__,
            'created_at': datetime.now().isoformat(),
            'model_type': 'classification',
            'framework': 'tensorflow'
        }
        
        # Save class names (for backward compatibility)
        class_names_path = os.path.join(self.models_dir, "class_names.json")
        with open(class_names_path, 'w') as f:
            json.dump(class_names, f, indent=2)
        
        # Save comprehensive metadata
        metadata_path = os.path.join(self.models_dir, f"{model_name}_metadata.json")
        with open(metadata_path, 'w') as f:
            json.dump(metadata, f, indent=2)
        
        logger.info(f"✅ Metadata saved: {metadata_path}")
    
    def _create_test_script(self, model_name, class_names):
        """Create a test script for the model"""
        test_script = f'''#!/usr/bin/env python3
"""
Test script for {model_name} model
Auto-generated for deployment testing
"""

import os
import json
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import load_img, img_to_array

def load_model_safe(model_path):
    """Safely load model with error handling"""
    try:
        model = load_model(model_path)
        print(f"✅ Model loaded successfully: {{model_path}}")
        return model
    except Exception as e:
        print(f"❌ Model loading failed: {{e}}")
        return None

def test_prediction(model, class_names, test_image_path=None):
    """Test model prediction"""
    if model is None:
        print("❌ No model available for testing")
        return
    
    # Create dummy input if no test image provided
    if test_image_path is None or not os.path.exists(test_image_path):
        print("📝 Using dummy input for testing...")
        input_shape = model.input_shape[1:]
        dummy_input = np.random.random((1, *input_shape))
    else:
        print(f"📸 Loading test image: {{test_image_path}}")
        img = load_img(test_image_path, target_size=model.input_shape[1:3])
        dummy_input = np.expand_dims(img_to_array(img) / 255.0, axis=0)
    
    # Make prediction
    try:
        prediction = model.predict(dummy_input, verbose=0)
        predicted_class_idx = np.argmax(prediction[0])
        predicted_class = class_names[predicted_class_idx]
        confidence = prediction[0][predicted_class_idx]
        
        print(f"✅ Prediction successful:")
        print(f"   Class: {{predicted_class}}")
        print(f"   Confidence: {{confidence:.4f}}")
        print(f"   All probabilities: {{prediction[0]}}")
        
        return predicted_class, confidence
        
    except Exception as e:
        print(f"❌ Prediction failed: {{e}}")
        return None, None

def main():
    """Main test function"""
    print(f"🧪 Testing {model_name} model...")
    
    # Model paths to try
    model_paths = [
        "{model_name}.keras",
        "{model_name}_savedmodel",
        "soil_classifier.keras"  # fallback
    ]
    
    # Load class names
    class_names = {class_names}
    
    # Try loading model from different paths
    model = None
    for model_path in model_paths:
        if os.path.exists(model_path):
            model = load_model_safe(model_path)
            if model is not None:
                break
    
    if model is None:
        print("❌ Could not load any model")
        return
    
    # Test prediction
    test_prediction(model, class_names)
    
    print(f"🎉 {model_name} test completed!")

if __name__ == "__main__":
    main()
'''
        
        test_script_path = os.path.join(self.models_dir, f"test_{model_name}.py")
        with open(test_script_path, 'w') as f:
            f.write(test_script)
        
        logger.info(f"✅ Test script created: {test_script_path}")

def create_deployment_package():
    """Create a complete deployment package"""
    logger.info("📦 Creating deployment package...")
    
    # Create deployment requirements
    requirements = [
        "tensorflow>=2.10.0,<3.0.0",
        "numpy>=1.21.0",
        "pillow>=8.0.0",
        "fastapi>=0.68.0",
        "uvicorn>=0.15.0",
        "python-multipart>=0.0.5"
    ]
    
    with open("deployment_requirements.txt", 'w') as f:
        f.write('\n'.join(requirements))
    
    # Create deployment configuration
    deployment_config = {
        "tensorflow_version": tf.__version__,
        "python_version": "3.11",
        "model_format": "keras",
        "input_size": [224, 224, 3],
        "preprocessing": {
            "rescale": "1/255.0",
            "resize": [224, 224]
        },
        "deployment_tips": [
            "Use TensorFlow 2.10+ for best compatibility",
            "Ensure consistent image preprocessing",
            "Use explicit input shapes",
            "Test model loading before deployment"
        ]
    }
    
    with open("deployment_config.json", 'w') as f:
        json.dump(deployment_config, f, indent=2)
    
    logger.info("✅ Deployment package created!")

if __name__ == "__main__":
    create_deployment_package()
    logger.info("🎉 Model compatibility optimization tools ready!")
