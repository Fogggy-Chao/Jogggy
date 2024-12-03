from fastapi.testclient import TestClient
from app.main import app
import pytest
from dotenv import load_dotenv
import os
from unittest.mock import patch
from openai import AuthenticationError, RateLimitError, APIConnectionError, APITimeoutError
from elevenlabs.core import ApiError
import httpx

# Load environment variables
load_dotenv()

# Create test client
client = TestClient(app)

def test_generate_voice():
    # Create test directories
    test_dir = os.path.join(os.path.dirname(__file__), 'test_inputs')
    test_outputs_dir = os.path.join(os.path.dirname(__file__), 'test_outputs')
    os.makedirs(test_dir, exist_ok=True)
    os.makedirs(test_outputs_dir, exist_ok=True)
    
    # Path to a test image
    test_image_path = os.path.join(test_dir, 'test_img.png')
    
    # Ensure the test image exists
    if not os.path.exists(test_image_path):
        raise FileNotFoundError(f"Test image not found at {test_image_path}")
    
    # Use the same test script from VoiceGenerator tests that we know works
    test_script = '''Hi Marco! Alex here.
        It has been long since last time we spoke about LensGo. 
        Now we are developing a new product called Humva, 
        which can generate spokesperson videos according to your script. 
        The video you are watching right now is one of our template videos. 
        I'd like to know if you are interested in this idea and 
        willing to have a look at our MVP product. Looking forward to your thoughts!
        The video you are watching right now is one of our template videos. 
        I'd like to know if you are interested in this idea and 
        willing to have a look at our MVP product. Looking forward to your thoughts!'''
    
    with open(test_image_path, "rb") as image_file:
        files = {"image": ("test_img.png", image_file, "image/png")}
        data = {"script": test_script}
        
        response = client.post("/api/generate-voice", files=files, data=data)
        
        print(f"Response status: {response.status_code}")
        if response.status_code != 200:
            print(f"Error response: {response.text}")
        
        # Save the generated audio
        output_path = os.path.join(test_outputs_dir, 'generated_voice.mp3')
        with open(output_path, 'wb') as f:
            f.write(response.content)
        
        print(f"Generated audio saved to: {output_path}")
        
        assert response.status_code == 200
        assert response.headers["content-type"] == "audio/mpeg"
        assert len(response.content) > 0

@pytest.mark.asyncio
async def test_analyze_image_invalid_url():
    response = client.post(
        "/api/generate-voice",
        files={"image": ("test.png", b"invalid image data", "image/png")},
        data={"script": "Test script"}
    )
    assert response.status_code == 422

@pytest.mark.asyncio
async def test_openai_authentication_error():
    with patch('app.services.image_analyzer.ImageAnalyzer.analyze_image') as mock_analyze:
        mock_response = httpx.Response(401, request=httpx.Request("POST", "https://api.openai.com/v1/test"))
        mock_analyze.side_effect = AuthenticationError(
            message="Invalid API key",
            response=mock_response,
            body={"error": {"message": "Invalid API key"}}
        )
        
        with open(os.path.join(os.path.dirname(__file__), 'test_inputs/test_img.png'), "rb") as image_file:
            response = client.post(
                "/api/generate-voice",
                files={"image": ("test_img.png", image_file, "image/png")},
                data={"script": "Test script"}
            )
        
        assert response.status_code == 401

@pytest.mark.asyncio
async def test_openai_rate_limit_error():
    with patch('app.services.image_analyzer.ImageAnalyzer.analyze_image') as mock_analyze:
        mock_response = httpx.Response(429, request=httpx.Request("POST", "https://api.openai.com/v1/test"))
        mock_analyze.side_effect = RateLimitError(
            message="Rate limit exceeded",
            response=mock_response,
            body={"error": {"message": "Rate limit exceeded"}}
        )
        
        with open(os.path.join(os.path.dirname(__file__), 'test_inputs/test_img.png'), "rb") as image_file:
            response = client.post(
                "/api/generate-voice",
                files={"image": ("test_img.png", image_file, "image/png")},
                data={"script": "Test script"}
            )
        
        assert response.status_code == 429

@pytest.mark.asyncio
async def test_elevenlabs_authentication_error():
    with patch('app.services.image_analyzer.ImageAnalyzer.analyze_image') as mock_analyze:
        mock_analyze.return_value = "Test description"
        
        with patch('app.services.voice_generator.VoiceGenerator.create_voice') as mock_create:
            mock_create.side_effect = ApiError(status_code=401, body="Invalid API key")
            
            with open(os.path.join(os.path.dirname(__file__), 'test_inputs/test_img.png'), "rb") as image_file:
                response = client.post(
                    "/api/generate-voice",
                    files={"image": ("test_img.png", image_file, "image/png")},
                    data={"script": "Test script"}
                )
            
            assert response.status_code == 401
            assert "Invalid ElevenLabs API key" in response.json()["detail"]

@pytest.mark.asyncio
async def test_elevenlabs_rate_limit_error():
    with patch('app.services.image_analyzer.ImageAnalyzer.analyze_image') as mock_analyze:
        mock_analyze.return_value = "Test description"
        
        with patch('app.services.voice_generator.VoiceGenerator.create_voice') as mock_create:
            mock_create.side_effect = ApiError(status_code=429, body="Rate limit exceeded")
            
            with open(os.path.join(os.path.dirname(__file__), 'test_inputs/test_img.png'), "rb") as image_file:
                response = client.post(
                    "/api/generate-voice",
                    files={"image": ("test_img.png", image_file, "image/png")},
                    data={"script": "Test script"}
                )
            
            assert response.status_code == 429
            assert "Rate limit exceeded" in response.json()["detail"]

@pytest.mark.asyncio
async def test_connection_error():
    with patch('app.services.image_analyzer.ImageAnalyzer.analyze_image') as mock_analyze:
        mock_request = httpx.Request("POST", "https://api.openai.com/v1/test")
        mock_analyze.side_effect = APIConnectionError(request=mock_request)
        
        with open(os.path.join(os.path.dirname(__file__), 'test_inputs/test_img.png'), "rb") as image_file:
            response = client.post(
                "/api/generate-voice",
                files={"image": ("test_img.png", image_file, "image/png")},
                data={"script": "Test script"}
            )
        
        assert response.status_code == 503

@pytest.mark.asyncio
async def test_timeout_error():
    with patch('app.services.image_analyzer.ImageAnalyzer.analyze_image') as mock_analyze:
        mock_request = httpx.Request("POST", "https://api.openai.com/v1/test")
        mock_analyze.side_effect = APITimeoutError(request=mock_request)
        
        with open(os.path.join(os.path.dirname(__file__), 'test_inputs/test_img.png'), "rb") as image_file:
            response = client.post(
                "/api/generate-voice",
                files={"image": ("test_img.png", image_file, "image/png")},
                data={"script": "Test script"}
            )
        
        assert response.status_code == 504
        assert "Failed to connect to OpenAI API" in response.json()["detail"]

@pytest.mark.asyncio
async def test_invalid_image_format():
    response = client.post(
        "/api/generate-voice",
        files={"image": ("test.txt", b"This is not an image", "text/plain")},
        data={"script": "Test script"}
    )
    
    assert response.status_code == 422
    assert "Character description generation failed" in response.json()["detail"]