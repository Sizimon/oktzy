'use client';
import React, {useState} from 'react';
import { VideoDisplay } from '@/components/VideoDisplay';


export default function Home() {
    const [clipUrl, setClipUrl] = useState('');
    console.log('Clip URL:', clipUrl);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setClipUrl(event.target.value);
    };

  return (
    <div className="font-sans flex flex-col items-center justify-items-center min-h-screen p-8">
      <h1 className="text-4xl font-bold">Welcome to Clip Curator</h1>
      <div>
        <label htmlFor="clip-url" className="text-lg font-medium">Clip URL:</label>
        <input id="clip-url" value={clipUrl} onChange={handleInputChange} type="text" className="mt-2 p-2 border border-gray-300 rounded" />
        <VideoDisplay clipUrl={clipUrl} />
      </div>
    </div>
  );
}

