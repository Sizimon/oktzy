import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export function Navigation({
    user,
}: {
    user: { username: string } | null;
}) {

    // Nav State
      const [navOpen, setNavOpen] = useState<boolean>(false);
      const navRef = useRef<HTMLDivElement>(null);
      console.log('NAV OPEN:', navOpen);

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

    return (
        <div>
            {!navOpen ? (
                <button className='absolute top-0 left-0 z-60'
                    onClick={() => setNavOpen(true)}
                >
                    {/* Hamburger icon */}
                    <p>open</p>
                </button>
            ) : null}
            <nav
                ref={navRef}
                className="fixed top-0 left-0 flex flex-col justify-start items-center h-full bg-slate-800/40 backdrop-blur-sm z-60 w-1/5 p-4"
            >
                <div className="text-white border-b border-white/10 w-full p-4">
                    {user ? `Welcome, ${user.username}` : 'Not logged in'}
                </div>
            </nav>
        </div>
    );
}