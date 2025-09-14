import { ClipNoteDisplay } from "@/features/clips/components/ui/ClipNoteDisplay"
import { BtnPrimary, BtnSecondary } from "@/components/ui/buttonVariants";
import { ClipSidebarProps } from "@/types/types"

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
}: ClipSidebarProps) {
    console.log('ClipSidebar received timestamps:', timestamps);
    console.log('ClipSidebar timestamps length:', timestamps?.length);
    return (
        <div className="
        flex-1 flex flex-col w-11/12 rounded-2xl space-y-4 justify-start items-center p-4 bg-foreground/30 backdrop-blur-sm border-[1px] border-white/10 max-h-[60lvh] lg:max-h-[80lvh]
        ">
            <div>
                <input type="text" placeholder="Clip Title" required className="border-b-[1px] border-violet-500 focus:outline-none text-lg text-text w-full text-center" value={clipTitle || ''}
                    onChange={handleChangeClipTitle} />
            </div>
            <div className='flex flex-row space-x-4 justify-center items-center w-full flex-shrink-0'>
                <BtnPrimary onClick={() => handleSave(clipTitle || '')}>Save Clip</BtnPrimary>
                <BtnSecondary onClick={handleTimestampModal}>Add Timestamp</BtnSecondary>
            </div>
            <ClipNoteDisplay
                timestamps={timestamps}
                handleToTimestamp={handleToTimestamp}
                clipUrl={clipUrl}
                clearTimestamps={clearTimestamps}
                handleSave={handleSave}
                handleTimestampModal={handleTimestampModal}
            />
        </div>
    )
}