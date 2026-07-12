import os
import sys

# Add the backend directory to Python path
backend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "backend")
sys.path.insert(0, backend_dir)
sys.path.insert(0, os.path.join(backend_dir, "app"))

from backend.app import create_app  # noqa: E402

app = create_app()

if __name__ == "__main__":
    # Standard development server settings
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 5000))
    debug = os.getenv("FLASK_DEBUG", "True").lower() == "true"

    print(f"🚀 Forwarding to backend/app.py on http://{host}:{port}")
    app.run(host=host, port=port, debug=debug)
