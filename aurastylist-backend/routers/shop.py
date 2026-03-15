from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import logging
from services import nova, shopping_agent

logger = logging.getLogger(__name__)

router = APIRouter()

class ShopRequest(BaseModel):
    image_url: str
    outfit_description: str = ""

@router.post("/search")
async def search_outfit_components(request: ShopRequest):
    """
    1. Pass description/image context to Nova Lite to extract components.
    2. Pass components to the Playwright shopping agent.
    """
    try:
        # 1. Parse into components using Nova Lite
        components = nova.extract_outfit_components(request.outfit_description)
        if not components:
            logger.warning("Nova failed to extract components, using fallback")
            components = {
                "top": "Elegant silk blouse",
                "bottom": "Tailored wide-leg trousers",
                "shoes": "Black stiletto heels",
                "accessories": "Gold statement necklace"
            }
            
        logger.info(f"Extracted components: {components}")
        
        # 2. Scrape/Search for each component using Playwright (simulating Nova Act)
        results = await shopping_agent.search_outfit_components(components)

        
        return {
            "status": "success",
            "components_searched": list(components.keys()),
            "results": results
        }
    except Exception as e:
        logger.error(f"Shopping search failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))
