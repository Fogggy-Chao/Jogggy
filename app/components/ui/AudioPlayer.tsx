import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export default function AudioPlayer({ audioBase64 }: { audioBase64: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleDownload = () => {
    if (audioBase64) {
      const link = document.createElement('a');
      link.href = `data:audio/mpeg;base64,${audioBase64}`;
      link.download = 'result.mp3';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="w-full bg-gray-100 rounded-lg p-4 flex items-center gap-4">
      {/* Play/Pause Button */}
      <button 
        onClick={togglePlay}
        className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded-full"
      >
        <Image 
          src={isPlaying ? "/pause.png" : "/play_arrow_filled.png"}
          alt={isPlaying ? "Pause" : "Play"}
          width={20} 
          height={20}
        />
      </button>

      {/* Title */}
      <span className="text-gray-600 flex-1">Voice Result</span>

      {/* Download Button */}
      <button 
        onClick={handleDownload}
        className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded-full"
      >
        <Image 
          src="/Download.svg"
          alt="Download"
          width={20}
          height={20}
        />
      </button>

      <audio
        ref={audioRef}
        src={audioBase64 ? `data:audio/mpeg;base64,${audioBase64}` : undefined}
      />
    </div>
  );
} 