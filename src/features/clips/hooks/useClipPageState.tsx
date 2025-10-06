import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useTimestamps } from './useTimestamps';
import { Clip, CuratorData } from '@/types/types'
import { toast } from 'react-toastify'
import { useAuth } from '@/features/auth/context/authProvider';
import { useClip } from '@/features/clips/context/clipProvider';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

export function useClipPageState(clipId?: number) {
  const router = useRouter();
  const pathname = usePathname();
  const [currentClip, setCurrentClip] = useState<Clip | null>(null);
  const [clipTitle, setClipTitle] = useState('');

  // Video States
  const [clipUrl, setClipUrl] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const [retainedVolume, setRetainedVolume] = useState(1);

  // Modal States
  const [timestampModalOpen, setTimestampModalOpen] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [signInModalOpen, setSignInModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const playerRef = useRef<any>(null);

  // Timestamps
  const { timestamps, setTimestamps, addTimestamp, editTimestamp, deleteTimestamp, clearTimestamps, loadTimestamps, editIndex, setEditIndex, editData, setEditData } = useTimestamps();

  // Auth states
  const { user, isAuthenticated, isLoading: authLoading, setHasUnsavedChanges } = useAuth()

  // Clip states
  const { createClip, updateClip, deleteClip, clips, isLoading: clipsLoading } = useClip()

  const [hasLoadedClipData, setHasLoadedClipData] = useState(false);

  // Memoize the current clip to prevent unnecessary lookups
  const foundClip = useMemo(() => {
    if (!clipId || !clips.length) return null;
    return clips.find(clip => Number(clip.id) === clipId) || null;
  }, [clipId, clips.length]);

  // Change Tracker
  useEffect(() => {
    if (!currentClip) {
      setHasUnsavedChanges(!!(clipUrl || timestamps.length > 0 || clipTitle));
      return;
    }
    // Compare current state with the loaded clip data
    const titleChanged = clipTitle !== (currentClip.title || '');
    const timestampsChanged = JSON.stringify(timestamps) !== JSON.stringify(currentClip.timestamps || []);
    setHasUnsavedChanges(titleChanged || timestampsChanged);
  }, [clipUrl, timestamps, clipTitle, currentClip]);

  // Revert changes 
  const revertChanges = useCallback(() => {
    if (currentClip) {
      setClipTitle(currentClip.title || '');
      setTimestamps(currentClip.timestamps || []);

      // Reset unsaved changes flag
      setHasUnsavedChanges(false);
      toast.info('Changes reverted to last save.');
    } else {
      toast.error('No saved clip to revert to.');
    }
  }, [currentClip, setHasUnsavedChanges]);

  // Single effect to handle all clip loading logic
  useEffect(() => {
    // Early return if still loading
    if (authLoading || clipsLoading) {
      console.log('⏳ Still loading auth or clips, skipping...');
      return;
    }

    // Early return if not authenticated (after auth has loaded)
    if (!authLoading && !isAuthenticated) {
      console.log('🔴 Not authenticated (after loading), clearing...');
      setCurrentClip(null);
      setHasLoadedClipData(false);
      return;
    }

    // Early return if no clipId
    if (!clipId) {
      console.log('🔴 No clipId provided');
      setCurrentClip(null);
      setHasLoadedClipData(false);
      return;
    }

    // Early return if clips haven't loaded yet
    if (!clipsLoading && clips.length === 0) {
      console.log('📭 No clips available yet');
      return;
    }

    if (!foundClip) {
      console.log('🔴 Clip not found in loaded clips');
      setCurrentClip(null);
      setHasLoadedClipData(false);
      return;
    }

    // Only load if we haven't loaded this clip's data yet
    if (!hasLoadedClipData || !currentClip || currentClip.id !== foundClip.id) {
      console.log('✅ Loading clip data for:', foundClip.id);
      console.log('Found clip timestamps:', foundClip.timestamps);
      setCurrentClip(foundClip);
      setClipTitle(foundClip.title || '');
      setClipUrl(foundClip.clipUrl || '');

      console.log('About to load timestamps:', foundClip.timestamps);
      // To this:
      if (foundClip.timestamps && foundClip.timestamps.length > 0) {
        loadTimestamps(foundClip.timestamps);
      } else {
        console.log('⚠️ Not loading empty timestamps array');
      }
      setHasLoadedClipData(true);
    } else {
      console.log('⏭️ Skipping load - already loaded');
    }
  }, [
    clipId,
    isAuthenticated,
    authLoading,
    clipsLoading,
    foundClip,
    hasLoadedClipData,
    currentClip,
    loadTimestamps,
    clips.length
  ]);

  // Handlers (copy from your main page)
  const handleTimestampModal = (index?: number) => {
    if (!clipUrl) {
      toast.error('Please enter a valid clip URL before adding timestamps');
      return;
    };

    if (typeof index === 'number' && timestamps[index]) {
      setEditIndex(index);
      setEditData(timestamps[index]);
    } else {
      setEditIndex(null);
      setEditData(null);
    }
    setTimestampModalOpen(true);
  };

  const handleChangeClipTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (clipUrl.length > 0) {
      setClipTitle?.(e.target.value);
    } else {
      toast.error('Please enter a valid clip URL before setting a title');
    }
  }

  const handleAddTimestamp = (title: string, note: string) => {
    if (!title || !note) {
      toast.error('Please provide both a title and a note for the timestamp');
      return;
    };
    addTimestamp(currentTime, title, note);
    setTimestampModalOpen(false);
    toast.success('Timestamp added');
  };

  const handleUpdateTimestamp = (editIndex: number | null, title: string, note: string) => {
    editTimestamp(editIndex as number, title, note);
    setTimestampModalOpen(false);
    setEditIndex(null);
    setEditData(null);
    toast.success('Timestamp updated');
  }

  const handleDeleteTimestamp = async (index: number) => {
    toast.warning(
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div>
          <p>Confirm deletion of timestamp?</p><br />
          <p className='italic'>If deleted by mistake you can restore by not saving the changes.</p>
        </div>
        <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
          <button
            onClick={() => {
              toast.dismiss();
              deleteTimestamp(index);
            }}
            style={{ padding: '4px 12px', background: '#fbbf24', border: 'none', borderRadius: '4px', color: '#222' }}
          >
            Confirm
          </button>
          <button
            onClick={() => toast.dismiss()}
            style={{ padding: '4px 12px', background: '#64748b', border: 'none', borderRadius: '4px', color: '#fff' }}
          >
            Cancel
          </button>
        </div>
      </div>
    )
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

    if (!currentClip && !clipData) {
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
      if (!currentClip) {
        const response = await createClip(title, clipData as CuratorData);
        if (response.success) {
          toast.success('Clip saved successfully');
          setTimeout(() => {
            router.push(`/${user?.id}/clips/${response.id}`);
          }, 1000);
        } else if (response.error) {
          toast.error(response.error || 'Failed to save clip');
        }
      } else {
        const response = await updateClip(Number(currentClip.id), title, clipData as CuratorData);
        console.log('Update response:', response);
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

  const confirmAndDeleteClip = async (id: number) => {
    toast.warning(
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div>
          <p>Confirm deletion of clip?</p><br />
          <p className='italic'>This action is PERMANENT and cannot be undone.</p>
        </div>
        <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
          <button
            onClick={async () => {
              toast.dismiss();
              await handleDeleteClip(id);
            }}
            style={{ padding: '4px 12px', background: '#fbbf24', border: 'none', borderRadius: '4px', color: '#222' }}
          >
            DELETE
          </button>
          <button
            onClick={() => toast.dismiss()}
            style={{ padding: '4px 12px', background: '#64748b', border: 'none', borderRadius: '4px', color: '#fff' }}
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  const handleDeleteClip = async (id: number) => {
    if (id === undefined) {
      toast.error('No clip selected for deletion');
      return;
    }
    if (!isAuthenticated) {
      toast.error('You must be logged in to delete clips');
      setSignInModalOpen(true);
      return;
    }

    try {
      const response = await deleteClip(id);
      if (response.success) {
        toast.success('Clip deleted successfully');

        if (pathname === `/${user?.id}/clips/${id}`) {
        router.push(`/${user?.id}`);
        }
      } else if (response.error) {
        toast.error(response.error || 'Failed to delete clip');
      }
    } catch (error) {
      console.error('Error deleting clip:', error);
      toast.error('Network error - please try again');
    }
  }

  return {
    // navOpen, setNavOpen,
    currentClip, setCurrentClip,
    clipTitle, setClipTitle,
    clipUrl, setClipUrl,
    currentTime, setCurrentTime,
    retainedVolume, setRetainedVolume,
    timestampModalOpen, setTimestampModalOpen,
    saveModalOpen, setSaveModalOpen,
    signInModalOpen, setSignInModalOpen,
    isSaving, setIsSaving,
    playerRef,
    timestamps, addTimestamp, clearTimestamps, loadTimestamps, editData, editIndex,
    revertChanges,
    handleTimestampModal,
    handleAddTimestamp,
    handleUpdateTimestamp,
    handleDeleteTimestamp,
    handleToTimestamp,
    handleSave,
    handleChangeClipTitle,
    confirmAndDeleteClip,
  };
}