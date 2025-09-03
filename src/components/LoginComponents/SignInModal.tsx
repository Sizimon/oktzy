'use client';

import React, { useState } from 'react';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import { toast } from 'react-toastify';
import { authAPI } from '@/connections/api';
import { SignInModalProps } from '@/types/types';

export default function SignInModal({ isOpen, onClose }: SignInModalProps) {
    const [formType, setFormType] = useState<'login' | 'register'>('login');
    const [email, setEmail] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formType === 'login') {
            if (!email || !password) {
                toast.error('Please enter your email and password');
                return;
            }
            try {
                const response = await authAPI.login(email, password);
                if (response.ok) {
                    toast.success('Login successful');
                } else {
                    toast.error('Login failed');
                }
            } catch (error) {
                toast.error('Error logging in');
            }
            // Handle login logic here
        } else if (formType === 'register') {
            if (!email || !password || !confirmPassword || !username) {
                toast.error('Please fill in all fields');
                return;
            }
            if (password !== confirmPassword) {
                toast.error('Passwords do not match');
                return;
            }
            try {
                const response = await authAPI.register(username, email, password);
                if (response.ok) {
                    toast.success('Registration successful');
                } else {
                    toast.error('Registration failed');
                }
            } catch (error) {
                toast.error('Error registering');
            }
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70">
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
    )
}