'use client';
import React from 'react';

// Component Imports
import { Navigation } from '@/features/nav/Navigation';
import { ClipInput } from '@/features/clips/components/ui/ClipInput';
import { ClipVideoSection } from '@/features/clips/components/layout/ClipVideoSection';
import { ClipSidebar } from '@/features/clips/components/layout/ClipSidebar';

// Modal Imports
import { ClipNoteModal } from '@/features/clips/components/modals/ClipNoteModal';
import SignInModal from '@/features/auth/components/SignInModal';

// Misc Imports
import { Bounce, ToastContainer } from 'react-toastify';
import { CiMenuBurger } from "react-icons/ci";

// Context Imports
import { useAuth } from '@/features/auth/context/authProvider';
import { useClipPageState } from '@/features/clips/hooks/useClipPageState';

export default function Home() {
  const { user } = useAuth()
  const clipPage = useClipPageState();

  return (
    <div className='relative w-full h-lvh lg:p-16'>
      <Navigation
        user={user}
        setSignInModalOpen={clipPage.setSignInModalOpen}
        navOpen={clipPage.navOpen}
        setNavOpen={clipPage.setNavOpen}
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
      <div className='absolute inset-0 gradient-bg-subtle -z-10' />

      {/* HEADER */}
      <div className='flex h-1/10 justify-between items-center lg:items-start px-4 lg:px-0 z-40'>
        <button className='cursor-pointer'
          aria-label="Open navigation menu"
          title="Open navigation menu"
          onClick={() => clipPage.setNavOpen(true)}
        >
          {/* Hamburger icon */}
          <p className='text-text hover:text-violet-500'>
            <CiMenuBurger size={32} />
          </p>
        </button>

        <ClipInput clipUrl={clipPage.clipUrl} onInputChange={clipPage.setClipUrl} />
        <div className='w-8'/>
      </div>

      <div className='flex flex-col lg:flex-row w-full z-40 h-9/10'>
        <div className="
          flex flex-col lg:flex-row font-sans items-center justify-center text-text z-50 space-y-4 w-full
          lg:px-4 lg:space-x-4 lg:space-y-0 lg:py-4 lg:items-start
          "
        >
          <ClipVideoSection
            clipUrl={clipPage.clipUrl}
            timestampModalOpen={clipPage.timestampModalOpen}
            signInModalOpen={clipPage.signInModalOpen}
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
            handleDeleteTimestamp={clipPage.handleDeleteTimestamp}
          />
          {/** MODALS **/}
          <ClipNoteModal
            isOpen={clipPage.timestampModalOpen}
            currentTime={clipPage.currentTime}
            onSave={(title, note) => {
              clipPage.handleAddTimestamp(title, note);
            }}
            onUpdate={(editIndex, title, note) => {
              clipPage.handleUpdateTimestamp(editIndex, title, note);
            }}
            onClose={() => clipPage.setTimestampModalOpen(false)}
            editIndex={clipPage.editIndex}
            editData={clipPage.editData}
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