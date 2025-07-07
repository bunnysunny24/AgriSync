#!/usr/bin/env python3
"""
Training Pipeline Runner
Orchestrates the complete training process for both PlantDoc and Soil models
"""

import os
import sys
import logging
import subprocess
from datetime import datetime

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def run_training_pipeline():
    """Run complete training pipeline"""
    logger.info("🚀 Starting Complete Training Pipeline...")
    
    start_time = datetime.now()
    
    try:
        # Get the current directory (scripts directory)
        current_dir = os.path.dirname(os.path.abspath(__file__))
        
        # 1. Train PlantDoc models
        logger.info("🌱 Starting PlantDoc training...")
        plantdoc_script = os.path.join(current_dir, "advanced_plantdoc_trainer.py")
        result = subprocess.run([
            sys.executable, plantdoc_script
        ], capture_output=True, text=True, cwd=os.path.dirname(current_dir))
        
        if result.returncode == 0:
            logger.info("✅ PlantDoc training completed successfully!")
            logger.info(f"Output: {result.stdout[-500:]}")  # Show last 500 chars
        else:
            logger.error(f"❌ PlantDoc training failed: {result.stderr}")
            logger.info(f"Output: {result.stdout}")
        
        # 2. Train Soil models
        logger.info("🌍 Starting Soil classification training...")
        soil_script = os.path.join(current_dir, "advanced_soil_trainer.py")
        result = subprocess.run([
            sys.executable, soil_script
        ], capture_output=True, text=True, cwd=os.path.dirname(current_dir))
        
        if result.returncode == 0:
            logger.info("✅ Soil training completed successfully!")
            logger.info(f"Output: {result.stdout[-500:]}")  # Show last 500 chars
        else:
            logger.error(f"❌ Soil training failed: {result.stderr}")
            logger.info(f"Output: {result.stdout}")
        
        # 3. Optimize for deployment
        logger.info("🔧 Running model compatibility optimization...")
        optimizer_script = os.path.join(current_dir, "model_compatibility_optimizer.py")
        result = subprocess.run([
            sys.executable, optimizer_script
        ], capture_output=True, text=True, cwd=os.path.dirname(current_dir))
        
        if result.returncode == 0:
            logger.info("✅ Model optimization completed!")
        else:
            logger.error(f"❌ Model optimization failed: {result.stderr}")
        
        end_time = datetime.now()
        duration = end_time - start_time
        
        logger.info(f"🎉 Training pipeline completed!")
        logger.info(f"⏱️ Total duration: {duration}")
        
    except Exception as e:
        logger.error(f"❌ Training pipeline failed: {e}")

def check_dependencies():
    """Check if all required dependencies are available"""
    logger.info("🔍 Checking dependencies...")
    
    # Map package names to their import names
    required_packages = {
        'tensorflow': 'tensorflow',
        'numpy': 'numpy', 
        'matplotlib': 'matplotlib',
        'seaborn': 'seaborn',
        'scikit-learn': 'sklearn',  # Note: import name is different
        'pillow': 'PIL'  # Note: import name is different
    }
    
    missing_packages = []
    
    for package_name, import_name in required_packages.items():
        try:
            __import__(import_name)
            logger.info(f"✅ {package_name} available")
        except ImportError:
            missing_packages.append(package_name)
            logger.error(f"❌ {package_name} missing")
    
    if missing_packages:
        logger.error(f"Missing packages: {missing_packages}")
        logger.info("Install missing packages with: pip install tensorflow numpy matplotlib seaborn scikit-learn pillow")
        return False
    
    return True

def main():
    """Main function"""
    logger.info("🎯 Advanced Model Training Pipeline")
    
    # Check dependencies
    if not check_dependencies():
        logger.error("❌ Dependencies check failed")
        return
    
    # Check data directories (look in parent directory)
    backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    required_dirs = ["PlantDoc-Dataset", "Soil"]
    missing_dirs = []
    
    for dir_name in required_dirs:
        dir_path = os.path.join(backend_dir, dir_name)
        if not os.path.exists(dir_path):
            missing_dirs.append(dir_name)
        else:
            logger.info(f"✅ Found data directory: {dir_path}")
    
    if missing_dirs:
        logger.error(f"❌ Missing data directories: {missing_dirs}")
        logger.info(f"Looking in: {backend_dir}")
        logger.info("Please ensure your dataset directories are available")
        return
    
    # Run training pipeline
    run_training_pipeline()

if __name__ == "__main__":
    main()
