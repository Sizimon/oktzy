'use client';
import React from 'react';
import { FaTrash, FaPencil } from "react-icons/fa6";
import { ClipSidebarProps } from '@/types/types';
import { Accordion, AccordionItem, AccordionContent, AccordionTrigger } from '@/components/ui/accordion';


export const ClipNoteDisplay: React.FC<ClipSidebarProps> = ({ timestamps, handleToTimestamp }) => {
    const sortedTimestamps = [...timestamps].sort((a, b) => a.time - b.time);

    return (
        <div className='flex flex-col p-4 rounded-2xl w-full h-full'>
            {timestamps.length === 0 ? (
                <div className='p-4 rounded text-text'>
                    <p className="text-center">No timestamps available, click "Add Timestamp" to create one.</p>
                </div>
            ) : (
                <Accordion type="single" collapsible className="w-full flex-1 max-h-[40lvh] lg:max-h-[60lvh] overflow-y-auto no-scrollbar">
                    {sortedTimestamps.map((st, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger>
                                <div className="flex justify-start items-center w-full">
                                    <span className="font-medium uppercase">{st.title}</span>
                                </div>
                                <div className='flex justify-end items-center space-x-4'>
                                    <span
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleToTimestamp(st.time);
                                        }}
                                        className="text-sm text-gray-500 hover:text-violet-500 cursor-pointer">
                                        {st.timeStringConverted}
                                    </span>
                                    <span>
                                        <FaPencil
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                // Handle edit action later
                                            }}
                                            className="h-4 w-4 text-sm text-gray-500 hover:text-blue-500 cursor-pointer"
                                        />
                                    </span>
                                    <span>
                                        <FaTrash
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                // Handle delete action later
                                            }}
                                            className="text-sm text-gray-500 ml-2 hover:text-red-500 cursor-pointer"
                                        />
                                    </span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="justify-center items-center w-full bg-foreground/20 border-[1px] border-violet-500/20 p-4 rounded-2xl">
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