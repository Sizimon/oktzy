import { ClipDisplayProps } from "@/types/types";
import { ClipDisplay } from "../ui/ClipDisplay";
import { MdVideoLibrary } from "react-icons/md";

export function ClipVideoSection({
  clipUrl,
  timestampModalOpen,
  signInModalOpen,
  setCurrentTime,
  ref
}: ClipDisplayProps) {
  return (
    <div className="
      relative w-full flex flex-col flex-[2] items-center justify-center
      bg-foreground/30 backdrop-blur-sm border border-white/10
      lg:p-4 lg:rounded-2xl
    ">
      <div className="w-full h-full flex justify-center items-center">
        {!clipUrl ? (
          <div className="flex flex-col items-center justify-center text-center p-8 rounded-2xl bg-gradient-to-br from-violet-500/10 to-background/80 space-y-4 border border-violet-500/20 shadow-lg">
            <MdVideoLibrary className="text-violet-500 mb-2" size={64} />
            <p className="text-2xl font-semibold text-violet-600">No video loaded</p>
            <p className="text-text/70 text-base">Paste a Video link above to preview your clip here.</p>
            <div className="mt-2 animate-pulse">
              <div className="w-24 h-2 rounded-full bg-violet-500/30 mx-auto" />
            </div>
          </div>
        ) : (
          <ClipDisplay
            clipUrl={clipUrl}
            timestampModalOpen={timestampModalOpen}
            signInModalOpen={signInModalOpen}
            setCurrentTime={setCurrentTime}
            ref={ref}
          />
        )}
      </div>
    </div>
  )
}