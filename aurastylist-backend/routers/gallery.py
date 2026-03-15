from fastapi import APIRouter, HTTPException, UploadFile, File, Form
import logging
import asyncio
from typing import Dict, Optional
from services import nova
from core import database

logger = logging.getLogger(__name__)

router = APIRouter()

# In-memory store to simulate background job tracking
# Key: request_id, Value: {"status": "processing"|"completed"|"failed", "images": []}
generation_jobs: Dict[str, dict] = {}

async def generate_images_background(request_id: str):
    """Background task to generate 4 images using Nova Omni based on the stored style request."""
    try:
        user_id = "user_123" # Mock user
        request_doc = database.get_style_request(request_id)
        
        source_image_bytes = None
        image_format = "jpeg"

        if request_doc:
            # Always prefer the original uploaded image path from the style request for virtual try-on.
            first_image_path = (
                request_doc.get("reference_image_path") or
                request_doc.get("myself_image_path") or
                request_doc.get("target_image_path") or
                request_doc.get("someone_image_path")
            )
            # Also accept previous style_request path naming for backwards compatibility
            first_image_path = first_image_path or request_doc.get("reference_image") or request_doc.get("target_image")

            if first_image_path:
                try:
                    with open(first_image_path, "rb") as f:
                        source_image_bytes = f.read()
                    image_format = first_image_path.split('.')[-1].lower() if '.' in first_image_path else 'jpeg'
                    logger.info(f"Using original uploaded image for virtual try-on: {first_image_path}")
                except Exception as e:
                    logger.error(f"Failed to read original image path: {e}")

            prompt = (
                f"Create a beautiful, photorealistic full-body fashion editorial outfit on the original provided image. "
                f"Aesthetic: {request_doc.get('aesthetic', 'elegant')}. "
                f"Venue: {request_doc.get('venue', 'event')}. "
                f"Dress type: {request_doc.get('dress_type', 'stylish')}. "
                "Keep the face exactly the same, preserve body shape and skin tone, and only replace the clothing with a stylish look.")
        else:
            prompt = (
                "Create a beautiful, photorealistic full-body fashion editorial outfit image. "
                "Aesthetic: elegant. Venue: evening event. Dress type: formal. "
                "The outfit should be flattering, fashionable, and polished.")

        negative_prompt = "cartoon, text, watermark, low quality, deformed, blurred"
        images_b64 = nova.generate_outfit_images_nova(
            prompt=prompt,
            negative_prompt=negative_prompt,
            source_image_bytes=source_image_bytes,
            image_format=image_format,
            count=4
        )

        if images_b64 and len(images_b64) > 0:
            generation_jobs[request_id] = {
                "status": "completed",
                "images": [f"data:image/jpeg;base64,{img}" for img in images_b64 if img]
            }
            logger.info(f"Background generation SUCCESSFULLY completed for {request_id}")
        else:
            logger.error(f"Generation job for {request_id} returned NO images. Marking as failed.")
            generation_jobs[request_id] = {"status": "failed", "images": []}
    except Exception as e:
        logger.error(f"UNCAUGHT EXCEPTION in background generation for {request_id}: {e}")
        generation_jobs[request_id] = {"status": "failed", "images": []}

@router.post("/virtual-tryon")
async def virtual_tryon(
    outfit_description: str = Form(...),
    image: UploadFile = File(...),
    voice: Optional[UploadFile] = File(None)
):
    """Generate 4 outfit try-on images using Nova Omni from description + optional voice."""
    try:
        image_bytes = await image.read()
        ext = image.filename.split('.')[-1].lower() if '.' in image.filename else 'jpeg'

        voice_text = ""
        if voice:
            # In a production implementation, call speech-to-text (Nova Sonic). Here we mock or infer.
            voice_bytes = await voice.read()
            voice_text = "(Voice input provided)"

        combined_prompt = (
            "Generate 4 very high-resolution, photorealistic full-body fashion edits on the provided image. "
            f"The user requests: {outfit_description}. "
            "Keep the person's face and head exactly the same as the original image. "
            "Preserve body shape, pose, and skin tone. Replace only clothing and accessories with stylish, couture-level fashion. "
            "Use cinematic lighting, realistic texture detail, and crisp editorial composition."
        )
        if voice_text:
            combined_prompt += f" Voice note: {voice_text}."

        images = nova.generate_outfit_images_nova(
            prompt=combined_prompt,
            negative_prompt="low quality, cartoon, text, watermark, deformed, blurred",
            source_image_bytes=image_bytes,
            image_format=ext,
            count=4
        )

        if not images:
            raise HTTPException(status_code=500, detail="Nova Omni image generation failed")

        # Wrap each as data URI for the frontend
        formatted = [f"data:image/jpeg;base64,{img}" for img in images if img]

        return {
            "status": "success",
            "generated_images": formatted,
            "prompt_used": combined_prompt
        }
    except Exception as e:
        logger.error(f"Virtual try-on failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/")
async def get_gallery_by_query(request_id: str):
    """
    Alternative endpoint using query parameter as requested by user.
    """
    return await fetch_gallery_generation(request_id)

@router.get("/generate/{request_id}")
async def fetch_gallery_generation(request_id: str):
    """
    Polls for the status of a gallery generation job.
    If done, returns images.
    """
    if request_id not in generation_jobs:
        logger.info(f"Starting new gallery generation job for {request_id}")
        generation_jobs[request_id] = {"status": "processing", "images": []}
        asyncio.create_task(generate_images_background(request_id))
        return {"request_id": request_id, "status": "processing"}
    
    job = generation_jobs[request_id]
    
    return {
        "request_id": request_id,
        "status": job["status"],
        "images": job.get("images", [])
    }
