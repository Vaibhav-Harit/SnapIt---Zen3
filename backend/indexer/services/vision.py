import google.generativeai as genai
from PIL import Image
import os
from django.conf import settings

class VisionService:
    """
    Vision service using Gemini-1.5-Flash to extract text/code from images.
    """
    def __init__(self):
        # Fetching API Key from environment variables
        api_key = os.getenv("GOOGLE_API_KEY")
        if api_key:
            genai.configure(api_key=api_key)
        else:
            print("Warning: GOOGLE_API_KEY not found in environment.")
        
        # Initialize model: gemini-1.5-flash
        self.model = genai.GenerativeModel("gemini-1.5-flash")

    def extract_text(self, image_file) -> str:
        """
        Identify the code or error message in this screenshot. Return only the raw text.
        
        Args:
            image_file: The uploaded image file.
            
        Returns:
            Extracted raw text from the image.
        """
        try:
            # Using Pillow for in-memory image handling as requested for Windows refinement
            img = Image.open(image_file)
            
            # Generating content with the specified prompt
            response = self.model.generate_content([
                "Identify the code or error message in this screenshot. Return only the raw text.",
                img
            ])
            
            return response.text.strip()
        except Exception as e:
            print(f"Error in VisionService extraction: {e}")
            return f"Error extracting text: {str(e)}"
