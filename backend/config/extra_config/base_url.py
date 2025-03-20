import os

SCHEMA = os.getenv("API_SCHEME", "http")
HOST = os.getenv("API_HOST", "localhost")
PORT = os.getenv("API_PORT", "8000")

BASE_URL = f"{SCHEMA}://{HOST}:{PORT}"
