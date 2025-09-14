import React, { forwardRef } from 'react';
import { ClipDisplayProps } from '@/types/types';
import ReactPlayer from 'react-player';
import { useVideoState } from '@/features/clips/hooks/useVideoState';

export const ClipDisplay = forwardRef<any, ClipDisplayProps>(({
    clipUrl,
    timestampModalOpen,
    signInModalOpen,
    setCurrentTime,
}, ref) => {

    // Use the custom hook to manage video state
    const {
        userVolume,
        handleProgress,
        handleVolumeChange,
        handlePlay,
        handlePause,
        shouldPlay,
    } = useVideoState({ // Pass necessary props to the hook
        timestampModalOpen,
        signInModalOpen,
        setCurrentTime,
    });

    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="w-full h-full aspect-video max-h-[80lvh]">
                <ReactPlayer
                    ref={ref}
                    src={clipUrl} // (as you prefer)
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
        </div>
    );
});