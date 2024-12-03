import { useState } from 'react';
import { generateVoice } from '../services/api';
import { ApiError } from '../types/errors';

interface VoiceGenerationState {
  audioUrl: string | null;
  isLoading: boolean;
  error: string | null;
}

export function useVoiceGeneration() {
  const [state, setState] = useState<VoiceGenerationState>({
    audioUrl: null,
    isLoading: false,
    error: null,
  });

  const generate = async (image: File, script: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const audioUrl = await generateVoice(image, script);
      setState(prev => ({ ...prev, audioUrl, isLoading: false }));
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'An unexpected error occurred';
      setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
    }
  };

  return {
    ...state,
    generate,
  };
}