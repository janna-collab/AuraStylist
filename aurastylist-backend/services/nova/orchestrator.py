import logging
import json
from .vision import analyze_style_profile
from .reasoning import generate_outfit_recommendation, extract_search_terms
from .image import generate_image, inpaint_image
from .prompts import PromptFactory

logger = logging.getLogger(__name__)

class StyleOrchestrator:
    """Agent Orchestrator for managing style workflows."""
    
    def __init__(self, use_omni: bool = False):
        self.use_omni = use_omni
        self.prompt_factory = PromptFactory()

    async def execute_style_flow(self, user_request: dict, image_bytes: bytes = None) -> dict:
        """Runs the full agentic flow."""
        logger.info(f"Orchestrating style flow: {user_request.get('target_type')}")
        
        result = {
            "status": "processing",
            "user_profile": None,
            "recommendation": None,
            "images": [],
            "search_terms": {}
        }

        # 1. Vision Agent: Profile Analysis
        if image_bytes:
            result["user_profile"] = analyze_style_profile(image_bytes, use_omni=self.use_omni)
        
        # 2. Reasoning Agent: Full Style Report & Recommendations
        if result["user_profile"]:
            # Build manual_inputs for the report generator
            manual_inputs = {
                "height": user_request.get("height", "Standard"),
                "venue": user_request.get("venue"),
                "aesthetic": user_request.get("aesthetic"),
                "dressType": user_request.get("dress_type"),
                "priceRange": user_request.get("price_range")
            }
            # Generate the detailed report (Overwrites the basic profile with enriched info)
            from .reasoning import generate_style_report_pro
            enriched_profile = generate_style_report_pro(
                json.dumps(result["user_profile"]), 
                manual_inputs, 
                use_omni=self.use_omni
            )
            if enriched_profile:
                result["user_profile"] = enriched_profile

        result["recommendation"] = generate_outfit_recommendation(
            aesthetic=user_request.get("aesthetic"),
            venue=user_request.get("venue"),
            target_profile=result["user_profile"],
            gender=user_request.get("gender"),
            vibe_analysis=f"Size: {user_request.get('size', 'regular')}",
            dress_type=user_request.get("dress_type"),
            price_range=user_request.get("price_range"),
            use_omni=self.use_omni
        )
        
        # 3. Product Agent: Search Extraction
        result["search_terms"] = extract_search_terms(result["recommendation"])
        
        # 4. Creative Agent: Image Generation
        # Make the generated prompt reference the uploaded image for virtual try-on
        if image_bytes and user_request.get("target_type") in ["myself", "someone"]:
            final_prompt = self.prompt_factory.create_inpainting_prompt(
                result["recommendation"],
                user_request.get("aesthetic"),
                user_request.get("venue"),
                gender=user_request.get("gender"),
                size=user_request.get("size")
            )
        else:
            final_prompt = self.prompt_factory.create_fashion_prompt(
                result["recommendation"],
                user_request.get("aesthetic"),
                user_request.get("venue"),
                gender=user_request.get("gender")
            )

        negative = self.prompt_factory.get_standard_negative()
        
        if image_bytes and user_request.get("target_type") in ["myself", "someone"]:
            # Virtual Try-On with original image
            result["images"] = inpaint_image(image_bytes, final_prompt, negative, gender=user_request.get("gender"))
        else:
            # Text-to-image variation
            result["images"] = generate_image(final_prompt, negative, use_omni=self.use_omni, gender=user_request.get("gender"))
        
        result["status"] = "success"
        return result

# Singleton orchestrator
orchestrator = StyleOrchestrator()
