'use client';

import React, { useState } from 'react';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';

export default function SignInModal() {
    const [formType, setFormType] = useState<'login' | 'register'>('login');
    const [email, setEmail] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formType === 'login') {
            
        } else if (formType === 'register') {
            // Handle registration logic here
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