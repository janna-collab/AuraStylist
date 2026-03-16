import logging
import json
from .client import bedrock_client
from .config import NOVA_PRO, NOVA_OMNI

from typing import Dict, Optional, Any

logger = logging.getLogger(__name__)

def generate_outfit_recommendation(
    aesthetic: str,
    venue: str,
    target_profile: Optional[dict] = None,
    vibe_analysis: Optional[str] = None,
    dress_type: Optional[str] = None,
    price_range: Optional[str] = None,
    gender: Optional[str] = None,
    use_omni: bool = False
) -> str:
    """Enhanced outfit recommendation logic ported from nova_service.py."""
    model_id = NOVA_OMNI if use_omni else NOVA_PRO
    
    context = []
    if target_profile:
        context.append(f"Profile: {json.dumps(target_profile)}")
    if vibe_analysis:
        context.append(f"Vibe: {vibe_analysis}")
    if dress_type:
        context.append(f"Requested Item: {dress_type}")
    if price_range:
        context.append(f"Budget: {price_range}")
    if gender:
        context.append(f"Gender: {gender}")

    context_str = "\n".join(context)
    prompt = (
        f"Generate a short, actionable outfit recommendation (2-3 sentences max) "
        f"for a person attending a {venue} with a {aesthetic} aesthetic.\n"
        f"Context:\n{context_str}\n\n"
        "Provide only the outfit description and why it works."
    )
    
    messages = [{"role": "user", "content": [{"text": prompt}]}]
    
    try:
        response = bedrock_client.converse(modelId=model_id, messages=messages)
        if not response or 'output' not in response:
            return "A stylish outfit tailored to your preferences."
        return "".join([c.get('text', '') for c in response['output']['message']['content'] if 'text' in c])
    except Exception as e:
        logger.error(f"Recommendation failed: {e}")
        return "A stylish outfit tailored to your preferences."

def generate_style_report_pro(analysis_data: str, manual_inputs: dict, use_omni: bool = False) -> Optional[dict]:
    """Generates a comprehensive Style Report JSON."""
    model_id = NOVA_OMNI if use_omni else NOVA_PRO
    
    prompt = (
        f"Based on image analysis: {analysis_data}\n"
        f"And user inputs: {json.dumps(manual_inputs)}\n"
        "Generate a Style Report. Return ONLY JSON with keys: "
        "'skinUndertone', 'bodyProportions', 'faceShape', 'bestColors', 'flatteringCuts', 'suitableHairstyles'."
    )
    
    messages = [{"role": "user", "content": [{"text": prompt}]}]
    
    try:
        response = bedrock_client.converse(modelId=model_id, messages=messages)
        if not response or 'output' not in response:
            logger.error(f"Report generation returned invalid response: {response}")
            return None
        text = "".join([c.get('text', '') for c in response['output']['message']['content'] if 'text' in c])
        clean_json = text.replace("```json", "").replace("```", "").strip()
        return json.loads(clean_json)
    except Exception as e:
        logger.error(f"Report generation failed: {e}")
        return None

def extract_search_terms(recommendation: str) -> dict:
    """Extracts shopping categories and terms from a recommendation."""
    # This is already good, but I'll make sure it handles code blocks more safely
    prompt = (
        f"From this recommendation: '{recommendation}', extract clothing items. "
        "Return ONLY JSON with keys 'top', 'bottom', 'shoes', 'accessories' and concise values."
    )
    messages = [{"role": "user", "content": [{"text": prompt}]}]
    
    try:
        response = bedrock_client.converse(modelId=NOVA_PRO, messages=messages)
        if not response or 'output' not in response:
            return {"top": "fashion top", "bottom": "trousers"}
        text = "".join([c.get('text', '') for c in response['output']['message']['content'] if 'text' in c])
        clean_json = text.replace("```json", "").replace("```", "").strip()
        return json.loads(clean_json)
    except Exception:
        return {"top": "fashion top", "bottom": "trousers"}

def extract_outfit_components(outfit_description: str) -> Optional[dict]:
    """Nova Lite extracts clothing elements from a descriptive string into a JSON dict."""
    messages = [
        {
            "role": "user",
            "content": [
                {
                    "text": (
                        f"Extract the clothing items from this outfit description: '{outfit_description}'. "
                        "Return ONLY a JSON dictionary where keys are categories (e.g., 'top', 'bottom', 'shoes', 'accessories') "
                        "and values are short, concise descriptive search terms (e.g., 'white silk dress shirt')."
                    )
                }
            ]
        }
    ]
    try:
        response = bedrock_client.converse(modelId=NOVA_PRO, messages=messages)
        if not response or 'output' not in response:
            return None
        text = "".join([c.get('text', '') for c in response['output']['message']['content'] if 'text' in c])
        clean_json = text.replace("```json", "").replace("```", "").strip()
        return json.loads(clean_json)
    except Exception as e:
        logger.error(f"Failed to parse JSON for outfit extraction: {e}")
        return None

def generate_image_prompt(request_data: dict, use_omni: bool = False) -> dict:
    """Uses Nova to generate detailed positive and negative prompts for image generation."""
    model_id = NOVA_OMNI if use_omni else NOVA_PRO
    
    aesthetic = request_data.get("aesthetic", "Stylish")
    venue = request_data.get("venue", "event")
    recommendation = request_data.get("recommendation", "A flattering and stylish outfit.")
    gender = request_data.get("gender", "")
    target_type = request_data.get("target_type", "")

    subject_desc = "a person"
    if target_type == "someone" and gender:
        subject_desc = f"a {gender}"

    prompt = (
        f"You are a fashion prompt engineer. Based on this outfit recommendation: '{recommendation}' "
        f"(Aesthetic: {aesthetic}, Venue: {venue}), generate a highly detailed, descriptive text prompt for a photorealistic AI image generator. "
        "Include model style, lighting, camera quality, fabric textures, and composition. "
        f"Subject: {subject_desc}. Keep it editorial, premium, and realistic. "
        "Return ONLY a JSON dictionary with keys 'prompt' and 'negative_prompt'."
    )
    
    messages = [{"role": "user", "content": [{"text": prompt}]}]
    
    default_res = {
        "prompt": (
            f"A high-quality, photorealistic fashion editorial photo of {subject_desc} wearing an outfit. "
            f"Aesthetic: {aesthetic}. Venue: {venue}. Flattering fit, cinematic lighting, ultra-detailed."
        ),
        "negative_prompt": "cartoon, illustration, poorly drawn, deformed, low resolution, ugly"
    }

    try:
        response = bedrock_client.converse(modelId=model_id, messages=messages)
        if not response or 'output' not in response:
            return default_res
        text = "".join([c.get('text', '') for c in response['output']['message']['content'] if 'text' in c])
        clean_json = text.replace("```json", "").replace("```", "").strip()
        data = json.loads(clean_json)
        return {
            "prompt": data.get("prompt", default_res["prompt"]),
            "negative_prompt": data.get("negative_prompt", default_res["negative_prompt"])
        }
    except Exception:
        return default_res

def invoke_nova(model_id: str, messages: list, system_prompts: list = None) -> str:
    """Generic wrapper to invoke Nova models via Bedrock Converse API."""
    try:
        kwargs = {
            "modelId": model_id,
            "messages": messages,
        }
        if system_prompts:
            kwargs["system_prompts"] = system_prompts
            
        response = bedrock_client.converse(**kwargs)
        if not response or 'output' not in response:
            return ""
        return "".join([c.get('text', '') for c in response['output']['message']['content'] if 'text' in c])
    except Exception as e:
        logger.error(f"Invoke Nova failed: {e}")
        return ""
