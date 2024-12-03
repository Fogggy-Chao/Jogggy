import pytest
from app.services.image_analyzer import ImageAnalyzer
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

@pytest.mark.asyncio
class TestImageAnalyzer:
    def setup_method(self):
        """Setup test instance"""
        self.image_analyzer = ImageAnalyzer()
        # Use a test image from test_assets directory
        self.test_image_path = os.path.join(
            os.path.dirname(__file__), 
            '..', 
            'test_img.png'
        )
        
        # Create test_assets directory if it doesn't exist
        os.makedirs(os.path.dirname(self.test_image_path), exist_ok=True)
    
    async def test_analyze_image(self):
        """Test image analysis"""
        # Skip test if image doesn't exist
        if not os.path.exists(self.test_image_path):
            pytest.skip("Test image not found")
        
        try:
            # Read image bytes
            with open(self.test_image_path, "rb") as image_file:
                image_bytes = image_file.read()
            
            # Analyze image
            analysis_result = await self.image_analyzer.analyze_image(image_bytes)
            
            # Assertions
            assert analysis_result is not None
            assert isinstance(analysis_result, str)
            assert len(analysis_result) > 0
            # Save analysis result next to test image
            result_path = os.path.join(
                os.path.dirname(self.test_image_path),
                'test_img_description.txt'
            )
            with open(result_path, 'w') as f:
                f.write(analysis_result)
        except Exception as e:
            pytest.fail(f"Test failed with error: {str(e)}")