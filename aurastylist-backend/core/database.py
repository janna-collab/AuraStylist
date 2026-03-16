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
    if db is None:
        logger.error("Database connection not initialized")
        raise Exception("Database connection not initialized")
    try:
        result = db.profiles.update_one(
            {"user_id": user_id},
            {"$set": profile_data},
            upsert=True
        )
        return result
    except Exception as e:
        logger.error(f"Error saving profile: {e}")
        raise e

def get_user_profile(user_id: str):
    if db is not None:
        try:
            return db.profiles.find_one({"user_id": user_id})
        except Exception as e:
            logger.error(f"Error fetching profile: {e}")
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
            doc = {
                "user_id": user_id,
                **request_data
            }
            if "request_id" in request_data:
                doc["_id"] = request_data["request_id"]
                
            result = db.style_requests.insert_one(doc)
            return str(result.inserted_id)
        except Exception as e:
            logger.error(f"Error saving style request: {e}")
            return None
    return None


def get_style_request(request_id: str) -> dict:
    if db is not None:
        try:
            from bson.objectid import ObjectId
            # Try finding by string ID first (for custom req_ IDs)
            request_doc = db.style_requests.find_one({"_id": request_id})
            
            # If not found and it's a valid ObjectId, try that
            if not request_doc and ObjectId.is_valid(request_id):
                request_doc = db.style_requests.find_one({"_id": ObjectId(request_id)})
                
            return request_doc
        except Exception as e:
            logger.error(f"Error fetching style request {request_id}: {e}")
            return None
    return None
def save_saved_outfit(user_id: str, outfit_data: dict):
    if db is not None:
        try:
            doc = {
                "user_id": user_id,
                **outfit_data,
                "created_at": uuid.uuid4().hex # Or use datetime if preferred
            }
            result = db.saved_outfits.insert_one(doc)
            return str(result.inserted_id)
        except Exception as e:
            logger.error(f"Error saving saved outfit: {e}")
            return None
    return None

def get_saved_outfits(user_id: str):
    if db is not None:
        try:
            return list(db.saved_outfits.find({"user_id": user_id}).sort("created_at", -1))
        except Exception as e:
            logger.error(f"Error fetching saved outfits for {user_id}: {e}")
            return []
    return []

def get_saved_outfit(outfit_id: str):
    if db is not None:
        try:
            from bson.objectid import ObjectId
            if ObjectId.is_valid(outfit_id):
                return db.saved_outfits.find_one({"_id": ObjectId(outfit_id)})
            return db.saved_outfits.find_one({"_id": outfit_id})
        except Exception as e:
            logger.error(f"Error fetching saved outfit {outfit_id}: {e}")
            return None
    return None
