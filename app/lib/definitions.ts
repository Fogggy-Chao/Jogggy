import { z } from "zod";

export type DataSchema = {
  image: File | null;
  script: string;
};

export const analysisSchema = z.object({
  humorousDescription: z.string().optional(),
  age: z.string().optional(),
  characteristics: z.array(z.string()).optional(),
  voiceFerocity: z.number().optional(),
  voiceSarcasm: z.number().optional(),
  voiceSassFactor: z.number().optional(),
  textToVoicePrompt: z.string(),
  textToGenerate: z.string(),
});

export interface VoicePreviewsResponseModel {
  previews: Array<{
    audio_base_64: string;
    generated_voice_id: string;
    media_type: string;
    duration_secs: number;
  }>;
  text: string;
}