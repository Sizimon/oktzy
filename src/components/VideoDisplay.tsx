import React from 'react';
import ReactPlayer from 'react-player';

export const VideoDisplay = ({ clipUrl }: { clipUrl: string }) => {
    return (
        <div className="video-display">
            <ReactPlayer src={clipUrl} controls className="w-full max-w-2xl" />
        </div>
    );
}