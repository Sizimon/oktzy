'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { CiMenuBurger } from "react-icons/ci";
import { useClip } from '../clips/context/clipProvider';
import { Clip } from '@/types/types'
import { useRouter } from 'next/navigation'

export function Navigation({
    user,
}: {
    user: { username: string } | null;
}) {
    const router = useRouter();    
    const { clips } = useClip();

    // Nav State
    const [navOpen, setNavOpen] = useState<boolean>(false);
    const navRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!navOpen) return;
        const handleClickOutsideNav = () => {
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

    return (
        <div>
            {!navOpen ? (
                <button className='absolute top-6 left-6 z-50'
                    aria-label="Open navigation menu"
                    title="Open navigation menu"
                    onClick={() => setNavOpen(true)}
                >
                    {/* Hamburger icon */}
                    <CiMenuBurger size={30} color='white' />
                </button>
            ) : null}
            <nav
                ref={navRef}
                className="fixed top-0 left-0 flex flex-col justify-start items-center h-full bg-foreground/40 backdrop-blur-sm z-60 w-1/5 p-4 space-y-4"
            >
                <div className="text-white border-b border-white/10 w-full p-4">
                    {user ? `Welcome, ${user.username}` : 'Not logged in'}
                </div>
                <div className='flex flex-col w-full space-y-4 justify-start items-start px-4'>
                    {clips.length > 0 ? (
                        clips.map((clip: Clip) => (
                            <h3 className='cursor-pointer text-text' key={clip.id} onClick={() => handleClipClick(clip, router)}>
                                {clip.title}
                            </h3>
                        ))
                    ) : (
                        <span>Could not find any clips...</span>
                    )}
                </div>
            </nav>
        </div>
    );
}