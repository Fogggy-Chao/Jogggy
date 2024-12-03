import React from 'react';

interface ScriptInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function ScriptInput({ value, onChange }: ScriptInputProps) {
  return (
    <div className="w-full">
      <label htmlFor="script" className="block text-sm font-medium text-gray-700 mb-2">
        Enter your script
      </label>
      <textarea
        id="script"
        rows={4}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        placeholder="Type your script here..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}