import { ApiError } from '../types/errors';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export async function generateVoice(image: File, script: string): Promise<string> {
  const formData = new FormData();
  formData.append('image', image);
  formData.append('script', script);

  try {
    const response = await fetch(`${API_BASE_URL}/generate-voice`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new ApiError(errorData.detail || 'Failed to generate voice', response.status);
    }

    const audioBlob = await response.blob();
    return URL.createObjectURL(audioBlob);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Failed to connect to the server', 500);
  }
}