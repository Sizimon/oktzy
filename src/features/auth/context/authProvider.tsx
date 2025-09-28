import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { authAPI } from '@/features/auth/api/api';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

interface AuthContextType {
    isAuthenticated: boolean;
    setIsAuthenticated: (isAuthenticated: boolean) => void;
    isLoading: boolean;
    user: any;
    hasUnsavedChanges: boolean;
    setHasUnsavedChanges: (hasUnsavedChanges: boolean) => void;
    setUser: (user: any) => void;
    login: (usernameOrEmail: string, password: string) => Promise<{ success: boolean; error?: string, userId?: string }>;
    register: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string, userId?: string }>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

     const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false); // refers to unsaved changes in a clip entry

    const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string, userId?: string }> => {
        setIsLoading(true);
        try {
            await authAPI.login(email, password);

            const data = await authAPI.me();
            if (!data) {
                throw new Error('No user data returned from API');
            }
            setUser(data.user);
            setIsAuthenticated(true);
            return { success: true, userId: data.user.id };
        } catch (error) {
            console.error('Error logging in:', error);
            return { success: false, error: (error instanceof Error ? error.message : 'Login failed') };
        } finally {
            setIsLoading(false);
        }
    }, []);

    const register = useCallback(async (username: string, email: string, password: string): Promise<{ success: boolean; error?: string, userId?: string }> => {
        setIsLoading(true);
        try {
            await authAPI.register(username, email, password);

            const data = await authAPI.me();
            if (!data) {
                throw new Error('No user data returned from API');
            }

            setUser(data.user);
            setIsAuthenticated(true);
            return { success: true, userId: data.user.id };
        } catch (error) {
            console.error('Error registering:', error);
            return { success: false, error: (error instanceof Error ? error.message : 'Registration failed') };
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        if (hasUnsavedChanges) {
            toast.error('You have unsaved changes. Please save them before logging out.');
            return;
        }
        await authAPI.logout();
        setHasUnsavedChanges(false);
        setUser(null);
        setIsAuthenticated(false);
        router.push('/');
    }, []);

    useEffect(() => {
        const checkAuth = async () => {
            setIsLoading(true);
            try {
                const data = await authAPI.me();
                if (data && data.user) {
                    setIsAuthenticated(true);
                    setUser(data.user);
                } else {
                    setIsAuthenticated(false);
                    setUser(null);
                }
            } catch (error) {
                console.error('Error checking authentication:', error);
            } finally {
                setIsLoading(false);
            }
        }
        checkAuth();
    }, []);

    // Memoize context value
    const contextValue = useMemo(() => ({
        isAuthenticated, setIsAuthenticated,
        isLoading,
        user, setUser,
        hasUnsavedChanges, setHasUnsavedChanges,
        login,
        register,
        logout,
    }), [isAuthenticated, isLoading, user, login, register, logout, hasUnsavedChanges, setHasUnsavedChanges]);

    return (
        <AuthContext.Provider
            value={contextValue}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};