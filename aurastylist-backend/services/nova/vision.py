import io
import logging
import base64
import json
from PIL import Image
from .client import bedrock_client
from .config import NOVA_LITE, NOVA_OMNI, MAX_IMAGE_PIXELS, MIN_DIMENSION, MAX_DIMENSION

logger = logging.getLogger(__name__)

def resize_image_if_needed(image_bytes: bytes, original_format: str = "jpeg", max_pixels: int = MAX_IMAGE_PIXELS) -> tuple[bytes, str]:
    """Resizes image to fit model constraints and ensures dimensions are multiples of 16. Returns (bytes, format)."""
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
        
        if (width, height) != img.size or img.mode in ("RGBA", "P") or img.format.lower() not in ("jpeg", "png"):
            img = img.resize((width, height), Image.Resampling.LANCZOS)
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")
            
            # Save as JPEG for consistency, but return 'jpeg' format
            buf = io.BytesIO()
            img.save(buf, format="JPEG", quality=90)
            return buf.getvalue(), "jpeg"
        
        # Consistent Bedrock format name
        fmt = img.format.lower()
        if fmt == "jpg": fmt = "jpeg"
        return image_bytes, fmt
    except Exception as e:
        logger.error(f"Resize failed: {e}")
        return image_bytes, original_format

def analyze_style_profile(image_bytes: bytes, image_format: str = "jpeg", use_omni: bool = False) -> dict:
    """Analyze person's physical profile from an image."""
    model_id = NOVA_OMNI if use_omni else NOVA_LITE
    image_bytes, image_format = resize_image_if_needed(image_bytes, image_format)
    
    messages = [{
        "role": "user",
        "content": [
            {"image": {"format": image_format, "source": {"bytes": image_bytes}}},
            {"text": "Analyze this person's: 1. Skin undertone, 2. Body shape, 3. Face shape. Return ONLY JSON with keys: 'skinUndertone', 'bodyProportions', 'faceShape'."}
        ]
    }]
    
    try:
        response = bedrock_client.converse(model_id, messages)
        if not response or 'output' not in response:
            logger.error(f"Style profile analysis returned invalid response")
            return None
            
        text = "".join([c.get('text', '') for c in response['output']['message']['content'] if 'text' in c])
        clean_json = text.replace("```json", "").replace("```", "").strip()
        return json.loads(clean_json)
    except Exception as e:
        logger.error(f"Analysis failed: {e}")
        return None

def analyze_reference_image(image_bytes: bytes, image_format: str = "jpeg", use_omni: bool = False) -> str:
    """Analyze a reference outfit/style image to extract its vibe/aesthetic."""
    model_id = NOVA_OMNI if use_omni else NOVA_LITE
    image_bytes, image_format = resize_image_if_needed(image_bytes, image_format)
    
    messages = [{
        "role": "user",
        "content": [
            {"image": {"format": image_format, "source": {"bytes": image_bytes}}},
            {"text": "Analyze this reference outfit/style image. Describe the core aesthetic, key clothing pieces, color palette, and overall vibe. Keep it concise, actionable, and focused on fashion elements."}
        ]
    }]
    
    try:
        response = bedrock_client.converse(model_id, messages)
        if not response or 'output' not in response:
            return "A stylish fashion reference."
            
        return "".join([c.get('text', '') for c in response['output']['message']['content'] if 'text' in c])
    except Exception as e:
        logger.error(f"Reference analysis failed: {e}")
        return "A stylish fashion reference."

def analyze_target_person(image_bytes: bytes, image_format: str = "jpeg", use_omni: bool = False) -> dict:
    """Analyze a photo of a target person to extract styling profile."""
    return analyze_style_profile(image_bytes, image_format, use_omni)

def analyze_outfit_visually(image_bytes: bytes, image_format: str = "jpeg") -> dict:
    """
    Uses Nova Omni to segment and describe an outfit image into discrete components.
    Returns a dictionary of components for granular shopping search.
    """
    model_id = NOVA_OMNI
    image_bytes, image_format = resize_image_if_needed(image_bytes, image_format)
    
    prompt = """You are a professional fashion vision parser. 
    Analyze the outfit image very precisely and detect each component independently.

    Return strict JSON matching THIS schema exactly:
    {
      "top": {"type": "...", "color": "...", "material": "...", "fit": "...", "style": "..."},
      "bottom": {"type": "...", "color": "...", "material": "...", "fit": "...", "style": "..."},
      "shoes": {"type": "...", "color": "...", "material": "...", "fit": "...", "style": "..."},
      "bag": {"type": "...", "color": "...", "material": "...", "fit": "...", "style": "..."},
      "watch": {"type": "...", "color": "...", "material": "...", "fit": "...", "style": "..."},
      "accessories": {"type": "...", "color": "...", "material": "...", "fit": "...", "style": "..."}
    }

    Notes:
    - If a component is missing, return empty strings for its fields.
    - Be extremely descriptive for search relevance.
    """
    
    image_bytes, image_format = resize_image_if_needed(image_bytes, image_format)
    
    # Bedrock Converse API expects 'jpeg' or 'png'
    messages = [
        {
            "role": "user",
            "content": [
                {"image": {"format": image_format, "source": {"bytes": image_bytes}}},
                {"text": prompt}
            ]
        }
    ]

    try:
        response = bedrock_client.converse(
            modelId=model_id,
            messages=messages
        )
        
        if not response or 'output' not in response:
            return None

        content = response['output']['message']['content']
        text_output = "".join([c.get('text', '') for c in content if 'text' in c])

        # Clean JSON and parse
        clean_json = text_output.strip()
        if "```json" in clean_json:
            clean_json = clean_json.split("```json")[1].split("```")[0].strip()
        elif "```" in clean_json:
            clean_json = clean_json.split("```")[1].split("```")[0].strip()

        parsed = json.loads(clean_json)
        
        for cat, details in parsed.items():
            if isinstance(details, dict):
                parts = [details.get(k, "") for k in ["color", "material", "type", "style"]]
                details["search_ready_query"] = " ".join([p for p in parts if p])
        
        return parsed

    except Exception as e:
        logger.error(f"Visual outfit analysis failed: {e}")
        return None
