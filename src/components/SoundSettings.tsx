import { Music, Play } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CHIME_OPTIONS, ChimeSound, playChime } from "@/lib/chime";

interface Props {
  selected: ChimeSound;
  onSelect: (s: ChimeSound) => void;
}

export const SoundSettings = ({ selected, onSelect }: Props) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          aria-label="Choose chime sound"
          title="Choose chime sound"
          className="chunky-btn h-12 w-12 flex items-center justify-center bg-cream text-forest"
        >
          <Music className="h-5 w-5" strokeWidth={2.5} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="chunky-card bg-cream border-[3px] border-forest p-4 w-72">
        <h3 className="font-display text-lg text-forest mb-3">Pick a chime 🎵</h3>
        <ul className="space-y-2">
          {CHIME_OPTIONS.map((opt) => {
            const isActive = selected === opt.id;
            return (
              <li key={opt.id}>
                <div
                  className={cn(
                    "flex items-center gap-2 rounded-2xl border-[2.5px] border-forest p-2 transition-all",
                    isActive ? "bg-sunshine" : "bg-background hover:bg-sunshine/30"
                  )}
                >
                  <button
                    onClick={() => {
                      onSelect(opt.id);
                      playChime(opt.id);
                    }}
                    className="flex-1 flex items-center gap-2 text-left"
                  >
                    <span className="text-xl">{opt.emoji}</span>
                    <div className="flex flex-col leading-tight">
                      <span className="font-bold text-sm text-forest">{opt.label}</span>
                      <span className="text-[11px] text-forest/70">{opt.description}</span>
                    </div>
                  </button>
                  <button
                    onClick={() => playChime(opt.id)}
                    aria-label={`Preview ${opt.label}`}
                    className="h-8 w-8 rounded-lg border-[2.5px] border-forest bg-cream flex items-center justify-center hover:bg-kiwi/40"
                  >
                    <Play className="h-3.5 w-3.5 fill-forest text-forest" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </PopoverContent>
    </Popover>
  );
};