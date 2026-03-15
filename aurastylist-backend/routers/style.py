import json
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional
from services import nova

router = APIRouter()

@router.post("/report")
async def style_report(
    analysis_data: str = Form(...),
    height: str = Form(...),
    shoe_size: str = Form(...),
    preferred_fit: str = Form(...)
):
    try:
        manual_inputs = {
            "height": height,
            "shoeSize": shoe_size,
            "preferredFit": preferred_fit
        }
        report = nova.generate_style_report_pro(analysis_data, manual_inputs)
        if not report:
            raise Exception("Nova returned invalid report")
        return {"status": "success", "report": report}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Style report generation failed: {e}")

@router.post("/outfits")
async def style_outfits(
    aesthetic: str = Form(...),
    venue: str = Form(...),
    dress_type: Optional[str] = Form(None),
    price_range: Optional[str] = Form(None),
    target_profile: Optional[str] = Form(None)
):
    try:
        # We allow an optional JSON string for profile to keep the endpoint generic
        parsed_profile = None
        if target_profile:
            try:
                parsed_profile = json.loads(target_profile)
            except Exception:
                parsed_profile = None

        recommendation = nova.generate_outfit_recommendation(
            aesthetic=aesthetic,
            venue=venue,
            target_profile=parsed_profile,
            dress_type=dress_type,
            price_range=price_range
        )

        prompt_data = nova.generate_titan_prompt({
            "aesthetic": aesthetic,
            "venue": venue,
            "recommendation": recommendation,
            "target_type": "myself"
        })

        return {
            "status": "success",
            "recommendation": recommendation,
            "titan_prompt": prompt_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Outfit generation failed: {e}")
