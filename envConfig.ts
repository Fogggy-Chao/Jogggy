import { loadEnvConfig } from '@next/env'

// Load environment variables
const projectDir = process.cwd()
const { combinedEnv } = loadEnvConfig(projectDir)

// Export environment variables
export const env = {
  OPEN_AI_API_KEY: process.env.OPENAI_API_KEY,
  ELEVENLABS_API_KEY: process.env.ELEVENLABS_API_KEY
} as const;

// Optional: Validate environment variables
if (!env.OPEN_AI_API_KEY || !env.ELEVENLABS_API_KEY) {
  throw new Error('Missing required environment variables');
}