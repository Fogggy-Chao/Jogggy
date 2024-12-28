import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export default function AudioPlayer({ audioBase64 }: { audioBase64: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('timeupdate', updateProgress);
      audioRef.current.addEventListener('ended', () => setIsPlaying(false));
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', updateProgress);
        audioRef.current.removeEventListener('ended', () => setIsPlaying(false));
      }
    };
  }, []);

  const updateProgress = () => {
    if (audioRef.current) {
      const percentage = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(percentage);
    }
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressBarRef.current && audioRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const percentage = ((e.clientX - rect.left) / rect.width) * 100;
      const newTime = (percentage / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setProgress(percentage);
    }
  };

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

  return (
    <div className="w-[90%] max-w-[820px] h-[90%] max-h-[98px] bg-white/70 rounded-full flex flex-col items-center justify-center px-4 gap-2">
      <div className="flex-1 flex justify-center items-center">
        <div className="w-6 h-6 cursor-pointer justify-center items-center" onClick={togglePlay}>
          <Image 
            src={isPlaying ? "/pause.png" : "/play_arrow_filled.png"}
            alt={isPlaying ? "Pause" : "Play"}
            width={24} 
            height={24} 
            className="w-full h-full" 
          />
        </div>
      </div>
      
      {/* Progress Bar */}
      <div 
        ref={progressBarRef}
        className="w-full h-1 bg-white/30 rounded-full cursor-pointer relative mb-4"
        onClick={handleProgressBarClick}
      >
        <div 
          className="absolute left-0 top-0 h-full bg-green-400 rounded-full transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      <audio
        ref={audioRef}
        src={audioBase64 ? `data:audio/mpeg;base64,${audioBase64}` : undefined}
      />
    </div>
  );
} 