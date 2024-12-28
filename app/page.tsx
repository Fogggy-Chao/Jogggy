'use client';

import { graphik } from "./ui/fonts/fonts";
import { motion } from 'motion/react';
import Image from 'next/image';
import DisplayCard from './ui/components/DisplayCard';

export default function Home() {
  
  return (
    <div className="w-full h-screen relative bg-white overflow-hidden">
      <video 
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        onLoadedMetadata={(e) => {
          e.currentTarget.playbackRate = 0.2;
        }}
      >
        <source src="/bgvideo.mp4" type="video/mp4" />
      </video>
      <DisplayCard/>
    </div>
  );
}
