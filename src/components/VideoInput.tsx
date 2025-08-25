import React from 'react';

interface VideoInputProps {
  clipUrl: string;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const VideoInput: React.FC<VideoInputProps> = ({ clipUrl, onInputChange }) => {
  return (
    <div className="flex justify-center w-full z-50">
      <input
        type="text"
        value={clipUrl}
        placeholder="Enter clip URL..."
        onChange={onInputChange}
        className="mt-2 p-2 border-[1px] border-white/10 focus:outline-none bg-slate-800/30 text-text rounded-full w-2/3 md:w-1/3"
      />
    </div>
  );
};