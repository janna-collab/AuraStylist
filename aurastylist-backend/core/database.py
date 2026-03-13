import os
from pymongo import MongoClient
import logging
import uuid
import shutil

logger = logging.getLogger(__name__)

# Use a default fallback for local dev if not present
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("MONGO_DB_NAME", "aurastylist")
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "uploads")

os.makedirs(UPLOAD_DIR, exist_ok=True)

client = None
db = None

try:
    client = MongoClient(MONGO_URI)
    db = client[DB_NAME]
    logger.info("Successfully connected to MongoDB")
except Exception as e:
    logger.error(f"Failed to connect to MongoDB: {e}")

def get_db():
    return db

def save_user_profile(user_id: str, profile_data: dict):
    if db is not None:
        try:
            return db.profiles.update_one(
                {"user_id": user_id},
                {"$set": profile_data},
                upsert=True
            )
        except Exception as e:
            logger.error(f"Error saving profile: {e}")
            return None
    return None

def save_uploaded_image(file_bytes: bytes, filename: str) -> str:
    """Mocking an S3 upload by saving locally"""
    ext = filename.split('.')[-1] if '.' in filename else 'jpg'
    unique_name = f"{uuid.uuid4()}.{ext}"
    filepath = os.path.join(UPLOAD_DIR, unique_name)
    try:
        with open(filepath, "wb") as f:
            f.write(file_bytes)
        return filepath
    except Exception as e:
        logger.error(f"Failed to save image locally: {e}")
        return None

def save_style_request(user_id: str, request_data: dict):
    if db is not None:
        try:
            result = db.style_requests.insert_one({
                "user_id": user_id,
                **request_data
            })
            return str(result.inserted_id)
        except Exception as e:
            logger.error(f"Error saving style request: {e}")
            return None
    return None
