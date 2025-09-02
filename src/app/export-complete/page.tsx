'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useNotoAuth } from '@/hooks/useNotoAuth';
import formatContentAsHTML from '@/utils/formatHTML';

// This component handles the export process if the user had to login first.

export default function ExportComplete() {
    const router = useRouter();
    const [status, setStatus] = useState<string>('Processing export...');
    const { createTask } = useNotoAuth();

    useEffect(() => {
        const completePendingExport = async () => {
            const pendingData = localStorage.getItem('pendingExport');

            if (pendingData) {
                try {
                    const dataToExport = JSON.parse(pendingData);
                    const formattedContent = formatContentAsHTML(dataToExport);
                    const response = await createTask(formattedContent);

                    if (response.ok) {
                        setStatus('Export completed successfully');
                        localStorage.removeItem('pendingExport');
                        setTimeout(() => {
                            router.push('/');
                        }, 2000);
                    } else {
                        setStatus('Export failed. Redirecting...');
                        setTimeout(() => {
                            router.push('/');
                        }, 2000);
                    }
                } catch (error) {
                    console.error('Export error:', error);
                    setStatus('Export failed. Redirecting...');
                    setTimeout(() => router.push('/'), 2000);
                }
            } else {
                setStatus('No pending export found. Redirecting...');
                setTimeout(() => router.push('/'), 2000);
            }
        };
        completePendingExport();
    }, []);

    return (
        <div className="flex items-center justify-center h-screen bg-slate-900 text-white">
            <div className="text-center">
                <h2 className="text-xl mb-4">{status}</h2>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
            </div>
        </div>
    );
};
