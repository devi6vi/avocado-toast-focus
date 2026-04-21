import { useState } from "react";
import { toast } from "sonner";
import { Timer, TimerMode } from "@/components/Timer";
import { ModeSelector } from "@/components/ModeSelector";
import { TaskList } from "@/components/TaskList";
import avocadoMascot from "@/assets/avocado-mascot.png";

const DEFAULT_MODES: TimerMode[] = [
  { id: "pomo", label: "Pomodoro", duration: 25 * 60, color: "carrot", emoji: "🍅" },
  { id: "short", label: "Short Break", duration: 5 * 60, color: "kiwi", emoji: "🌿" },
  { id: "long", label: "Long Break", duration: 15 * 60, color: "sunshine", emoji: "☕" },
  { id: "deep", label: "Deep Focus", duration: 60 * 60, color: "tomato", emoji: "🎯" },
];

const Index = () => {
  const [modes, setModes] = useState<TimerMode[]>(DEFAULT_MODES);
  const [active, setActive] = useState<TimerMode>(DEFAULT_MODES[0]);

  const handleCustom = (focusMin: number, breakMin: number) => {
    const focusMode: TimerMode = {
      id: "custom-focus",
      label: "Custom Focus",
      duration: Math.max(1, focusMin) * 60,
      color: "carrot",
      emoji: "✨",
    };
    const breakMode: TimerMode = {
      id: "custom-break",
      label: "Custom Break",
      duration: Math.max(1, breakMin) * 60,
      color: "kiwi",
      emoji: "🥒",
    };
    const next = [...DEFAULT_MODES.filter((m) => !m.id.startsWith("custom")), focusMode, breakMode];
    setModes(next);
    setActive(focusMode);
    toast(`Custom timer set: ${focusMin}min focus / ${breakMin}min break 🥑`);
  };

  return (
    <main className="min-h-screen px-4 py-8 md:py-12">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <header className="mb-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <img
              src={avocadoMascot}
              alt="Avocado Toast mascot"
              width={64}
              height={64}
              className="animate-wobble"
            />
            <h1 className="font-display text-5xl md:text-6xl text-forest leading-none">
              Avocado <span className="text-carrot">Toast</span>
            </h1>
          </div>
          <p className="text-forest/70 font-medium text-base md:text-lg">
            Crunchy focus sessions, smooth breaks. 🥑✨
          </p>
        </header>

        {/* Mode selector */}
        <div className="mb-8">
          <ModeSelector
            modes={modes}
            active={active.id}
            onChange={setActive}
            onCustom={handleCustom}
          />
        </div>

        {/* Main grid */}
        <div className="grid gap-8 lg:grid-cols-[1fr_400px] items-start">
          <section className="chunky-card-lg bg-cream p-8 md:p-10 flex justify-center">
            <Timer
              mode={active}
              onComplete={() =>
                toast(`${active.label} done! Time for a bite 🥑`, {
                  description: "Great work — your toast is ready.",
                })
              }
            />
          </section>

          <aside>
            <TaskList />
          </aside>
        </div>

        <footer className="text-center mt-10 text-forest/60 text-sm font-medium">
          Stay crunchy 🥑 — built with focus
        </footer>
      </div>
    </main>
  );
};

export default Index;
