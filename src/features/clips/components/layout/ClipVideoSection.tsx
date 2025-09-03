import { ClipDisplayProps } from "@/types/types";
import { ClipDisplay } from "../ui/ClipDisplay";
import { ClipLoader } from "react-spinners";

export function ClipVideoSection({
    clipUrl,
    modalOpen,
    retainedVolume,
    setRetainedVolume,
    setCurrentTime,
    ref
}: ClipDisplayProps) {
    return (
        <div className="
            relative col-span-10 w-full flex flex-col items-center justify-center bg-slate-800/30 backdrop-blur-sm border-[1px] border-white/10
            md:col-span-7 md:p-4 md:rounded-2xl md:h-[80lvh]
            ">
            <div className="w-full justify-start">
              {!clipUrl ? (
                <div className="text-center p-4 rounded space-y-4">
                  <p className="text-3xl text-text">No video URL provided.</p>
                  <ClipLoader color='#FFFFFF' />
                </div>
              ) : (
                <ClipDisplay
                  clipUrl={clipUrl}
                  modalOpen={modalOpen}
                  retainedVolume={retainedVolume}
                  setRetainedVolume={setRetainedVolume}
                  setCurrentTime={setCurrentTime}
                  ref={ref}
                />
              )}

            </div>
          </div>
    )
}