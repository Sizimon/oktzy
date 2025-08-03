import React from 'react';
import ReactPlayer from 'react-player';

export const VideoDisplay = ({ clipUrl }: { clipUrl: string }) => {
    return (
        <div className="w-full flex justify-center">
            <ReactPlayer src={clipUrl} width="75%" height="500px" controls />
        </div>
    );
}