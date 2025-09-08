import { useState, useRef, useEffect } from 'react';
import { useTimestamps } from './useTimestamps';
import { Clip, CuratorData } from '@/types/types'
import { toast } from 'react-toastify'
import { useAuth } from '@/features/auth/context/authProvider';
import { useClip } from '@/features/clips/context/clipProvider';
import { useRouter } from 'next/navigation';

export function useClipPageState(initialClip?: Clip) {
  const router = useRouter();
  const [clipTitle, setClipTitle] = useState(initialClip?.title || '');

  // Video States
  const [clipUrl, setClipUrl] = useState(initialClip?.clipUrl || '');
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

  // Auth
  const { isAuthenticated } = useAuth()
  const { createClip, updateClip } = useClip()

  // Sync state whenever initialClip changes.
  useEffect(() => {
    if (initialClip) {
      setClipTitle(initialClip.title || ''); // Use || consistently
      setClipUrl(initialClip.clipUrl || ''); // Use || consistently
      loadTimestamps(initialClip.timestamps || []);
    }
  }, [initialClip, loadTimestamps]);

  // Handlers (copy from your main page)
  const handleTimestampModal = () => {
    if (!clipUrl) {
      toast.error('Please enter a valid clip URL before adding timestamps');
      return;
    };
    setTimestampModalOpen(true);
  };

  const handleAddTimestamp = (title: string, note: string) => {
    if (!title || !note) {
      toast.error('Please provide both a title and a note for the timestamp');
      return;
    };
    addTimestamp(currentTime, title, note);
    setTimestampModalOpen(false);
  };

  const handleToTimestamp = (time: number) => {
    if (playerRef.current) {
      playerRef.current.currentTime = time;
    }
  };

  // Handler which saves the clip data to the database
  const handleSave = async (title: string) => {
    if (!title) {
      toast.error('Please provide a title for the clip before saving');
      return;
    }

    if (!clipUrl && !timestamps.length) {
      toast.error('Cannot save an empty clip. Please add a clip URL and at least one timestamp.');
      return;
    }

    const clipData = {
      clipUrl: clipUrl,
      timestamps: timestamps
    }

    if (!initialClip && !clipData) {
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
        const response = await createClip(title, clipData as CuratorData);
        if (response.success) {
          toast.success('Clip saved successfully');
          router.push(`/clips/${response.id}`);
        } else if (response.error) {
          toast.error(response.error || 'Failed to save clip');
        }
      } else {
        const response = await updateClip(Number(initialClip.id), title, clipData as CuratorData);
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
    clipTitle, setClipTitle,
    clipUrl, setClipUrl,
    currentTime, setCurrentTime,
    retainedVolume, setRetainedVolume,
    timestampModalOpen, setTimestampModalOpen,
    saveModalOpen, setSaveModalOpen,
    signInModalOpen, setSignInModalOpen,
    isSaving, setIsSaving,
    playerRef,
    timestamps, addTimestamp, clearTimestamps, loadTimestamps,
    handleTimestampModal,
    handleAddTimestamp,
    handleToTimestamp,
    handleSave
  };
}