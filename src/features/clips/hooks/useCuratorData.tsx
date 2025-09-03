import React, { useState, useCallback } from 'react';
import { CuratorData } from '@/types/types';

export const useCuratorData = () => {
    const [curatorData, setCuratorData] = useState<CuratorData | null>(null);
    const [curatorTitle, setCuratorTitle] = useState<string>('My Curated Clip');
    
    const generateCuratorData = useCallback((clipUrl: string, timestamps: CuratorData['timestamps']) => {
        const data: CuratorData = {
            clipUrl,
            timestamps,
        }
        setCuratorData(data);
        return data;
    }, [curatorTitle]);

    return {
        curatorData,
        generateCuratorData,
        curatorTitle,
        setCuratorTitle
    };
}
