import pytest
from app.services.voice_generator import VoiceGenerator
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

@pytest.mark.asyncio
class TestVoiceGenerator:
    def setup_method(self):
        """Setup test instance"""
        self.voice_generator = VoiceGenerator()
        self.test_description = "A friendly British male voice, warm and welcoming, speaking clearly and professionally"
        # Longer test text to meet minimum requirements
        self.test_text = (
            '''Hi Marco! Alex here.
            It has been long since last time we spoke about LensGo. 
            Now we are developing a new product called Humva, 
            which can generate spokesperson videos according to your script. 
            The video you are watching right now is one of our template videos. 
            I'd like to know if you are interested in this idea and 
            willing to have a look at our MVP product. Looking forward to your thoughts!
            The video you are watching right now is one of our template videos. 
            I'd like to know if you are interested in this idea and 
            willing to have a look at our MVP product. Looking forward to your thoughts!'''
        )
    
    async def test_create_voice(self):
        """Test voice creation"""
        voice_id = await self.voice_generator.create_voice(self.test_description)
        
        # Assertions for voice creation
        assert voice_id is not None
        assert isinstance(voice_id, str)
        assert len(voice_id) > 0
        
        return voice_id
    
    async def test_generate_speech(self):
        """Test voice generation"""
        # First create a voice to get a valid voice_id
        voice_id = await self.test_create_voice()
        
        # Use the valid voice_id to generate speech
        audio_bytes = await self.voice_generator.generate_speech(voice_id, self.test_text)
        
        # Assertions for voice generation
        assert audio_bytes is not None
        assert isinstance(audio_bytes, bytes)
        
        # Optionally save the audio to test the output
        with open("test_output.mp3", "wb") as f:
            f.write(audio_bytes)
    
# @pytest.mark.asyncio
# async def test_create_voice_with_invalid_description():
#     voice_generator = VoiceGenerator()
#     with pytest.raises(Exception):
#         await voice_generator.create_voice("")

# @pytest.mark.asyncio
# async def test_generate_speech_with_invalid_voice_id():
#     voice_generator = VoiceGenerator()
#     with pytest.raises(Exception):
#         await voice_generator.generate_speech("invalid_voice_id", "Test text")
    