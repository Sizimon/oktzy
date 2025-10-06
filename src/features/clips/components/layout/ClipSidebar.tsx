'use client';
import React, { useLayoutEffect, useRef } from "react"
import { ClipNoteDisplay } from "@/features/clips/components/ui/ClipNoteDisplay"
import { BtnPrimary, BtnSecondary } from "@/components/ui/buttonVariants";
import { ClipSidebarProps } from "@/types/types"
import { useParams } from "next/navigation";
import { GiBackwardTime } from "react-icons/gi";
import { useAuth } from "@/features/auth/context/authProvider";
import { gsap } from "gsap";

export function ClipSidebar({
    // Modal Handlers
    handleTimestampModal,
    handleSave,
    timestamps,
    handleToTimestamp,
    clipUrl,
    clearTimestamps,
    clipTitle,
    handleChangeClipTitle,
    handleDeleteTimestamp,
    revertChanges
}: ClipSidebarProps) {
    const params = useParams();
    const { id: clipId } = params;
    const { hasUnsavedChanges } = useAuth();
    const revertBtnRef = useRef<HTMLButtonElement>(null);

    useLayoutEffect(() => {
        if (revertBtnRef.current) {
            if (hasUnsavedChanges) {
                gsap.to(revertBtnRef.current, {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    duration: 0.5,
                    ease: "back.out(1.7)",
                    pointerEvents: "auto"
                });
            } else {
                gsap.to(revertBtnRef.current, {
                    opacity: 0,
                    scale: 0.9,
                    y: -10,
                    duration: 0.5,
                    ease: "power2.in",
                    pointerEvents: "none"
                });
            }
        }
    }, [hasUnsavedChanges]);

    return (
        <div className="
        flex-1 flex flex-col w-11/12 rounded-2xl space-y-4 justify-start items-center p-4 bg-foreground/5 backdrop-blur-sm border-[1px] border-white/10 h-full
        ">
            <button
                ref={revertBtnRef}
                className="fixed top-4 right-4 w-6 h-6 text-white hover:text-violet-500 cursor-pointer opacity-0 pointer-events-none"
                onClick={revertChanges}
            >
                <GiBackwardTime className="w-full h-full" />
            </button>
            <div>
                <input type="text" placeholder="Clip Title" required className="border-b-[1px] border-violet-500 focus:outline-none lg:text-lg text-text w-full text-center" value={clipTitle || ''}
                    onChange={handleChangeClipTitle} />
            </div>
            <div className='flex flex-row space-x-4 justify-center items-center w-full flex-shrink-0'>
                <BtnPrimary onClick={() => handleSave(clipTitle || '')}>{params.id ? 'Update Clip' : 'Save Clip'}</BtnPrimary>
                <BtnSecondary onClick={handleTimestampModal}>Add Timestamp</BtnSecondary>
            </div>
            <ClipNoteDisplay
                timestamps={timestamps}
                handleToTimestamp={handleToTimestamp}
                clipUrl={clipUrl}
                clearTimestamps={clearTimestamps}
                handleSave={handleSave}
                handleTimestampModal={handleTimestampModal}
                handleDeleteTimestamp={handleDeleteTimestamp}
            />
        </div>
    )
}