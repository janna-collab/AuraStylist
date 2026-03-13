import os
import boto3
import json
import logging

logger = logging.getLogger(__name__)

# Fallback to us-east-1 if no region is set, as Nova is available in select regions
REGION = os.getenv("AWS_REGION", "us-east-1")

boto_session = boto3.Session(region_name=REGION)
bedrock_client = boto_session.client(service_name='bedrock-runtime')

NOVA_LITE = "us.amazon.nova-lite-v1:0"
NOVA_PRO = "us.amazon.nova-pro-v1:0"
TITAN_IMAGE = "amazon.titan-image-generator-v1"

def invoke_nova(model_id: str, messages: list, system_prompts: list = None) -> str:
    """Wrapper to call AWS Bedrock Converse API for Nova models."""
    try:
        kwargs = {
            "modelId": model_id,
            "messages": messages,
        }
        if system_prompts:
            kwargs["system"] = [{"text": p} for p in system_prompts]
            
        response = bedrock_client.converse(**kwargs)
        # Extract the text from the response
        content = response['output']['message']['content']
        text_response = "".join([c.get('text', '') for c in content if 'text' in c])
        return text_response
    except Exception as e:
        logger.error(f"Error invoking Bedrock model {model_id}: {e}")
        return None

def analyze_image_lite(image_bytes: bytes, image_format: str = "jpeg") -> str:
    """
    Step 1: Nova 2 Lite analyzes the image for skin undertone, body proportions, and face shape.
    """
    messages = [
        {
            "role": "user",
            "content": [
                {
                    "image": {
                        "format": image_format,
                        "source": {"bytes": image_bytes}
                    }
                },
                {
                    "text": (
                        "Analyze this image and determine the person's: "
                        "1. Skin undertone (e.g., Warm Olive, Cool Pink, Neutral) "
                        "2. Body proportions/shape (e.g., Inverted Triangle, Pear, Rectangle) "
                        "3. Face shape (e.g., Square, Heart, Oval, Round). "
                        "Provide a clear, brief summary of these three aspects."
                    )
                }
            ]
        }
    ]
    
    system_prompts = [
        "You are an expert style consultant with an incredible eye for detail. Focus ONLY on answering the prompt."
    ]
    
    return invoke_nova(NOVA_LITE, messages, system_prompts)

def generate_style_report_pro(analysis_data: str, manual_inputs: dict) -> dict:
    """
    Step 2: Nova 2 Pro creates a General Style Report based on the Lite analysis + manual inputs.
    """
    messages = [
        {
            "role": "user",
            "content": [
                {
                    "text": (
                        f"Based on the following image analysis:\n{analysis_data}\n\n"
                        f"And these manual inputs from the user:\n"
                        f"- Height: {manual_inputs.get('height')}\n"
                        f"- Shoe Size: {manual_inputs.get('shoeSize')}\n"
                        f"- Preferred Fit: {manual_inputs.get('preferredFit')}\n\n"
                        "Please generate a comprehensive and personalized Style Report. "
                        "Return ONLY a JSON object with the following exact keys (no markdown formatting or code blocks, just raw JSON text): "
                        "\"skinUndertone\", \"bodyProportions\", \"faceShape\", \"bestColors\" (array of strings), "
                        "\"flatteringCuts\" (array of strings), \"suitableHairstyles\" (array of strings)."
                    )
                }
            ]
        }
    ]
    
    system_prompts = [
        "You are a master personal stylist. Provide highly tailored, practical style advice in strict JSON format."
    ]
    
    response_text = invoke_nova(NOVA_PRO, messages, system_prompts)
    
    if not response_text:
        return None
        
    try:
        # Clean up in case Nova returned markdown code blocks
        clean_json = response_text.replace("```json", "").replace("```", "").strip()
        report = json.loads(clean_json)
        return report
    except Exception as e:
        logger.error(f"Failed to parse JSON from Nova Pro response: {response_text}. Error: {e}")
        return None

def analyze_reference_image(image_bytes: bytes, image_format: str = "jpeg") -> str:
    """Nova 2 Lite analyzes a reference image for the 'Own Self' style flow to extract its vibe/aesthetic."""
    messages = [
        {
            "role": "user",
            "content": [
                {
                    "image": {
                        "format": image_format,
                        "source": {"bytes": image_bytes}
                    }
                },
                {
                    "text": (
                        "Analyze this reference outfit/style image. "
                        "Describe the core aesthetic, key clothing pieces, color palette, and overall vibe. "
                        "Keep it concise, actionable, and focused on fashion elements."
                    )
                }
            ]
        }
    ]
    system_prompts = ["You are an expert fashion analyst."]
    return invoke_nova(NOVA_LITE, messages, system_prompts)

def extract_outfit_components(outfit_description: str) -> dict:
    """Nova 2 Lite extracts clothing elements from a descriptive string into a JSON dict."""
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
    system_prompts = ["You are a fashion data extractor. Return strict JSON only."]
    response_text = invoke_nova(NOVA_LITE, messages, system_prompts)
    
    if not response_text:
        return None
        
    try:
        clean_json = response_text.replace("```json", "").replace("```", "").strip()
        report = json.loads(clean_json)
        return report
    except Exception as e:
        logger.error(f"Failed to parse JSON for outfit extraction: {e}")
        return None

def analyze_target_person(image_bytes: bytes, image_format: str = "jpeg") -> dict:
    """Nova 2 Lite analyzes a photo of a target person ('Someone Else') to extract basic styling profile."""
    messages = [
        {
            "role": "user",
            "content": [
                {
                    "image": {
                        "format": image_format,
                        "source": {"bytes": image_bytes}
                    }
                },
                {
                    "text": (
                        "Analyze this person's photo. Determine: "
                        "1. Skin undertone "
                        "2. Body proportions/shape "
                        "3. Face shape. "
                        "Return ONLY a JSON object with keys: \"skinUndertone\", \"bodyProportions\", \"faceShape\"."
                    )
                }
            ]
        }
    ]
    system_prompts = ["You are an expert personal stylist. Provide strict JSON only."]
    response_text = invoke_nova(NOVA_LITE, messages, system_prompts)
    
    if not response_text:
        return None
        
    try:
        clean_json = response_text.replace("```json", "").replace("```", "").strip()
        report = json.loads(clean_json)
        return report
    except Exception as e:
        logger.error(f"Failed to parse JSON for target person: {e}")
        return None

def invoke_titan_image_generation(prompt: str, negative_prompt: str = None) -> str:
    """Wrapper to call AWS Bedrock Amazon Titan Image Generator V1. Returns base64 image string."""
    try:
        request_body = {
            "taskType": "TEXT_IMAGE",
            "textToImageParams": {
                "text": prompt,
            },
            "imageGenerationConfig": {
                "numberOfImages": 1,
                "quality": "standard",
                "cfgScale": 8.0,
                "height": 1024,
                "width": 1024,
                "seed": int.from_bytes(os.urandom(4), 'little') # random seed
            }
        }
        
        if negative_prompt:
            request_body["textToImageParams"]["negativeText"] = negative_prompt

        response = bedrock_client.invoke_model(
            modelId=TITAN_IMAGE,
            body=json.dumps(request_body)
        )
        
        response_body = json.loads(response.get("body").read())
        # Titan returns images in an array
        if "images" in response_body and len(response_body["images"]) > 0:
            return response_body["images"][0] # base64 string
        return None
    except Exception as e:
        logger.error(f"Error invoking Bedrock Titan Image generator: {e}")
        return None
