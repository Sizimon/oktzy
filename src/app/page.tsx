'use client';
import React, {useState} from 'react';
import { VideoDisplay } from '@/components/VideoDisplay';


export default function Home() {
    const [clipUrl, setClipUrl] = useState<string>('');
    const [timestampModalOpen, setTimestampModalOpen] = useState<boolean>(false);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [timestampTitle, setTimestampTitle] = useState<string>('');
    const [timestampNote, setTimestampNote] = useState<string>('');
    // console.log('Clip URL:', clipUrl);
    // console.log('Current Time:', currentTime);

    function formatCurrentTime(time: number): string {
      const hours = Math.floor(time / 3600);
      const minutes = Math.floor((time % 3600) / 60);
      const seconds = Math.floor(time % 60);
      if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      }
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

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
    <div className="font-sans flex flex-col items-center justify-items-center h-lvh p-8">
      <div>
        <input id="clip-url" value={clipUrl} placeholder='Enter clip URL...' onChange={handleInputChange} type="text" className="mt-2 p-2 border border-gray-300 rounded" />
      </div>
      <div className="mt-8 w-full flex justify-center">
        <VideoDisplay clipUrl={clipUrl} modalOpen={timestampModalOpen} setCurrentTime={setCurrentTime} />
      </div>
      <div>
        <button className="mt-4 p-2 bg-blue-500 text-white rounded cursor-pointer" onClick={handleAddTimestamp}>Add Timestamp</button>
      </div>
      {timestampModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30">
          <div className="flex flex-col justify-center items-center bg-white p-6 rounded shadow-lg w-2/6">
            <p>{formatCurrentTime(currentTime)}</p>
            <input type="text" placeholder='Timestamp title...' value={timestampTitle} maxLength={24} onChange={(e) => setTimestampTitle(e.target.value)}  className="my-4 p-2 border border-gray-300 rounded" />
            <textarea placeholder='Timestamp note...' value={timestampNote} onChange={(e) => setTimestampNote(e.target.value)} className="mb-4 p-2 border border-gray-300 rounded w-full" />
            <button className="p-2 bg-red-500 text-white rounded cursor-pointer" onClick={() => setTimestampModalOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

