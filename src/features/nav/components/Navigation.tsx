'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useClip } from '../../clips/context/clipProvider';
import { useAuth } from '../../auth/context/authProvider';
import { Clip } from '@/types/types'
import { toast } from 'react-toastify';

import { BtnPrimary, BtnSecondary } from '@/components/ui/buttonVariants';
import { FaTrash } from "react-icons/fa6";
import Logo from "@/images/Oktzy Test Logo 1.png"

import { useRouter } from 'next/navigation'

export function Navigation({
    user,
    setSignInModalOpen,
    navOpen,
    setNavOpen,
    confirmAndDeleteClip
}: {
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
    const { clips } = useClip();
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

    function handleClipClick(
        clip: Clip,
        router: any
    ) {
        if (hasUnsavedChanges) {
            toast.error('You have unsaved changes. Please save them before navigating away.');
            return;
        }
        router.push(`/${user?.id}/clips/${clip.id}`)
    }

    function handleHomeClick() {
        if (hasUnsavedChanges) {
            toast.error('You have unsaved changes. Please save them before navigating away.');
            return;
        }
        router.push(`/${user?.id}`)
    }

    // Add this ref
    const horizontalScrollRef = useRef<HTMLDivElement>(null);

    // Update your useEffect with smooth scrolling
    useEffect(() => {
        const scrollContainer = horizontalScrollRef.current;

        const handleWheel = (e: WheelEvent) => {
            if (scrollContainer && scrollContainer.contains(e.target as Node)) {
                e.preventDefault();

                // Smooth scrolling with scrollTo
                scrollContainer.scrollTo({
                    left: scrollContainer.scrollLeft + e.deltaY,
                    behavior: 'smooth'
                });
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
                <div className="flex border-b border-violet-500/50 px-6 py-4 flex-shrink-0 justify-between items-center">
                    <img src={Logo.src} alt="Oktzy Logo" className="h-24 mb-2 cursor-pointer" onClick={handleHomeClick} />
                    {/* User Section */}
                    <div className="
                        flex-shrink-0 w-full
                        px-6 py-4 lg:w-80 flex flex-col justify-center
                    ">
                        {isAuthenticated ? (
                            <div className='space-y-4 text-center'>
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

                    {/* Clips Section - Horizontal Scroll - FIXED */}
                    <div className="flex-1 p-6 justify-center items-center w-full overflow-hidden flex flex-col">
                        <h3 className="text-lg text-text/80 mb-6 font-medium text-center">Your Clips</h3>
                        <div ref={horizontalScrollRef} className="overflow-x-auto max-w-full pb-4 horizontal-scroll-container no-scrollbar">
                            <div className="flex gap-4 px-2">
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
                    </div>
                </div>
            </nav>
        </div>
    );
}