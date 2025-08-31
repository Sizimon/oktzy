import React, {useRef, useCallback, useEffect, forwardRef} from 'react';
import { VideoDisplayProps } from '@/types/types';
import ReactPlayer from 'react-player';

export const VideoDisplay = forwardRef<any, VideoDisplayProps>(({
    clipUrl,
    modalOpen,
    setCurrentTime,
    retainedVolume,
    setRetainedVolume,
}, ref) => {
    const currentTimeRef = useRef<number>(0);
    const currentVolumeRef = useRef<number>(1);

    const handleProgress = useCallback((progress: any) => {
        currentVolumeRef.current = progress.srcElement ? progress.srcElement.volume : 1;
        currentTimeRef.current = progress.srcElement ? progress.srcElement.currentTime : 0;
        console.log('Current Time:', currentTimeRef.current);
    }, []);

    useEffect(() => {
        if (modalOpen) {
            setCurrentTime(currentTimeRef.current);
            setRetainedVolume(currentVolumeRef.current);
        }
    }, [modalOpen, setCurrentTime, setRetainedVolume]);

    return (
        <div className="w-full flex justify-center h-[33lvh] md:h-[70lvh]">
            <ReactPlayer src={clipUrl} width="100%" height="100%" playing={!modalOpen} volume={retainedVolume} controls onTimeUpdate={handleProgress} />
        </div>
    );
});