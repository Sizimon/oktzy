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
            relative w-full flex flex-col items-center justify-center bg-foreground/30 backdrop-blur-sm border-[1px] border-white/10 min-h-[33lvh]
            lg:p-4 lg:rounded-2xl lg:min-h-[80lvh]
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