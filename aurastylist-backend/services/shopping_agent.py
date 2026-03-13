import logging
import asyncio
from typing import Dict, List

try:
    from playwright.async_api import async_playwright
except ImportError:
    async_playwright = None

logger = logging.getLogger(__name__)

async def search_components(components: Dict[str, str]) -> Dict[str, List[dict]]:
    """
    Automates a browser to search for each outfit component on Google/DuckDuckGo.
    Returns a dictionary of results per component.
    """
    results = {}
    
    # Fallback to mock data if playwright is not installed or crashes
    if not async_playwright:
        logger.warning("Playwright not installed. Falling back to mock shopping data.")
        return _mock_shopping_data(components)

    try:
        async with async_playwright() as p:
            # Running headless=False makes the browser VISIBLE for the demo!
            browser = await p.chromium.launch(headless=False)
            context = await browser.new_context()
            page = await context.new_page()

            for category, query in components.items():
                logger.info(f"Searching for {category}: {query}")
                items = await _search_duckduckgo(page, query)
                results[category] = items

            await browser.close()
            
    except Exception as e:
        logger.error(f"Playwright automation failed: {e}")
        return _mock_shopping_data(components)

    return results

async def _search_duckduckgo(page, query: str) -> List[dict]:
    # Using DuckDuckGo HTML as it has fewer CAPTCHAs than Google Shopping for basic scraping tests
    try:
        await page.goto("https://html.duckduckgo.com/html/")
        # Type into search bar
        await page.fill("#search_form_input_homepage", f"buy {query} fashion")
        await page.click("#search_button_homepage")
        
        # Wait for results to load
        await page.wait_for_selector(".result", timeout=5000)
        
        # Extract title, link, and a mocked price/image since DDG HTML mode doesn't have shopping images nicely formatted
        # In a real app with Google Custom Search API, all this comes cleanly as JSON.
        items = []
        results_elements = await page.query_selector_all(".result__body")
        
        for idx, el in enumerate(results_elements[:3]): # top 3 results
            a_tag = await el.query_selector("a.result__url")
            if a_tag:
                link = await a_tag.get_attribute("href")
                title = await a_tag.text_content()
                
                # Mocking price and image since generic search engines don't easily provide shopping cards without JS/captchas
                items.append({
                    "title": title.strip().replace("buy ", "").title() if title else query,
                    "url": link,
                    "price": f"${(idx + 1) * 35}.99",
                    "image": "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=300&auto=format&fit=crop"
                })
        return items
    except Exception as e:
        logger.error(f"Scraping error: {e}")
        return []

def _mock_shopping_data(components: Dict[str, str]) -> Dict[str, List[dict]]:
    mock_results = {}
    for cat, query in components.items():
        mock_results[cat] = [
            {
                "title": f"Premium {query}",
                "url": "https://amazon.com",
                "price": "$89.99",
                "image": "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=300&auto=format&fit=crop"
            },
            {
                "title": f"Boutique {query}",
                "url": "https://asos.com",
                "price": "$120.00",
                "image": "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=300&auto=format&fit=crop"
            }
        ]
    return mock_results
