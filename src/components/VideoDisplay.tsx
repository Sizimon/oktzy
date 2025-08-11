import React from 'react';
import ReactPlayer from 'react-player';

export const VideoDisplay = ({ clipUrl, modalOpen }: { clipUrl: string, modalOpen: boolean }) => {
    return (
        <div className="w-full flex justify-center">
            <ReactPlayer src={clipUrl} width="66%" height="500px" playing={!modalOpen} controls />
        </div>
    );
}