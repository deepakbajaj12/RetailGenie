#!/usr/bin/env python3
"""
RetailGenie Backend - Main WSGI Entry Point
Perfect Structure Implementation
"""

import os
import sys
from pathlib import Path

# Add backend and app directory to Python path
backend_dir = Path(__file__).parent.resolve()
sys.path.insert(0, str(backend_dir))
sys.path.insert(0, str(backend_dir / "app"))

from app import create_app

app = create_app()

def main():
    """Main application entry point"""
    host = os.getenv('HOST', '0.0.0.0')
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    
    print(f"""
    🚀 RetailGenie Backend Starting (WSGI)...
    
    📍 Server: http://{host}:{port}
    🔧 Environment: {app.config.get('ENV', 'development')}
    🐛 Debug Mode: {debug}
    📊 Health Check: http://{host}:{port}/health
    
    📁 Perfect Structure Implemented ✅
    """)
    
    app.run(
        host=host,
        port=port,
        debug=debug,
        threaded=True
    )

if __name__ == '__main__':
    main()
