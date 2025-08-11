'use client';
import React, {useState} from 'react';
import { VideoDisplay } from '@/components/VideoDisplay';


export default function Home() {
    const [clipUrl, setClipUrl] = useState<string>('');
    const [timestampModalOpen, setTimestampModalOpen] = useState<boolean>(false);
    console.log('Clip URL:', clipUrl);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setClipUrl(event.target.value);
    };

    const handleAddTimestamp = () => {
      setTimestampModalOpen(true);
    }

    const CuratorDetails: Record<string, any> = {}

    function addCuratorDetails() {
      // This function can be used to add more details about the curator if needed
      CuratorDetails['timestamp'] = new Date().toISOString();
    }

    const CuratorObj = {
      source: clipUrl,
      ...CuratorDetails
    }

  return (
    <div className="font-sans flex flex-col items-center justify-items-center min-h-screen p-8">
      <h1 className="text-4xl font-bold">Welcome to Clip Curator</h1>
      <div>
        <label htmlFor="clip-url" className="text-lg font-medium">Clip URL:</label>
        <input id="clip-url" value={clipUrl} onChange={handleInputChange} type="text" className="mt-2 p-2 border border-gray-300 rounded" />
      </div>
      <div className="mt-8 w-full flex justify-center">
        <VideoDisplay clipUrl={clipUrl} />
      </div>
      <div>
        <button className="mt-4 p-2 bg-blue-500 text-white rounded" onClick={handleAddTimestamp}>Add Timestamp</button>
      </div>
      {timestampModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Timestamp Added</h2>
            <p className="mb-4">Timestamp: {new Date().toLocaleTimeString()}</p>
            <button className="p-2 bg-red-500 text-white rounded" onClick={() => setTimestampModalOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

