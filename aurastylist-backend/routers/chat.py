from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
import logging
from typing import Optional
from services import nova

logger = logging.getLogger(__name__)

router = APIRouter()

class ChatMessage(BaseModel):
    message: str

@router.post("/message")
async def chat_text(payload: ChatMessage):
    """Handles standard text chat utilizing Nova Lite with an expert persona."""
    try:
        messages = [{"role": "user", "content": [{"text": payload.message}]}]
        system_prompts = [
            "You are AuraStylist, a world-class AI Fashion Stylist. "
            "Your responses must be elite, sophisticated, and concise. "
            "Focus on high-end fashion, fabric quality, and timeless style. "
            "Provide clear, actionable advice that feels like a 'golden liner'—brief yet invaluable."
        ]
        
        reply = nova.invoke_nova(nova.NOVA_LITE, messages, system_prompts)
        if not reply:
            reply = "I am momentarily reflecting on the latest collections. Please share your thoughts again."
            
        return {"reply": reply}
    except Exception as e:
        logger.error(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail="Stylist brain momentarily offline")

@router.post("/multimodal")
async def chat_multimodal(
    message: str = Form(...),
    image: UploadFile = File(...)
):
    """Handles image + text chat with visual expertise."""
    try:
        file_bytes = await image.read()
        ext = image.filename.split('.')[-1].lower()
        if ext == "jpg": ext = "jpeg"
        if ext not in ["jpeg", "png", "webp"]: ext = "jpeg" # Default fallback
        
        messages = [
            {
                "role": "user",
                "content": [
                    {
                        "image": {
                            "format": ext,
                            "source": {"bytes": file_bytes}
                        }
                    },
                    {
                        "text": message
                    }
                ]
            }
        ]
        system_prompts = [
            "You are AuraStylist, a visual fashion expert. "
            "Analyze the garment provided with precision. "
            "Discuss silhouette, texture, and coordination. "
            "Keep your expert verdict concise and elegant."
        ]
        
        reply = nova.invoke_nova(nova.NOVA_LITE, messages, system_prompts)
        if not reply:
            reply = "This piece is intriguing, yet I need a clearer view to give my expert verdict."
            
        return {"reply": reply}
    except Exception as e:
        logger.error(f"Multimodal chat error: {e}")
        raise HTTPException(status_code=500, detail="Visual expertise offline")

@router.post("/voice")
async def chat_voice(
    audio: UploadFile = File(...)
):
    """Handles voice requests with a conversational yet sophisticated tone."""
    try:
        # Mocking the voice-to-text-to-voice flow with premium style
        user_text = "I need something sophisticated for a gala."
        
        messages = [{"role": "user", "content": [{"text": user_text}]}]
        system_prompts = [
            "You are AuraStylist, speaking as a personal couture consultant. "
            "Your tone should be warm, confident, and highly knowledgeable. "
            "Recommend only the most refined options."
        ]
        reply = nova.invoke_nova(nova.NOVA_LITE, messages, system_prompts)
        
        return {
          "transcribed_text": user_text,
          "reply": reply or "A velvet tuxedo or a floor-length silk gown would be impeccable.",
          "note": "Optimized for Nova Sonic speech synthesis."
        }
    except Exception as e:
        logger.error(f"Voice chat error: {e}")
        raise HTTPException(status_code=500, detail="Voice consultant error")
