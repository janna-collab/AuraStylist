from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional, Any
import logging
from services import nova_service
from core import database

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/")
async def create_style_request(
    target_type: str = Form(...),
    venue: str = Form(...),
    aesthetic: str = Form(...),
    
    # Own self fields
    dress_type: Optional[str] = Form(None),
    price_range: Optional[str] = Form(None),
    reference_image: Optional[UploadFile] = File(None),
    
    # Someone else fields
    gender: Optional[str] = Form(None),
    height: Optional[str] = Form(None),
    target_image: Optional[UploadFile] = File(None)
):
    try:
        user_id = "user_123"  # Mock user
        response_data: dict[str, Any] = {
            "target_type": target_type,
            "venue": venue,
            "aesthetic": aesthetic,
            "status": "success"
        }

        if target_type == "myself":
            response_data["dress_type"] = dress_type
            response_data["price_range"] = price_range
            
            # Process optional reference image
            if reference_image:
                file_bytes = await reference_image.read()
                ext = reference_image.filename.split('.')[-1]
                
                # Save locally (Mocking S3)
                filepath = database.save_uploaded_image(file_bytes, reference_image.filename)
                response_data["reference_image_path"] = filepath
                
                # Analyze vibe
                try:
                    vibe_analysis = nova_service.analyze_reference_image(file_bytes, image_format=ext)
                    response_data["ai_vibe_analysis"] = vibe_analysis or "Mock vibe analysis"
                except Exception as e:
                    logger.error(f"Nova analysis failed: {e}")
                    response_data["ai_vibe_analysis"] = "Fallback mock vibe: High fashion elegant"
            
            # Mock final recommendations generator
            response_data["recommendation"] = f"Based on {aesthetic} for {venue}, we recommend a {dress_type} outfit within {price_range}."

        elif target_type == "someone":
            response_data["gender"] = gender
            response_data["height"] = height
            
            if not target_image:
                raise HTTPException(status_code=400, detail="Target image is required for someone else")
                
            file_bytes = await target_image.read()
            ext = target_image.filename.split('.')[-1]
            
            # Save locally (Mocking S3)
            filepath = database.save_uploaded_image(file_bytes, target_image.filename)
            response_data["target_image_path"] = filepath
            
            # Analyze physical attributes
            try:
                target_profile = nova_service.analyze_target_person(file_bytes, image_format=ext)
                if not target_profile:
                    raise Exception("Bedrock returned none")
                response_data["target_profile"] = target_profile
            except Exception as e:
                logger.error(f"Target analysis failed: {e}")
                # Mock profile
                response_data["target_profile"] = {
                    "skinUndertone": "Cool Pink",
                    "bodyProportions": "Hourglass",
                    "faceShape": "Oval"
                }

            # Save the target sub-profile to DB for future use
            database.save_user_profile(f"{user_id}_someone_{filepath}", response_data["target_profile"])
            
            response_data["recommendation"] = f"Styled a {gender} ({height}) for {venue} focusing on {aesthetic}."

        else:
            raise HTTPException(status_code=400, detail="Invalid target_type")

        # Save the full request to Mongo
        request_id = database.save_style_request(user_id, response_data)
        response_data["request_id"] = request_id

        return response_data

    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Failed to process style request: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
