import React, { createContext, useContext, useState, useEffect } from 'react';
import { Clip, CuratorData } from '@/types/types';
import { clipsAPI } from '@/features/clips/api/api';
import { useAuth } from '@/features/auth/context/authProvider';

interface ClipContextType {
    // state
    clips: Clip[];
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchClips: () => Promise<void>;
    createClip: (title: string, data: CuratorData) => Promise<{ success: boolean; error?: string }>;
}

const ClipContext = createContext<ClipContextType | undefined>(undefined);

export const ClipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [clips, setClips] = useState<Clip[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const { user, isAuthenticated } = useAuth();

    // Fetch all clips when user is authenticated
    const fetchClips = async () => {
        if (!isAuthenticated) {
            setClips([]);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const result = await clipsAPI.getAll();
            setClips(result.data || []);
        } catch (err: any) {
            console.error('Error fetching clips:', err);
            setError(err.message || 'Failed to fetch clips');
            setClips([]);
        } finally {
            setIsLoading(false);
        }
    };

    const createClip = async (title: string, data: CuratorData): Promise<{ success: boolean; error?: string }> => {
        if (!user) {
            return { success: false, error: 'User not authenticated' };
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await clipsAPI.create(title, data);
            if (response.status === 201) {
                // Add the new clip to the list
                setClips((prevClips) => [...prevClips, response.data]);
                return { success: true };
            } else {
                return { success: false, error: 'Failed to create clip' };
            }
        } catch (error: any) {
            console.error('Error creating clip:', error);
            setError(error.message || 'Failed to create clip');
            return { success: false, error: error.message || 'Failed to create clip' };
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated && user) {
            fetchClips();
        } else {
            setClips([]);
            setError(null);
        }
    }, [isAuthenticated, user]);

    const values: ClipContextType = {
        clips,
        isLoading,
        error,
        fetchClips,
        createClip
    }

    return (
        <ClipContext.Provider value={values}>
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