'use client';

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/context/authProvider';
import { useClip } from '@/features/clips/context/clipProvider';

import { ClipLoader } from 'react-spinners';
import { Bounce, ToastContainer } from 'react-toastify';
import { CiMenuBurger } from "react-icons/ci";

// Components
import { Navigation } from '@/features/nav/Navigation';
import { ClipVideoSection } from '@/features/clips/components/layout/ClipVideoSection';
import { ClipSidebar } from '@/features/clips/components/layout/ClipSidebar';
import { ClipNoteModal } from '@/features/clips/components/modals/ClipNoteModal';

// Hooks
import { useClipPageState } from '@/features/clips/hooks/useClipPageState';

const ClipPage = () => {
    const { id } = useParams();
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const { isLoading: clipsLoading } = useClip();
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
        return <div>Error:{error}</div>;
    }

    if (authLoading || clipsLoading) {
        return <ClipLoader size={50} className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' />;
    }

    if (!user || !isAuthenticated) {
        return <div>Loading...</div>;
    }

    if (!clipPage.currentClip) {
        return <div>Clip not found</div>;
    }

    return (
        <div className='relative w-full h-lvh lg:p-16'>
            <Navigation
                user={user}
                setSignInModalOpen={clipPage.setSignInModalOpen}
                navOpen={clipPage.navOpen}
                setNavOpen={clipPage.setNavOpen}
                handleDeleteClip={clipPage.handleDeleteClip}
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
                className={'z-50'}
            />

            <div className='absolute inset-0 gradient-bg-subtle -z-10' />
            {/* HEADER */}
            <div className='flex h-1/10 justify-between items-center lg:items-start px-4 lg:px-0 z-40'>
                <button className='cursor-pointer'
                    aria-label="Open navigation menu"
                    title="Open navigation menu"
                    onClick={() => clipPage.setNavOpen(true)}
                >
                    {/* Hamburger icon */}
                    <p className='text-text hover:text-violet-500'>
                        <CiMenuBurger className='h-6 w-6 lg:h-8 lg:w-8' />
                    </p>
                </button>
            </div>

            <div className='flex flex-col lg:flex-row w-full z-40 h-9/10'>
                <div className="
                    flex flex-col lg:flex-row font-sans items-center justify-center text-text z-50 space-y-4 w-full
                    lg:px-4 lg:space-x-4 lg:space-y-0 lg:py-4 lg:items-start
                    "
                >
                    <ClipVideoSection
                        clipUrl={clipPage.clipUrl}
                        timestampModalOpen={clipPage.timestampModalOpen}
                        signInModalOpen={clipPage.signInModalOpen}
                        setCurrentTime={clipPage.setCurrentTime}
                        ref={clipPage.playerRef}
                    />
                    <ClipSidebar
                        clipTitle={clipPage.clipTitle}
                        handleChangeClipTitle={clipPage.handleChangeClipTitle}
                        timestamps={clipPage.timestamps}
                        handleToTimestamp={clipPage.handleToTimestamp}
                        clipUrl={clipPage.clipUrl}
                        clearTimestamps={clipPage.clearTimestamps}
                        handleTimestampModal={clipPage.handleTimestampModal}
                        handleSave={clipPage.handleSave}
                        handleDeleteTimestamp={clipPage.handleDeleteTimestamp}
                    />
                    {/** MODALS **/}
                    <ClipNoteModal
                        isOpen={clipPage.timestampModalOpen}
                        currentTime={clipPage.currentTime}
                        onSave={(title: string, note: string) => {
                            clipPage.handleAddTimestamp(title, note);
                        }}
                        onUpdate={(editIndex, title, note) => {
                            clipPage.handleUpdateTimestamp(editIndex, title, note);
                        }}
                        onClose={() => clipPage.setTimestampModalOpen(false)}
                        editIndex={clipPage.editIndex}
                        editData={clipPage.editData}
                    />
                </div>
            </div>
        </div>
    )
}

export default ClipPage
