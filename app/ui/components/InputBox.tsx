'use client';

interface InputBoxProps {
  script: string;
  setScript: (script: string) => void;
  className?: string;
  placeholder?: string;
}

export default function InputBox({ script, setScript, className = '', placeholder = 'Type what you want it to say here:)' }: InputBoxProps) {
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setScript(event.target.value);
  };
  return (
    <div className={`
      w-[90%] max-w-[820px]
      h-[210px]
      bg-white/70
      rounded-[40px]
      relative
      ${className}
    `}>
      <textarea
        value={script}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full h-full 
          px-12 py-8
          bg-transparent 
          rounded-[40px]
          text-black/80
          text-2xl
          placeholder:text-gray-400
          focus:outline-none
          resize-none
          absolute
          top-0 left-0"
      />
    </div>
  );
}
