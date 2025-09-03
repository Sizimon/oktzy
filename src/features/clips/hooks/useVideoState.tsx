// useVideoState hook which manages the state of the video player (URL, current time, volume)
import { useState } from 'react';

export const useVideoState = () => {
  const [clipUrl, setClipUrl] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [retainedVolume, setRetainedVolume] = useState<number>(1);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setClipUrl(event.target.value);
  };

  return {
    clipUrl,
    currentTime,
    retainedVolume,
    setClipUrl,
    setCurrentTime,
    setRetainedVolume,
    handleInputChange
  };
};