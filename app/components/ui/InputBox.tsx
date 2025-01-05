import * as React from "react"

import { cn } from "@/app/lib/utils"

interface InputBoxProps {
  script: string;
  setScript: (script: string) => void;
  className?: string;
  placeholder?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputBoxProps>(
  ({ className, placeholder, script, setScript, ...props }, ref) => {
    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setScript(event.target.value);
    };
    return (
      <textarea
        value={script}
        placeholder={placeholder}
        onChange={handleChange}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
