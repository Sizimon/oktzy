'use client';

import Providers from '@/context/Providers';
import React from 'react';

export default function ClipLayout({ children }: { children: React.ReactNode }) {
    return (
        <Providers>
            {children}
        </Providers>
    );
}