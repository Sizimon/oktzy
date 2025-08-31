// useTimestamp hook which collects all timestamps in state and provides a function to add more.
import { useState } from 'react';
import { Timestamp } from '@/types/types';
import { formatCurrentTime } from '@/utils/formatTime';

export const useTimestamps = () => {
  const [timestamps, setTimestamps] = useState<Timestamp[]>([]);

  const clearTimestamps = () => {
    setTimestamps([]);
  }

  const addTimestamp = (currentTime: number, title: string, note: string) => {
    const newTimestamp: Timestamp = {
      title: title,
      note: note,
      time: currentTime,
      timeStringConverted: formatCurrentTime(currentTime)
    };
    
    setTimestamps(prev => [...prev, newTimestamp]);
  };

  return {
    timestamps,
    addTimestamp,
    clearTimestamps
  };
};