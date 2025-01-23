import { loadEnvConfig } from '@next/env'

// Load environment variables
const projectDir = process.cwd()
const { combinedEnv } = loadEnvConfig(projectDir)

// Export environment variables
export const env = {
  OPEN_AI_API_KEY: process.env.OPENAI_API_KEY as string,
  ELEVENLABS_API_KEY: process.env.ELEVENLABS_API_KEY as string,
  DATABASE_URL: process.env.DATABASE_URL as string,
  BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN as string
} as const;

// Optional: Validate environment variables
if (!Object.values(env).every(Boolean)) {
  throw new Error('Missing required environment variables');
}