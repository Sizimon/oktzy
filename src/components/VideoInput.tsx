import React from 'react';
import { VideoInputProps } from '@/types/types';

export const VideoInput: React.FC<VideoInputProps> = ({ clipUrl, onInputChange }) => {

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => { // Checks if clip url is empty, if not then if the user attempts to change the value they will recieve a warning prompt.
    if (clipUrl !== '') {
      let userInput = prompt('Changing video URL will result in the loss of current timestamps. If you wish to continue, enter your desired video url.', clipUrl);
      if (userInput === clipUrl) {
        return; // No change, do nothing
      } else {
        onInputChange(event);
      }
    } else {
      onInputChange(event);
    }
  }

  return (
    <div className="flex justify-center w-full z-50">
      <input
        type="text"
        value={clipUrl}
        placeholder="Enter clip URL..."
        onChange={handleInputChange}
        className="mt-2 p-2 border-[1px] border-white/10 focus:outline-none bg-slate-800/30 text-text rounded-full w-2/3 md:w-1/3"
      />
    </div>
  );
};