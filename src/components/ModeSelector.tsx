import { useState } from "react";
import { Settings2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { TimerMode } from "./Timer";

interface Props {
  modes: TimerMode[];
  active: string;
  onChange: (m: TimerMode) => void;
  onCustom: (focusMin: number, breakMin: number, focusName: string) => void;
  onDelete: (id: string) => void;
}

const colorBg = {
  carrot: "bg-carrot text-cream",
  kiwi: "bg-kiwi text-forest",
  tomato: "bg-tomato text-cream",
  sunshine: "bg-sunshine text-forest",
} as const;

const isCustom = (id: string) => id.startsWith("custom");

export const ModeSelector = ({ modes, active, onChange, onCustom, onDelete }: Props) => {
  const [focusMin, setFocusMin] = useState(45);
  const [breakMin, setBreakMin] = useState(10);
  const [focusName, setFocusName] = useState("Custom Focus");
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {modes.map((m) => {
        const isActive = active === m.id;
        const custom = isCustom(m.id);
        return (
          <div key={m.id} className="relative">
            <button
              onClick={() => onChange(m)}
              className={cn(
                "chunky-btn px-4 py-2.5 text-sm font-bold uppercase tracking-wide flex items-center gap-2",
                custom && "pr-8",
                isActive ? colorBg[m.color] : "bg-cream text-forest hover:bg-sunshine/30"
              )}
            >
              <span>{m.emoji}</span>
              {m.label}
            </button>
            {custom && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(m.id);
                }}
                aria-label={`Delete ${m.label}`}
                className={cn(
                  "absolute -right-2 -top-2 h-6 w-6 rounded-full border-[2.5px] border-forest bg-tomato text-cream flex items-center justify-center hover:scale-110 transition-transform shadow-[2px_2px_0_0_hsl(var(--forest))]"
                )}
              >
                <X className="h-3 w-3" strokeWidth={3} />
              </button>
            )}
          </div>
        );
      })}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button className="chunky-btn px-4 py-2.5 text-sm font-bold uppercase tracking-wide flex items-center gap-2 bg-cream text-forest hover:bg-sunshine/30">
            <Settings2 className="h-4 w-4" /> Custom
          </button>
        </PopoverTrigger>
        <PopoverContent className="chunky-card bg-cream border-[3px] border-forest p-5 w-72">
          <h3 className="font-display text-lg text-forest mb-3">Roll your own 🥑</h3>
          <div className="space-y-3">
            <label className="block">
              <span className="text-xs font-bold uppercase text-forest/70">Name</span>
              <Input
                type="text"
                maxLength={24}
                value={focusName}
                onChange={(e) => setFocusName(e.target.value)}
                placeholder="e.g. Deep Coding"
                className="border-[2.5px] border-forest rounded-xl h-10 mt-1 bg-background font-bold"
              />
            </label>
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
              onClick={() => {
                onCustom(focusMin, breakMin, focusName.trim() || "Custom Focus");
                setOpen(false);
              }}
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