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

// This is the type for the generation records in the database  

// Zod schema for generation records
export const generationRecordSchema = z.object({
  taskId: z.string().min(1, "Task ID is required"),
  imageBase64: z.string().min(1, "Image data is required"),
  script: z.string().min(1, "Script is required"),
  audioBase64: z.string().nullable(),
  createdAt: z.date(),
  status: z.enum(['completed', 'failed'])
});

export const updateGenerationRecordSchema = generationRecordSchema.omit({
  createdAt: true,
  taskId: true,
});

// Type inference from the schema
export type GenerationRecord = z.infer<typeof generationRecordSchema>;
export type UpdateGenerationRecord = z.infer<typeof updateGenerationRecordSchema>;