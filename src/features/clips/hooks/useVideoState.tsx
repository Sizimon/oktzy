import React, { useRef, useCallback, useEffect, forwardRef, useState } from 'react';

export function useVideoState({
    timestampModalOpen,
    signInModalOpen,
    setCurrentTime,
}: {
    timestampModalOpen: boolean;
    signInModalOpen: boolean;
    setCurrentTime: (time: number) => void;
}) {
    const currentTimeRef = useRef<number>(0);

    // Track the actual user-controlled video state
    const [userVolume, setUserVolume] = useState<number>(1);
    const [isUserPaused, setIsUserPaused] = useState<boolean>(false);
    const [wasPlayingBeforeModal, setWasPlayingBeforeModal] = useState<boolean>(false);

    // 🟢 HANDLES VIDEO PLAYBACK PROGRESS 🟢
    const handleProgress = useCallback((progress: any) => {
        currentTimeRef.current = progress.srcElement ? progress.srcElement.currentTime : 0;
    }, []);

    // 🟢 HANDLES VOLUME CHANGES 🟢
    const handleVolumeChange = useCallback((event: React.SyntheticEvent<HTMLVideoElement>) => {
        const target = event.target as HTMLVideoElement;
        const volume = target.volume;
        setUserVolume(volume);
    }, []);

    // 🟢 HANDLES PLAY/PAUSE BUTTONS 🟢
    const handlePlay = useCallback(() => {
        setIsUserPaused(false);
    }, []);

    const handlePause = useCallback(() => {
        setIsUserPaused(true);
    }, []);

    // 🟢 MODAL OPEN EFFECT 🟢
    useEffect(() => {
        const isModalOpen = timestampModalOpen || signInModalOpen;

        if (isModalOpen) {
            setCurrentTime(currentTimeRef.current);
            // Only save the state if we haven't already saved it
            setWasPlayingBeforeModal(prev => prev !== false ? prev : !isUserPaused);
        }
    }, [timestampModalOpen, signInModalOpen, setCurrentTime, isUserPaused]);

     // 🟢 MODAL CLOSE EFFECT 🟢
    useEffect(() => {
        const isModalOpen = timestampModalOpen || signInModalOpen;

        if (!isModalOpen && wasPlayingBeforeModal) {

            setIsUserPaused(false);
            setWasPlayingBeforeModal(false); // Reset the flag
        }
    }, [timestampModalOpen, signInModalOpen, wasPlayingBeforeModal]);

    // Determine if video should be playing
    const shouldPlay = !isUserPaused && !timestampModalOpen && !signInModalOpen;

    return {
        userVolume,
        handleProgress,
        handleVolumeChange,
        handlePlay,
        handlePause,
        shouldPlay,
    }
}
