'use client';
import React, { useState } from 'react';
import { VideoDisplay } from '@/components/VideoDisplay';
import { VideoInput } from '@/components/VideoInput';
import { NoteDisplay } from '@/components/NoteDisplay';
import { TimestampModal } from '@/components/TimestampModal';
import { useTimestamps } from '@/hooks/useTimestamps';
import { useVideoState } from '@/hooks/useVideoState';

export default function Home() {
  const [timestampModalOpen, setTimestampModalOpen] = useState<boolean>(false);

  const {
    clipUrl,
    currentTime,
    retainedVolume,
    setCurrentTime,
    setRetainedVolume,
    handleInputChange
  } = useVideoState();

  const {
    timestamps,
    addTimestamp
  } = useTimestamps();

  const handleAddTimestamp = () => {
    setTimestampModalOpen(true);
  };

  const handleSaveTimestamp = (title: string, note: string) => {
    addTimestamp(currentTime, title, note);
    setTimestampModalOpen(false);
  };

  return (
    <div className="font-sans grid grid-flow-col grid-cols-10 space-x-8 items-center justify-center h-lvh p-8">
      <div className="col-span-6 flex flex-col items-center justify-center">
        <VideoInput clipUrl={clipUrl} onInputChange={handleInputChange} />
        <div className="mt-8 w-full flex justify-center">
          {!clipUrl ? (
            <div className="text-center">
              <p className="text-gray-500">No video URL provided</p>
            </div>
          ) : (
          <VideoDisplay
            clipUrl={clipUrl}
            modalOpen={timestampModalOpen}
            retainedVolume={retainedVolume}
            setRetainedVolume={setRetainedVolume}
            setCurrentTime={setCurrentTime}
          />
        )}

        </div>
      </div>

      <div className="flex flex-col space-y-4 w-full col-span-4 justify-start items-center">
        <button
          className="mt-4 p-2 bg-blue-500 text-white rounded cursor-pointer"
          onClick={handleAddTimestamp}
        >
          Add Timestamp
        </button>
        <button
          className="mt-4 p-2 bg-green-500 text-white rounded cursor-pointer"
        >
          Submit to Noto
        </button>
        <NoteDisplay timestamps={timestamps} />
      </div>

      <TimestampModal
        isOpen={timestampModalOpen}
        currentTime={currentTime}
        onSave={(title, note) => {
          handleSaveTimestamp(title, note);
        }}
        onClose={() => setTimestampModalOpen(false)}
      />
    </div>
  );
}