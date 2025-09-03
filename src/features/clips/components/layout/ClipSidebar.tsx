import { ClipNoteDisplay } from "@/features/clips/components/ui/ClipNoteDisplay"
import { ClipSidebarProps } from "@/types/types"

export function ClipSidebar({
    // Modal Handlers
    handleTimestampModal,
    handleSaveModal,
    timestamps,
    handleToTimestamp,
    clipUrl,
    clearTimestamps
}: ClipSidebarProps) {
    return (
        <div className="flex flex-col w-full space-y-4 col-span-10 md:col-span-3 justify-start items-center p-4 md:rounded-2xl bg-slate-800/30 backdrop-blur-sm border-[1px] border-white/10 h-[80lvh]">
            <div className='flex flex-row space-x-4 justify-center items-center w-full'>
                <button
                    className="p-2 bg-blue-500 text-white rounded cursor-pointer"
                    onClick={handleTimestampModal}
                >
                    Add Timestamp
                </button>
                <button
                    onClick={handleSaveModal}
                    className="p-2 bg-green-500 text-white rounded cursor-pointer"
                >
                    Save
                </button>
            </div>
            <ClipNoteDisplay timestamps={timestamps} handleToTimestamp={handleToTimestamp} clipUrl={clipUrl} clearTimestamps={clearTimestamps} handleSaveModal={handleSaveModal} handleTimestampModal={handleTimestampModal} />
        </div>
    )
}