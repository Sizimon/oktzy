'use client';
import React, { useEffect } from 'react';
import { ClipSidebarProps } from '@/types/types';
import { Accordion, AccordionItem, AccordionContent, AccordionTrigger } from '@/components/ui/accordion';


export const ClipNoteDisplay: React.FC<ClipSidebarProps> = ({ timestamps, handleToTimestamp, clipUrl, clearTimestamps }) => {

    useEffect(() => { // Clear timestamps when clipUrl changes
        clearTimestamps();
    }, [clipUrl]);

    return (
        <div className='p-4 rounded-2xl bg-slate-800 w-full'>
            {timestamps.length === 0 ? (
                <div className='p-4 rounded text-text'>
                    <p className="text-center">No timestamps available, click "Add Timestamp" to create one.</p>
                </div>
            ) : (
                <Accordion type="single" collapsible className="w-full max-h-[65lvh] overflow-y-auto" defaultValue='ERROR'>
                {timestamps.map((timestamp, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger>
                            <div className="flex justify-start items-center w-full">
                                <span className="font-medium uppercase">{timestamp.title}</span>
                            </div>
                            <span 
                            onClick={(e) => {
                                e.stopPropagation();
                                handleToTimestamp(timestamp.time);
                            }}
                            className="text-sm text-gray-500 ml-2 hover:text-violet-700 cursor-pointer">
                                    {timestamp.timeStringConverted}
                                </span>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="pt-2 justify-center items-center w-full">
                                <p className="whitespace-pre-wrap text-center">{timestamp.note}</p>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
            )}
        </div>
    )
}