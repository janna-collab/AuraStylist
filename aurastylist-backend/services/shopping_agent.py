import logging
import httpx
import asyncio
import base64
from typing import List, Dict, Any, Optional
from services.nova.vision import analyze_outfit_visually
from services.retrieval.embeddings import EmbeddingService
from services.retrieval.opensearch import OpenSearchService
from services.retrieval.ranker import RankingEngine

logger = logging.getLogger(__name__)

async def execute_aws_shopping_search(
    image_url: Optional[str] = None,
    image_bytes: Optional[bytes] = None,
    outfit_description: str = "An elegant, curated fashion look."
) -> Dict[str, List[dict]]:
    """
    AWS High-Precision Shopping Pipeline:
    1. Parse: Use Nova Vision for component-wise attribute extraction.
    2. Embed: Use Nova Multimodal Embeddings for visual/textual context.
    3. Retrieve: Vector similarity search in OpenSearch.
    4. Rank: Combine embedding affinity with metadata similarity (style, color, material).
    """
    logger.info(f"Starting AWS Multimodal Shopping Search for {image_url[:50] if image_url else 'direct bytes' if image_bytes else 'text description'}")
    
    # 1. PREPARE IMAGE BYTES
    if not image_bytes and image_url:
        image_bytes = await _fetch_image_bytes(image_url)
        
    # 2. PARSE OUTFIT
    parsed_outfit = None
    if image_bytes:
        parsed_outfit = analyze_outfit_visually(image_bytes)
    
    # Fallback to text parsing if vision fails
    if not parsed_outfit:
        logger.warning("Vision parsing failed or no image provided. Using text-based reasoning.")
        parsed_outfit = _parse_outfit_text_only(outfit_description)

    # 3. COMPONENT-WISE RETRIEVAL
    results = {}
    categories = ["top", "bottom", "shoes", "bag", "watch", "accessories"]
    
    # Run searches in parallel
    search_tasks = []
    for cat in categories:
        details = parsed_outfit.get(cat, {})
        if not details: 
            details = {"type": cat, "color": "", "material": "", "style": outfit_description}
        search_tasks.append(_search_component_high_precision(cat, details, image_bytes))
    
    search_outputs = await asyncio.gather(*search_tasks)
    
    for cat, items in zip(categories, search_outputs):
        if items:
            display_key = cat.capitalize()
            results[display_key] = items

    return results

async def _search_component_high_precision(category: str, details: Dict[str, str], source_image: Optional[bytes]) -> List[Dict[str, Any]]:
    """Orchestrates retrieval and ranking for a specific fashion component."""
    try:
        # A. Contextual Query
        text_query = f"{details.get('color', '')} {details.get('material', '')} {details.get('type', '')} {details.get('style', '')}".strip()
        
        # B. Multimodal Embeddings
        embedding = None
        if source_image:
            embedding = EmbeddingService.generate_image_embedding(source_image)
        
        if not embedding:
            embedding = EmbeddingService.generate_text_embedding(text_query)

        # C. OpenSearch Vector Search
        candidates = OpenSearchService.search_similar_products(
            category=category,
            embedding=embedding or [],
            metadata=details
        )
        
        # D. Ranking & Post-processing
        final_picks = RankingEngine.rank_products(candidates, details)
        
        # E. Return only high-confidence matches (no forced fallbacks if truly empty)
        return final_picks[:4]

    except Exception as e:
        logger.error(f"Error searching for {category}: {e}")
        return []

# ── Helpers ────────────────────────────────────────────────────────────────

def _parse_outfit_text_only(description: str) -> Dict[str, Any]:
    """Generates structured attributes from a text description."""
    return {
        "top": {"type": "top wear", "color": "", "material": "", "style": description},
        "bottom": {"type": "bottom wear", "color": "", "material": "", "style": description},
        "shoes": {"type": "footwear", "color": "", "material": "", "style": description}
    }

async def _fetch_image_bytes(url: str) -> Optional[bytes]:
    """Fetches image bytes from a URL (handles data URIs and remote URLs)."""
    try:
        if url.startswith("data:image"):
            header, encoded = url.split(",", 1)
            return base64.b64decode(encoded)
        
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(url)
            resp.raise_for_status()
            return resp.content
    except Exception as e:
        logger.error(f"Failed to fetch image bytes: {e}")
        return None

# ── Compatibility Wrappers ──────────────────────────────────────────────────

async def visual_search_workflow(image_url: Optional[str] = None, image_bytes: Optional[bytes] = None, outfit_description: str = ""):
    """Standardized entry point for the shopping search."""
    return await execute_aws_shopping_search(image_url=image_url, image_bytes=image_bytes, outfit_description=outfit_description)

async def search_outfit_components(components: Dict[str, str], user_profile: dict = None) -> Dict[str, List[dict]]:
    description = " ".join(components.values())
    return await execute_aws_shopping_search(outfit_description=description)
