'use client';
import React from 'react';
import { Timestamp } from '@/types/types';
import { Accordion, AccordionItem, AccordionContent, AccordionTrigger } from './ui/accordion';

interface NoteDisplayProps {
    timestamps: Timestamp[];
}

export const NoteDisplay: React.FC<NoteDisplayProps> = ({ timestamps }) => {
    return (
        <div className='px-8 rounded bg-zinc-200 w-full'>
            <Accordion type="single" collapsible className="w-full" defaultValue='ERROR'>
                {timestamps.map((timestamp, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger>
                            <div className="flex justify-start items-center w-full">
                                <span className="font-medium uppercase">{timestamp.title}</span>
                            </div>
                            <span className="text-sm text-gray-500 ml-2">
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
        </div>
    )
}