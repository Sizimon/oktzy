'use client';

import { useParams } from 'next/navigation';
import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/features/auth/context/authProvider';
import { useClip } from '@/features/clips/context/clipProvider'
import { Bounce, ToastContainer } from 'react-toastify';

// Types
import { Clip } from '@/types/types'

// Components
import { Navigation } from '@/features/nav/Navigation';
import { ClipVideoSection } from '@/features/clips/components/layout/ClipVideoSection';
import { ClipSidebar } from '@/features/clips/components/layout/ClipSidebar';
import { ClipNoteModal } from '@/features/clips/components/modals/ClipNoteModal';
import SignInModal from '@/features/auth/components/SignInModal';

// Hooks
import { useClipPageState } from '@/features/clips/hooks/useClipPageState';

const ClipPage = () => {
    const [currentClip, setCurrentClip] = useState<Clip | null>(null);
    const { id } = useParams();
    const { user, isAuthenticated } = useAuth();
    const { clips } = useClip();
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');

    const idAsNum = Number(id);

    // Set error for invalid id in an effect
    useEffect(() => {
        if (isNaN(idAsNum)) {
            setError('Invalid clipId');
        }
    }, [idAsNum]);

    // Find and set currentClip in an effect
    useEffect(() => {
        if (!isAuthenticated || isNaN(idAsNum)) return;
        const loadedClip = clips.find(clip => Number(clip.id) === idAsNum);
        setCurrentClip(loadedClip ?? null);
    }, [idAsNum, isAuthenticated, clips]);

    console.log(currentClip)
    const clipPage = useClipPageState(currentClip ?? undefined);

    if (error) {
        return <div>{error}</div>;
    }

    if (!user || !isAuthenticated || !currentClip) {
        return <div>Loading...</div>;
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
            <div className='absolute inset-0 z-0 background'/>
            <div className='flex h-1/10 justify-center items-center text-text z-50'>
                <h1>{currentClip?.title}</h1>
            </div>
            <div className='flex flex-col lg:flex-row w-full z-50'>
                <div className="
                      flex flex-col lg:flex-row font-sans items-center justify-center text-text z-50 py-4 space-y-4 w-full
                      lg:px-4 lg:space-x-4 lg:space-y-0 lg:py-4
                      "
                >
                    <ClipVideoSection
                        clipUrl={clipPage.clipUrl}
                        modalOpen={clipPage.timestampModalOpen}
                        retainedVolume={clipPage.retainedVolume}
                        setRetainedVolume={clipPage.setRetainedVolume}
                        setCurrentTime={clipPage.setCurrentTime}
                        ref={clipPage.playerRef}
                    />
                    <ClipSidebar
                        timestamps={clipPage.timestamps}
                        handleToTimestamp={clipPage.handleToTimestamp}
                        clipUrl={clipPage.clipUrl}
                        clearTimestamps={clipPage.clearTimestamps}
                        handleTimestampModal={clipPage.handleTimestampModal}
                        handleSave={clipPage.handleSave}
                    />
                    {/** MODALS **/}
                    <ClipNoteModal
                        isOpen={clipPage.timestampModalOpen}
                        currentTime={clipPage.currentTime}
                        onSave={(title: any, note: any) => {
                            clipPage.handleAddTimestamp(title, note);
                        }}
                        onClose={() => clipPage.setTimestampModalOpen(false)}
                    />
                    {/* <ClipSaveModal
                        isOpen={clipPage.saveModalOpen}
                        onClose={() => clipPage.setSaveModalOpen(false)}
                        onSave={clipPage.handleSave}
                        isSaving={clipPage.isSaving}
                        curatorData={clipPage.curatorData}
                    /> */}
                    <SignInModal
                        isOpen={clipPage.signInModalOpen}
                        onClose={() => clipPage.setSignInModalOpen(false)} />
                    {/** MODALS **/}
                </div>
            </div>
        </div>
    )
}

export default ClipPage