// useTimestamp hook which collects all timestamps in state and provides a function to add more.
import { useCallback, useState } from 'react';
import { Timestamp } from '@/types/types';
import { formatCurrentTime } from '@/utils/formatTime';

export const useTimestamps = () => {
  const [timestamps, setTimestamps] = useState<Timestamp[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editData, setEditData] = useState<{ title: string; note: string; time: number; timeStringConverted: string } | null>(null);

  const clearTimestamps = useCallback(() => {
    console.log('🔴 clearTimestamps called');
    console.trace('clearTimestamps call stack');
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

  const editTimestamp = (index: number, title: string, note: string) => {
    if (index < 0 || index >= timestamps.length) {
      console.error('🔴 Invalid index for editing timestamp:', index);
      return;
    }
    const updatedTimestamp = { ...timestamps[index], title, note };
    const updatedTimestamps = [...timestamps];
    updatedTimestamps[index] = updatedTimestamp;
    setTimestamps(updatedTimestamps);
  }

  const deleteTimestamp = (index: number) => {
    if (index < 0 || index >= timestamps.length) {
      console.error('🔴 Invalid index for deleting timestamp:', index);
      return;
    }
    const updatedTimestamps = [...timestamps];
    updatedTimestamps.splice(index, 1);
    setTimestamps(updatedTimestamps);
  };

  return {
    timestamps,
    editIndex, setEditIndex,
    editData, setEditData,
    loadTimestamps,
    addTimestamp,
    editTimestamp,
    deleteTimestamp,
    clearTimestamps
  };
};