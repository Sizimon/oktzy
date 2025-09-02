import { useState, useEffect, useCallback } from 'react';

interface NotoUser {
    id: string;
    username: string;
    email: string;
}

export const useNotoAuth = () => {
    const [user, setUser] = useState<NotoUser | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const checkAuthStatus = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:5006/api/auth/me', {
                credentials: 'include',
            })

            if (response.ok) {
                const userData = await response.json();
                setUser(userData.user || userData);
                setIsAuthenticated(true);
            } else {
                setUser(null);
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error('Error checking auth status:', error);
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    }, [])

    useEffect(() => {
        setIsLoading(true);
        checkAuthStatus();
    }, [checkAuthStatus]);

    const login = useCallback((dataToExport?: any) => {
        // Save export data for login success
        if (dataToExport) {
            try {
                localStorage.setItem('pendingExport', JSON.stringify(dataToExport))
            } catch (error) {
                console.error('Error saving pending export to localStorage:', error);
            }
        }

        // Redirect to Noto with return URL
        const returnUrl = encodeURIComponent(window.location.origin + '/export-complete');
        window.location.href = `http://localhost:3000/login?redirect=${returnUrl}`
    }, [])

    const createTask = useCallback(async (dataToExport: any) => {
        if (!isAuthenticated) {
            throw new Error('User not authenticated');
        }

        const response = await fetch('http://localhost:5006/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(dataToExport),
        });

        if (!response.ok) {
            if (response.status === 401) {
                setUser(null);
                setIsAuthenticated(false);
                throw new Error('Authentication Expired');
            }

            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Failed to create task');
        }

        return response.json();
    }, [isAuthenticated])

    return {
        user,
        isAuthenticated,
        isLoading,
        checkAuthStatus,
        login,
        createTask
    }
}
