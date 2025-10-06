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

    // Actions
    fetchClips: () => Promise<void>;
    createClip: (title: string, data: CuratorData) => Promise<{ success: boolean; error?: string, id?: number }>;
    updateClip: (id: number, title: string, data: CuratorData) => Promise<{ success: boolean; error?: string }>;
    deleteClip: (id: number) => Promise<{ success: boolean; error?: string }>;
}

const ClipContext = createContext<ClipContextType | undefined>(undefined);

export const ClipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [clips, setClips] = useState<Clip[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const { user, isAuthenticated } = useAuth();

    // Fetch all clips when user is authenticated
    const fetchClips = useCallback(async () => {
        if (!isAuthenticated) {
            setClips([]);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const result = await clipsAPI.getAll();
            const normalizedClips = result.data.map(normalizeClip)
            setClips(normalizedClips || []);
        } catch (err: any) {
            console.error('Error fetching clips:', err);
            setError(err.message || 'Failed to fetch clips');
            setClips([]);
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated]);

    const createClip = useCallback(async (title: string, data: CuratorData): Promise<{ success: boolean; error?: string, id?: number }> => {
        if (!user) {
            return { success: false, error: 'User not authenticated' };
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
}, [user, clips]) // Keep clips dependency since you're using it

    const deleteClip = useCallback(async (id: number): Promise<{ success: boolean; error?: string }> => {
        if (!user) {
            return { success: false, error: 'User Not Authenticated' }
        }

        setError(null)

        try {
            const response = await clipsAPI.delete(id)
            if (response.data) {
                setClips(prevClips => prevClips.filter(clip => clip.id !== id))
            }
            return { success: true }
        } catch (error: any) {
            console.error('Error deleting clip:', error);
            setError(error.message || 'Failed to delete clip');
            return { success: false, error: error.message || 'Failed to delete clip' }
        }
    }, [user, clips]);

    useEffect(() => {
        if (isAuthenticated && user) {
            fetchClips();
        } else {
            setClips([]);
            setError(null);
        }
    }, [isAuthenticated, user, fetchClips]);

    // Memoize context value
    const contextValue = useMemo(() => ({
        clips,
        isLoading,
        error,
        fetchClips,
        createClip,
        updateClip,
        deleteClip
    }), [clips, isLoading, error, fetchClips, createClip, updateClip, deleteClip]);

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