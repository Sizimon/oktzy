'use client';
import React, { useState } from 'react';
import { VideoDisplay } from '@/components/VideoDisplay';
import { NoteDisplay } from '@/components/NoteDisplay';

interface timestamp {
  title: string;
  note: string;
  time: number;
  timeStringConverted: string;
}

export default function Home() {
  const [clipUrl, setClipUrl] = useState<string>('');
  const [timestampModalOpen, setTimestampModalOpen] = useState<boolean>(false);

  const [retainedVolume, setRetainedVolume] = useState<number>(1); // Helps store the volume value to prevent reset on rerenders.
  const [currentTime, setCurrentTime] = useState<number>(0); // Grabs the currentTime

  const [timestampTitle, setTimestampTitle] = useState<string>('');
  const [timestampNote, setTimestampNote] = useState<string>('');
  const [timestamps, setTimestamps] = useState<Array<timestamp>>([]);
  // console.log('Clip URL:', clipUrl);
  console.log('Current Time:', currentTime);

  // Function to handle saving a timestamp
  // This function creates a new timestamp object and adds it to the timestamps state
  // It resets the title and note fields after saving
  // It also closes the timestamp modal
  const handleSaveTimestamp = () => {
    const newTimestamp: timestamp = {
      title: timestampTitle,
      note: timestampNote,
      time: currentTime,
      timeStringConverted: formatCurrentTime(currentTime)
    }
    setTimestamps(prev => [...prev, newTimestamp]);
    setTimestampTitle('');
    setTimestampNote('');
    setTimestampModalOpen(false);
  }

  // Function to format the current time in HH:MM:SS format
  // This function is used to display the time in a user-friendly format
  // It takes a time in seconds and returns a string formatted as HH:MM:SS
  // If the time is less than an hour, it returns MM:SS format
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

  // function addCuratorDetails() {
  //   // This function can be used to add more details about the curator if needed
  //   CuratorDetails['timestamp'] = new Date().toISOString();
  // }

  const CuratorObj = {
    source: clipUrl,
    timestamps: timestamps,
    ...CuratorDetails
  }

  return (
    <div className="font-sans grid grid-flow-col grid-cols-10 space-x-8 items-center justify-center h-lvh p-8">
      <div className='col-span-6 flex flex-col items-center justify-center'>
        <div className='flex justify-center w-full'>
          <input
            type="text"
            value={clipUrl}
            placeholder='Enter clip URL...'
            onChange={handleInputChange}
            className="mt-2 p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mt-8 w-full flex justify-center">
          <VideoDisplay
            clipUrl={clipUrl}
            modalOpen={timestampModalOpen}
            retainedVolume={retainedVolume}
            setRetainedVolume={setRetainedVolume}
            setCurrentTime={setCurrentTime}
          />
        </div>
      </div>
      <div className="flex flex-col space-y-4 w-full col-span-4 justify-start items-center">
        <button
          className="mt-4 p-2 bg-blue-500 text-white rounded cursor-pointer"
          onClick={handleAddTimestamp}
        >
          Add Timestamp
        </button>
        <NoteDisplay
          timestamps={timestamps}
        />
      </div>
      {timestampModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
          <div className="flex flex-col justify-center items-center bg-white p-6 rounded shadow-lg w-2/6">
            <p>{formatCurrentTime(currentTime)}</p>
            <input
              type="text"
              placeholder='Timestamp title...'
              value={timestampTitle}
              maxLength={24}
              onChange={(e) => setTimestampTitle(e.target.value)}
              className="my-4 p-2 border border-gray-300 rounded"
            />
            <textarea
              placeholder='Timestamp note...'
              value={timestampNote}
              onChange={(e) => setTimestampNote(e.target.value)}
              className="mb-4 p-2 border border-gray-300 rounded w-full"
            />
            <div className="flex flex-row justify-center w-full space-x-4">
              <button
                className="ml-2 p-2 bg-green-500 text-white rounded cursor-pointer"
                onClick={handleSaveTimestamp}
              >
                Save Timestamp
              </button>
              <button
                className="p-2 bg-red-500 text-white rounded cursor-pointer"
                onClick={() => setTimestampModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

