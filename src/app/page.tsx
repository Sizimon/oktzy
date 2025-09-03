'use client';
import React, { useState, useRef } from 'react';

// Component Imports
import { ClipDisplay } from '@/features/clips/components/ClipDisplay';
import { ClipInput } from '@/features/clips/components/ClipInput';
import { ClipNoteDisplay } from '@/features/clips/components/ClipNoteDisplay';

// Modal Imports
import { ClipNoteModal } from '@/features/clips/components/ClipNoteModal';
import { ClipSaveModal } from '@/features/clips/components/ClipSaveModal';
import SignInModal from '@/features/auth/components/SignInModal';

// Hook Imports
import { useTimestamps } from '@/features/clips/hooks/useTimestamps';
import { useVideoState } from '@/features/clips/hooks/useVideoState';
import { useCuratorData } from '@/features/clips/hooks/useCuratorData';

// Misc Imports
import { Bounce, ToastContainer, toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import Galaxy from '@/components/Galaxy';

// Context Imports
import { useAuth } from '@/features/auth/context/authProvider';
import { useClip } from '@/features/clips/context/clipProvider';

// Type Imports
import { CuratorData } from '@/types/types';

export default function Home() {
  const [timestampModalOpen, setTimestampModalOpen] = useState<boolean>(false);
  const [saveModalOpen, setSaveModalOpen] = useState<boolean>(false);
  const [signInModalOpen, setSignInModalOpen] = useState<boolean>(false);
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

  const { user, isAuthenticated } = useAuth();
  const { createClip, clips } = useClip();

  console.log('Current Clips:', clips);

  // Handler which opens the timestamp creation modal
  const handleAddTimestamp = () => {
    if (!clipUrl) {
      toast.warning('Please provide a video URL before adding a timestamp.');
      return;
    }
    setTimestampModalOpen(true);
  };

  // Handler which saves the timestamp data
  const handleSaveTimestamp = (title: string, note: string) => {
    if (!title || !note) {
      toast.error('Please provide both a title and a note for the timestamp.');
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
  const handleSaveModal = () => {
    if (!clipUrl) {
      toast.error('No clip URL/timestamp data provided');
      return;
    }
    generateCuratorData(clipUrl, timestamps);
    setSaveModalOpen(true);
  }

  const handleSave = async (title: string, dataToSave: CuratorData) => {
    if (!curatorData) {
      toast.error('No curator data to save');
      return;
    }

    if (!isAuthenticated) {
      toast.error('You must be logged in to save clips');
      setSignInModalOpen(true);
      return;
    }
    setIsSaving(true);

    try {
      const response = await createClip(title, dataToSave);
      if (response.success) {
        toast.success('Clip saved successfully');
      } else if (response.error) {
        toast.error(response.error || 'Failed to save clip');
      }
    } catch (error) {
      console.error('Error saving clip:', error);
      toast.error('Network error - please try again');
    } finally {
      setIsSaving(false);
    }
  }

  // BEGINNING OF JSX RETURN

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
        <ClipInput clipUrl={clipUrl} onInputChange={handleInputChange} />
        {user ? (
          <p className='text-text'>{`Welcome back, ${user.username}!`}</p>
        ) : (
          <p className='text-text'>
            Please sign in to access all features.
          </p>
        )}
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
                <ClipDisplay
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
                onClick={handleSaveModal}
                className="p-2 bg-green-500 text-white rounded cursor-pointer"
              >
                Save
              </button>
            </div>
            <ClipNoteDisplay timestamps={timestamps} handleToTimestamp={handleToTimestamp} clipUrl={clipUrl} clearTimestamps={clearTimestamps} />
          </div>
          <ClipNoteModal
            isOpen={timestampModalOpen}
            currentTime={currentTime}
            onSave={(title, note) => {
              handleSaveTimestamp(title, note);
            }}
            onClose={() => setTimestampModalOpen(false)}
          />
          <ClipSaveModal
            isOpen={saveModalOpen}
            onClose={() => setSaveModalOpen(false)}
            onSave={handleSave}
            isSaving={isSaving}
            curatorData={curatorData}
          />
          <SignInModal
            isOpen={signInModalOpen}
            onClose={() => setSignInModalOpen(false)} />
        </div>
      </div>
    </div>

  );
}