import React, {useRef, useCallback, useEffect, forwardRef} from 'react';
import { ClipDisplayProps } from '@/types/types';
import ReactPlayer from 'react-player';

export const ClipDisplay = forwardRef<any, ClipDisplayProps>(({
    clipUrl,
    timestampModalOpen,
    signInModalOpen,
    setCurrentTime,
    retainedVolume,
    setRetainedVolume,
}, ref) => {
    const currentTimeRef = useRef<number>(0);
    const currentVolumeRef = useRef<number>(1);
    console.log(signInModalOpen)

    const handleProgress = useCallback((progress: any) => {
        currentVolumeRef.current = progress.srcElement ? progress.srcElement.volume : 1;
        currentTimeRef.current = progress.srcElement ? progress.srcElement.currentTime : 0;
    }, []);

    useEffect(() => {
        if (timestampModalOpen || signInModalOpen) {
            setCurrentTime(currentTimeRef.current);
            setRetainedVolume(currentVolumeRef.current);
        }
    }, [timestampModalOpen, signInModalOpen, setCurrentTime, setRetainedVolume]);

    return (
        <div className="w-full flex justify-center h-[33lvh] md:h-[40lvh] lg:h-[70lvh]">
            <ReactPlayer ref={ref} src={clipUrl} width="100%" height="100%" playing={!timestampModalOpen && !signInModalOpen} volume={retainedVolume} controls onTimeUpdate={handleProgress} />
        </div>
    );
});