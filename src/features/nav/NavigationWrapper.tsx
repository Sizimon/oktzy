'use client';
import { useState } from 'react';
import { Navigation } from '@/features/nav/components/Navigation';
import { useAuth } from '@/features/auth/context/authProvider';
import { useClipPageState } from '@/features/clips/hooks/useClipPageState';
import { CiMenuBurger } from "react-icons/ci";

export default function NavigationWrapper() {
  const { user } = useAuth();
  const [navOpen, setNavOpen] = useState(false);
  const [signInModalOpen, setSignInModalOpen] = useState(false);
  const clipPage = useClipPageState();

  return (
    <>
      {/* Navigation Toggle Button - Fixed Position */}
      <button 
        className='fixed top-4 left-4 lg:top-12 lg:left-12 z-50 cursor-pointer'
        aria-label="Open navigation menu"
        title="Open navigation menu"
        onClick={() => setNavOpen(true)}
      >
        <CiMenuBurger className='h-6 w-6 lg:h-8 lg:w-8 text-text hover:text-violet-500' />
      </button>

      {/* Navigation Sidebar */}
      <Navigation
        user={user}
        setSignInModalOpen={setSignInModalOpen}
        navOpen={navOpen}
        setNavOpen={setNavOpen}
        confirmAndDeleteClip={clipPage.confirmAndDeleteClip}
      />
    </>
  );
}