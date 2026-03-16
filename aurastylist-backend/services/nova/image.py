import json
import logging
import base64
import os
from .client import bedrock_client
from .config import NOVA_CANVAS, NOVA_OMNI, MAX_SEED

from .vision import resize_image_if_needed

from typing import Optional, List, Dict, Any

logger = logging.getLogger(__name__)

def _build_gender_directive(gender: Optional[str]) -> str:
    """Returns a strong gender enforcement string for prompts."""
    if not gender:
        return ""
    g = gender.strip().lower()
    if g in ("female", "woman", "girl"):
        return (
            " STRICT GENDER RULE: The subject is FEMALE. Generate ONLY women's fashion — "
            "dresses, skirts, women's tops, feminine cuts and silhouettes. "
            "Do NOT generate any men's clothing, suits, or gender-neutral styles. "
            "The model must appear unambiguously female."
        )
    elif g in ("male", "man", "boy"):
        return (
            " STRICT GENDER RULE: The subject is MALE. Generate ONLY men's fashion — "
            "suits, trousers, shirts, men's cuts and silhouettes. "
            "Do NOT generate any women's clothing, dresses, skirts, or feminine styles. "
            "The model must appear unambiguously male."
        )
    return f" STRICT GENDER RULE: The subject is {gender}. Generate attire appropriate ONLY for {gender}."

def generate_image(
    prompt: str, 
    negative_prompt: str = None, 
    count: int = 4, 
    use_omni: bool = False,
    source_image_bytes: Optional[bytes] = None,
    image_format: str = "jpeg",
    gender: Optional[str] = None
) -> list:
    """Generates images using Nova Canvas. Handles inpainting if source_image_bytes is provided."""
    gender_directive = _build_gender_directive(gender)
    full_prompt = prompt + gender_directive
    
    if source_image_bytes:
        logger.info("generate_image: using source image bytes for inpainting prompt")
        return inpaint_image(source_image_bytes, full_prompt, negative_prompt, count, gender=gender)
    
    model_id = NOVA_CANVAS
    seed = int.from_bytes(os.urandom(4), 'little') % MAX_SEED
    
    request_body = {
        "taskType": "TEXT_IMAGE",
        "textToImageParams": {"text": full_prompt},
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

def inpaint_image(image_bytes: bytes, prompt: str, negative_prompt: str = None, count: int = 1, gender: Optional[str] = None) -> list:
    """Text-guided inpainting (Virtual Try-On)."""
    resized_bytes, _ = resize_image_if_needed(image_bytes)
    seed = int.from_bytes(os.urandom(4), 'little') % MAX_SEED
    
    gender_directive = _build_gender_directive(gender)
    inpaint_prompt = (
        prompt + gender_directive +
        " PRESERVE FACE EXACTLY. Do not alter face, eyes, nose, mouth, or hairline. "
        "Keep body pose and shape unchanged. Replace only clothing and accessories."
    )
    
    fallbacks = ["clothing", "outfit", "apparel", "garments", "upper body", "full body"]
    
    for mask_term in fallbacks:
        in_painting_params = {
            "image": base64.b64encode(resized_bytes).decode("utf-8"),
            "text": inpaint_prompt,
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
            
            if isinstance(response_body, dict) and "error" in response_body:
                if "ValidationException" in response_body["error"] and "maskPrompt" in response_body["error"]:
                    logger.warning(f"Mask prompt '{mask_term}' failed, trying next fallback...")
                    continue
                else:
                    logger.error(f"Inpainting failed: {response_body['error']}")
                    break

            images = response_body.get("images", [])
            if images and isinstance(images, list):
                return images
        except Exception as e:
            logger.error(f"Inpainting failed unexpectedly: {e}")
            break
            
    # Final Fallback: Text-to-Image
    logger.info("Inpainting failed completely. Falling back to Text-to-Image generation.")
    return generate_image(prompt, negative_prompt, count, use_omni=False, source_image_bytes=None, gender=gender)
