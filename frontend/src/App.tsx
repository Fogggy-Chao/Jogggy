import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { ScriptInput } from './components/ScriptInput';
import { AudioPlayer } from './components/AudioPlayer';
import { ImagePreview } from './components/ImagePreview';
import { Mic, Clock } from 'lucide-react';
import { useVoiceGeneration } from './hooks/useVoiceGeneration';
import { ErrorDisplay } from './components/ErrorDisplay';

function App() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [script, setScript] = useState('');
  const { audioUrl, isLoading, error, status, generate, errorStatus } = useVoiceGeneration();
  const [generationStartTime, setGenerationStartTime] = useState<Date | null>(null);

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!selectedImage || !script) {
      return;
    }
    setGenerationStartTime(new Date());
    await generate(selectedImage, script);
    setGenerationStartTime(null);
  };

  const getElapsedTime = () => {
    if (!generationStartTime) return 0;
    return Math.floor((new Date().getTime() - generationStartTime.getTime()) / 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Mic className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl font-bold text-gray-900">Voice Generator</h1>
          </div>
          <p className="text-gray-600">Transform your images into unique voices with AI</p>
        </div>

        <div className="space-y-8 bg-white p-8 rounded-xl shadow-sm">
          {imagePreview ? (
            <ImagePreview
              imageUrl={imagePreview}
              onRemove={() => {
                setSelectedImage(null);
                setImagePreview(null);
              }}
            />
          ) : (
            <FileUpload onImageSelect={handleImageSelect} />
          )}

          <ScriptInput value={script} onChange={setScript} />

          <button
            onClick={handleSubmit}
            disabled={isLoading || !selectedImage || !script}
            className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg font-medium
                     hover:bg-blue-600 transition-colors disabled:bg-gray-300
                     disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {status === 'processing' ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Voice'
            )}
          </button>

          {status === 'processing' && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-500 animate-pulse" />
                <div>
                  <p className="font-medium text-blue-700">
                    Generating your voice...
                  </p>
                  <p className="text-sm text-blue-600">
                    This might take a few minutes
                  </p>
                </div>
              </div>
            </div>
          )}

          {status === 'error' && error && (
            <ErrorDisplay error={error} status={errorStatus} />
          )}

          {audioUrl && <AudioPlayer audioUrl={audioUrl} />}

          {isLoading && (
            <div data-testid="generating-status" className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-500 animate-pulse" />
                <div>
                  <p className="font-medium text-blue-700">
                    Generating your voice...
                  </p>
                  <p className="text-sm text-blue-600">
                    Elapsed time: {getElapsedTime()} seconds
                    {getElapsedTime() > 30 && " (This might take a few minutes)"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;