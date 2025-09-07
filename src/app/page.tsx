'use client';
import React from 'react';

// Component Imports
import Galaxy from '@/components/Galaxy';
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
      />
      <div className='absolute inset-0 -z-10'>
        <Galaxy
          mouseInteraction={false}
          mouseRepulsion={false}
          density={0.8}
          glowIntensity={0.15}
          saturation={0.5}
          hueShift={140}
          twinkleIntensity={0.2}
          rotationSpeed={0}
          starSpeed={0.1}
          speed={0.1}
        />
      </div>
      <ClipHeader clipUrl={clipPage.clipUrl} onInputChange={clipPage.setClipUrl} />
      <div>
        <input className="p-2 border-[1px] border-white/10 focus:outline-none text-lg bg-slate-800/30 text-text rounded-full w-2/3 lg:w-1/3" value={clipPage.clipTitle || ''} onChange={(e) => clipPage.setClipTitle(e.target.value)} />
      </div>
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