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
    """Handles standard text chat utilizing Nova Lite."""
    try:
        messages = [{"role": "user", "content": [{"text": payload.message}]}]
        system_prompts = [
            "You are a friendly, expert AI Fashion Stylist. Keep answers concise, helpful, and fashionable."
        ]
        
        reply = nova.invoke_nova(nova.NOVA_LITE, messages, system_prompts)
        if not reply:
            reply = "I'm having a little trouble connecting to my styling brain right now. Can you try again?"
            
        return {"reply": reply}
    except Exception as e:
        logger.error(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail="Inner stylist error")

@router.post("/multimodal")
async def chat_multimodal(
    message: str = Form(...),
    image: UploadFile = File(...)
):
    """Handles image + text chat utilizing Nova Lite."""
    try:
        file_bytes = await image.read()
        ext = image.filename.split('.')[-1]
        
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
            "You are a friendly, expert AI Fashion Stylist. Analyze the image and respond concisely."
        ]
        
        reply = nova.invoke_nova(nova.NOVA_LITE, messages, system_prompts)
        if not reply:
            reply = "I couldn't quite see the image clearly. Please try a different one."
            
        return {"reply": reply}
    except Exception as e:
        logger.error(f"Multimodal chat error: {e}")
        raise HTTPException(status_code=500, detail="Inner stylist error")

@router.post("/voice")
async def chat_voice(
    audio: UploadFile = File(...)
):
    """
    Handles audio blobs. In a real Amazon environment with Nova Sonic, 
    we would stream this directly. 
    For simulation, we'll mock the transcribe -> process -> synthesise loop.
    """
    try:
        # 1. (Mock) Transcribe Audio using Nova Sonic Speech-to-Speech
        user_text = "Does this outfit look good for a summer wedding?"
        
        # 2. Process via Nova Lite (as text or image) to get response
        messages = [{"role": "user", "content": [{"text": user_text}]}]
        system_prompts = ["You are a friendly audio stylist powered by Nova Sonic. Be conversational."]
        reply = nova_service.invoke_nova(nova_service.NOVA_LITE, messages, system_prompts)
        
        # 3. (Mock) Return the text to be synthesized by Nova Sonic / Browser TTS
        return {
            "transcribed_text": user_text,
            "reply": reply or "Yes, that sounds like a lovely choice!",
            "note": "Nova Sonic is processing this as a speech-to-speech stream."
        }

    except Exception as e:
        logger.error(f"Voice chat error: {e}")
        raise HTTPException(status_code=500, detail="Voice stylist error")
