'use client';

import { useParams } from 'next/navigation';
import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/features/auth/context/authProvider';
import { useClip } from '@/features/clips/context/clipProvider'
import { Bounce, ToastContainer } from 'react-toastify';

// Types
import { Clip } from '@/types/types'

// Components
import Galaxy from '@/components/Galaxy';
import { Navigation } from '@/features/nav/Navigation';
import { ClipVideoSection } from '@/features/clips/components/layout/ClipVideoSection';
import { ClipSidebar } from '@/features/clips/components/layout/ClipSidebar';


const ClipPage = () => {
    const [currentClip, setCurrentClip] = useState<Clip | null>(null)
    const { id } = useParams();
    const { user, isAuthenticated } = useAuth();
    const { clips } = useClip();
    const [error, setError] = useState<string>('')
    const [success, setSuccess] = useState<string>('')


    // Converts ID Param to a number and ensures it is indeed a number.
    const idAsNum = Number(id)
    if (isNaN(idAsNum)) {
        setError('Invalid clipId')
        return;
    }


    // First, checks auth, then finds the correct clip & sets it as the currentClip
    useEffect(() => {
        if (!isAuthenticated) return;
        const loadedClip = clips.find(clip => Number(clip.id) === idAsNum)
        console.log(loadedClip)
        setCurrentClip(loadedClip ?? null)
    }, [idAsNum, isAuthenticated, clips])

    if (!user || !isAuthenticated || !currentClip) {
        return (
            <div>Loading...</div>
        )
    }

    return (
        <div className='relative w-full h-lvh lg:px-16'>
            <Navigation
                user={user}
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
            />
            <div className='absolute inset-0 z-0'>
                <Galaxy
                    mouseInteraction={false}
                    mouseRepulsion={false}
                    density={0.8}
                    glowIntensity={0.15}
                    saturation={0.5}
                    hueShift={140}
                    twinkleIntensity={0.2}
                    rotationSpeed={0.03}
                    starSpeed={0.1}
                    speed={0.1}
                />
            </div>
            <div className='flex h-1/10 justify-center items-center text-text z-50'>
                <h1>{currentClip?.title}</h1>
            </div>
        </div>
    )
}

export default ClipPage