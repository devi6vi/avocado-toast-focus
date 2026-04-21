import { Flame, Volume2, VolumeX, Bell, BellOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsBarProps {
  todayCount: number;
  streak: number;
  muted: boolean;
  onToggleMute: () => void;
  notify: boolean;
  onToggleNotify: () => void;
}

export const StatsBar = ({
  todayCount,
  streak,
  muted,
  onToggleMute,
  notify,
  onToggleNotify,
}: StatsBarProps) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <div className="chunky-card bg-cream px-4 py-2 flex items-center gap-2">
        <span className="text-2xl">🍅</span>
        <div className="flex flex-col leading-none">
          <span className="font-display text-2xl text-forest tabular-nums">{todayCount}</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-forest/70">Today</span>
        </div>
      </div>
      <div className="chunky-card bg-cream px-4 py-2 flex items-center gap-2">
        <Flame className={cn("h-6 w-6", streak > 0 ? "text-carrot fill-carrot/40" : "text-forest/40")} strokeWidth={2.5} />
        <div className="flex flex-col leading-none">
          <span className="font-display text-2xl text-forest tabular-nums">{streak}</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-forest/70">Day streak</span>
        </div>
      </div>
      <button
        onClick={onToggleMute}
        aria-label={muted ? "Unmute chime" : "Mute chime"}
        title={muted ? "Unmute chime" : "Mute chime"}
        className={cn(
          "chunky-btn h-12 w-12 flex items-center justify-center",
          muted ? "bg-cream text-forest" : "bg-kiwi text-forest"
        )}
      >
        {muted ? <VolumeX className="h-5 w-5" strokeWidth={2.5} /> : <Volume2 className="h-5 w-5" strokeWidth={2.5} />}
      </button>
      <button
        onClick={onToggleNotify}
        aria-label={notify ? "Disable notifications" : "Enable notifications"}
        title={notify ? "Disable notifications" : "Enable notifications"}
        className={cn(
          "chunky-btn h-12 w-12 flex items-center justify-center",
          notify ? "bg-sunshine text-forest" : "bg-cream text-forest"
        )}
      >
        {notify ? <Bell className="h-5 w-5" strokeWidth={2.5} /> : <BellOff className="h-5 w-5" strokeWidth={2.5} />}
      </button>
    </div>
  );
};