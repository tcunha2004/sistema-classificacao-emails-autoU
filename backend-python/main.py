import os
from app import app
import routes  # noqa: F401 ensure routes are registered

if __name__ == "__main__":
    port = int(os.getenv("PORT", "5000"))
    # Bind to all interfaces inside the container
    app.run(host="0.0.0.0", port=port, debug=False)

