'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useAuth } from '../../auth/context/authProvider';
import { Clip } from '@/types/types'
import { toast } from 'react-toastify';

import { BtnPrimary, BtnSecondary } from '@/components/ui/buttonVariants';
import { FaTrash } from "react-icons/fa6";
import Logo from "@/images/Oktzy Test Logo 1.png"
import { IoIosArrowUp } from "react-icons/io";

import { useRouter } from 'next/navigation'

export function Navigation({
    clips,
    user,
    setSignInModalOpen,
    navOpen,
    setNavOpen,
    confirmAndDeleteClip
}: {
    clips: Clip[];
    user: {
        username: string,
        id: number
    } | null;
    setSignInModalOpen: (open: boolean) => void;
    navOpen: boolean;
    setNavOpen: (open: boolean) => void;
    confirmAndDeleteClip?: (id: number) => void;
}) {
    const router = useRouter();
    const { isAuthenticated, logout, hasUnsavedChanges } = useAuth();

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
                y: '-100%',
                opacity: 0
            });
        }
    }, [navRef]);

    // Animate dropdown
    useEffect(() => {
        if (!navRef.current) return;
        gsap.to(navRef.current, {
            y: navOpen ? 0 : '-100%',
            opacity: navOpen ? 1 : 0,
            duration: 0.4,
            ease: navOpen ? 'power2.out' : 'power2.in'
        });
    }, [navOpen, navRef]);

    // useEffect(() => {
    //     console.log('🔍 Navigation render:', { clipsCount: clips.length, clipIds: clips.map(c => c.id) });
    // }, [clips]);

    function handleClipClick(
        clip: Clip,
        router: any
    ) {
        if (hasUnsavedChanges) {
            toast.error('You have unsaved changes. Please save them before navigating away.');
            return;
        }
        setNavOpen(false);
        setTimeout(() => {
            router.push(`/${user?.id}/clips/${clip.id}`)
        }, 500); // Slight delay to ensure state updates
    }

    function handleHomeClick() {
        if (hasUnsavedChanges) {
            toast.error('You have unsaved changes. Please save them before navigating away.');
            return;
        }
        setNavOpen(false);
        setTimeout(() => {
            router.push(`/${user?.id}`)
        }, 500); // Slight delay to ensure state updates
    }

    // Add this ref for the horizontal scroll container
    const horizontalScrollRef = useRef<HTMLDivElement>(null);

    // Add this useEffect for wheel handling
    useEffect(() => {
        const scrollContainer = horizontalScrollRef.current;

        const handleWheel = (e: WheelEvent) => {
            // Only handle on desktop and when hovering over the scroll container
            if (window.innerWidth < 1024 || !scrollContainer) return;

            if (scrollContainer.contains(e.target as Node)) {
                e.preventDefault();

                // Convert vertical wheel movement to horizontal scroll
                const scrollAmount = e.deltaY;
                scrollContainer.scrollLeft += scrollAmount;
            }
        };

        if (scrollContainer) {
            scrollContainer.addEventListener('wheel', handleWheel, { passive: false });
        }

        return () => {
            if (scrollContainer) {
                scrollContainer.removeEventListener('wheel', handleWheel);
            }
        };
    }, []);

    return (
        <div>
            <nav
                ref={navRef}
                className={`
                    fixed top-0 left-0 right-0 z-50 w-full
                    h-screen sm:h-1/2
                    bg-foreground/20 backdrop-blur-md
                    flex flex-col
                    ${navOpen ? 'pointer-events-auto' : 'pointer-events-none'}
                `}
            >
                {/* Header Section */}
                <div className="flex border-b border-violet-500/50 lg:px-6 py-4 flex-shrink-0 justify-between items-center">
                    <button 
                        className='absolute lg:hidden lg:pointer-events-none top-2 left-1/2 -translate-x-1/2'
                        onClick={() => setNavOpen(false)}
                        aria-label="Close Navigation Menu"
                    >
                            <IoIosArrowUp className='h-6 w-6 text-text hover:text-violet-500 transition-color duration-400' />
                    </button>
                    <img
                        src={Logo.src}
                        alt="Oktzy Logo"
                        className="h-24 mb-2 cursor-pointer"
                        onClick={handleHomeClick} />
                    {/* User Section */}
                    <div className="
                        flex-shrink-0
                        p-4 flex flex-col justify-center
                    ">
                        {isAuthenticated ? (
                            <div className='text-center items-center flex flex-col gap-2'>
                                <p className='text-text'>
                                    Logged in as <span className='text-violet-500 font-medium'>{user?.username}</span>
                                </p>
                                <BtnSecondary onClick={logout}>
                                    Logout
                                </BtnSecondary>
                            </div>
                        ) : (
                            <div className='space-y-4 text-center'>
                                <BtnPrimary
                                    onClick={() => {
                                        setSignInModalOpen(true);
                                        setNavOpen(false);
                                    }}
                                >
                                    Sign In
                                </BtnPrimary>
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-hidden flex flex-col items-center">

                    {/* Clips Section - Separate Mobile/Desktop */}
                    <div className="flex-1 p-6 w-full flex flex-col items-center justify-evenly">
                        <h3 className="text-lg text-text/80 mb-6 font-medium text-center">Your Clips</h3>

                        {/* Mobile: Vertical Scrolling */}
                        <div className="lg:hidden w-full max-h-[65vh] overflow-y-auto">
                            <div className="flex flex-col gap-4 px-2">
                                {clips.length > 0 ? (
                                    clips.map((clip: Clip, i: number) => (
                                        <div
                                            key={clip.id}
                                            onClick={() => handleClipClick(clip, router)}
                                            className="group relative bg-background/50 backdrop-blur-sm border border-violet-500/20 rounded-lg p-4 cursor-pointer hover:border-violet-500/50 hover:bg-violet-500/5 transition-all duration-200"
                                        >
                                            {/* Your existing card content */}
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="w-8 h-8 bg-violet-500/20 rounded-full flex items-center justify-center">
                                                    <span className="text-violet-500 text-sm font-bold">{i + 1}</span>
                                                </div>
                                                <FaTrash
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setNavOpen(false);
                                                        confirmAndDeleteClip && confirmAndDeleteClip(clip.id);
                                                    }}
                                                    className="text-gray-500/50 opacity-0 group-hover:opacity-100 hover:text-red-500 h-4 w-4 transition-all duration-200 cursor-pointer"
                                                />
                                            </div>
                                            <h4 className="text-text group-hover:text-violet-500 transition-colors duration-200 font-medium">
                                                {clip.title}
                                            </h4>
                                            <p className="text-text/60 text-sm mt-1">
                                                {clip.timestamps?.length || 0} timestamps
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="w-full text-center py-12">
                                        <p className='text-text/70 italic'>
                                            {isAuthenticated ? 'No clips yet. Insert a clip and save it!' : 'Login to view saved clips.'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Desktop: Horizontal Scrolling */}
                        <div
                            ref={horizontalScrollRef} 
                            className="hidden lg:flex flex-row items-center justify-start gap-4 overflow-x-auto py-2 px-2 w-full no-scrollbar">
                            {clips.length > 0 ? (
                                clips.map((clip: Clip, i: number) => (
                                    <div
                                        key={clip.id}
                                        onClick={() => handleClipClick(clip, router)}
                                        className="group relative bg-background/50 backdrop-blur-sm border border-violet-500/20 rounded-lg p-4 cursor-pointer hover:border-violet-500/50 hover:bg-violet-500/5 transition-all duration-200 min-w-[250px] max-w-[300px] flex-shrink-0"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="w-8 h-8 bg-violet-500/20 rounded-full flex items-center justify-center">
                                                <span className="text-violet-500 text-sm font-bold">{i + 1}</span>
                                            </div>
                                            <FaTrash
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setNavOpen(false);
                                                    confirmAndDeleteClip && confirmAndDeleteClip(clip.id);
                                                }}
                                                className="text-gray-500/50 opacity-0 group-hover:opacity-100 hover:text-red-500 h-4 w-4 transition-all duration-200 cursor-pointer"
                                            />
                                        </div>
                                        <h4 className="text-text group-hover:text-violet-500 transition-colors duration-200 font-medium whitespace-nowrap">
                                            {clip.title}
                                        </h4>
                                        <p className="text-text/60 text-sm mt-1">
                                            {clip.timestamps?.length || 0} timestamps
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <div className="w-full text-center py-12">
                                    <p className='text-text/70 italic'>
                                        {isAuthenticated ? 'No clips yet. Insert a clip and save it!' : 'Login to view saved clips.'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
}