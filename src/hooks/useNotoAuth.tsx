import React, { useState, useEffect, useCallback } from 'react';

interface NotoUser {
    id: string;
    username: string;
    email: string;
}

const useNotoAuth = () => {
    const [user, setUser] = useState<NotoUser | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const checkAuthStatus = useCallback( async () => {
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
}

// login logic

// create task logic

export default useNotoAuth;