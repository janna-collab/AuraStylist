import logging
import asyncio
from typing import Dict, List

try:
    from playwright.async_api import async_playwright
except ImportError:
    async_playwright = None

logger = logging.getLogger(__name__)

async def search_outfit_components(components: Dict[str, str], user_profile: dict = None) -> Dict[str, List[dict]]:
    """
    Stage 4: Activate Shopping Page (UI Automation)
    Performs distinct searches for 'top wear', 'bottom wear', 'jewelry', 'shoes', and 'bag'.
    Uses Nova Act (simulated via Playwright) to automate the browsing and filtering.
    """
    results = {}
    
    if not async_playwright:
        logger.warning("Playwright not installed. Falling back to mock shopping data.")
        return _mock_shopping_data(components)

    try:
        async with async_playwright() as p:
            # Running headless=False makes the browser VISIBLE for the demo!
            browser = await p.chromium.launch(headless=False)
            context = await browser.new_context()
            page = await context.new_page()

            # The Section-by-Section Search
            for category, query in components.items():
                logger.info(f"Nova Act: Searching for {category} -> {query}")
                
                # We can search Amazon or Google Shopping
                # For this demo, we'll use Amazon and simulate filter application
                items = await _search_amazon_with_nova_act(page, query, user_profile)
                results[category] = items

            await browser.close()
            
    except Exception as e:
        logger.error(f"Nova Act automation failed: {e}")
        return _mock_shopping_data(components)

    return results

async def _search_amazon_with_nova_act(page, query: str, profile: dict = None) -> List[dict]:
    """
    Simulates Nova Act behavior: clicking, typing, and applying filters.
    """
    items = []
    try:
        # 1. Navigate to Amazon
        await page.goto("https://www.amazon.com/s?k=" + query.replace(" ", "+"), timeout=60000)
        
        # 2. Nova Act would "see" the filters and click them based on User Profile
        if profile:
            # Example: Filter by size if extracted from profile (e.g., shoe size)
            pass 
        
        # 3. Wait for search results
        await page.wait_for_selector(".s-result-item", timeout=10000)
        
        # 4. Extract top 3 results
        result_cards = await page.query_selector_all(".s-result-item[data-component-type='s-search-result']")
        
        for card in result_cards[:3]:
            title_el = await card.query_selector("h2 a span")
            link_el = await card.query_selector("h2 a")
            price_el = await card.query_selector(".a-price .a-offscreen")
            img_el = await card.query_selector(".s-image")
            
            if title_el and link_el:
                title = await title_el.text_content()
                link = "https://www.amazon.com" + await link_el.get_attribute("href")
                price = await price_el.text_content() if price_el else "$???"
                img_url = await img_el.get_attribute("src") if img_el else ""
                
                items.append({
                    "title": title.strip(),
                    "url": link,
                    "price": price,
                    "image": img_url
                })
        
        return items
    except Exception as e:
        logger.error(f"Amazon search error: {e}")
        # Fallback to a simpler search or mock if Amazon blocks us
        return [{"title": f"Classic {query}", "url": "https://amazon.com", "price": "$45.00", "image": ""}]

def _mock_shopping_data(components: Dict[str, str]) -> Dict[str, List[dict]]:
    mock_results = {}
    for cat, query in components.items():
        mock_results[cat] = [
            {
                "title": f"Premium {query}",
                "url": "https://amazon.com",
                "price": "$89.99",
                "image": "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=300&auto=format&fit=crop"
            }
        ]
    return mock_results
