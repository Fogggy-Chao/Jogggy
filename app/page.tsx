'use client';


import DisplayCard from './components/ui/DisplayCard';

export default function Home() {
  
  return (
    <div className="w-full h-screen relative bg-white overflow-hidden flex items-center justify-center">
      <video 
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        onLoadedMetadata={(e) => {
          e.currentTarget.playbackRate = .5;
        }}
      >
        <source src="/bgvideo.mp4" type="video/mp4" />
      </video>
      <DisplayCard className='relative z-10'/>
    </div>
  );
}
