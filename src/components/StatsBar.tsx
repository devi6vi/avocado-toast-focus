import { ReactNode } from "react";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsBarProps {
  todayCount: number;
  streak: number;
  settingsButton?: ReactNode;
}

export const StatsBar = ({
  todayCount,
  streak,
  settingsButton,
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
      {settingsButton}
    </div>
  );
};