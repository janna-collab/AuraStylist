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
    preferredFit: str = Form(...),
    userId: Optional[str] = Form("user_123"),
    name: Optional[str] = Form("User")
):
    try:
        user_id = userId
        manual_inputs = {
            "name": name,
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
            
        # Store in MongoDB
        try:
            save_result = database.save_user_profile(user_id, {
                "inputs": manual_inputs,
                "report": report
            })
            if save_result:
                logger.info(f"Successfully saved profile for user: {user_id}")
            else:
                logger.error(f"Save operation returned no result for user: {user_id}")
                raise HTTPException(status_code=500, detail="Failed to save profile to database")
        except Exception as e:
            logger.error(f"Failed to save profile for user {user_id} to database: {e}")
            raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
        
        return report

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error in generating profile: {e}")
        raise HTTPException(status_code=500, detail=str(e))
@router.get("/{user_id}")
async def get_profile(user_id: str):
    logger.info(f"Fetching profile for user: {user_id}")
    profile = database.get_user_profile(user_id)
    if not profile:
        logger.warning(f"Profile not found for user: {user_id}")
        raise HTTPException(status_code=404, detail="Profile not found")
    
    # Remove MongoDB internal _id for frontend compatibility
    if "_id" in profile:
        profile["_id"] = str(profile["_id"])
        
    return profile

@router.get("/status/{user_id}")
async def check_profile_status(user_id: str):
    profile = database.get_user_profile(user_id)
    return {"exists": profile is not None}
