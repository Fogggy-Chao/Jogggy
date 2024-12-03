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
        try:
            character_description = await image_analyzer.analyze_image(image_bytes)
        except AuthenticationError as e:
            return JSONResponse(
                status_code=401,
                content={"detail": "Invalid OpenAI API key or authentication failed", "error": str(e)}
            )
        except RateLimitError as e:
            return JSONResponse(
                status_code=429,
                content={"detail": "Rate limit exceeded for OpenAI API", "error": str(e)}
            )
        except APIConnectionError as e:
            return JSONResponse(
                status_code=503,
                content={"detail": "Failed to connect to OpenAI API", "error": str(e)}
            )
        except APITimeoutError as e:
            return JSONResponse(
                status_code=504,
                content={"detail": "Request to OpenAI API timed out", "error": str(e)}
            )
        except Exception as e:
            return JSONResponse(
                status_code=422,
                content={"detail": f"Character description generation failed: {str(e)}"}
            )
        
        # Create voice from description
        try:
            voice_id = await voice_generator.create_voice(character_description)
        except ApiError as e:
            if e.status_code == 401:
                return JSONResponse(
                    status_code=401,
                    content={"detail": "Invalid ElevenLabs API key or authentication failed", "error": str(e)}
                )
            elif e.status_code == 429:
                return JSONResponse(
                    status_code=429,
                    content={"detail": "Rate limit exceeded for ElevenLabs API", "error": str(e)}
                )
            else:
                return JSONResponse(
                    status_code=e.status_code,
                    content={"detail": f"ElevenLabs API error: {str(e)}"}
                )
        except Exception as e:
            return JSONResponse(
                status_code=400,
                content={"detail": f"Voice creation failed: {str(e)}"}
            )

        # Generate speech from script
        try:
            audio_bytes = await voice_generator.generate_speech(voice_id, script)
            return Response(
                content=audio_bytes,
                media_type="audio/mpeg",
                headers={"Content-Disposition": "attachment; filename=generated_voice.mp3"}
            )
        except ApiError as e:
            if e.status_code == 401:
                return JSONResponse(
                    status_code=401,
                    content={"detail": "Invalid ElevenLabs API key or authentication failed", "error": str(e)}
                )
            elif e.status_code == 429:
                return JSONResponse(
                    status_code=429,
                    content={"detail": "Rate limit exceeded for ElevenLabs API", "error": str(e)}
                )
            else:
                return JSONResponse(
                    status_code=e.status_code,
                    content={"detail": f"ElevenLabs API error: {str(e)}"}
                )
        except Exception as e:
            return JSONResponse(
                status_code=400,
                content={"detail": f"Speech generation failed: {str(e)}"}
            )

    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"detail": f"Internal server error: {str(e)}"}
        )

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)