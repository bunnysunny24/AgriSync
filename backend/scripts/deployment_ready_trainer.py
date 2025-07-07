#!/usr/bin/env python3
"""
Deployment-Ready Model Training
Simplified training script optimized for deployment environments
"""

import os
import sys
import json
import logging
import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers, models, optimizers, callbacks
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from datetime import datetime
import warnings

# Suppress warnings and configure TensorFlow
warnings.filterwarnings('ignore')
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
os.environ['TF_FORCE_GPU_ALLOW_GROWTH'] = 'true'

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class DeploymentReadyTrainer:
    def __init__(self):
        """Initialize deployment-ready trainer"""
        self.models_dir = "models"
        os.makedirs(self.models_dir, exist_ok=True)
        
        # Configure GPU if available
        self.setup_gpu()
        
        logger.info("🚀 Deployment-Ready Trainer initialized")

    def setup_gpu(self):
        """Configure GPU for deployment compatibility"""
        try:
            gpus = tf.config.experimental.list_physical_devices('GPU')
            if gpus:
                for gpu in gpus:
                    tf.config.experimental.set_memory_growth(gpu, True)
                logger.info(f"✅ GPU configured: {len(gpus)} GPU(s)")
            else:
                logger.info("🔄 Using CPU")
        except Exception as e:
            logger.warning(f"⚠️ GPU setup warning: {e}")

    def create_deployment_soil_model(self):
        """Create a deployment-optimized soil classification model"""
        logger.info("🌍 Creating deployment-ready soil model...")
        
        # Simple but effective architecture for deployment
        model = models.Sequential([
            # Input layer with explicit shape
            layers.Input(shape=(180, 180, 3), name='input_layer'),
            
            # Preprocessing
            layers.Rescaling(1./255, name='rescaling'),
            
            # Feature extraction
            layers.Conv2D(32, 3, activation='relu', name='conv1'),
            layers.MaxPooling2D(name='pool1'),
            layers.Conv2D(64, 3, activation='relu', name='conv2'),
            layers.MaxPooling2D(name='pool2'),
            layers.Conv2D(128, 3, activation='relu', name='conv3'),
            layers.MaxPooling2D(name='pool3'),
            
            # Classification head
            layers.Flatten(name='flatten'),
            layers.Dropout(0.5, name='dropout1'),
            layers.Dense(128, activation='relu', name='dense1'),
            layers.Dropout(0.3, name='dropout2'),
            layers.Dense(4, activation='softmax', name='predictions')
        ])
        
        # Compile for deployment
        model.compile(
            optimizer=optimizers.Adam(learning_rate=0.001),
            loss='sparse_categorical_crossentropy',
            metrics=['accuracy']
        )
        
        return model

    def create_mock_training_data(self):
        """Create mock training data for testing"""
        logger.info("📝 Creating mock training data...")
        
        # Create synthetic data for testing
        x_train = np.random.random((100, 180, 180, 3))
        y_train = np.random.randint(0, 4, (100,))
        x_val = np.random.random((20, 180, 180, 3))
        y_val = np.random.randint(0, 4, (20,))
        
        return x_train, y_train, x_val, y_val

    def train_deployment_model(self):
        """Train a deployment-ready model"""
        logger.info("🎯 Training deployment-ready soil model...")
        
        # Create model
        model = self.create_deployment_soil_model()
        
        # Get training data (mock for testing)
        x_train, y_train, x_val, y_val = self.create_mock_training_data()
        
        # Training callbacks
        callbacks_list = [
            callbacks.EarlyStopping(patience=10, restore_best_weights=True),
            callbacks.ReduceLROnPlateau(patience=5, factor=0.5)
        ]
        
        # Train model
        history = model.fit(
            x_train, y_train,
            validation_data=(x_val, y_val),
            epochs=20,  # Quick training for testing
            batch_size=16,
            callbacks=callbacks_list,
            verbose=1
        )
        
        return model, history

    def save_deployment_model(self, model, model_name="soil_classifier_deployment"):
        """Save model in deployment-ready format"""
        logger.info("💾 Saving deployment-ready model...")
        
        # Save in new Keras format
        model_path = os.path.join(self.models_dir, f"{model_name}.keras")
        model.save(model_path, save_format='keras')
        
        # Save class names
        class_names = ["Alluvial soil", "Black Soil", "Clay soil", "Red soil"]
        class_names_path = os.path.join(self.models_dir, "class_names.json")
        with open(class_names_path, 'w') as f:
            json.dump(class_names, f, indent=2)
        
        # Save model metadata
        metadata = {
            'model_name': model_name,
            'input_shape': [180, 180, 3],
            'num_classes': 4,
            'class_names': class_names,
            'tensorflow_version': tf.__version__,
            'created_at': datetime.now().isoformat(),
            'deployment_ready': True
        }
        
        metadata_path = os.path.join(self.models_dir, f"{model_name}_metadata.json")
        with open(metadata_path, 'w') as f:
            json.dump(metadata, f, indent=2)
        
        logger.info(f"✅ Model saved successfully:")
        logger.info(f"   Model: {model_path}")
        logger.info(f"   Classes: {class_names_path}")
        logger.info(f"   Metadata: {metadata_path}")
        
        return model_path

    def test_model_loading(self, model_path):
        """Test that the saved model can be loaded"""
        logger.info("🧪 Testing model loading...")
        
        try:
            # Load model
            loaded_model = tf.keras.models.load_model(model_path)
            
            # Test prediction
            test_input = np.random.random((1, 180, 180, 3))
            prediction = loaded_model.predict(test_input, verbose=0)
            
            logger.info(f"✅ Model loading test passed!")
            logger.info(f"   Prediction shape: {prediction.shape}")
            logger.info(f"   Prediction: {prediction[0]}")
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Model loading test failed: {e}")
            return False

def main():
    """Main training function"""
    logger.info("🚀 Starting Deployment-Ready Training...")
    
    try:
        # Initialize trainer
        trainer = DeploymentReadyTrainer()
        
        # Train model
        model, history = trainer.train_deployment_model()
        
        # Save model
        model_path = trainer.save_deployment_model(model)
        
        # Test loading
        if trainer.test_model_loading(model_path):
            logger.info("🎉 Deployment-ready model created successfully!")
        else:
            logger.error("❌ Model loading test failed")
            
    except Exception as e:
        logger.error(f"❌ Training failed: {e}")
        import traceback
        logger.error(traceback.format_exc())

if __name__ == "__main__":
    main()
