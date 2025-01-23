import { GenerationRecord } from './definitions';
import crypto from 'crypto';

// Function to generate hashed ID
const generateHashId = () => crypto.randomBytes(16).toString('hex');

export const generations: GenerationRecord[] = [
  {
    taskId: generateHashId(), // e.g., '8a7b5c3d2e1f4a6b9c8d7e6f5a4b3c2d'
    imageBase64: 'base64_image_string_1',
    script: "Hey there! I'm excited to share my thoughts on the latest tech trends.",
    audioBase64: 'base64_audio_string_1',
    createdAt: new Date('2024-03-01'),
    status: 'completed'
  },
  {
    taskId: generateHashId(),
    imageBase64: 'base64_image_string_2',
    script: "Welcome to my cooking channel! Today we're making pasta carbonara.",
    audioBase64: 'base64_audio_string_2',
    createdAt: new Date('2024-03-02'),
    status: 'completed'
  },
  {
    taskId: generateHashId(),
    imageBase64: 'base64_image_string_3',
    script: "Let me tell you about my recent adventure in the mountains.",
    audioBase64: 'base64_audio_string_3',
    createdAt: new Date('2024-03-03'),
    status: 'completed'
  },
  {
    taskId: generateHashId(),
    imageBase64: 'base64_image_string_4',
    script: "This is a quick update on our project's progress.",
    audioBase64: null,
    createdAt: new Date('2024-03-04'),
    status: 'failed'
  },
  {
    taskId: generateHashId(),
    imageBase64: 'base64_image_string_5',
    script: "Here's my review of the latest smartphone release.",
    audioBase64: 'base64_audio_string_5',
    createdAt: new Date('2024-03-05'),
    status: 'completed'
  }
];
