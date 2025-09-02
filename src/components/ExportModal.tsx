'use client';
import React, { useState } from 'react';
import { ExportModalProps } from '@/types/types';

export const ExportModal: React.FC<ExportModalProps> = ({
    isOpen,
    onClose,
    onExport,
    curatorData,
    isExporting = false, // Loading for the export
    isCheckingAuth = false
}) => {
    const [curatorTitle, setCuratorTitle] = useState<string>('');

    const handleExport = () => {
        // Implement export functionality
        if (curatorData) {
            const dataToExport = {
                ...curatorData,
                title: curatorTitle || 'Untitled Export'
            };
            onExport(dataToExport);
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
                    disabled={isCheckingAuth || isExporting}
                    className="my-4 p-2 border-[1px] border-white/10 bg-slate-900/40 rounded-xl focus:outline-none"
                />
                <div className="flex flex-row justify-center w-full space-x-4">
                    <button
                        className="ml-2 p-2 bg-green-500 rounded cursor-pointer"
                        disabled={!curatorData || isCheckingAuth || isExporting}
                        onClick={handleExport}
                    >
                        {isCheckingAuth ? 'Checking Auth' : isExporting ? 'Exporting...' : 'Export'}
                    </button>
                    <button
                        className="p-2 bg-red-500 rounded cursor-pointer"
                        disabled={isExporting || isCheckingAuth}
                        onClick={handleClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};