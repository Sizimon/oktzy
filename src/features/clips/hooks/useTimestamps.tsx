// useTimestamp hook which collects all timestamps in state and provides a function to add more.
import { useCallback, useState } from 'react';
import { Timestamp } from '@/types/types';
import { formatCurrentTime } from '@/utils/formatTime';

export const useTimestamps = () => {
  const [timestamps, setTimestamps] = useState<Timestamp[]>([]);

  const clearTimestamps = useCallback(() => {
    console.log('🔴 clearTimestamps called');
    console.trace('clearTimestamps call stack'); // This shows you WHERE it's called from
    setTimestamps([]);
  }, []);


  const loadTimestamps = useCallback((newTimestamps: Timestamp[]) => {
    console.log('📥 loadTimestamps called with:', newTimestamps);
    if (newTimestamps.length === 0) {
      console.log('🔴 WARNING: Loading empty timestamps array');
      console.trace('Empty loadTimestamps call stack');
    }
    setTimestamps(newTimestamps);
  }, []);

  const addTimestamp = (currentTime: number, title: string, note: string) => {
    const newTimestamp: Timestamp = {
      title: title,
      note: note,
      time: currentTime,
      timeStringConverted: formatCurrentTime(currentTime)
    };

    setTimestamps(prev => {
      const updated = [...prev, newTimestamp];
      return updated;
    });
  };

  return {
    timestamps,
    loadTimestamps,
    addTimestamp,
    clearTimestamps
  };
};