import { useState } from 'react';
import { generateVoice } from '../services/api';
import { ApiError } from '../types/errors';

interface VoiceGenerationState {
  audioUrl: string | null;
  isLoading: boolean;
  error: string | null;
  errorStatus?: number;
  status: 'idle' | 'processing' | 'completed' | 'error';
}

export function useVoiceGeneration() {
  const [state, setState] = useState<VoiceGenerationState>({
    audioUrl: null,
    isLoading: false,
    error: null,
    status: 'idle'
  });

  const generate = async (image: File, script: string) => {
    setState(prev => ({ 
      ...prev, 
      isLoading: true, 
      error: null,
      status: 'processing' 
    }));

    try {
      const audioUrl = await generateVoice(image, script);
      setState(prev => ({ 
        ...prev, 
        audioUrl, 
        isLoading: false,
        status: 'completed'
      }));
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'An unexpected error occurred';
      setState(prev => ({ 
        ...prev, 
        error: errorMessage, 
        isLoading: false,
        status: 'error'
      }));
    }
  };

  return {
    ...state,
    generate,
  };
}