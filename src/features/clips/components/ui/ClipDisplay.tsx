import React, { useRef, useCallback, useEffect, forwardRef, useState } from 'react';
import { ClipDisplayProps } from '@/types/types';
import ReactPlayer from 'react-player';

export const ClipDisplay = forwardRef<any, ClipDisplayProps>(({
    clipUrl,
    timestampModalOpen,
    signInModalOpen,
    setCurrentTime,
}, ref) => {
    const currentTimeRef = useRef<number>(0);

    // Track the actual user-controlled video state
    const [retainedVolume, setRetainedVolume] = useState(1);
    const [userVolume, setUserVolume] = useState<number>(retainedVolume);
    const [isUserPaused, setIsUserPaused] = useState<boolean>(false);
    const [wasPlayingBeforeModal, setWasPlayingBeforeModal] = useState<boolean>(false);

    const handleProgress = useCallback((progress: any) => {
        currentTimeRef.current = progress.srcElement ? progress.srcElement.currentTime : 0;
    }, []);

    // Handle when user manually changes volume
    const handleVolumeChange = useCallback((event: React.SyntheticEvent<HTMLVideoElement>) => {
        const target = event.target as HTMLVideoElement;
        const volume = target.volume;
        setUserVolume(volume);
        setRetainedVolume(volume);
    }, [setRetainedVolume]);

    // Handle when user manually plays/pauses
    const handlePlay = useCallback(() => {
        setIsUserPaused(false);
    }, []);

    const handlePause = useCallback(() => {
        setIsUserPaused(true);
    }, []);

    // Handle modal open/close behavior
    useEffect(() => {
        if (timestampModalOpen || signInModalOpen) {
            // Store current time for timestamp modal
            setCurrentTime(currentTimeRef.current);

            // Remember if video was playing before modal opened
            setWasPlayingBeforeModal(!isUserPaused);
        }
    }, [timestampModalOpen, signInModalOpen, setCurrentTime, isUserPaused]);

    // Determine if video should be playing
    const shouldPlay = !isUserPaused && !timestampModalOpen && !signInModalOpen;

    // Update retained volume only when user changes it
    useEffect(() => {
        setUserVolume(retainedVolume);
    }, [retainedVolume]);

    return (
        <div className="w-full flex justify-center h-[33lvh] md:h-[40lvh] lg:h-[70lvh]">
            <ReactPlayer
                ref={ref}
                src={clipUrl}
                width="100%"
                height="100%"
                playing={shouldPlay}
                volume={userVolume}
                controls
                onProgress={handleProgress}
                onVolumeChange={handleVolumeChange}
                onPlay={handlePlay}
                onPause={handlePause}
            />
        </div>
    );
});