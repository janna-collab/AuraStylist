from fastapi import APIRouter, UploadFile, File, HTTPException
from services import nova

router = APIRouter()

@router.post("/body")
async def analyze_body(image: UploadFile = File(...)):
    try:
        file_bytes = await image.read()
        ext = image.filename.split('.')[-1].lower() if '.' in image.filename else 'jpeg'
        analysis = nova.analyze_image_lite(file_bytes, image_format=ext)
        return {
            "status": "success",
            "analysis": analysis
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Body analysis failed: {e}")
@router.post("/report")
async def generate_report(analysis_data: str, height: str, shoe_size: str, preferred_fit: str):
    """
    Stage 1: Nova 2 Pro creates a General Style Report.
    """
    try:
        manual_inputs = {
            "height": height,
            "shoeSize": shoe_size,
            "preferredFit": preferred_fit
        }
        report = nova.generate_style_report_pro(analysis_data, manual_inputs)
        return {
            "status": "success",
            "report": report
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Style report generation failed: {e}")
