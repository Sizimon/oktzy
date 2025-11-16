'use client';
import React, { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

// Component Imports
import { ClipInput } from '@/features/clips/components/ui/ClipInput';
import { ClipVideoSection } from '@/features/clips/components/layout/ClipVideoSection';
import { ClipSidebar } from '@/features/clips/components/layout/ClipSidebar';

// Modal Imports
import { ClipNoteModal } from '@/features/clips/components/modals/ClipNoteModal';
import SignInModal from '@/features/nav/SignInModal';

// Misc Imports
import { Bounce, toast, ToastContainer } from 'react-toastify';


// Context Imports
import { useClipPageState } from '@/features/clips/hooks/useClipPageState';

export default function Home() {
  const clipPage = useClipPageState();

  const hasShownToast = useRef<boolean>(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (hasShownToast.current) return; // Prevent multiple executions
    const loginSuccess = searchParams.get('loginSuccess');
    const registerSuccess = searchParams.get('registerSuccess');

    console.log('🔍 loginSuccess:', loginSuccess);
    console.log('🔍 registerSuccess:', registerSuccess);

    if (loginSuccess === 'true') {
      console.log('🎉 Showing login success toast');
      hasShownToast.current = true;
      setTimeout(() => {
        toast.success('Welcome back! 👋');
      }, 200);

      // Clean up after showing toast
      setTimeout(() => {
        const url = new URL(window.location.href);
        url.searchParams.delete('loginSuccess');
        url.searchParams.delete('registerSuccess');
        window.history.replaceState({}, '', url.toString());
      }, 2500);
      
    } else if (registerSuccess === 'true') {
      console.log('🎉 Showing register success toast');
      hasShownToast.current = true;
      setTimeout(() => {
        toast.success('Welcome to Oktzy! 🎉');
      }, 200);

      setTimeout(() => {
        const url = new URL(window.location.href);
        url.searchParams.delete('loginSuccess');
        url.searchParams.delete('registerSuccess');
        window.history.replaceState({}, '', url.toString());
      }, 2500);
    }
  }, [searchParams]);

  return (
    <div className='relative w-full h-lvh lg:p-8'>
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
      <div className='flex h-1/10 w-full justify-center items-center px-4 lg:px-0 z-10'>
        <ClipInput clipUrl={clipPage.clipUrl} onInputChange={clipPage.setClipUrl} />
      </div>

      <div className='flex flex-col lg:flex-row w-full z-40 h-9/10'>
        <div className="
          flex flex-col lg:flex-row font-sans items-center justify-center text-text z-20 gap-4 w-full
          lg:px-4 lg:py-4 lg:items-start
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