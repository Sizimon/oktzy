'use client';
import { useState } from 'react';
import { Navigation } from '@/features/nav/components/Navigation';
import { useAuth } from '@/features/auth/context/authProvider';
import { useClip } from '@/features/clips/context/clipProvider';
import { useClipPageState } from '@/features/clips/hooks/useClipPageState';
import { IoIosArrowDown } from "react-icons/io";
import SignInModal from './SignInModal';

export default function NavigationWrapper() {
  const { user } = useAuth();
  const [navOpen, setNavOpen] = useState(false);
  const [signInModalOpen, setSignInModalOpen] = useState(false);
  const clipPage = useClipPageState();
  const { clips } = useClip();

  return (
    <>
      {/* Navigation Toggle Button - Fixed Position */}
      <button 
        className='opacity-50 fixed top-4 left-1/2 transform -translate-x-1/2 z-50 cursor-pointer hover:opacity-100 transition duration-300'
        aria-label="Open navigation menu"
        title="Open navigation menu"
        onClick={() => setNavOpen(true)}
      >
        <IoIosArrowDown className='h-4 w-4 lg:h-6 lg:w-6 text-text hover:text-violet-500 transition-color duration-400' />
      </button>

      {/* Navigation Sidebar */}
      <Navigation
        clips={clips}
        user={user}
        setSignInModalOpen={setSignInModalOpen}
        navOpen={navOpen}
        setNavOpen={setNavOpen}
        confirmAndDeleteClip={clipPage.confirmAndDeleteClip}
      />

      {/* Sign In Modal */}
      <SignInModal
        isOpen={signInModalOpen}
        onClose={() => setSignInModalOpen(false)}
      />
    </>
  );
}