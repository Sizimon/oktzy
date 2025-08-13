'use client';
import React, { useState } from 'react';
import { Accordion, AccordionItem, AccordionContent, AccordionTrigger } from './ui/accordion';

interface NoteDisplayProps {
    timestamps: {
        title: string;
        note: string;
        time: number;
    }[];
    formatCurrentTime: (time: number) => string;
}

export const NoteDisplay: React.FC<NoteDisplayProps> = ({ timestamps, formatCurrentTime }) => {
    return (
        <div className='px-8 rounded bg-zinc-200 w-full'>
            <Accordion type="single" collapsible className="w-full" defaultValue='ERROR'>
                {timestamps.map((timestamp, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger>
                            <div className="flex justify-center items-center w-full cursor-pointer">
                                <span className="font-medium uppercase">{timestamp.title}</span>
                                <span className="text-sm text-gray-500 ml-2">
                                    {formatCurrentTime(timestamp.time)}
                                </span>
                            </div>
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