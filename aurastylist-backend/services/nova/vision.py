import io
import logging
import base64
from PIL import Image
from .client import bedrock_client
from .config import NOVA_LITE, NOVA_OMNI, MAX_IMAGE_PIXELS, MIN_DIMENSION, MAX_DIMENSION

logger = logging.getLogger(__name__)

def resize_image_if_needed(image_bytes: bytes, max_pixels: int = MAX_IMAGE_PIXELS) -> bytes:
    """Resizes image to fit model constraints and ensures dimensions are multiples of 16."""
    try:
        img = Image.open(io.BytesIO(image_bytes))
        width, height = img.size
        
        pixels = width * height
        if pixels > max_pixels:
            scale = (max_pixels / pixels) ** 0.5
            width, height = int(width * scale), int(height * scale)
        
        # Multiples of 16
        width = (width // 16) * 16
        height = (height // 16) * 16
        
        # Constraints
        width = max(MIN_DIMENSION, min(MAX_DIMENSION, width))
        height = max(MIN_DIMENSION, min(MAX_DIMENSION, height))
        
        if (width, height) != img.size:
            img = img.resize((width, height), Image.Resampling.LANCZOS)
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")
            buf = io.BytesIO()
            img.save(buf, format="JPEG", quality=90)
            return buf.getvalue()
        return image_bytes
    except Exception as e:
        logger.error(f"Resize failed: {e}")
        return image_bytes

def analyze_style_profile(image_bytes: bytes, image_format: str = "jpeg", use_omni: bool = False) -> dict:
    """Analyze person's physical profile from an image."""
    model_id = NOVA_OMNI if use_omni else NOVA_LITE
    image_bytes = resize_image_if_needed(image_bytes)
    
    messages = [{
        "role": "user",
        "content": [
            {"image": {"format": image_format, "source": {"bytes": image_bytes}}},
            {"text": "Analyze this person's: 1. Skin undertone, 2. Body shape, 3. Face shape. Return ONLY JSON with keys: 'skinUndertone', 'bodyProportions', 'faceShape'."}
        ]
    }]
    
    try:
        response = bedrock_client.converse(model_id, messages)
        text = "".join([c.get('text', '') for c in response['output']['message']['content'] if 'text' in c])
        import json
        clean_json = text.replace("```json", "").replace("```", "").strip()
        return json.loads(clean_json)
    except Exception as e:
        logger.error(f"Analysis failed: {e}")
        return None

def analyze_reference_image(image_bytes: bytes, image_format: str = "jpeg", use_omni: bool = False) -> str:
    """Analyze a reference outfit/style image to extract its vibe/aesthetic."""
    model_id = NOVA_OMNI if use_omni else NOVA_LITE
    image_bytes = resize_image_if_needed(image_bytes)
    
    messages = [{
        "role": "user",
        "content": [
            {"image": {"format": image_format, "source": {"bytes": image_bytes}}},
            {"text": "Analyze this reference outfit/style image. Describe the core aesthetic, key clothing pieces, color palette, and overall vibe. Keep it concise, actionable, and focused on fashion elements."}
        ]
    }]
    
    try:
        response = bedrock_client.converse(model_id, messages)
        return "".join([c.get('text', '') for c in response['output']['message']['content'] if 'text' in c])
    except Exception as e:
        logger.error(f"Reference analysis failed: {e}")
        return "A stylish fashion reference."

def analyze_target_person(image_bytes: bytes, image_format: str = "jpeg", use_omni: bool = False) -> dict:
    """Analyze a photo of a target person to extract styling profile."""
    # Reuse analyze_style_profile logic since they do the same thing
    return analyze_style_profile(image_bytes, image_format, use_omni)
