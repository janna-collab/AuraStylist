from fastapi import APIRouter, HTTPException, Form
from pydantic import BaseModel
from typing import Optional
import logging
import base64
from services import nova, shopping_agent

logger = logging.getLogger(__name__)

router = APIRouter()

class ShopRequest(BaseModel):
    image_url: Optional[str] = None
    image_bytes_b64: Optional[str] = None
    outfit_description: str = ""

@router.post("/search")
async def search_outfit_components(request: ShopRequest):
    """
    Hybrid Visual Search flow:
    1. If image provided, use Nova Omni to segment into items (Top, Bottom, etc).
    2. Run hybrid shopping agent (Lens for discovery, CSE API for 'Buy Now' links).
    """
    try:
        image_bytes = None
        if request.image_bytes_b64:
            # Handle base64 image if provided directly
            try:
                b64_str = request.image_bytes_b64
                if "base64," in b64_str:
                    b64_str = b64_str.split("base64,")[1]
                image_bytes = base64.b64decode(b64_str)
            except Exception as e:
                logger.error(f"Failed to decode image bytes: {e}")

        # Execute the refined visual search workflow
        results = await shopping_agent.execute_aws_shopping_search(
            image_url=request.image_url,
            image_bytes=image_bytes,
            outfit_description=request.outfit_description
        )

        return {
            "status": "success",
            "results": results
        }
    except Exception as e:
        logger.error(f"Shopping search failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))
