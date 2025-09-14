import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { authAPI } from '@/features/auth/api/api';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    isAuthenticated: boolean;
    setIsAuthenticated: (isAuthenticated: boolean) => void;
    isLoading: boolean;
    user: any;
    setUser: (user: any) => void;
    login: (usernameOrEmail: string, password: string) => Promise<{ success: boolean; error?: string }>;
    register: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        setIsLoading(true);
        try {
            await authAPI.login(email, password);

            const data = await authAPI.me();
            if (!data) {
                throw new Error('No user data returned from API');
            }

            setUser(data.user);
            setIsAuthenticated(true);
            router.push(`/${data.user.id}`);
            return { success: true };
        } catch (error) {
            console.error('Error logging in:', error);
            return { success: false, error: (error instanceof Error ? error.message : 'Login failed') };
        } finally {
            setIsLoading(false);
        }
    }, []);

    const register = useCallback(async (username: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        setIsLoading(true);
        try {
            await authAPI.register(username, email, password);

            const data = await authAPI.me();
            if (!data) {
                throw new Error('No user data returned from API');
            }

            setUser(data.user);
            setIsAuthenticated(true);
            router.push(`/${data.user.id}`);
            return { success: true };
        } catch (error) {
            console.error('Error registering:', error);
            return { success: false, error: (error instanceof Error ? error.message : 'Registration failed') };
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        await authAPI.logout();
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
        isAuthenticated,
        setIsAuthenticated,
        isLoading,
        user,
        setUser,
        login,
        register,
        logout,
    }), [isAuthenticated, isLoading, user, login, register, logout]);

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