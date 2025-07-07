#!/usr/bin/env python3
"""
Startup script for AgriSync backend on Render
"""
import uvicorn
import os

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    uvicorn.run(
        "scripts.main:app",
        host="0.0.0.0",
        port=port,
        reload=False
    )
