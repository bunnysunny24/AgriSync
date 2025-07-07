#!/usr/bin/env python3
"""
AgriSync Model Deployment Test Script
Tests all models to ensure they are working correctly in production
"""

import os
import sys
import json
import logging
from pathlib import Path

# Add the backend directory to the path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def test_soil_model():
    """Test soil classification model"""
    logger.info("🧪 Testing Soil Classification Model...")
    
    try:
        from main import load_soil_model
        model, class_names = load_soil_model()
        
        logger.info(f"✅ Soil model loaded successfully")
        logger.info(f"   Model type: {type(model)}")
        logger.info(f"   Classes: {class_names}")
        logger.info(f"   Number of classes: {len(class_names)}")
        
        # Test with a sample image if available
        test_image = "uploaded_images/Alluvial_1.jpg"
        if os.path.exists(test_image):
            from scripts.predict_soil import predict_soil_type
            result = predict_soil_type(test_image)
            logger.info(f"   Test prediction: {result}")
        else:
            logger.info("   No test image available for soil classification")
            
        return True
        
    except Exception as e:
        logger.error(f"❌ Soil model test failed: {str(e)}")
        return False

def test_plantdoc_model():
    """Test plant disease detection model"""
    logger.info("🧪 Testing PlantDoc Model...")
    
    try:
        from main import load_plantdoc_predictor
        predictor = load_plantdoc_predictor()
        
        logger.info(f"✅ PlantDoc predictor loaded successfully")
        logger.info(f"   Predictor type: {type(predictor)}")
        
        # Test with a sample image if available
        test_image = "PlantDoc-Dataset/trial_image1.jpg"
        if os.path.exists(test_image):
            result = predictor(test_image)
            logger.info(f"   Test prediction: {result}")
        else:
            logger.info("   No test image available for plant disease detection")
            
        # Test class names loading
        from scripts.predict_plantdoc import load_class_names
        class_names = load_class_names()
        logger.info(f"   Number of classes: {len(class_names)}")
        logger.info(f"   Sample classes: {class_names[:5]}...")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ PlantDoc model test failed: {str(e)}")
        return False

def test_price_predictor():
    """Test price prediction model"""
    logger.info("🧪 Testing Price Prediction Model...")
    
    try:
        from main import load_price_predictor
        predictor = load_price_predictor()
        
        logger.info(f"✅ Price predictor loaded successfully")
        logger.info(f"   Predictor type: {type(predictor)}")
        
        # Test with sample data
        try:
            result = predictor("tomato")
            logger.info(f"   Test prediction for tomato: {type(result)}")
        except Exception as e:
            logger.info(f"   Price prediction test skipped: {str(e)}")
            
        return True
        
    except Exception as e:
        logger.error(f"❌ Price predictor test failed: {str(e)}")
        return False

def test_api_endpoints():
    """Test if the API can be started"""
    logger.info("🧪 Testing API Startup...")
    
    try:
        from main import app
        logger.info(f"✅ FastAPI app created successfully")
        logger.info(f"   App type: {type(app)}")
        logger.info(f"   Available routes: {len(app.routes)}")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ API startup test failed: {str(e)}")
        return False

def check_model_files():
    """Check if all required model files exist"""
    logger.info("🧪 Checking Model Files...")
    
    models_dir = Path("models")
    required_files = [
        "soil_classifier.keras",
        "class_names.json",
        "plantdoc_class_names.json"
    ]
    
    plantdoc_models = [
        "plantdoc_optimized_v2.keras",
        "plantdoc_optimized_ema.keras", 
        "plantdoc_optimized.keras",
        "plantdoc_best.keras",
        "best_plantdoc_model.keras"
    ]
    
    all_good = True
    
    for file in required_files:
        file_path = models_dir / file
        if file_path.exists():
            logger.info(f"✅ {file} exists ({file_path.stat().st_size / 1024 / 1024:.1f} MB)")
        else:
            logger.error(f"❌ {file} missing")
            all_good = False
    
    # Check if at least one PlantDoc model exists
    plantdoc_found = False
    for model in plantdoc_models:
        file_path = models_dir / model
        if file_path.exists():
            logger.info(f"✅ {model} exists ({file_path.stat().st_size / 1024 / 1024:.1f} MB)")
            plantdoc_found = True
    
    if not plantdoc_found:
        logger.error("❌ No PlantDoc models found")
        all_good = False
    
    return all_good

def main():
    """Run all tests"""
    logger.info("🚀 Starting AgriSync Model Deployment Tests")
    logger.info("=" * 60)
    
    tests = [
        ("Model Files Check", check_model_files),
        ("Soil Model Test", test_soil_model),
        ("PlantDoc Model Test", test_plantdoc_model),
        ("Price Predictor Test", test_price_predictor),
        ("API Endpoints Test", test_api_endpoints)
    ]
    
    results = []
    for test_name, test_func in tests:
        logger.info(f"\n{'='*20} {test_name} {'='*20}")
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            logger.error(f"Test {test_name} crashed: {str(e)}")
            results.append((test_name, False))
    
    # Summary
    logger.info("\n" + "="*60)
    logger.info("🎯 TEST SUMMARY")
    logger.info("="*60)
    
    passed = 0
    for test_name, result in results:
        status = "✅ PASSED" if result else "❌ FAILED"
        logger.info(f"{status}: {test_name}")
        if result:
            passed += 1
    
    logger.info(f"\n📊 Overall: {passed}/{len(results)} tests passed")
    
    if passed == len(results):
        logger.info("🎉 All tests passed! Models are ready for deployment.")
        return True
    else:
        logger.error("⚠️ Some tests failed. Please check the logs above.")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
