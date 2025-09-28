'use client';

import React, { useState } from 'react';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import { toast } from 'react-toastify';
import { SignInModalProps } from '@/types/types';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/features/auth/context/authProvider';

export default function SignInModal({ isOpen, onClose }: SignInModalProps) {
    const [formType, setFormType] = useState<'login' | 'register'>('login');
    const [email, setEmail] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { login, register, user } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (formType === 'login') {
            if (!email || !password) {
                toast.error('Please enter your email and password');
                setIsLoading(false);
                return;
            }
            try {
                const result = await login(email, password);

                if (result.success) {
                    toast.success('Login successful');
                    setTimeout(() => {
                        onClose();
                        if (result.userId) {
                            router.push(`/${result.userId}`); // or wherever you redirect
                        }
                    }, 2000);
                } else {
                    toast.error(result.error || 'Login failed');
                }

            } catch (error) {
                console.error('Login error:', error);
                toast.error('Network error - please try again');
            }
            // Handle login logic here
        } else if (formType === 'register') {
            if (!email || !password || !confirmPassword || !username) {
                toast.error('Please fill in all fields');
                setIsLoading(false);
                return;
            }
            if (password !== confirmPassword) {
                toast.error('Passwords do not match');
                setIsLoading(false);
                return;
            }
            try {
                const result = await register(username, email, password);

                if (result.success) {
                    toast.success('Login successful');
                    setTimeout(() => {
                        onClose();
                        if (result.userId) {
                            router.push(`/${result.userId}`); // or wherever you redirect
                        }
                    }, 2000);
                } else {
                    toast.error(result.error || 'Login failed');
                }
                
            } catch (error) {
                console.error('Registration error:', error);
                toast.error('Network error - please try again');
            }
        }

        setIsLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70">
            <div className="flex flex-col justify-center items-center text-text bg-foreground/60 border-[1px] border-white/10 backdrop-blur-md px-6 py-12 rounded-2xl shadow-lg w-5/6 lg:w-2/6 xl:w-1/6">
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