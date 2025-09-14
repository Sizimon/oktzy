'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useClip } from '../clips/context/clipProvider';
import { useAuth } from '../auth/context/authProvider';
import { Clip } from '@/types/types'

import { BtnPrimary, BtnSecondary } from '@/components/ui/buttonVariants';
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";

import { useRouter } from 'next/navigation'

export function Navigation({
    user,
    setSignInModalOpen,
    navOpen,
    setNavOpen
}: {
    user: { 
        username: string,
        id: number
    } | null;
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
        router.push(`/${user?.id}/clips/${clip.id}`)
    }

    function handleHomeClick() {
        router.push(`/${user?.id}`)
    }

    return (
        <div>
            <nav
                ref={navRef}
                className="fixed top-0 left-0 flex flex-col justify-between items-start h-full bg-foreground/40 backdrop-blur-sm z-60 w-2/3 lg:w-1/5 xl:w-1/6 p-4 gap-4 max-h-[100lvh]"
            >
                <div className='flex flex-col gap-4 w-full h-9/10 p-4'>
                    <div className="text-text border-b border-violet-500/50 w-full justify-center items-center py-4">
                        <h2
                            className='text-2xl hover:text-violet-500 cursor-pointer'
                            onClick={handleHomeClick}
                        >
                            Home
                        </h2>
                    </div>
                    <div className='w-full max-h-full space-y-4 justify-start items-start overflow-y-auto no-scrollbar'>
                        {clips.length > 0 ? (
                            clips.map((clip: Clip, i: number) => (
                                <div
                                    id={`clip-${i}`}
                                    key={clip.id}
                                    onClick={() => handleClipClick(clip, router)}
                                    className='flex flex-row items-center w-full cursor-pointer group relative'
                                >
                                    <MdOutlineKeyboardDoubleArrowRight 
                                        className="absolute -left-8 text-violet-500 h-6 w-6 opacity-0 group-hover:translate-x-8 group-hover:opacity-100 transition-all duration-200 ease-out"  
                                    />
                                    <h3 className="text-text group-hover:translate-x-8 transition-transform duration-200 ease-out">
                                        {clip.title}
                                    </h3>
                                </div>
                            ))
                        ) : (
                            <span className='text-text/60'>Login to view saved clips.</span>
                        )}
                    </div>
                </div>
                <div className='flex flex-col w-full h-1/10 justify-end items-center'>
                    {isAuthenticated ? (
                            <div className='space-y-4 text-center w-full'>
                            <p className='text-text'>Logged in as <span className='text-violet-500'>{user?.username}</span></p>
                            <BtnSecondary onClick={logout}>Logout</BtnSecondary>
                        </div>
                    ) : (
                        <div className='space-y-4'>
                            <BtnPrimary onClick={() => setSignInModalOpen(true)}>Sign In</BtnPrimary>
                        </div>
                    )}
                </div>
            </nav>
        </div>
    );
}