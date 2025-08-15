'use client';
import React, { useState } from 'react';
import { VideoDisplay } from '@/components/VideoDisplay';
import { VideoInput } from '@/components/VideoInput';
import { NoteDisplay } from '@/components/NoteDisplay';
import { TimestampModal } from '@/components/TimestampModal';
import { useTimestamps } from '@/hooks/useTimestamps';
import { useVideoState } from '@/hooks/useVideoState';

import { Bounce, ToastContainer, toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';

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
    if (!clipUrl) {
      toast.warning('Please provide a video URL before adding a timestamp.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
      return;
    }
    setTimestampModalOpen(true);
  };

  const handleSaveTimestamp = (title: string, note: string) => {
    const notify = (message: string) => toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });

    if (!title || !note) {
      notify('Please provide both a title and a note for the timestamp.');
      return;
    }

    addTimestamp(currentTime, title, note);
    setTimestampModalOpen(false);
  };

  return (
    <div className='w-full h-lvh'>
      <VideoInput clipUrl={clipUrl} onInputChange={handleInputChange} />
      <div className="font-sans grid grid-flow-col grid-cols-10 space-x-8 items-center justify-center p-8 text-text">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          transition={Bounce}
        />
        <div className="relative col-span-6 flex flex-col items-center justify-center">
          <div className="mt-8 w-full flex justify-center">
            {!clipUrl ? (
              <div className="text-center bg-background p-4 rounded space-y-4">
                <p className="text-3xl text-text">No video URL provided.</p>
                <ClipLoader color='#FFFFFF' />
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

        <div className="flex flex-col w-full space-y-4 col-span-4 justify-center items-center">
          <div className='flex flex-row space-x-4 justify-center items-center w-full'>
            <button
              className="p-2 bg-blue-500 text-white rounded cursor-pointer"
              onClick={handleAddTimestamp}
            >
              Add Timestamp
            </button>
            <button
              className="p-2 bg-green-500 text-white rounded cursor-pointer"
            >
              Submit to Noto
            </button>
          </div>
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
    </div>

  );
}