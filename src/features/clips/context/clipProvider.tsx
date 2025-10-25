import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Clip, CuratorData } from '@/types/types';
import { clipsAPI } from '@/features/clips/api/api';
import { useAuth } from '@/features/auth/context/authProvider';

import { normalizeClip } from '@/utils/normalizeClip';

interface ClipContextType {
    // state
    clips: Clip[];
    isLoading: boolean;
    error: string | null;
    pendingClip: any | null;

    // Actions
    fetchClips: () => Promise<void>;
    createClip: (title: string, data: CuratorData) => Promise<{ success: boolean; error?: string, id?: number }>;
    updateClip: (id: number, title: string, data: CuratorData) => Promise<{ success: boolean; error?: string }>;
    deleteClip: (id: number) => Promise<{ success: boolean; error?: string }>;
    savePendingClip: (title: string, data: CuratorData) => void;
    processPendingClip: () => Promise<{ success: boolean; error?: string, id?: number }>;
    clearPendingClip: () => void;
}

const ClipContext = createContext<ClipContextType | undefined>(undefined);

export const ClipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [clips, setClips] = useState<Clip[]>([]);
    const [pendingClip, setPendingClip] = useState<{ title: string; data: CuratorData } | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    console.log('Pending Clip:', pendingClip);

    const { user, isAuthenticated } = useAuth();

    // Fetch all clips when user is authenticated
    const fetchClips = useCallback(async () => {
        // console.log('🚨 FETCHCLIPS CALLED - Stack trace:');
        // console.trace('Stack trace for fetchClips');
        if (!isAuthenticated) {
            setClips([]);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const result = await clipsAPI.getAll();
            const normalizedClips: Clip[] = result.data.map(normalizeClip)
            const sortedClips = normalizedClips.sort((a, b) => {
                const dateA = new Date(a.updated_at || 0).getTime();
                const dateB = new Date(b.updated_at || 0).getTime();
                return dateB - dateA;
            });
            setClips(sortedClips || []);
        } catch (err: any) {
            console.error('Error fetching clips:', err);
            setError(err.message || 'Failed to fetch clips');
            setClips([]);
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated]);

    const createClip = useCallback(async (title: string, data: CuratorData): Promise<{ success: boolean; error?: string, id?: number }> => {
        if (!user || !isAuthenticated) {
            console.log('📝 User not authenticated, saving clip as pending');
            return { success: false, error: 'Please log in to save this clip. We\'ll save it automatically when you sign in!' };
        }

        setError(null);

        try {
            const response = await clipsAPI.create(title, data);
            if (response.data) {
                // Normalize the clip data
                const normalizedClip = normalizeClip(response.data);
                // Add the new clip to the list
                setClips((prevClips) => [normalizedClip, ...prevClips]);
                return { success: true, id: normalizedClip.id };
            } else {
                return { success: false, error: 'Failed to create clip' };
            }
        } catch (error: any) {
            console.error('Error creating clip:', error);
            setError(error.message || 'Failed to create clip');
            return { success: false, error: error.message || 'Failed to create clip' };
        }
    }, [user]);

    const savePendingClip = useCallback((title: string, data: CuratorData) => {
        console.log('📝 Saving clip as pending');
        setPendingClip({
            title,
            data,
        });
    }, []);

    const processPendingClip = useCallback(async () => {
        if (pendingClip && user) {
            console.log('📝 Processing pending clip after authentication');
            try {
                const result = await createClip(pendingClip.title, pendingClip.data);
                if (result.success) {
                    console.log('✅ Pending clip saved successfully after login');
                    setPendingClip(null);
                    return { success: true, id: result.id };
                } else {
                    console.error('❌ Failed to save pending clip after login:', result.error);
                    return { success: false, error: result.error };
                }
            } catch (error) {
                console.error('❌ Error processing pending clip:', error);
                return { success: false, error: 'Failed to process pending clip' };
            }
        }
        return { success: false, error: 'No pending clip or user' };
    }, [createClip, user, pendingClip]);

    const clearPendingClip = useCallback(() => {
        setPendingClip(null);
    }, []);

    const updateClip = useCallback(async (id: number, title: string, data: CuratorData): Promise<{ success: boolean; error?: string }> => {
        if (!user) {
            return { success: false, error: 'User Not Authenticated' }
        }

        setError(null)

        try {
            const response = await clipsAPI.update(id, title, data)

            if (response.data) {
                const normalizedClip = normalizeClip(response.data)

                setClips(prevClips => {
                    const filteredClips = prevClips.filter(clip => Number(id) !== Number(clip.id))
                    const newClips = [normalizedClip, ...filteredClips];
                    return newClips;
                })
            }
            return { success: true }
        } catch (error: any) {
            console.error('Error updating clip:', error);
            setError(error.message || 'Failed to update clip');
            return { success: false, error: error.message || 'Failed to update clip' }
        }
    }, [user]);

    const deleteClip = useCallback(async (id: number): Promise<{ success: boolean; error?: string }> => {
        if (!user) {
            return { success: false, error: 'User Not Authenticated' }
        }

        setError(null)

        // console.log('🗑️ DELETING CLIP:', id);
        // console.log('📊 Clips before delete:', clips.map(c => ({ id: c.id, title: c.title })));
        try {
            const response = await clipsAPI.delete(id)
            if (response.data) {
                // console.log('✅ Delete API successful, updating context');
                setClips(prevClips => {
                    const filtered = prevClips.filter(clip => clip.id !== id);
                    // console.log('🔄 New clips after filter:', filtered.map(c => ({ id: c.id, title: c.title })));
                    return filtered;
                });
            }
            return { success: true };
        } catch (error: any) {
            console.error('Error deleting clip:', error);
            setError(error.message || 'Failed to delete clip');
            return { success: false, error: error.message || 'Failed to delete clip' }
        }
    }, [user]);

    useEffect(() => {
        if (isAuthenticated && user) {
            fetchClips();

            if (pendingClip) {
                processPendingClip();
            }

        } else {
            setClips([]);
            setError(null);
        }
    }, [isAuthenticated, user, processPendingClip, pendingClip]);

    // Memoize context value
    const contextValue = useMemo(() => ({
        clips,
        isLoading,
        error,
        pendingClip,
        fetchClips,
        createClip,
        updateClip,
        deleteClip,
        savePendingClip,
        processPendingClip,
        clearPendingClip
    }), [clips, isLoading, error, pendingClip, fetchClips, createClip, updateClip, deleteClip, savePendingClip, processPendingClip, clearPendingClip]);

    return (
        <ClipContext.Provider value={contextValue}>
            {children}
        </ClipContext.Provider>
    );
};

export const useClip = () => {
    const context = useContext(ClipContext);
    if (!context) {
        throw new Error('useClip must be used within a ClipProvider');
    }
    return context;
};