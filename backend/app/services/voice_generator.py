from elevenlabs import ElevenLabs
from ..config import settings
import requests

class VoiceGenerator:
    def __init__(self):
        self.api_key = settings.ELEVENLABS_API_KEY
        self.client = ElevenLabs(api_key=settings.ELEVENLABS_API_KEY)
    
    async def create_voice(self, character_description: str) -> str:
        """
        Creates voice based on character description
        Returns voice_id
        """
        # First generate voice preview with longer sample text
        preview_text = (
            '''Hello! This is a test of my voice. I'm demonstrating my speaking capabilities.
            with this longer sample text. I hope you find my voice pleasant and suitable 
            for your needs. I can speak clearly and naturally, making me perfect for various 
            applications. Thank you for listening to this demonstration.'''
        )
        
        preview_response = self.client.text_to_voice.create_previews(
            voice_description=character_description,
            text=preview_text,
        )
        
        # Access the generated voice ID using dot notation
        generated_voice_id = preview_response.previews[0].generated_voice_id
        
        # Create permanent voice from preview using direct API call
        url = "https://api.elevenlabs.io/v1/text-to-voice/create-voice-from-preview"
        
        payload = {
            "voice_name": "Character Voice",
            "voice_description": character_description,
            "generated_voice_id": generated_voice_id,
            "labels": {"language": "en"}
        }
        
        headers = {
            "Content-Type": "application/json",
            "xi-api-key": self.api_key
        }
        
        response = requests.request("POST", url, json=payload, headers=headers)
        
        if response.status_code != 200:
            raise Exception(f"Error creating voice: {response.text}")
            
        voice_response = response.json()
        return voice_response["voice_id"]
    
    async def generate_speech(self, voice_id: str, text: str) -> bytes:
        """
        Generates speech using voice_id and text
        Returns audio bytes
        """
        url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
        
        payload = {
            "text": text,
            "model_id": "eleven_monolingual_v1",
            "voice_settings": {
                "stability": 0.5,
                "similarity_boost": 0.75
            }
        }
        
        headers = {
            "Content-Type": "application/json",
            "xi-api-key": self.api_key
        }

        response = requests.post(url, json=payload, headers=headers)
        
        if response.status_code != 200:
            raise Exception(f"Error generating speech: {response.text}")
            
        return response.content
