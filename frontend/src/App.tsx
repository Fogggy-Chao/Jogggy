import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { ScriptInput } from './components/ScriptInput';
import { AudioPlayer } from './components/AudioPlayer';
import { ImagePreview } from './components/ImagePreview';
import { Mic } from 'lucide-react';
import { useVoiceGeneration } from './hooks/useVoiceGeneration';

function App() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [script, setScript] = useState('');
  const { audioUrl, isLoading, error, generate } = useVoiceGeneration();

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!selectedImage || !script) {
      return;
    }
    await generate(selectedImage, script);
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

          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg">
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={isLoading || !selectedImage || !script}
            className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg font-medium
                     hover:bg-blue-600 transition-colors disabled:bg-gray-300
                     disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Voice'
            )}
          </button>

          {audioUrl && <AudioPlayer audioUrl={audioUrl} />}
        </div>
      </div>
    </div>
  );
}

export default App;