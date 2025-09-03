import { useState } from 'react';
import { toast } from 'react-toastify';
import { useTimestamps } from './useTimestamps';
import { useVideoState } from './useVideoState';
import { useCuratorData } from './useCuratorData';
import { useAuth } from '@/features/auth/context/authProvider';
import { useClip } from '../context/clipProvider';
import { CuratorData } from '@/types/types';

export function useClipPageController(playerRef: React.RefObject<any>) {
  const [timestampModalOpen, setTimestampModalOpen] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [signInModalOpen, setSignInModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    clipUrl,
    currentTime,
    retainedVolume,
    setCurrentTime,
    setRetainedVolume,
    handleInputChange
  } = useVideoState();

  const {
    timestamps,
    addTimestamp,
    clearTimestamps
  } = useTimestamps();

  const { curatorData, generateCuratorData } = useCuratorData();

  const { user, isAuthenticated } = useAuth();
  const { createClip } = useClip();

  const handleAddTimestamp = () => {
    if (!clipUrl) {
      toast.warning('Please provide a video URL before adding a timestamp.');
      return;
    }
    setTimestampModalOpen(true);
  };

  const handleSaveTimestamp = (title: string, note: string) => {
    if (!title || !note) {
      toast.error('Please provide both a title and a note for the timestamp.');
      return;
    }
    addTimestamp(currentTime, title, note);
    setTimestampModalOpen(false);
  };

  const handleToTimestamp = (time: number) => {
    if (playerRef.current) {
      playerRef.current.currentTime = time;
    }
  };

  const handleSaveModal = () => {
    if (!clipUrl) {
      toast.error('No clip URL/timestamp data provided');
      return;
    }
    generateCuratorData(clipUrl, timestamps);
    setSaveModalOpen(true);
  };

  const handleSave = async (title: string, dataToSave: CuratorData) => {
    if (!curatorData) {
      toast.error('No curator data to save');
      return;
    }
    if (!isAuthenticated) {
      toast.error('You must be logged in to save clips');
      setSignInModalOpen(true);
      return;
    }
    setIsSaving(true);
    try {
      const response = await createClip(title, dataToSave);
      if (response.success) {
        toast.success('Clip saved successfully');
      } else if (response.error) {
        toast.error(response.error || 'Failed to save clip');
      }
    } catch (error) {
      console.error('Error saving clip:', error);
      toast.error('Network error - please try again');
    } finally {
      setIsSaving(false);
    }
  };

  return {
    // State
    clipUrl,
    currentTime,
    retainedVolume,
    timestamps,
    curatorData,
    user,
    isAuthenticated,
    isSaving,
    timestampModalOpen,
    saveModalOpen,
    signInModalOpen,

    // Handlers
    handleInputChange,
    handleAddTimestamp,
    handleSaveTimestamp,
    handleToTimestamp,
    handleSaveModal,
    handleSave,
    setTimestampModalOpen,
    setSaveModalOpen,
    setSignInModalOpen,
    setRetainedVolume,
    setCurrentTime,
    clearTimestamps,
  };
}