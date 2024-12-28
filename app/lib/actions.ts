'use server';

import { z } from "zod";
import { actionClient } from "./safe-action";
import { OpenAI } from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { analysisSchema, VoicePreviewsResponseModel } from "./definitions";
import { ElevenLabsClient } from "elevenlabs";

//Define schema for the action
const schema = z.object({
  base64Image: z.string(),
  script: z.string().min(1)
}); 



async function imageAnalyzer(image: string) {

  const client = new OpenAI({ 
    apiKey: process.env.OPEN_AI_API_KEY,
    timeout: 30000 
  });

  console.log("Connected to OpenAI");

  const completion = await client.beta.chat.completions.parse({
    model: "gpt-4o-2024-08-06",
    messages: [
      {
        role: "system",
        content: "You are an insightful analyst who humorously examines human based on their appearance. While your analysis can be playful and witty, when it comes to describing the human's voice in the 'textToVoicePrompt', be as detailed and descriptive as possible, focusing on accurate vocal characteristics without any humor or alien/robot references.",
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Analyze this user. Provide a humorous perspective on their persona, but create a detailed 'textToVoicePrompt' for voice recreation that is descriptive and free of any humorous or robotic elements. Include the following information:
                       - **Essence Description**: A short, witty summary of the user.
                       - **Age Stratum**: Estimated age range.
                       - **Characteristics**: A list of personality traits or attributes they must be funny.
                       - **Specimen Metrics**:
                         - **Voice Ferocity (0-100)**: How aggressive or assertive the user's voice might be.
                         - **Sarcasm Quotient (0-100)**: Likelihood of snark or irony in vocal patterns.
                         - **Sass Factor (0-100)**: The user's flair for delivering sass.
                       - **Genesis Date**: The era or decade the user seems to belong to.
                       - **TextToVoicePrompt**: A detailed and neutral description for recreating the user's voice, focusing on tone, pitch, pace, location, gender (important) and other vocal qualities. Exaggerate the tone. Never mention their name here, especially if they are famous.
                       - **TextToGenerate**: Some demo text, to test out the new voice, as if the user was reading it themselves. Must be somewhat relevant to context and humurous. Must be between 101 & 700 characters long (keep it on the shorter end, around 120 characters)
                      
                      Here is the user's image:`
          },
          {
            type: "image_url",
            image_url: { url: `data:image/jpeg;base64,${image}` }
          },
        ]
      }
    ],
    response_format: zodResponseFormat(analysisSchema, "analysis"),
  }).catch((error) => {
    console.error("[Pick-a-Voice: OpenAI] Analysis failed:", error);
    throw new Error("Failed to analyze image. Please try again.");
  });

  const analysis = completion.choices[0].message.parsed;
  return analysis;
}

//Define the server action
export const generateVoice = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { base64Image, script } }) => {
    try {
      
      const formData = new FormData();
      formData.append('image', new Blob([base64Image]));
      formData.append('script', script);
      
      //Generate character description
      console.info(`------------[Pick-a-Voice: OpenAI] Starting OpenAI analysis------------`);

      const analysis = await imageAnalyzer(base64Image);
      
      console.info('------------[Pick-a-Voice: OpenAI] Analysis complete------------');
      
      //handle error if character description is not found
      if (!analysis) {
        throw new Error("Error analyzing user, please try again.");
      }

      //Generate voice previews from ElevenLabs
      const requestBody = {
        voice_description: analysis.textToVoicePrompt,
        text: analysis.textToGenerate,
      };
      console.info(
        "------------[Pick-a-Voice: ElevenLabs] Starting ElevenLabs API call------------");
      
      const client = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });
      const voiceResponse = await client.textToVoice.createPreviews(requestBody);

      console.info('------------[Pick-a-Voice: ElevenLabs] Voice response generated successfully------------');
      console.log('voiceResponse duration:',voiceResponse.previews[0].duration_secs);
      const voiceRes = voiceResponse as VoicePreviewsResponseModel;
      
      if (!voiceRes.previews) {
        console.error("[Pick-a-Voice: ElevenLabs] ElevenLabs API error:", voiceRes);
        throw new Error(`Failed to generate voice previews, please try again.`);
      }
      
      return voiceRes.previews[0].audio_base_64;

    } catch (error) {
      console.error("Server Error:", error);
      return {
        data: {
          failure: "Failed to generate voice"
        }
      };
    }
  });