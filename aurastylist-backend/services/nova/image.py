import json
import logging
import base64
import os
from .client import bedrock_client
from .config import NOVA_CANVAS, NOVA_OMNI, MAX_SEED

from .vision import resize_image_if_needed

from typing import Optional, List, Dict, Any

logger = logging.getLogger(__name__)

def generate_image(
    prompt: str, 
    negative_prompt: str = None, 
    count: int = 4, 
    use_omni: bool = False,
    source_image_bytes: Optional[bytes] = None,
    image_format: str = "jpeg"
) -> list:
    """Generates images using Nova Canvas or Omni. Handles inpainting if source_image_bytes is provided."""
    if source_image_bytes:
        logger.info("generate_image: using source image bytes for inpainting prompt")
        return inpaint_image(source_image_bytes, prompt, negative_prompt, count)
    
    model_id = NOVA_CANVAS
    seed = int.from_bytes(os.urandom(4), 'little') % MAX_SEED
    
    request_body = {
        "taskType": "TEXT_IMAGE",
        "textToImageParams": {"text": prompt},
        "imageGenerationConfig": {
            "numberOfImages": count,
            "quality": "standard",
            "seed": seed
        }
    }
    
    if negative_prompt:
        request_body["textToImageParams"]["negativeText"] = negative_prompt
        
    try:
        response_body = bedrock_client.invoke_model(model_id, request_body)
        
        # Robust parsing ported from nova_service.py
        images = []
        if "images" in response_body:
            images = response_body["images"]
        elif "output" in response_body:
            out = response_body["output"]
            images = out.get("images") or ([out.get("image")] if "image" in out else [])
            
        return images if isinstance(images, list) else []
    except Exception as e:
        logger.error(f"Image generation failed for prompt '{prompt[:50]}...': {e}")
        return []

def inpaint_image(image_bytes: bytes, prompt: str, negative_prompt: str = None, count: int = 1) -> list:
    """Text-guided inpainting (Virtual Try-On)."""
    # Ported resize call to ensure 16-pixel alignment
    resized_bytes = resize_image_if_needed(image_bytes)
    seed = int.from_bytes(os.urandom(4), 'little') % MAX_SEED
    
    fallbacks = ["clothing", "outfit", "apparel", "garments", "upper body", "full body"]
    
    for mask_term in fallbacks:
        in_painting_params = {
            "image": base64.b64encode(resized_bytes).decode("utf-8"),
            "text": prompt + " PRESERVE FACE EXACTLY. Do not alter face, eyes, nose, mouth, or hairline. Keep body pose and shape unchanged. Replace only clothing and accessories.",
            "maskPrompt": mask_term,
            "maskStrength": 0.97
        }
        
        if negative_prompt:
            in_painting_params["negativeText"] = negative_prompt

        request_body = {
            "taskType": "INPAINTING",
            "inPaintingParams": in_painting_params,
            "imageGenerationConfig": {
                "numberOfImages": count,
                "quality": "standard",
                "seed": seed
            }
        }

        try:
            response_body = bedrock_client.invoke_model(NOVA_CANVAS, request_body)
            
            # Check for error in the returned body (since we no longer raise on ValidationException in client)
            if isinstance(response_body, dict) and "error" in response_body:
                if "ValidationException" in response_body["error"] and "maskPrompt" in response_body["error"]:
                    logger.warning(f"Mask prompt '{mask_term}' failed, trying next fallback...")
                    continue
                else:
                    logger.error(f"Inpainting failed: {response_body['error']}")
                    # If it's a non-mask error, break the loop and try T2I below
                    break

            images = response_body.get("images", [])
            if images and isinstance(images, list):
                return images
        except Exception as e:
            logger.error(f"Inpainting failed unexpectedly: {e}")
            break
            
    # Final Fallback: If inpainting fails for ALL masks, return standard Text-to-Image
    logger.info("Inpainting (Virtual Try-On) failed completely. Falling back to simple Text-to-Image generation.")
    # We recursion-call generate_image WITHOUT source_image_bytes to trigger the T2I flow
    return generate_image(prompt, negative_prompt, count, use_omni=False, source_image_bytes=None)
