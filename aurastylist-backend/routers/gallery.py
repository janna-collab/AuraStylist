from fastapi import APIRouter, HTTPException
import logging
import asyncio
from typing import Dict
from services import nova_service
from core import database

logger = logging.getLogger(__name__)

router = APIRouter()

# In-memory store to simulate background job tracking
# Key: request_id, Value: {"status": "processing"|"completed"|"failed", "images": []}
generation_jobs: Dict[str, dict] = {}

async def generate_images_background(request_id: str):
    """Background task to generate 4 images using Titan based on the style request."""
    try:
        # For this demo, we'll synthesize a prompt based on a mock request if DB fetch fails
        prompt = (
            "A high-quality, photorealistic fashion editorial photo of a person wearing an outfit. "
            "Aesthetic: Elegant Summer Wedding guest. "
            "Dress Type: Formal/Black Tie. "
            "Flattering fit, cinematic lighting, ultra-detailed."
        )
        negative_prompt = "cartoon, illustration, poorly drawn, deformed, low resolution, ugly"
        
        images_base64 = []
        
        # Generate 4 unique variations
        # In a real app we'd parallelize this with asyncio.gather
        for i in range(4):
            img_b64 = nova_service.invoke_titan_image_generation(prompt, negative_prompt)
            if img_b64:
                # Format to display directly in an <img> tag src
                images_base64.append(f"data:image/jpeg;base64,{img_b64}")
            else:
                logger.warning(f"Failed to generate image {i+1} for {request_id}")
                
        if len(images_base64) > 0:
            generation_jobs[request_id] = {
                "status": "completed",
                "images": images_base64
            }
        else:
            generation_jobs[request_id] = {
                "status": "failed",
                "images": []
            }
            
    except Exception as e:
        logger.error(f"Background generation failed for {request_id}: {e}")
        generation_jobs[request_id] = {
            "status": "failed",
            "images": []
        }

@router.get("/generate/{request_id}")
async def fetch_gallery_generation(request_id: str):
    """
    Polling endpoint.
    If request is new, starts background generation and returns 'processing'.
    If processing, returns 'processing'.
    If done, returns images.
    """
    if request_id not in generation_jobs:
        # Start the background job
        generation_jobs[request_id] = {"status": "processing", "images": []}
        asyncio.create_task(generate_images_background(request_id))
        return {"request_id": request_id, "status": "processing"}
        
    job = generation_jobs[request_id]
    
    if job["status"] == "completed":
        return {
            "request_id": request_id,
            "status": "completed",
            "images": job["images"]
        }
    elif job["status"] == "failed":
        raise HTTPException(status_code=500, detail="Image generation failed")
    else:
        # Still processing
        return {"request_id": request_id, "status": "processing"}
