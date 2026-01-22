import os
from pathlib import Path
from dotenv import load_dotenv

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
load_dotenv(dotenv_path=ROOT_DIR / ".env")

FRONTEND_URL = os.getenv("BACKEND_FRONTEND_URL")
FRONTEND_PORT = os.getenv("PORT")