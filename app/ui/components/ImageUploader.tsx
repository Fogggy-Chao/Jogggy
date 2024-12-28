'use client';

import Image from 'next/image';

interface ImageUploaderProps {
  image: File | null;
  setImage: (image: File | null) => void;
}

export default function ImageUploader({ image, setImage }: ImageUploaderProps) {
  const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB in bytes

  const handleClick = () => {
    document.getElementById('fileInput')?.click();
  };

  return (
    <div
      className="w-full h-auto bg-white/70 rounded-[40px] flex flex-col items-center justify-center cursor-pointer gap-2 p-8"
      onClick={handleClick}
    >
      <input
        type="file"
        id="fileInput"
        accept="image/*"
        className="hidden"
        onChange={(event) => setImage(event.target.files?.[0] ?? null)}
      />
      {image ? (
        <Image
          src={URL.createObjectURL(image)}
          alt="Uploaded image"
          width={48}
          height={48}
          className="mb-2 object-cover rounded-lg"
        />
      ) : (
        <Image
          src="/Image.svg"
          alt="Upload icon"
          width={48}
          height={48}
          className="mb-2"
        />
      )}
      <div className="text-gray-600 font-medium text-lg text-center">
        {image ? 'Change image' : 'Upload your character image here'}
      </div>
      <div className="text-gray-400 text-sm text-center">
        File &lt; {MAX_FILE_SIZE / (1024 * 1024)} MB
      </div>
    </div>
  );
}
