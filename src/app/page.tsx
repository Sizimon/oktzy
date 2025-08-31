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
import Galaxy from '@/Galaxy/Galaxy';

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
    <div className='relative w-full h-lvh'>
      <div className='absolute inset-0 z-0'>
        <Galaxy
          mouseInteraction={true}
          mouseRepulsion={false}
          density={0.8}
          glowIntensity={0.3}
          saturation={1}
          hueShift={140}
          twinkleIntensity={0.2}
          rotationSpeed={0}
          starSpeed={0.1}
          speed={0.1}
        />
      </div>
      <div className='flex h-[10lvh] justify-center items-center'>
        <VideoInput clipUrl={clipUrl} onInputChange={handleInputChange} />
      </div>
      <div className='grid z-50'>
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
        <div className="font-sans grid grid-flow-row md:grid-flow-col grid-cols-10 space-y-4 md:space-x-4 items-center justify-center md:px-4 text-text z-50">
          <div className="relative col-span-10 w-full md:col-span-7 flex flex-col items-center justify-center md:p-4 md:rounded-2xl md:h-[80lvh] bg-slate-800/30 backdrop-blur-sm border-[1px] border-white/10">
            <div className="w-full justify-start">
              {!clipUrl ? (
                <div className="text-center p-4 rounded space-y-4">
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

          <div className="flex flex-col w-full space-y-4 col-span-10 md:col-span-3 justify-start items-center p-4 md:rounded-2xl bg-slate-800/30 backdrop-blur-sm border-[1px] border-white/10 h-[80lvh]">
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
    </div>

  );
}