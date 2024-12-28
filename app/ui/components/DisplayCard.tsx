'use client';

import InputBox from './InputBox';
import AudioPlayer from './AudioPlayer';
import ImageUploader from './ImageUploader';
import { useState, useEffect } from 'react';
import { useAction } from 'next-safe-action/hooks';
import { generateVoice } from '@/app/lib/actions';

export default function DisplayCard() {
  
  // Use State to store the image and script 
  const [image, setImage] = useState<File | null>(null);
  const [script, setScript] = useState<string>('');

  const { execute, status, result } = useAction(generateVoice);

  const handleGenerate = async () => {
    try {
      if (!image) {
        //TODO: use toast to show error message
        throw new Error('Image is required');
      }
      if (!script) {
        throw new Error('Script is required');
      }

      // Convert the image to base64
      const buffer = await image.arrayBuffer();
      const imageBuffer = Buffer.from(buffer);
      const base64Image = imageBuffer.toString('base64');
      
      execute({base64Image, script});

    } catch (error) {
      //TODO: use toast to show error message
      console.error('Failed to generate voice:', error);
    }
  }

  useEffect(() => {
    if (result?.serverError) {
      //TODO: use toast to show error message
      console.log('Voice generation failed:', result.serverError);
    }
  }, [result]);

  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      {/* Display Card Flex Container */}
      <div className="w-full max-w-3xl mx-auto flex justify-center items-center">
          {/* Display Card */}
          <div className="
            w-full h-full
            bg-gradient-to-b from-[#0e5eff]/30 to-[#0e5eff]/40
            rounded-[70px]
            shadow-[0px_4px_10px_rgba(0,0,0,0.1)]
            border border-[#0e5eff]/20
            backdrop-blur-[10px]
            p-8
            pt-2
            ">
          {/* Display Card Header */}
          <div className="w-full h-auto flex items-center pl-8 gap-4">
            <h1 className="text-center text-[40px] font-medium">Pick a Voice</h1>
            <button 
              onClick={handleGenerate}
              className="text-center text-[40px] font-medium text-red-500">
              Generate
            </button>
          </div>
          <div className="w-full h-[calc(100%-60px)] flex flex-row gap-4">
                <div className="basis-4/6 flex flex-col gap-4">
                  <div className="w-full flex gap-1 items-center justify-center p-0">
                    <InputBox script={script} setScript={setScript} />
                  </div>
                  <div className="w-full flex gap-1 items-center justify-center p-0">
                    <AudioPlayer audioBase64={result?.data}/>
                  </div>
                </div>
                <div className="basis-2/6 flex gap-4 aspect-square">
                  <ImageUploader image={image} setImage={setImage} />
                </div>
          </div>
        </div>
      </div>
    </div>
  );
} 