'use client';

import AudioPlayer from './AudioPlayer';
import ImageUploader from './ImageUploader';
import { useState, useEffect } from 'react';
import { useAction } from 'next-safe-action/hooks';
import { generateVoice, createGenerationRecord } from '@/app/lib/actions';
import { toast } from "sonner"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card"
import { cn } from '@/app/lib/utils';
import { Input } from '@/app/components/ui/InputBox';
import { Button } from '@/app/components/ui/button';
import { Loader2 } from "lucide-react";
import { upload} from '@vercel/blob/client'
import { type PutBlobResult } from '@vercel/blob'

export default function DisplayCard({className}: {className?: string}) {
  
  // Use State to store the image and script 
  const [image, setImage] = useState<File | null>(null);
  const [script, setScript] = useState<string>('');
  // Use State to store the blob
  const [imageBlob, setImageBlob] = useState<PutBlobResult | null>(null);
  const [scriptBlob, setScriptBlob] = useState<PutBlobResult | null>(null);
  const { execute, status, result } = useAction(generateVoice);
  const { execute: dataExecute } = useAction(createGenerationRecord);

  const handleGenerate = async () => {
    try {
      if (!image) {
        toast.warning("Image is Required")
        return;
      }
      if (!script) {
        toast.warning("Script is Required")
        return;
      }

      // Convert the image to base64
      const buffer = await image.arrayBuffer();
      const imageBuffer = Buffer.from(buffer);
      const base64Image = imageBuffer.toString('base64');
      
      execute({base64Image, script});

      // Send user's inputs to blob variables
      const newImageBlob = await upload(`/jogggy/user_input/image/${image.name}`, image, {
        access: 'public',
        handleUploadUrl: '/api/upload',
      });

      const scriptBlob = new Blob([script], { type: 'text/plain' });
      const newScriptBlob = await upload(
      `/jogggy/user_input/script/script-${Date.now()}.txt`, // Unique filename
      scriptBlob,
      {
        access: 'public',
        handleUploadUrl: '/api/upload',
      }
    );

      setImageBlob(newImageBlob);
      setScriptBlob(newScriptBlob);

      dataExecute({
        // taskId: taskId,
        imageBase64: newImageBlob.url,
        script: script,
        audioBase64: result?.data || null,
        // createdAt: new Date(),
        status: result?.data ? 'completed' : 'failed'
      });

    } catch (error) {
      console.error('Failed to Generate Voice:', error);
    }
  }

  useEffect(() => {
    if (result?.serverError) {
      toast.error("Voice Generation Failed")
      console.log('Voice Generation Failed:', result.serverError);
    }
  }, [result]);

  return (
    <div className={cn("w-full h-full flex items-center justify-center p-8", className)}>
      <div className='w-full max-w-3xl flex gap-4 items-center justify-center p-8'>
        <Card className='w-full h-full rounded-[10px] bg-slate-300/60 backdrop-blur-[10px]'>
          <CardHeader>
            <CardTitle className='text-2xl font-medium'>Pick a Voice</CardTitle>
          </CardHeader>
          <CardContent className='flex flex-col gap-4'>
            
            <label htmlFor="script" className='text-md font-medium'>Script</label>
            <label htmlFor="script">
              <Input script={script} setScript={setScript} placeholder='Type your script here' className='min-h-[100px]'/>
            </label>

            <label htmlFor="image" className='text-md font-medium'>Image</label>
            <label htmlFor="image">
              <ImageUploader image={image} setImage={setImage} />
            </label>

            <Button 
              onClick={handleGenerate} 
              className='w-full' 
              variant='outline'
              disabled={status === 'executing'}
            >
              {status === 'executing' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate'
              )}
            </Button>

            {/* Only show audio section when generation is complete and successful */}
            {status === 'hasSucceeded' && result?.data && (
              <>
                <label htmlFor="audio" className='text-md font-medium'>Result</label>
                <label htmlFor="audio">
                  <AudioPlayer audioBase64={result.data as string}/>
                </label>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 