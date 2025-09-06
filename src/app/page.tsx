'use client';
import React, { useState, useRef } from 'react';

// Component Imports
import { ClipHeader } from '@/features/clips/components/layout/ClipHeader';
import { ClipVideoSection } from '@/features/clips/components/layout/ClipVideoSection';
import { ClipSidebar } from '@/features/clips/components/layout/ClipSidebar';

// Modal Imports
import { ClipNoteModal } from '@/features/clips/components/modals/ClipNoteModal';
import { ClipSaveModal } from '@/features/clips/components/modals/ClipSaveModal';
import SignInModal from '@/features/auth/components/SignInModal';

// Hook Imports
import { useTimestamps } from '@/features/clips/hooks/useTimestamps';
import { useCuratorData } from '@/features/clips/hooks/useCuratorData';

// Misc Imports
import { Bounce, ToastContainer, toast } from 'react-toastify';
import Galaxy from '@/components/Galaxy';

// Context Imports
import { useAuth } from '@/features/auth/context/authProvider';
import { useClip } from '@/features/clips/context/clipProvider';

// Type Imports
import { CuratorData } from '@/types/types';

export default function Home() {

  // Video States
  const [clipUrl, setClipUrl] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [retainedVolume, setRetainedVolume] = useState<number>(1);

  // Modal States
  const [timestampModalOpen, setTimestampModalOpen] = useState<boolean>(false);
  const [saveModalOpen, setSaveModalOpen] = useState<boolean>(false);
  const [signInModalOpen, setSignInModalOpen] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const playerRef = useRef<any>(null);

  const {
    timestamps,
    addTimestamp,
    clearTimestamps
  } = useTimestamps();

  const { curatorData, generateCuratorData } = useCuratorData();

  const { user, isAuthenticated } = useAuth();
  const { createClip } = useClip();

  // Handler which opens the timestamp creation modal
  const handleTimestampModal = () => {
    if (!clipUrl) {
      toast.warning('Please provide a video URL before adding a timestamp.');
      return;
    }
    setTimestampModalOpen(true);
  };

  // Handler which adds a new timestamp
  const handleAddTimestamp = (title: string, note: string) => {
    if (!title || !note) {
      toast.error('Please provide both a title and a note for the timestamp.');
      return;
    }

    addTimestamp(currentTime, title, note);
    setTimestampModalOpen(false);
  };


  // Handler which seeks the video to the specified timestamp (BROKEN: NEEDS TO BE FIXED)
  const handleToTimestamp = (time: number) => {
    if (playerRef.current) {
      playerRef.current.currentTime = time;
    }
  };

  // Handler which triggers the save modal & generates curator data from the current video
  const handleSaveModal = () => {
    if (!clipUrl) {
      toast.error('No clip URL/timestamp data provided');
      return;
    }
    generateCuratorData(clipUrl, timestamps);
    setSaveModalOpen(true);
  }

  // Handler which saves the clip data to the database
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
      setSaveModalOpen(false);
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
      <ClipHeader clipUrl={clipUrl} onInputChange={setClipUrl} user={user} />
      <div className='flex flex-col lg:flex-row w-full z-50'>
        <div className="
          flex flex-col lg:flex-row font-sans items-center justify-center text-text z-50 py-4 space-y-4 w-full
          lg:px-4 lg:space-x-4 lg:space-y-0 lg:py-4
          "
        >
          <ClipVideoSection
            clipUrl={clipUrl}
            modalOpen={timestampModalOpen}
            retainedVolume={retainedVolume}
            setRetainedVolume={setRetainedVolume}
            setCurrentTime={setCurrentTime}
            ref={playerRef}
          />
          <ClipSidebar
            timestamps={timestamps}
            handleToTimestamp={handleToTimestamp}
            clipUrl={clipUrl}
            clearTimestamps={clearTimestamps}
            handleTimestampModal={handleTimestampModal}
            handleSaveModal={handleSaveModal}
          />
          {/** MODALS **/}
          <ClipNoteModal
            isOpen={timestampModalOpen}
            currentTime={currentTime}
            onSave={(title, note) => {
              handleAddTimestamp(title, note);
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
          {/** MODALS **/}
        </div>
      </div>
    </div>

  );
}