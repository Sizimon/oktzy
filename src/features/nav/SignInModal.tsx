'use client';

import React, { useState } from 'react';
import SignInForm from './components/SignInForm';
import SignUpForm from './components/SignUpForm';
import { toast } from 'react-toastify';
import { SignInModalProps } from '@/types/types';

import { useAuth } from '@/features/auth/context/authProvider';

export default function SignInModal({ isOpen, onClose }: SignInModalProps) {
    const [formType, setFormType] = useState<'login' | 'register'>('login');
    const [email, setEmail] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { login, register } = useAuth();

    const handleSubmit = async (e: React.FormEvent): Promise<boolean> => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (formType === 'login') {
                if (!email || !password) {
                    toast.error('Please enter your email and password');
                    return false;
                }

                const result = await login(email, password);
                if (result.success) {
                    const currentUrl = new URL(window.location.href);
                    currentUrl.searchParams.set('loginSuccess', 'true');
                    window.history.replaceState({}, '', currentUrl.toString());
                    onClose();
                    return true;
                } else {
                    toast.error(result.error || 'Login failed');
                    return false;
                }

            } else if (formType === 'register') {
                if (!email || !password || !confirmPassword || !username) {
                    toast.error('Please fill in all fields');
                    return false;
                }

                // Add your register logic here
                const result = await register(email, username, password);
                if (result.success) {
                    toast.success('Registration successful!');
                    onClose();
                    return true;
                } else {
                    toast.error(result.error || 'Registration failed');
                    return false;
                }
            }

            return false; // Fallback return
        } catch (error) {
            console.error('Authentication error:', error);
            toast.error('Network error - please try again');
            return false;
        } finally {
            setIsLoading(false); // Always reset loading state
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
            <div className="flex flex-col justify-center items-center text-text bg-foreground/60 border border-white/10 backdrop-blur-md px-6 py-12 rounded-2xl shadow-lg w-5/6 lg:w-2/6 xl:w-1/6">
                <button onClick={onClose} className="absolute top-2 right-4 text-white text-2xl font-bold cursor-pointer hover:text-red-500">&times;</button>
                {formType === 'login' ? (
                    <SignInForm
                        email={email}
                        setEmail={setEmail}
                        password={password}
                        setPassword={setPassword}
                        handleSubmit={handleSubmit}
                        formType={formType}
                        setFormType={setFormType}
                    />
                ) : (
                    <SignUpForm
                        email={email}
                        setEmail={setEmail}
                        username={username}
                        setUsername={setUsername}
                        password={password}
                        setPassword={setPassword}
                        confirmPassword={confirmPassword}
                        setConfirmPassword={setConfirmPassword}
                        handleSubmit={handleSubmit}
                        formType={formType}
                        setFormType={setFormType}
                    />
                )}
            </div>
        </div>
    )
}