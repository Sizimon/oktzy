import React from 'react';
import ReactPlayer from 'react-player';

export const VideoDisplay = ({
    clipUrl,
    modalOpen,
    setCurrentTime
}: {
    clipUrl: string,
    modalOpen: boolean,
    setCurrentTime: (time: number) => void
}) => {
    const handleProgress = (progress: any) => {
        console.log('Progress object:', progress);
        setCurrentTime(progress.srcElement ? progress.srcElement.currentTime : 0);
    }

    return (
        <div className="w-full flex justify-center">
            <ReactPlayer src={clipUrl} width="66%" height="500px" playing={!modalOpen} controls onTimeUpdate={handleProgress} />
        </div>
    );
}