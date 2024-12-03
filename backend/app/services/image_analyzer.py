from openai import OpenAI
from ..config import settings
import base64

class ImageAnalyzer:
    def __init__(self):
        self.client = OpenAI(api_key=settings.OPENAI_API_KEY)
    
    async def analyze_image(self, image_bytes: bytes) -> str:
        """
        Analyzes image and returns character description
        Returns a concise description of the person's appearance and voice characteristics
        """
        try:
            # Convert bytes to base64 without decoding
            base64_image = base64.b64encode(image_bytes).decode('utf-8')
            
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {
                        "role": "user", 
                        "content": [
                            {
                                "type": "text",
                                "text": (
                                    "Now you are an experienced face recognition expert "
                                    "with more than ten years of working experience. "
                                    "I'll give you several images of different people. "
                                    "I want you to give me a precise description of the face and the appearence "
                                    "which I'll use to generate a possible voice line those people have. "
                                    "You should include specified elements in your description that are listed below:\n"
                                    "1. Age\n"
                                    "2. Gender\n"
                                    "2. Race\n"
                                    "3. Region (To indicate the possible accent it may have)\n"
                                    "5. Voice tone\n\n"
                                    "Compress your description into a whole part that I can directly copy from. Make it less than 30 words."
                                ),
                            },
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:image/jpeg;base64,{base64_image}"
                                }
                            }
                        ]
                    }
                ],
                max_tokens=300
            )
            
            description = response.choices[0].message.content
            print("\nGPT Description:", description, "\n")
            return description
        except Exception as e:
            raise Exception(f"Error analyzing image: {str(e)}")
