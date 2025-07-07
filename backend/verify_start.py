#!/usr/bin/env python3
"""
Simple script to verify the correct start command for Render
"""
import os
import sys

# Add current directory to path
sys.path.insert(0, os.path.dirname(__file__))

# Try to import the main app
try:
    from main import app
    print("✅ Successfully imported main app")
    
    # Check if running in production
    if __name__ == "__main__":
        import uvicorn
        port = int(os.environ.get("PORT", 8000))
        host = os.environ.get("HOST", "0.0.0.0")
        
        print(f"🚀 Starting server on {host}:{port}")
        uvicorn.run(app, host=host, port=port)
        
except ImportError as e:
    print(f"❌ Import error: {e}")
    sys.exit(1)
except Exception as e:
    print(f"❌ Error: {e}")
    sys.exit(1)
