import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type TimerMode = {
  id: string;
  label: string;
  duration: number; // seconds
  color: "carrot" | "kiwi" | "tomato" | "sunshine";
  emoji: string;
};

interface TimerProps {
  mode: TimerMode;
  onComplete?: () => void;
}

const colorMap = {
  carrot: { bg: "bg-carrot", text: "text-carrot", ring: "stroke-carrot" },
  kiwi: { bg: "bg-kiwi", text: "text-kiwi", ring: "stroke-kiwi" },
  tomato: { bg: "bg-tomato", text: "text-tomato", ring: "stroke-tomato" },
  sunshine: { bg: "bg-sunshine", text: "text-forest", ring: "stroke-sunshine" },
};

const formatTime = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
};

export const Timer = ({ mode, onComplete }: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState(mode.duration);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    setTimeLeft(mode.duration);
    setRunning(false);
  }, [mode]);

  useEffect(() => {
    if (running) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            setRunning(false);
            onComplete?.();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [running, onComplete]);

  const progress = 1 - timeLeft / mode.duration;
  const circumference = 2 * Math.PI * 130;
  const colors = colorMap[mode.color];

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative h-[300px] w-[300px]">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 300 300">
          <circle cx="150" cy="150" r="130" className="fill-none stroke-cream" strokeWidth="14" />
          <circle
            cx="150"
            cy="150"
            r="130"
            className={cn("fill-none transition-all duration-1000", colors.ring)}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-6xl mb-1">{mode.emoji}</span>
          <span className="font-display text-6xl text-forest tabular-nums">{formatTime(timeLeft)}</span>
          <span className="text-sm font-bold uppercase tracking-widest text-forest/70 mt-1">{mode.label}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={() => setRunning((r) => !r)}
          className={cn(
            "chunky-btn h-14 px-8 text-base text-cream hover:opacity-90",
            colors.bg,
            running && "animate-pulse-soft"
          )}
        >
          {running ? <Pause className="mr-2 h-5 w-5 fill-current" /> : <Play className="mr-2 h-5 w-5 fill-current" />}
          {running ? "Pause" : timeLeft === mode.duration ? "Start" : "Resume"}
        </Button>
        <Button
          onClick={() => {
            setRunning(false);
            setTimeLeft(mode.duration);
          }}
          className="chunky-btn h-14 px-6 bg-cream text-forest hover:bg-cream/80"
        >
          <RotateCcw className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};