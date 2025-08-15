import React from 'react';

interface VideoInputProps {
  clipUrl: string;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const VideoInput: React.FC<VideoInputProps> = ({ clipUrl, onInputChange }) => {
  return (
    <div className="flex justify-center w-full">
      <input
        type="text"
        value={clipUrl}
        placeholder="Enter clip URL..."
        onChange={onInputChange}
        className="mt-2 p-2 border border-gray-300 rounded"
      />
    </div>
  );
};