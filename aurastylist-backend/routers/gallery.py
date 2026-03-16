from fastapi import APIRouter, HTTPException, UploadFile, File, Form
import logging
import asyncio
import json
from typing import Dict, Optional, List
from services import nova
from core import database

logger = logging.getLogger(__name__)

router = APIRouter()

# In-memory store to simulate background job tracking
# Key: request_id, Value: {"status": "processing"|"completed"|"failed", "images": [], "recommendation": ""}
generation_jobs: Dict[str, dict] = {}

async def generate_images_background(request_id: str):
    """Background task to generate 4 images using Nova Omni."""
    try:
        request_doc = database.get_style_request(request_id)
        if not request_doc:
            logger.error(f"No style request found for {request_id}")
            generation_jobs[request_id] = {"status": "failed", "images": []}
            return

        source_image_bytes = None
        image_format = "jpeg"

        # Find the best image to use for try-on
        first_image_path = (
            request_doc.get("reference_image_path") or
            request_doc.get("myself_image_path") or
            request_doc.get("target_image_path") or
            request_doc.get("someone_image_path")
        )
        # Also accept legacy naming
        first_image_path = first_image_path or request_doc.get("reference_image") or request_doc.get("target_image")

        if first_image_path:
            try:
                with open(first_image_path, "rb") as f:
                    source_image_bytes = f.read()
                image_format = first_image_path.split('.')[-1].lower() if '.' in first_image_path else 'jpeg'
                logger.info(f"Using original uploaded image for virtual try-on: {first_image_path}")
            except Exception as e:
                logger.error(f"Failed to read image path: {e}")

        gender = request_doc.get("gender") or "female"
        gender_subject = "female fashion model" if gender.lower() in ("female", "woman", "girl") else "male fashion model" if gender.lower() in ("male", "man", "boy") else "fashion model"

        prompt = (
            f"Create a photorealistic FULL-BODY fashion editorial photo of a {gender_subject}. "
            "MANDATORY: Show the complete outfit HEAD-TO-TOE — face, torso, legs, and feet. NO cropping. "
            f"Aesthetic: {request_doc.get('aesthetic', 'elegant')}. "
            f"Venue: {request_doc.get('venue', 'event')}. "
            f"Dress type: {request_doc.get('dress_type', 'stylish')}. "
            f"STRICT GENDER RULE: Generate ONLY {'women' if gender.lower() in ('female','woman','girl') else 'men'}'s fashion. "
            "Keep the face exactly the same, preserve body shape and skin tone, and only replace the clothing with a stylish look."
        )

        negative_prompt = (
            "cartoon, text, watermark, low quality, deformed, blurred, "
            "cropped image, cut off legs, cut off feet, partial body, headshot only, portrait only"
        )

        images_b64 = nova.generate_outfit_images_nova(
            prompt=prompt,
            negative_prompt=negative_prompt,
            source_image_bytes=source_image_bytes,
            image_format=image_format,
            count=4,
            gender=gender
        )

        if images_b64 and len(images_b64) > 0:
            generation_jobs[request_id] = {
                "status": "completed",
                "images": [f"data:image/jpeg;base64,{img}" for img in images_b64 if img],
                "recommendation": request_doc.get("recommendation", "A curated fashion selection.")
            }
            logger.info(f"Background generation completed for {request_id}")
        else:
            logger.error(f"Generation returned NO images for {request_id}")
            generation_jobs[request_id] = {"status": "failed", "images": []}
            
    except Exception as e:
        logger.error(f"Background job error for {request_id}: {e}")
        generation_jobs[request_id] = {"status": "failed", "images": []}

@router.post("/virtual-tryon")
async def virtual_tryon(
    outfit_description: str = Form(...),
    image: UploadFile = File(...),
    voice: Optional[UploadFile] = File(None)
):
    try:
        image_bytes = await image.read()
        ext = image.filename.split('.')[-1].lower() if '.' in image.filename else 'jpeg'

        combined_prompt = (
            "Generate 4 very high-resolution, photorealistic full-body fashion edits on the provided image. "
            f"The user requests: {outfit_description}. "
            "Keep the person's face and head exactly the same. Preserve body shape and skin tone."
        )

        images = nova.generate_outfit_images_nova(
            prompt=combined_prompt,
            negative_prompt="low quality, cartoon, text, watermark, deformed, blurred",
            source_image_bytes=image_bytes,
            image_format=ext,
            count=4,
            gender=None # Optional: we could extract this from profile if available
        )

        if not images:
            raise HTTPException(status_code=500, detail="Generation failed")

        formatted = [f"data:image/jpeg;base64,{img}" for img in images if img]
        return {"status": "success", "generated_images": formatted}
    except Exception as e:
        logger.error(f"Virtual try-on failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("")
@router.get("/")
async def get_gallery_by_query(request_id: str):
    return await fetch_gallery_generation(request_id)

@router.post("/regenerate")
async def regenerate_gallery(request_id: str):
    if not request_id:
        raise HTTPException(status_code=400, detail="request_id is required")
    if request_id in generation_jobs:
        del generation_jobs[request_id]
    
    generation_jobs[request_id] = {"status": "processing", "images": []}
    asyncio.create_task(generate_images_background(request_id))
    return {"request_id": request_id, "status": "processing"}

@router.get("/generate/{request_id}")
async def fetch_gallery_generation(request_id: str):
    if request_id not in generation_jobs:
        logger.info(f"Starting new job for {request_id}")
        generation_jobs[request_id] = {"status": "processing", "images": []}
        asyncio.create_task(generate_images_background(request_id))
        return {"request_id": request_id, "status": "processing"}
    
    job = generation_jobs[request_id]
    return {
        "request_id": request_id,
        "status": job["status"],
        "images": job.get("images", []),
        "recommendation": job.get("recommendation", "")
    }

@router.post("/save")
async def save_look(user_id: str, outfit_data: dict):
    if not user_id:
        raise HTTPException(status_code=400, detail="User ID is required")
    
    result = database.save_saved_outfit(user_id, outfit_data)
    if not result:
        raise HTTPException(status_code=500, detail="Failed to save look")
        
    return {"status": "success", "id": result}

@router.get("/saved/{user_id}")
async def get_saved_looks(user_id: str):
    if not user_id:
        raise HTTPException(status_code=400, detail="User ID is required")
        
    outfits = database.get_saved_outfits(user_id)
    # Convert MongoDB _id to string for JSON serialization
    for o in outfits:
        o["_id"] = str(o["_id"])
        
    return {"status": "success", "outfits": outfits}

@router.get("/saved-outfit/{outfit_id}")
async def get_saved_outfit(outfit_id: str):
    if not outfit_id:
        raise HTTPException(status_code=400, detail="Outfit ID is required")
        
    outfit = database.get_saved_outfit(outfit_id)
    if not outfit:
        raise HTTPException(status_code=404, detail="Saved outfit not found")
        
    outfit["_id"] = str(outfit["_id"])
    return {"status": "success", "outfit": outfit}
