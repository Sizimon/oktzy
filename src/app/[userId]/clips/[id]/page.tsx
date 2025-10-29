'use client';

import { useParams, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/features/auth/context/authProvider';
import { useClip } from '@/features/clips/context/clipProvider';

import { ClipLoader } from 'react-spinners';
import { Bounce, toast, ToastContainer } from 'react-toastify';

// Components
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

    const hasShownToast = useRef<boolean>(false);
    const searchParams = useSearchParams();

    useEffect(() => {
        if (hasShownToast.current) return; // Prevent multiple executions
        const loginSuccess = searchParams.get('loginSuccess');
        const registerSuccess = searchParams.get('registerSuccess');

        console.log('🔍 loginSuccess:', loginSuccess);
        console.log('🔍 registerSuccess:', registerSuccess);

        if (loginSuccess === 'true') {
            console.log('🎉 Showing login success toast');
            hasShownToast.current = true;
            setTimeout(() => {
                toast.success('Welcome back! Your clip has been saved 👋');
            }, 200);

            // Clean up after showing toast
            setTimeout(() => {
                const url = new URL(window.location.href);
                url.searchParams.delete('loginSuccess');
                url.searchParams.delete('registerSuccess');
                window.history.replaceState({}, '', url.toString());
            }, 2500);
        } else if (registerSuccess === 'true') {
            console.log('🎉 Showing register success toast');
            hasShownToast.current = true;
            setTimeout(() => {
                toast.success('Welcome to Oktzy! Your clip has been saved 🎉');
            }, 200);

            setTimeout(() => {
                const url = new URL(window.location.href);
                url.searchParams.delete('loginSuccess');
                url.searchParams.delete('registerSuccess');
                window.history.replaceState({}, '', url.toString());
            }, 2500);
        }
    }, [searchParams]);

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
        <div className='relative flex items-center w-full h-lvh lg:p-8'>
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
            <div className='flex flex-col lg:flex-row w-full z-10 h-9/10'>
                <div className="
                    flex flex-col lg:flex-row font-sans items-center justify-center text-text z-20 gap-4 w-full
                    lg:px-4 lg:py-4 lg:items-start
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
                        revertChanges={clipPage.revertChanges}
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
