#!/usr/bin/env python3
"""
Render Deployment Test
This script simulates the Render deployment process
"""
import os
import sys
import subprocess
import traceback

def test_environment():
    """Test the environment setup"""
    print("🌍 Testing Environment Setup...")
    
    # Check Python version
    print(f"🐍 Python version: {sys.version}")
    
    # Check working directory
    print(f"📁 Working directory: {os.getcwd()}")
    
    # Check if requirements.txt exists
    if os.path.exists("requirements.txt"):
        print("✅ requirements.txt found")
    else:
        print("❌ requirements.txt not found")
        return False
    
    # Check if main.py exists
    if os.path.exists("main.py"):
        print("✅ main.py found")
    else:
        print("❌ main.py not found")
        return False
    
    # Check if start.py exists
    if os.path.exists("start.py"):
        print("✅ start.py found")
    else:
        print("❌ start.py not found")
        return False
    
    return True

def test_imports():
    """Test critical imports"""
    print("\n🧪 Testing Critical Imports...")
    
    critical_imports = [
        "fastapi",
        "uvicorn",
        "PIL",
        "numpy",
        "requests"
    ]
    
    failed_imports = []
    
    for module in critical_imports:
        try:
            __import__(module)
            print(f"✅ {module} import successful")
        except ImportError:
            print(f"❌ {module} import failed")
            failed_imports.append(module)
    
    if failed_imports:
        print(f"❌ Failed imports: {failed_imports}")
        return False
    
    return True

def test_app_startup():
    """Test app startup"""
    print("\n🚀 Testing App Startup...")
    
    try:
        # Test importing the main app
        from main import app
        print("✅ Main app imported successfully")
        
        # Test app routes
        routes = [route.path for route in app.routes if hasattr(route, 'path')]
        required_routes = ['/', '/health', '/healthz']
        
        missing_routes = [route for route in required_routes if route not in routes]
        if missing_routes:
            print(f"❌ Missing routes: {missing_routes}")
            return False
        
        print("✅ All required routes found")
        
        # Test health endpoints
        print("✅ App startup test passed")
        return True
        
    except Exception as e:
        print(f"❌ App startup failed: {e}")
        traceback.print_exc()
        return False

def test_port_binding():
    """Test port binding configuration"""
    print("\n🔌 Testing Port Configuration...")
    
    # Test default port
    default_port = os.environ.get("PORT", "8000")
    print(f"📍 Default port: {default_port}")
    
    # Test if port is numeric
    try:
        port_num = int(default_port)
        if 1000 <= port_num <= 65535:
            print("✅ Port configuration valid")
            return True
        else:
            print("❌ Port out of valid range")
            return False
    except ValueError:
        print("❌ Port is not a valid number")
        return False

def main():
    """Run all deployment tests"""
    print("🚀 Starting Render Deployment Test")
    print("=" * 50)
    
    tests = [
        ("Environment Setup", test_environment),
        ("Critical Imports", test_imports),
        ("App Startup", test_app_startup),
        ("Port Configuration", test_port_binding)
    ]
    
    passed_tests = 0
    total_tests = len(tests)
    
    for test_name, test_func in tests:
        print(f"\n📋 Running: {test_name}")
        print("-" * 30)
        
        try:
            if test_func():
                print(f"✅ {test_name}: PASSED")
                passed_tests += 1
            else:
                print(f"❌ {test_name}: FAILED")
        except Exception as e:
            print(f"❌ {test_name}: ERROR - {e}")
            traceback.print_exc()
    
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {passed_tests}/{total_tests} passed")
    
    if passed_tests == total_tests:
        print("🎉 All tests passed! Ready for Render deployment")
        print("\n📝 Render Settings Checklist:")
        print("✅ Root Directory: backend")
        print("✅ Build Command: pip install -r requirements.txt")
        print("✅ Start Command: python start.py")
        print("✅ Health Check: /healthz")
        return True
    else:
        print("❌ Some tests failed. Please fix issues before deploying.")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
