import { useState, useRef, useEffect } from 'react';
import { useTimestamps } from './useTimestamps';
import { useCuratorData } from './useCuratorData';
import { Clip, CuratorData } from '@/types/types'
import { toast } from 'react-toastify'
import { useAuth } from '@/features/auth/context/authProvider';
import { useClip } from '@/features/clips/context/clipProvider'

export function useClipPageState(initialClip?: Clip) {
  // Video States
  const [clipUrl, setClipUrl] = useState(initialClip?.clipUrl ?? '');
  const [currentTime, setCurrentTime] = useState(0);
  const [retainedVolume, setRetainedVolume] = useState(1);

  // Modal States
  const [timestampModalOpen, setTimestampModalOpen] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [signInModalOpen, setSignInModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const playerRef = useRef<any>(null);

  // Timestamps
  const { timestamps, addTimestamp, clearTimestamps, loadTimestamps } = useTimestamps();

  // Curator Data
  const { curatorData, generateCuratorData } = useCuratorData();

  // Auth
  const { isAuthenticated } = useAuth()
  const { createClip, updateClip } = useClip()

  // Sync state whenever initialClip changes.
  useEffect(() => {
    if (initialClip?.timestamps) {
      console.log(initialClip.clipUrl)
      setClipUrl(initialClip.clipUrl ?? '')
      loadTimestamps(initialClip.timestamps);
    }
  }, [initialClip, loadTimestamps]);

  // Handlers (copy from your main page)
  const handleTimestampModal = () => {
    if (!clipUrl) return;
    setTimestampModalOpen(true);
  };

  const handleAddTimestamp = (title: string, note: string) => {
    if (!title || !note) return;
    addTimestamp(currentTime, title, note);
    setTimestampModalOpen(false);
  };

  const handleToTimestamp = (time: number) => {
    if (playerRef.current) {
      playerRef.current.currentTime = time;
    }
  };

  const handleSaveModal = () => {
    if (!clipUrl) return;
    generateCuratorData(clipUrl, timestamps);
    setSaveModalOpen(true);
  };

  // Handler which saves the clip data to the database
  const handleSave = async (title: string, dataToSave: CuratorData) => {
    if (!initialClip && !curatorData) {
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
      if (!initialClip) {
        const response = await createClip(title, dataToSave);
        if (response.success) {
          toast.success('Clip saved successfully');
        } else if (response.error) {
          toast.error(response.error || 'Failed to save clip');
        }
      } else {
        const response = await updateClip(Number(initialClip.id), title, dataToSave);
        if (response.success) {
          toast.success('Clip updated successfully');
        } else if (response.error) {
          toast.error(response.error || 'Failed to update clip');
        }
      }
    } catch (error) {
      console.error('Error saving clip:', error);
      toast.error('Network error - please try again');
    } finally {
      setIsSaving(false);
      setSaveModalOpen(false);
    }
  }

  return {
    clipUrl, setClipUrl,
    currentTime, setCurrentTime,
    retainedVolume, setRetainedVolume,
    timestampModalOpen, setTimestampModalOpen,
    saveModalOpen, setSaveModalOpen,
    signInModalOpen, setSignInModalOpen,
    isSaving, setIsSaving,
    playerRef,
    timestamps, addTimestamp, clearTimestamps, loadTimestamps,
    curatorData, generateCuratorData,
    handleTimestampModal,
    handleAddTimestamp,
    handleToTimestamp,
    handleSaveModal,
    handleSave
  };
}