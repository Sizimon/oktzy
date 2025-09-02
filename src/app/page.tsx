'use client';
import React, { useState, useRef } from 'react';

// Component Imports
import { VideoDisplay } from '@/components/VideoDisplay';
import { VideoInput } from '@/components/VideoInput';
import { NoteDisplay } from '@/components/NoteDisplay';

// Modal Imports
import { TimestampModal } from '@/components/TimestampModal';
import { SaveModal } from '@/components/SaveModal';

// Hook Imports
import { useTimestamps } from '@/hooks/useTimestamps';
import { useVideoState } from '@/hooks/useVideoState';
import { useCuratorData } from '@/hooks/useCuratorData';

// Misc Imports
import { Bounce, ToastContainer, toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import Galaxy from '@/Galaxy/Galaxy';

// Type Imports
import { CuratorData } from '@/types/types';

export default function Home() {
  const [timestampModalOpen, setTimestampModalOpen] = useState<boolean>(false);
  const [exportModalOpen, setExportModalOpen] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const playerRef = useRef<any>(null);

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
    addTimestamp,
    clearTimestamps
  } = useTimestamps();

  const { curatorData, generateCuratorData } = useCuratorData();

  // Handler which opens the timestamp creation modal
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

  // Handler which saves the timestamp data
  const handleSaveTimestamp = (title: string, note: string) => {
    const notify = (message: string) => toast.error(message, {
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

    if (!title || !note) {
      notify('Please provide both a title and a note for the timestamp.');
      return;
    }

    addTimestamp(currentTime, title, note);
    setTimestampModalOpen(false);
  };


  // Handler which seeks the video to the specified timestamp
  const handleToTimestamp = (time: number) => {
    if (playerRef.current) {
      playerRef.current.currentTime = time;
    }
  };

  // Handler which saves the data in a 'CuratorData' object, ready for export.
  const handleExportModal = () => {
    if (!clipUrl) {
      toast.error('No clip URL/timestamp data provided');
      return;
    }
    generateCuratorData(clipUrl, timestamps);
    setExportModalOpen(true);
  }

  const handleSave = async (dataToSave: CuratorData) => {
    if (!curatorData) {
      toast.error('No curator data to export');
      return;
    }

    try {
    } catch (error: any) {
      toast.error(`Export failed: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className='relative w-full h-lvh'>
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
      <div className='grid z-50 h-[90lvh]'>
        <div className="
          font-sans grid grid-flow-row grid-cols-10 gap-4 items-center justify-center text-text z-50
          md:grid-flow-col md:gap-4 md:px-4"
        >
          <div className="
            relative col-span-10 w-full flex flex-col items-center justify-center bg-slate-800/30 backdrop-blur-sm border-[1px] border-white/10
            md:col-span-7 md:p-4 md:rounded-2xl md:h-[80lvh]
            ">
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
                  ref={playerRef}
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
                onClick={handleExportModal}
                className="p-2 bg-green-500 text-white rounded cursor-pointer"
              >
                Submit to Noto
              </button>
            </div>
            <NoteDisplay timestamps={timestamps} handleToTimestamp={handleToTimestamp} clipUrl={clipUrl} clearTimestamps={clearTimestamps} />
          </div>
          <TimestampModal
            isOpen={timestampModalOpen}
            currentTime={currentTime}
            onSave={(title, note) => {
              handleSaveTimestamp(title, note);
            }}
            onClose={() => setTimestampModalOpen(false)}
          />
          <SaveModal
            isOpen={exportModalOpen}
            onClose={() => setExportModalOpen(false)}
            onSave={handleSave}
            isSaving={isSaving}
            curatorData={curatorData}
          />
        </div>
      </div>
    </div>

  );
}