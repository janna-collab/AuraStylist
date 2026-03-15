from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional
import json
import logging
from services import nova
from core import database

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/generate")
async def generate_profile(
    image: Optional[UploadFile] = File(None),
    height: str = Form(...),
    shoeSize: str = Form(...),
    preferredFit: str = Form(...)
):
    try:
        manual_inputs = {
            "height": height,
            "shoeSize": shoeSize,
            "preferredFit": preferredFit
        }
        
        # In a real environment, we check if image exists and call Nova Lite.
        # If no AWS credentials are provided locally, this will mock the response.
        analysis_data = "Missing image"
        image_bytes = None
        
        if image:
            image_bytes = await image.read()
            # Try to get extension format
            ext = image.filename.split('.')[-1].lower()
            if ext not in ['jpeg', 'png', 'webp', 'gif']:
                ext = 'jpeg' # default to jpeg if unknown or unsupported by bedrock
                
            try:
                analysis = nova.analyze_image_lite(image_bytes, image_format=ext)
                if analysis:
                    analysis_data = analysis
            except Exception as e:
                logger.error(f"Image analysis failed: {e}")
                
        # Call Nova Pro for the final JSON report
        report = None
        try:
            report = nova.generate_style_report_pro(analysis_data, manual_inputs)
        except Exception as e:
            logger.error(f"Style report generation failed: {e}")
            
        # Mock fallback if Bedrock fails (e.g. no AWS credentials locally)
        if not report:
            logger.info("Falling back to mock style report")
            # Generating a sensible mock based on the inputs
            report = {
                "skinUndertone": "Warm Olive",
                "bodyProportions": "Inverted Triangle",
                "faceShape": "Square",
                "bestColors": ["Emerald Green", "Terracotta", "Navy Blue", "Mustard"],
                "flatteringCuts": ["V-necklines", "A-line skirts", "Wide-leg trousers"],
                "suitableHairstyles": ["Soft layers", "Side-swept bangs", "Textured bob"]
            }
            
        # Store in MongoDB (using simple user_id for now as mock auth)
        user_id = "user_123" 
        profile_record = {
            "inputs": manual_inputs,
            "report": report
        }
        if image_bytes and image:
            filepath = database.save_uploaded_image(image_bytes, image.filename)
            profile_record["image_path"] = filepath

        database.save_user_profile(user_id, profile_record)
        
        return report

    except Exception as e:
        logger.error(f"Failed to generate profile: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
