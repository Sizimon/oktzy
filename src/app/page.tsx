'use client';
import React from 'react';

// Component Imports
import { Navigation } from '@/features/nav/Navigation';
import { ClipHeader } from '@/features/clips/components/layout/ClipHeader';
import { ClipVideoSection } from '@/features/clips/components/layout/ClipVideoSection';
import { ClipSidebar } from '@/features/clips/components/layout/ClipSidebar';

// Modal Imports
import { ClipNoteModal } from '@/features/clips/components/modals/ClipNoteModal';
import SignInModal from '@/features/auth/components/SignInModal';

// Misc Imports
import { Bounce, ToastContainer } from 'react-toastify';

// Context Imports
import { useAuth } from '@/features/auth/context/authProvider';
import { useClipPageState } from '@/features/clips/hooks/useClipPageState';

export default function Home() {
  const { user } = useAuth()
  const clipPage = useClipPageState();

  // BEGINNING OF JSX RETURN

  return (
    <div className='relative w-full h-lvh lg:px-16'>
      <Navigation
        user={user}
      />
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
        className={'z-50'}
      />
      <ClipHeader clipUrl={clipPage.clipUrl} onInputChange={clipPage.setClipUrl} />
      <div className='flex flex-col lg:flex-row w-full z-50'>
        <div className="
          flex flex-col lg:flex-row font-sans items-center justify-center text-text z-50 py-4 space-y-4 w-full
          lg:px-4 lg:space-x-4 lg:space-y-0 lg:py-4
          "
        >
          <ClipVideoSection
            clipUrl={clipPage.clipUrl}
            modalOpen={clipPage.timestampModalOpen}
            retainedVolume={clipPage.retainedVolume}
            setRetainedVolume={clipPage.setRetainedVolume}
            setCurrentTime={clipPage.setCurrentTime}
            ref={clipPage.playerRef}
          />
          <ClipSidebar
            clipTitle={clipPage.clipTitle}
            handleChangeClipTitle={clipPage.handleChangeClipTitle}
            timestamps={clipPage.timestamps}
            handleToTimestamp={clipPage.handleToTimestamp}
            clipUrl={clipPage.clipUrl}
            clearTimestamps={clipPage.clearTimestamps}
            handleTimestampModal={clipPage.handleTimestampModal}
            handleSave={clipPage.handleSave}
          />
          {/** MODALS **/}
          <ClipNoteModal
            isOpen={clipPage.timestampModalOpen}
            currentTime={clipPage.currentTime}
            onSave={(title, note) => {
              clipPage.handleAddTimestamp(title, note);
            }}
            onClose={() => clipPage.setTimestampModalOpen(false)}
          />
          <SignInModal
            isOpen={clipPage.signInModalOpen}
            onClose={() => clipPage.setSignInModalOpen(false)} />
          {/** MODALS **/}
        </div>
      </div>
    </div>

  );
}