#!/usr/bin/env python3
"""
Advanced PlantDoc Model Training with Deployment Optimizations
Designed to avoid TensorFlow/Keras compatibility issues and optimize for cloud deployment
"""

import os
import sys
import json
import logging
import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers, models, optimizers, callbacks
from tensorflow.keras.applications import EfficientNetB0, MobileNetV2, ResNet50V2
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime
import warnings

# Suppress warnings for cleaner output
warnings.filterwarnings('ignore')
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class AdvancedPlantDocTrainer:
    def __init__(self, data_dir="PlantDoc-Dataset", img_size=(224, 224), batch_size=32):
        """
        Initialize the advanced PlantDoc trainer
        
        Args:
            data_dir: Directory containing PlantDoc dataset
            img_size: Image size for training (224x224 recommended for most models)
            batch_size: Batch size for training
        """
        self.data_dir = data_dir
        self.img_size = img_size
        self.batch_size = batch_size
        self.model = None
        self.history = None
        self.class_names = None
        
        # Create output directories
        self.models_dir = "models"
        self.results_dir = "training_results"
        os.makedirs(self.models_dir, exist_ok=True)
        os.makedirs(self.results_dir, exist_ok=True)
        
        logger.info(f"🚀 Advanced PlantDoc Trainer initialized")
        logger.info(f"📊 Image size: {img_size}, Batch size: {batch_size}")
        logger.info(f"🌱 Data directory: {data_dir}")

    def setup_gpu(self):
        """Configure GPU settings for optimal training"""
        try:
            # Enable memory growth for GPU
            gpus = tf.config.experimental.list_physical_devices('GPU')
            if gpus:
                for gpu in gpus:
                    tf.config.experimental.set_memory_growth(gpu, True)
                logger.info(f"✅ GPU configured: {len(gpus)} GPU(s) available")
            else:
                logger.info("🔄 No GPU found, using CPU")
        except Exception as e:
            logger.warning(f"⚠️ GPU setup failed: {e}")

    def create_data_generators(self):
        """Create optimized data generators with extensive augmentation"""
        logger.info("📸 Creating data generators with advanced augmentation...")
        
        # Training data generator with extensive augmentation
        train_datagen = ImageDataGenerator(
            rescale=1.0/255.0,
            rotation_range=40,
            width_shift_range=0.2,
            height_shift_range=0.2,
            shear_range=0.2,
            zoom_range=0.2,
            horizontal_flip=True,
            vertical_flip=True,
            brightness_range=[0.8, 1.2],
            fill_mode='nearest',
            validation_split=0.2
        )
        
        # Validation data generator (only rescaling)
        val_datagen = ImageDataGenerator(
            rescale=1.0/255.0,
            validation_split=0.2
        )
        
        # Test data generator
        test_datagen = ImageDataGenerator(rescale=1.0/255.0)
        
        train_dir = os.path.join(self.data_dir, "train")
        test_dir = os.path.join(self.data_dir, "test")
        
        # Training generator
        self.train_generator = train_datagen.flow_from_directory(
            train_dir,
            target_size=self.img_size,
            batch_size=self.batch_size,
            class_mode='categorical',
            subset='training',
            shuffle=True,
            seed=42
        )
        
        # Validation generator
        self.val_generator = val_datagen.flow_from_directory(
            train_dir,
            target_size=self.img_size,
            batch_size=self.batch_size,
            class_mode='categorical',
            subset='validation',
            shuffle=False,
            seed=42
        )
        
        # Test generator
        self.test_generator = test_datagen.flow_from_directory(
            test_dir,
            target_size=self.img_size,
            batch_size=self.batch_size,
            class_mode='categorical',
            shuffle=False
        )
        
        self.class_names = list(self.train_generator.class_indices.keys())
        self.num_classes = len(self.class_names)
        
        logger.info(f"✅ Data generators created successfully")
        logger.info(f"📊 Classes: {self.num_classes}")
        logger.info(f"📊 Training samples: {self.train_generator.samples}")
        logger.info(f"📊 Validation samples: {self.val_generator.samples}")
        logger.info(f"📊 Test samples: {self.test_generator.samples}")
        logger.info(f"🏷️ Class names: {self.class_names}")

    def create_advanced_model(self, model_type="efficientnet"):
        """
        Create an advanced model with deployment optimizations
        
        Args:
            model_type: Type of model ('efficientnet', 'mobilenet', 'resnet')
        """
        logger.info(f"🏗️ Creating {model_type} model...")
        
        # Input layer with explicit shape
        input_layer = layers.Input(shape=(*self.img_size, 3), name='input_layer')
        
        # Base model selection
        if model_type == "efficientnet":
            base_model = EfficientNetB0(
                weights='imagenet',
                include_top=False,
                input_tensor=input_layer,
                pooling='avg'
            )
        elif model_type == "mobilenet":
            base_model = MobileNetV2(
                weights='imagenet',
                include_top=False,
                input_tensor=input_layer,
                pooling='avg'
            )
        elif model_type == "resnet":
            base_model = ResNet50V2(
                weights='imagenet',
                include_top=False,
                input_tensor=input_layer,
                pooling='avg'
            )
        else:
            raise ValueError(f"Unsupported model type: {model_type}")
        
        # Freeze base model layers initially
        base_model.trainable = False
        
        # Add custom classification head
        x = base_model.output
        x = layers.Dropout(0.3, name='top_dropout')(x)
        x = layers.Dense(512, activation='relu', name='dense_1')(x)
        x = layers.BatchNormalization(name='bn_1')(x)
        x = layers.Dropout(0.5, name='dropout_1')(x)
        x = layers.Dense(256, activation='relu', name='dense_2')(x)
        x = layers.BatchNormalization(name='bn_2')(x)
        x = layers.Dropout(0.3, name='dropout_2')(x)
        
        # Output layer
        predictions = layers.Dense(
            self.num_classes,
            activation='softmax',
            name='predictions'
        )(x)
        
        # Create model
        self.model = models.Model(inputs=input_layer, outputs=predictions)
        
        # Compile with advanced optimizer
        self.model.compile(
            optimizer=optimizers.AdamW(learning_rate=0.001, weight_decay=0.0001),
            loss='categorical_crossentropy',
            metrics=['accuracy', 'top_k_categorical_accuracy']
        )
        
        logger.info(f"✅ {model_type} model created successfully")
        logger.info(f"📊 Total parameters: {self.model.count_params():,}")
        logger.info(f"📊 Trainable parameters: {sum(p.numel() for p in self.model.trainable_variables):,}")

    def get_callbacks(self, model_name):
        """Create advanced callbacks for training"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        callbacks_list = [
            # Model checkpoint - save best model
            callbacks.ModelCheckpoint(
                filepath=os.path.join(self.models_dir, f'{model_name}_best.keras'),
                monitor='val_accuracy',
                save_best_only=True,
                save_weights_only=False,
                verbose=1
            ),
            
            # Reduce learning rate on plateau
            callbacks.ReduceLROnPlateau(
                monitor='val_loss',
                factor=0.5,
                patience=5,
                min_lr=1e-7,
                verbose=1
            ),
            
            # Early stopping
            callbacks.EarlyStopping(
                monitor='val_accuracy',
                patience=10,
                restore_best_weights=True,
                verbose=1
            ),
            
            # CSV logger
            callbacks.CSVLogger(
                os.path.join(self.results_dir, f'{model_name}_training_log_{timestamp}.csv')
            ),
            
            # Learning rate scheduler
            callbacks.LearningRateScheduler(
                lambda epoch: 0.001 * 0.95 ** epoch,
                verbose=0
            )
        ]
        
        return callbacks_list

    def train_model(self, model_type="efficientnet", epochs=50, fine_tune_epochs=20):
        """
        Train the model with transfer learning and fine-tuning
        
        Args:
            model_type: Type of model to train
            epochs: Number of epochs for initial training
            fine_tune_epochs: Number of epochs for fine-tuning
        """
        logger.info(f"🎯 Starting training for {model_type} model...")
        
        # Create model
        self.create_advanced_model(model_type)
        
        # Get callbacks
        callbacks_list = self.get_callbacks(f"plantdoc_{model_type}")
        
        # Phase 1: Train with frozen base model
        logger.info("🔄 Phase 1: Training with frozen base model...")
        history1 = self.model.fit(
            self.train_generator,
            epochs=epochs,
            validation_data=self.val_generator,
            callbacks=callbacks_list,
            verbose=1
        )
        
        # Phase 2: Fine-tuning with unfrozen layers
        logger.info("🔄 Phase 2: Fine-tuning with unfrozen layers...")
        
        # Unfreeze the base model
        self.model.layers[1].trainable = True
        
        # Compile with lower learning rate for fine-tuning
        self.model.compile(
            optimizer=optimizers.AdamW(learning_rate=0.0001, weight_decay=0.0001),
            loss='categorical_crossentropy',
            metrics=['accuracy', 'top_k_categorical_accuracy']
        )
        
        # Continue training
        history2 = self.model.fit(
            self.train_generator,
            epochs=fine_tune_epochs,
            initial_epoch=epochs,
            validation_data=self.val_generator,
            callbacks=callbacks_list,
            verbose=1
        )
        
        # Combine histories
        self.history = {
            'loss': history1.history['loss'] + history2.history['loss'],
            'accuracy': history1.history['accuracy'] + history2.history['accuracy'],
            'val_loss': history1.history['val_loss'] + history2.history['val_loss'],
            'val_accuracy': history1.history['val_accuracy'] + history2.history['val_accuracy']
        }
        
        logger.info("✅ Training completed successfully!")

    def evaluate_model(self):
        """Evaluate the model on test data"""
        logger.info("📊 Evaluating model on test data...")
        
        # Evaluate on test data
        test_loss, test_accuracy, test_top_k = self.model.evaluate(
            self.test_generator,
            verbose=1
        )
        
        logger.info(f"📊 Test Results:")
        logger.info(f"   Loss: {test_loss:.4f}")
        logger.info(f"   Accuracy: {test_accuracy:.4f}")
        logger.info(f"   Top-K Accuracy: {test_top_k:.4f}")
        
        # Generate predictions for confusion matrix
        predictions = self.model.predict(self.test_generator)
        y_pred = np.argmax(predictions, axis=1)
        y_true = self.test_generator.classes
        
        # Classification report
        report = classification_report(
            y_true, y_pred, 
            target_names=self.class_names,
            output_dict=True
        )
        
        logger.info("📊 Classification Report:")
        for class_name, metrics in report.items():
            if isinstance(metrics, dict):
                logger.info(f"   {class_name}: Precision={metrics['precision']:.3f}, Recall={metrics['recall']:.3f}, F1={metrics['f1-score']:.3f}")
        
        return test_accuracy, report

    def save_deployment_model(self, model_name="plantdoc_deployment"):
        """Save model optimized for deployment"""
        logger.info("💾 Saving deployment-optimized model...")
        
        # Save in multiple formats for compatibility
        model_path = os.path.join(self.models_dir, f"{model_name}.keras")
        
        # Save with explicit format
        self.model.save(model_path, save_format='keras')
        
        # Save class names
        class_names_path = os.path.join(self.models_dir, "plantdoc_class_names.json")
        with open(class_names_path, 'w') as f:
            json.dump(self.class_names, f, indent=2)
        
        # Save model summary
        summary_path = os.path.join(self.models_dir, f"{model_name}_summary.txt")
        with open(summary_path, 'w') as f:
            self.model.summary(print_fn=lambda x: f.write(x + '\n'))
        
        logger.info(f"✅ Model saved successfully:")
        logger.info(f"   Model: {model_path}")
        logger.info(f"   Classes: {class_names_path}")
        logger.info(f"   Summary: {summary_path}")

    def plot_training_history(self):
        """Plot training history"""
        if self.history is None:
            logger.warning("No training history available")
            return
        
        plt.figure(figsize=(12, 4))
        
        # Plot accuracy
        plt.subplot(1, 2, 1)
        plt.plot(self.history['accuracy'], label='Training Accuracy')
        plt.plot(self.history['val_accuracy'], label='Validation Accuracy')
        plt.title('Model Accuracy')
        plt.xlabel('Epoch')
        plt.ylabel('Accuracy')
        plt.legend()
        
        # Plot loss
        plt.subplot(1, 2, 2)
        plt.plot(self.history['loss'], label='Training Loss')
        plt.plot(self.history['val_loss'], label='Validation Loss')
        plt.title('Model Loss')
        plt.xlabel('Epoch')
        plt.ylabel('Loss')
        plt.legend()
        
        plt.tight_layout()
        plt.savefig(os.path.join(self.results_dir, 'training_history.png'))
        plt.close()
        
        logger.info("📈 Training history plot saved")

    def create_tflite_model(self, model_name="plantdoc_deployment"):
        """Create TensorFlow Lite model for mobile deployment"""
        logger.info("📱 Creating TensorFlow Lite model...")
        
        try:
            # Convert to TensorFlow Lite
            converter = tf.lite.TFLiteConverter.from_keras_model(self.model)
            converter.optimizations = [tf.lite.Optimize.DEFAULT]
            converter.target_spec.supported_types = [tf.float16]
            
            tflite_model = converter.convert()
            
            # Save TFLite model
            tflite_path = os.path.join(self.models_dir, f"{model_name}.tflite")
            with open(tflite_path, 'wb') as f:
                f.write(tflite_model)
            
            logger.info(f"✅ TensorFlow Lite model saved: {tflite_path}")
            
        except Exception as e:
            logger.error(f"❌ TensorFlow Lite conversion failed: {e}")

def main():
    """Main training function"""
    logger.info("🌱 Starting Advanced PlantDoc Training...")
    
    # Initialize trainer
    trainer = AdvancedPlantDocTrainer()
    
    # Setup GPU
    trainer.setup_gpu()
    
    # Create data generators
    trainer.create_data_generators()
    
    # Train models with different architectures
    models_to_train = ["efficientnet", "mobilenet"]
    
    for model_type in models_to_train:
        logger.info(f"🚀 Training {model_type} model...")
        
        try:
            # Train model
            trainer.train_model(model_type=model_type, epochs=30, fine_tune_epochs=15)
            
            # Evaluate model
            accuracy, report = trainer.evaluate_model()
            
            # Save model
            trainer.save_deployment_model(f"plantdoc_{model_type}")
            
            # Plot training history
            trainer.plot_training_history()
            
            # Create TFLite model
            trainer.create_tflite_model(f"plantdoc_{model_type}")
            
            logger.info(f"✅ {model_type} training completed successfully!")
            
        except Exception as e:
            logger.error(f"❌ Training failed for {model_type}: {e}")
            continue
    
    logger.info("🎉 All training completed!")

if __name__ == "__main__":
    main()
