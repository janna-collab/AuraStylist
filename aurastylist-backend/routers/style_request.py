from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional, Any
import logging
import uuid
from services import nova
from core import database

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/")
async def create_style_request(
    target_type: str = Form(...),
    venue: str = Form(...),
    aesthetic: str = Form(...),
    
    # Own self fields
    gender: Optional[str] = Form(None),
    size: Optional[str] = Form(None),
    dress_type: Optional[str] = Form(None),
    price_range: Optional[str] = Form(None),
    reference_image: Optional[UploadFile] = File(None),
    
    # Someone else fields
    height: Optional[str] = Form(None),
    target_image: Optional[UploadFile] = File(None)
):
    try:
        user_id = "user_123"  # Mock user
        
        # Prepare context for orchestrator
        request_data = {
            "target_type": target_type,
            "venue": venue,
            "aesthetic": aesthetic,
            "gender": gender,
            "size": size,
            "dress_type": dress_type,
            "price_range": price_range,
            "height": height
        }

        image_to_process = reference_image if target_type == "myself" else target_image
        file_bytes = None
        filepath = None
        
        if image_to_process:
            file_bytes = await image_to_process.read()
            filepath = database.save_uploaded_image(file_bytes, image_to_process.filename)
            if target_type == "myself":
                request_data["reference_image_path"] = filepath
                request_data["myself_image_path"] = filepath
            else:
                request_data["target_image_path"] = filepath
                request_data["someone_image_path"] = filepath

        # EXECUTE AGENT ORCHESTRATION
        from services.nova import orchestrator
        result = await orchestrator.execute_style_flow(request_data, file_bytes)
        
        # Prepare specific request_id as requested by user
        request_id = f"req_{uuid.uuid4().hex[:8]}"

        # Prepare data for DB saving
        response_data = {
            **request_data,
            "request_id": request_id,
            "status": result.get("status", "error"),
            "recommendation": result.get("recommendation", "A stylish custom look."),
            "images": result.get("images", []),
            "user_profile": result.get("user_profile", {})
        }

        # Save to Mongo
        database.save_style_request(user_id, response_data)
        
        # Standardize response as requested by user: request_id, palette, cuts, outfits
        profile = result.get("user_profile") or {}
        recommendation = result.get("recommendation") or "A tailored selection for your event."
        
        final_response = {
            "request_id": request_id,
            "palette": profile.get("bestColors", ["neutral"]),
            "cuts": ", ".join(profile.get("flatteringCuts", [])) if profile.get("flatteringCuts") else "Classic Tailored",
            "outfits": [
                {
                    "id": f"outfit_{request_id}_0",
                    "request_id": request_id, 
                    "title": recommendation.split('.')[0] if recommendation else "Custom Curation",
                    "description": recommendation
                }
            ]
        }

        return final_response

    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Failed to process style request: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
