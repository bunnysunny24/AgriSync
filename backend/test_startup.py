#!/usr/bin/env python3
"""
Test script to verify the AgriSync API startup
"""
import os
import sys
import traceback

def test_imports():
    """Test that all imports work"""
    print("🧪 Testing imports...")
    
    try:
        # Test basic imports
        from fastapi import FastAPI
        print("✅ FastAPI import successful")
        
        # Test PIL import
        from PIL import Image
        print("✅ PIL import successful")
        
        # Test numpy import
        import numpy as np
        print("✅ NumPy import successful")
        
        # Test main app import
        from main import app
        print("✅ Main app import successful")
        
        # Test health endpoints
        print("✅ All basic imports successful")
        return True
        
    except Exception as e:
        print(f"❌ Import error: {e}")
        traceback.print_exc()
        return False

def test_app_creation():
    """Test that the app can be created"""
    print("\n🧪 Testing app creation...")
    
    try:
        from main import app
        print(f"✅ App created: {app}")
        print(f"✅ App type: {type(app)}")
        
        # Check routes
        routes = [route.path for route in app.routes if hasattr(route, 'path')]
        print(f"✅ Routes found: {routes}")
        
        return True
        
    except Exception as e:
        print(f"❌ App creation error: {e}")
        traceback.print_exc()
        return False

def main():
    """Run all tests"""
    print("🚀 Starting AgriSync API Tests")
    print(f"📁 Working directory: {os.getcwd()}")
    print(f"🐍 Python version: {sys.version}")
    
    success = True
    
    # Test imports
    if not test_imports():
        success = False
    
    # Test app creation
    if not test_app_creation():
        success = False
    
    if success:
        print("\n✅ All tests passed!")
        print("🎉 AgriSync API should be ready to deploy")
    else:
        print("\n❌ Some tests failed!")
        sys.exit(1)

if __name__ == "__main__":
    main()
