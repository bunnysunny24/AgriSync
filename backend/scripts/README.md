# 🚀 Advanced Model Training & Deployment Guide

## 🎯 Overview

This guide provides advanced training scripts for PlantDoc and Soil classification models with deployment optimizations to avoid TensorFlow/Keras compatibility issues.

## 🔧 Key Features

### ✅ **Deployment Compatibility**
- **Modern TensorFlow format**: Uses `.keras` format (TF 2.10+)
- **Explicit input shapes**: Avoids `batch_shape` compatibility issues
- **Version-agnostic saving**: Multiple format support
- **GPU optimization**: Proper memory management

### ✅ **Advanced Training Techniques**
- **Transfer learning**: EfficientNet, MobileNet, ResNet
- **Custom architectures**: Optimized for specific tasks
- **Advanced augmentation**: Extensive data augmentation
- **Smart callbacks**: Learning rate scheduling, early stopping
- **Multi-phase training**: Frozen → Fine-tuning

### ✅ **Production Features**
- **Model optimization**: TensorFlow Lite conversion
- **Comprehensive logging**: Detailed training logs
- **Automatic testing**: Model validation scripts
- **Error handling**: Graceful failure recovery

## 📁 Files Structure

```
backend/scripts/
├── advanced_plantdoc_trainer.py     # PlantDoc model training
├── advanced_soil_trainer.py         # Soil classification training
├── model_compatibility_optimizer.py # Deployment optimization
├── run_training_pipeline.py         # Complete pipeline runner
└── README.md                        # This guide
```

## 🚀 Quick Start

### 1. **Install Dependencies**
```bash
pip install tensorflow>=2.10.0 numpy matplotlib seaborn scikit-learn pillow
```

### 2. **Prepare Data**
Ensure your data structure is:
```
backend/
├── PlantDoc-Dataset/
│   ├── train/
│   │   ├── class1/
│   │   ├── class2/
│   │   └── ...
│   └── test/
│       ├── class1/
│       ├── class2/
│       └── ...
└── Soil/
    ├── Train/
    │   ├── Alluvial/
    │   ├── Black/
    │   ├── Clay/
    │   └── Red/
    └── test/ (optional)
```

### 3. **Run Complete Training Pipeline**
```bash
cd backend/scripts
python run_training_pipeline.py
```

### 4. **Or Train Individual Models**
```bash
# Train PlantDoc models
python advanced_plantdoc_trainer.py

# Train Soil models
python advanced_soil_trainer.py

# Optimize for deployment
python model_compatibility_optimizer.py
```

## 🔧 Advanced Configuration

### **PlantDoc Training**
```python
trainer = AdvancedPlantDocTrainer(
    data_dir="PlantDoc-Dataset",
    img_size=(224, 224),  # Recommended for transfer learning
    batch_size=32
)

# Train multiple models
models = ["efficientnet", "mobilenet"]
for model_type in models:
    trainer.train_model(model_type=model_type, epochs=30, fine_tune_epochs=15)
```

### **Soil Training**
```python
trainer = AdvancedSoilTrainer(
    data_dir="Soil",
    img_size=(224, 224),
    batch_size=32
)

# Train custom + transfer learning models
models = ["custom", "mobilenet", "efficientnet"]
for model_type in models:
    trainer.train_model(model_type=model_type, epochs=80)
```

## 🎯 Model Architecture Options

### **PlantDoc Models**
1. **EfficientNetB0**: Best accuracy, moderate size
2. **MobileNetV2**: Fastest inference, smallest size
3. **ResNet50V2**: Good balance of accuracy and speed

### **Soil Models**
1. **Custom CNN**: Optimized for soil textures
2. **MobileNetV2**: Transfer learning + custom head
3. **EfficientNetB0**: Maximum accuracy

## 🚀 Deployment Optimization

### **Compatibility Features**
```python
# ✅ Modern Keras format
model.save('model.keras', save_format='keras')

# ✅ Explicit input shapes
input_layer = layers.Input(shape=(224, 224, 3), name='input_layer')

# ✅ Deployment testing
optimizer.optimize_for_deployment(model, "model_name", class_names)
```

### **Error Prevention**
- **No `batch_shape`**: Uses standard `shape` parameter
- **Explicit formats**: Specified save formats
- **Version compatibility**: Works with TF 2.10+
- **Memory optimization**: GPU memory growth enabled

## 📊 Training Results

Models will be saved in:
```
backend/models/
├── plantdoc_efficientnet.keras
├── plantdoc_mobilenet.keras
├── soil_custom.keras
├── soil_mobilenet.keras
├── class_names.json
└── *_metadata.json
```

Training logs and plots in:
```
backend/training_results/
├── training_history.png
├── *_training_log_*.csv
└── model_summaries/
```

## 🔍 Testing & Validation

### **Automatic Testing**
Each model gets a test script:
```bash
python models/test_soil_custom.py
python models/test_plantdoc_mobilenet.py
```

### **Manual Testing**
```python
import tensorflow as tf

# Load model
model = tf.keras.models.load_model('models/soil_custom.keras')

# Test prediction
import numpy as np
dummy_input = np.random.random((1, 224, 224, 3))
prediction = model.predict(dummy_input)
print(f"Prediction: {prediction}")
```

## 🚨 Troubleshooting

### **Common Issues & Solutions**

1. **`batch_shape` error**
   - ✅ **Fixed**: Uses `shape` instead of `batch_shape`
   - ✅ **Solution**: Modern input layer definition

2. **GPU memory issues**
   - ✅ **Fixed**: Memory growth enabled
   - ✅ **Solution**: `tf.config.experimental.set_memory_growth(gpu, True)`

3. **Model loading errors**
   - ✅ **Fixed**: Multiple format support
   - ✅ **Solution**: Saves in `.keras`, SavedModel, and weights

4. **Version compatibility**
   - ✅ **Fixed**: TensorFlow 2.10+ compatibility
   - ✅ **Solution**: Modern API usage

### **Deployment Checklist**
- [ ] TensorFlow 2.10+ installed
- [ ] Models saved in `.keras` format
- [ ] Class names JSON available
- [ ] Test scripts pass
- [ ] GPU memory configured
- [ ] Error handling implemented

## 🎉 Expected Results

### **PlantDoc Models**
- **Accuracy**: 85-95% (depending on model)
- **Size**: 5-50MB
- **Inference**: 50-200ms per image

### **Soil Models**
- **Accuracy**: 80-90%
- **Size**: 3-30MB
- **Inference**: 30-150ms per image

## 📞 Support

If you encounter issues:
1. Check TensorFlow version: `python -c "import tensorflow as tf; print(tf.__version__)"`
2. Verify data structure
3. Run test scripts
4. Check GPU configuration
5. Review training logs

## 🎯 Next Steps

After training:
1. **Test models locally**
2. **Deploy to staging environment**
3. **Monitor performance**
4. **Collect feedback**
5. **Retrain with new data**

---

**🌟 Pro Tips:**
- Use GPU for faster training
- Monitor training curves for overfitting
- Test models before deployment
- Keep multiple model versions
- Use transfer learning for better results
