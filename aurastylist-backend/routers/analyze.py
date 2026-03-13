from fastapi import APIRouter

router = APIRouter()

@router.post("/body")
async def analyze_body():
    return {"message": "Body analysis endpoint (Nova Lite)"}
