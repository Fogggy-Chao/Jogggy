import { ApiError } from '../types/errors';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export async function generateVoice(image: File, script: string, retries = 3): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('script', script);

    const response = await fetch(`${API_BASE_URL}/generate-voice`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      switch (response.status) {
        case 401:
          throw new ApiError('OpenAI API key is invalid or missing', 401);
        case 429:
          throw new ApiError('Rate limit exceeded. Please try again later', 429);
        case 503:
          throw new ApiError('OpenAI service is currently unavailable', 503);
        case 504:
          throw new ApiError('Request timed out. Please try again', 504);
        case 422:
          throw new ApiError(errorData.detail || 'Invalid image or script format', 422);
        default:
          throw new ApiError(errorData.detail || 'Failed to generate voice', response.status);
      }
    }

    const audioBlob = await response.blob();
    return URL.createObjectURL(audioBlob);
  } catch (error) {
    if (retries > 0 && !(error instanceof ApiError)) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return generateVoice(image, script, retries - 1);
    }
    
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Failed to connect to the server. Please check your internet connection', 500);
  }
}