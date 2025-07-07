#!/usr/bin/env python3
"""
Startup script for AgriSync backend on Render
"""
import uvicorn
import os
import sys

if __name__ == "__main__":
    try:
        port = int(os.environ.get("PORT", 10000))
        
        print(f"🚀 Starting AgriSync API on 0.0.0.0:{port}")
        print("📁 Working directory:", os.getcwd())
        print("🐍 Python version:", sys.version)
        
        uvicorn.run(
            "main:app",  # Changed from scripts.main:app to main:app
            host="0.0.0.0",
            port=port,
            reload=False,
            log_level="info"
        )
        
    except Exception as e:
        print(f"❌ Failed to start server: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
