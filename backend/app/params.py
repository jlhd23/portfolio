import os
from pathlib import Path
from dotenv import load_dotenv

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
load_dotenv(dotenv_path=ROOT_DIR / ".env")

FRONTEND_URL = os.getenv("BACKEND_FRONTEND_URL")
FRONTEND_PORT = os.getenv("PORT")

ASSETS_DIR = ROOT_DIR / "assets"
RESUME_FILE_NAME = "cv_jose_huerta.pdf"
RESUME_PDF_PATH = ASSETS_DIR / RESUME_FILE_NAME