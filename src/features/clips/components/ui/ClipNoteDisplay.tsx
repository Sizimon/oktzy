'use client';
import React from 'react';
import { ClipSidebarProps } from '@/types/types';
import { Accordion, AccordionItem, AccordionContent, AccordionTrigger } from '@/components/ui/accordion';


export const ClipNoteDisplay: React.FC<ClipSidebarProps> = ({ timestamps, handleToTimestamp }) => {
    const sortedTimestamps = [...timestamps].sort((a, b) => a.time - b.time);

    return (
        <div className='p-4 rounded-2xl w-full h-full flex flex-col'>
            {timestamps.length === 0 ? (
                <div className='p-4 rounded text-text'>
                    <p className="text-center">No timestamps available, click "Add Timestamp" to create one.</p>
                </div>
            ) : (
                    <Accordion type="single" collapsible className="w-full flex-1 overflow-y-auto no-scrollbar">
                        {sortedTimestamps.map((st, index) => (
                            <AccordionItem key={index} value={`item-${index}`}>
                                <AccordionTrigger>
                                    <div className="flex justify-start items-center w-full">
                                        <span className="font-medium uppercase">{st.title}</span>
                                    </div>
                                    <span 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleToTimestamp(st.time);
                                        }}
                                        className="text-sm text-gray-500 ml-2 hover:text-violet-700 cursor-pointer">
                                        {st.timeStringConverted}
                                    </span>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="justify-center items-center w-full bg-foreground p-4 rounded">
                                        <p className="whitespace-pre-wrap text-start">{st.note}</p>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
            )}
        </div>
    )
}