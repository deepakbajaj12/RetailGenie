import os
import sys

# Add backend directory to path so we can import from it
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from backend.app import create_app

app = create_app()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)
