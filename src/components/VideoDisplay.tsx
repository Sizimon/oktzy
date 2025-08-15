import React, {useRef, useCallback, useEffect} from 'react';
import ReactPlayer from 'react-player';

export const VideoDisplay = ({
    clipUrl,
    modalOpen,
    setCurrentTime,
    retainedVolume,
    setRetainedVolume
}: {
    clipUrl: string,
    modalOpen: boolean,
    setCurrentTime: (time: number) => void,
    retainedVolume: number,
    setRetainedVolume: (volume: number) => void
}) => {
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
        <div className="w-full flex justify-center">
            <ReactPlayer src={clipUrl} width="100%" height="500px" playing={!modalOpen} volume={retainedVolume} controls onTimeUpdate={handleProgress} />
        </div>
    );
}