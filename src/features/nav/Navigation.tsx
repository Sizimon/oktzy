'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useClip } from '../clips/context/clipProvider';
import { useAuth } from '../auth/context/authProvider';
import { Clip } from '@/types/types'

import { BtnPrimary, BtnSecondary } from '@/components/ui/buttonVariants';

import { useRouter } from 'next/navigation'

export function Navigation({
    user,
    setSignInModalOpen,
    navOpen,
    setNavOpen
}: {
    user: { username: string } | null;
    setSignInModalOpen: (open: boolean) => void;
    navOpen: boolean;
    setNavOpen: (open: boolean) => void;
}) {
    const router = useRouter();
    const { clips } = useClip();
    const { isAuthenticated, logout } = useAuth();

    // Nav Ref for animation
    const navRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!navOpen) return;
        const handleClickOutsideNav = (event: MouseEvent) => {
            if (navRef.current && !navRef.current.contains(event?.target as Node)) {
                setNavOpen(false);
            }
        }

        document.addEventListener('click', handleClickOutsideNav);

        return () => {
            document.removeEventListener('click', handleClickOutsideNav);
        }

    }, [navOpen]);

    // Set initial hidden state once
    useEffect(() => {
        if (navRef.current) {
            gsap.set(navRef.current, {
                x: '-100%',
                opacity: 0,
                pointerEvents: 'none'
            });
        }
    }, [navRef]);

    // Animate
    useEffect(() => {
        if (!navRef.current) return;
        gsap.to(navRef.current, {
            x: navOpen ? 0 : '-100%',
            opacity: navOpen ? 1 : 0,
            pointerEvents: navOpen ? 'auto' : 'none',
            duration: 0.4,
            ease: navOpen ? 'power2.out' : 'power2.in'
        });
    }, [navOpen, navRef]);


    function handleClipClick(
        clip: Clip,
        router: any
    ) {
        router.push(`/clips/${clip.id}`)
    }

    function handleHomeClick() {
        router.push(`/`)
    }

    return (
        <div>
            <nav
                ref={navRef}
                className="fixed top-0 left-0 flex flex-col justify-between items-start h-full bg-foreground/40 backdrop-blur-sm z-60 w-2/3 lg:w-1/5 xl:w-1/6 p-4 space-y-4"
            >
                <div className='space-y-4 w-full'>
                    <div className="text-text border-b border-white/10 w-full p-4">
                        <h2 
                        className='text-2xl hover:text-violet-500 cursor-pointer'
                        onClick={handleHomeClick}
                        >
                            Home
                        </h2>
                    </div>
                    <div className='flex flex-col w-full space-y-4 justify-start items-start px-4 overflow-y-auto no-scrollbar max-h-[80lvh]'>
                        {clips.length > 0 ? (
                            clips.map((clip: Clip, i: number) => (
                                <h3 id={`clip-${i}`} className='cursor-pointer text-text' key={clip.id} onClick={() => handleClipClick(clip, router)}>
                                    {clip.title}
                                </h3>
                            ))
                        ) : (
                            <span className='text-text/60'>Could not find any clips...</span>
                        )}
                    </div>
                </div>
                <div className='w-full'>
                    {isAuthenticated ? (
                        <div className='flex flex-col space-y-4'>
                            <p className='text-text text-center'>Logged in as <span className='text-violet-500'>{user?.username}</span></p>
                            <BtnSecondary onClick={logout}>Logout</BtnSecondary>
                        </div>
                    ) : (
                        <BtnPrimary onClick={() => setSignInModalOpen(true)}>Sign In</BtnPrimary>
                    )}
                </div>
            </nav>
        </div>
    );
}