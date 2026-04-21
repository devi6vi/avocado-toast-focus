import { useState } from "react";
import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { TimerMode } from "./Timer";

interface Props {
  modes: TimerMode[];
  active: string;
  onChange: (m: TimerMode) => void;
  onCustom: (minutes: number, breakMin: number) => void;
}

const colorBg = {
  carrot: "bg-carrot text-cream",
  kiwi: "bg-kiwi text-forest",
  tomato: "bg-tomato text-cream",
  sunshine: "bg-sunshine text-forest",
} as const;

export const ModeSelector = ({ modes, active, onChange, onCustom }: Props) => {
  const [focusMin, setFocusMin] = useState(45);
  const [breakMin, setBreakMin] = useState(10);

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {modes.map((m) => (
        <button
          key={m.id}
          onClick={() => onChange(m)}
          className={cn(
            "chunky-btn px-4 py-2.5 text-sm font-bold uppercase tracking-wide flex items-center gap-2",
            active === m.id ? colorBg[m.color] : "bg-cream text-forest hover:bg-sunshine/30"
          )}
        >
          <span>{m.emoji}</span>
          {m.label}
        </button>
      ))}
      <Popover>
        <PopoverTrigger asChild>
          <button className="chunky-btn px-4 py-2.5 text-sm font-bold uppercase tracking-wide flex items-center gap-2 bg-cream text-forest hover:bg-sunshine/30">
            <Settings2 className="h-4 w-4" /> Custom
          </button>
        </PopoverTrigger>
        <PopoverContent className="chunky-card bg-cream border-[3px] border-forest p-5 w-72">
          <h3 className="font-display text-lg text-forest mb-3">Roll your own 🥑</h3>
          <div className="space-y-3">
            <label className="block">
              <span className="text-xs font-bold uppercase text-forest/70">Focus (min)</span>
              <Input
                type="number"
                min={1}
                max={180}
                value={focusMin}
                onChange={(e) => setFocusMin(Number(e.target.value))}
                className="border-[2.5px] border-forest rounded-xl h-10 mt-1 bg-background font-bold"
              />
            </label>
            <label className="block">
              <span className="text-xs font-bold uppercase text-forest/70">Break (min)</span>
              <Input
                type="number"
                min={1}
                max={60}
                value={breakMin}
                onChange={(e) => setBreakMin(Number(e.target.value))}
                className="border-[2.5px] border-forest rounded-xl h-10 mt-1 bg-background font-bold"
              />
            </label>
            <Button
              onClick={() => onCustom(focusMin, breakMin)}
              className="chunky-btn w-full bg-carrot text-cream hover:bg-carrot/90 h-11"
            >
              Set Custom Timer
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};