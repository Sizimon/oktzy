import { ClipNoteDisplay } from "@/features/clips/components/ui/ClipNoteDisplay"
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
    setClipTitle
}: ClipSidebarProps) {
    return (
        <div className="
        flex flex-col w-9/10 rounded-2xl space-y-4 justify-start items-center p-4 bg-foreground/30 backdrop-blur-sm border-[1px] border-white/10 h-[50lvh]
        lg:min-h-[80lvh] lg:w-1/2
        ">
            <div>
                <input type="text" placeholder="Clip Title" required className="p-2 border-[1px] border-white/10 focus:outline-none text-lg bg-foreground/30 text-text rounded-full w-full text-center" value={clipTitle || ''} onChange={(e) => setClipTitle?.(e.target.value)} />
            </div>
            <div className='flex flex-row space-x-4 justify-center items-center w-full flex-shrink-0'>
                <button
                    className="p-2 bg-blue-500 text-white rounded cursor-pointer"
                    onClick={handleTimestampModal}
                >
                    Add Timestamp
                </button>
                <button
                    onClick={() => handleSave(clipTitle || '')}
                    className="p-2 bg-green-500 text-white rounded cursor-pointer"
                >
                    Save
                </button>
            </div>
            <div className="flex-1 w-full min-h-0">
                <ClipNoteDisplay
                    timestamps={timestamps}
                    handleToTimestamp={handleToTimestamp}
                    clipUrl={clipUrl}
                    clearTimestamps={clearTimestamps}
                    handleSave={handleSave}
                    handleTimestampModal={handleTimestampModal}
                />
            </div>
        </div>
    )
}