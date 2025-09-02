'use client';
import React, { useState } from 'react';
import { SaveModalProps } from '@/types/types';

export const SaveModal: React.FC<SaveModalProps> = ({
    isOpen,
    onClose,
    onSave,
    curatorData,
    isSaving
}) => {
    const [curatorTitle, setCuratorTitle] = useState<string>('');

    const handleSave = () => {
        // Implement export functionality
        if (curatorData) {
        }
    };
    const handleClose = () => {
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70">
            <div className="flex flex-col justify-center items-center text-text bg-slate-800/60 border-[1px] border-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg w-2/6">
                <input
                    type="text"
                    placeholder="Name your export"
                    value={curatorTitle}
                    maxLength={24}
                    onChange={(e) => setCuratorTitle(e.target.value)}
                    disabled={isSaving}
                    className="my-4 p-2 border-[1px] border-white/10 bg-slate-900/40 rounded-xl focus:outline-none"
                />
                <div className="flex flex-row justify-center w-full space-x-4">
                    <button
                        className="ml-2 p-2 bg-green-500 rounded cursor-pointer"
                        disabled={!curatorData || isSaving}
                        onClick={handleSave}
                    >
                        {isSaving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                        className="p-2 bg-red-500 rounded cursor-pointer"
                        disabled={isSaving}
                        onClick={handleClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};