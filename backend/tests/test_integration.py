import pytest
from app.services.image_analyzer import ImageAnalyzer
from app.services.voice_generator import VoiceGenerator
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

@pytest.mark.asyncio
class TestIntegration:
    def setup_method(self):
        """Setup test instances"""
        self.image_analyzer = ImageAnalyzer()
        self.voice_generator = VoiceGenerator()
        
        # Test image path
        test_inputs_dir = os.path.join(os.path.dirname(__file__), 'test_inputs')
        self.test_image_path = max(
            (os.path.join(test_inputs_dir, f) for f in os.listdir(test_inputs_dir) if f.endswith('.png')),
            key=os.path.getctime
        )
        
        # Test script
        self.test_script = '''
            Hello! I'm excited to introduce our new product. 
            We've been working hard to create something special, 
            and I believe you'll find it interesting.
        '''
        
        # Create output directory
        self.output_dir = os.path.join(os.path.dirname(__file__), 'test_outputs')
        os.makedirs(self.output_dir, exist_ok=True)
    
    async def test_end_to_end_flow(self):
        """Test complete flow from image to voice generation"""
        # Skip if test image doesn't exist
        if not os.path.exists(self.test_image_path):
            pytest.skip("Test image not found")
        
        try:
            # Step 1: Analyze image
            with open(self.test_image_path, "rb") as image_file:
                image_bytes = image_file.read()
            
            character_description = await self.image_analyzer.analyze_image(image_bytes)
            
            # Save description for inspection
            description_path = os.path.join(self.output_dir, 'character_description.txt')
            with open(description_path, 'w') as f:
                f.write(character_description)
            
            # Step 2: Create voice from description
            voice_id = await self.voice_generator.create_voice(character_description)
            
            # Step 3: Generate speech
            audio_bytes = await self.voice_generator.generate_speech(voice_id, self.test_script)
            
            # Save audio output
            audio_path = os.path.join(self.output_dir, 'test_output.mp3')
            with open(audio_path, 'wb') as f:
                f.write(audio_bytes)
            
            # Assertions
            assert os.path.exists(description_path), "Description file should be created"
            assert os.path.exists(audio_path), "Audio file should be created"
            assert os.path.getsize(audio_path) > 0, "Audio file should not be empty"
            
        except Exception as e:
            pytest.fail(f"Integration test failed with error: {str(e)}") 