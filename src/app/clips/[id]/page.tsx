'use client';

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/context/authProvider';
import { Bounce, ToastContainer } from 'react-toastify';

// Types
import { Clip } from '@/types/types'

// Components
import { Navigation } from '@/features/nav/Navigation';
import { ClipVideoSection } from '@/features/clips/components/layout/ClipVideoSection';
import { ClipSidebar } from '@/features/clips/components/layout/ClipSidebar';
import { ClipNoteModal } from '@/features/clips/components/modals/ClipNoteModal';

// Hooks
import { useClipPageState } from '@/features/clips/hooks/useClipPageState';

const ClipPage = () => {
    const { id } = useParams();
    const { user, isAuthenticated } = useAuth();
    const [error, setError] = useState<string>('');

    const idAsNum = Number(id);

    // Just pass the ID to the hook
    const clipPage = useClipPageState(isNaN(idAsNum) ? undefined : idAsNum);

    useEffect(() => {
        if (isNaN(idAsNum)) {
            setError('Invalid clipId');
        }
    }, [idAsNum]);

    if (error) {
        return <div>{error}</div>;
    }

    if (!user || !isAuthenticated || !clipPage.currentClip) {
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
            <div className='flex flex-col lg:flex-row w-full z-50 justify-center h-full'>
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
                        clipTitle={clipPage.clipTitle}
                        setClipTitle={clipPage.setClipTitle}
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
                        onSave={(title: string, note: string) => {
                            clipPage.handleAddTimestamp(title, note);
                        }}
                        onClose={() => clipPage.setTimestampModalOpen(false)}
                    />
                    {/* <SignInModal
                        isOpen={clipPage.signInModalOpen}
                        onClose={() => clipPage.setSignInModalOpen(false)} /> */}
                    {/** MODALS **/}
                </div>
            </div>
        </div>
    )
}

export default ClipPage