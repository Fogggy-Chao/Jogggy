from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import Response, JSONResponse
from ..services.image_analyzer import ImageAnalyzer
from ..services.voice_generator import VoiceGenerator
from openai import AuthenticationError, RateLimitError, APIConnectionError, APITimeoutError
from elevenlabs.core import ApiError
import os
from fastapi.middleware.cors import CORSMiddleware

router = APIRouter()

@router.post("/generate-voice", response_class=Response)
async def generate_voice(
    image: UploadFile = File(...),
    script: str = Form(...)
):
    image_analyzer = ImageAnalyzer()
    voice_generator = VoiceGenerator()

    try:
        # Read image bytes
        image_bytes = await image.read()

        # Analyze image to get character description
        character_description = await image_analyzer.analyze_image(image_bytes)
        
        # Create voice from description
        voice_id = await voice_generator.create_voice(character_description)
        
        # Generate speech from script
        audio_bytes = await voice_generator.generate_speech(voice_id, script)
        
        return Response(
            content=audio_bytes,
            media_type="audio/mpeg",
            headers={"Content-Disposition": "attachment; filename=generated_voice.mp3"}
        )

    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={
                "status": "error",
                "message": f"Internal server error: {str(e)}"
            }
        )

@router.head("/health")
@router.get("/health")
async def health_check():
    return {"status": "ok"}