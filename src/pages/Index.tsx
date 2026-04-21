import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Timer, TimerMode } from "@/components/Timer";
import { ModeSelector } from "@/components/ModeSelector";
import { TaskList } from "@/components/TaskList";
import { StatsBar } from "@/components/StatsBar";
import { SoundSettings } from "@/components/SoundSettings";
import { AuthBar } from "@/components/AuthBar";
import { WeeklyChart } from "@/components/WeeklyChart";
import { useAuth } from "@/hooks/useAuth";
import { useCloudStats } from "@/hooks/useCloudStats";
import { playChime, requestNotifyPermission, sendNotification, ChimeSound } from "@/lib/chime";
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
  const { user } = useAuth();
  const { todayCount, streak, weekly, recordPomodoro } = useCloudStats(user);
  const [muted, setMuted] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("avocado-toast-muted") === "1";
  });
  const [notify, setNotify] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("avocado-toast-notify") === "1";
  });
  const [chime, setChime] = useState<ChimeSound>(() => {
    if (typeof window === "undefined") return "bell";
    return (localStorage.getItem("avocado-toast-chime") as ChimeSound) || "bell";
  });

  useEffect(() => {
    localStorage.setItem("avocado-toast-muted", muted ? "1" : "0");
  }, [muted]);
  useEffect(() => {
    localStorage.setItem("avocado-toast-notify", notify ? "1" : "0");
  }, [notify]);
  useEffect(() => {
    localStorage.setItem("avocado-toast-chime", chime);
  }, [chime]);

  const handleToggleNotify = async () => {
    if (!notify) {
      const result = await requestNotifyPermission();
      if (result === "granted") {
        setNotify(true);
        toast("Notifications on 🔔");
      } else if (result === "unsupported") {
        toast("Notifications not supported in this browser");
      } else {
        toast("Notification permission denied", {
          description: "Enable it in your browser settings.",
        });
      }
    } else {
      setNotify(false);
      toast("Notifications off");
    }
  };

  const handleComplete = () => {
    if (!muted) playChime(chime);
    if (notify) sendNotification("Avocado Toast 🥑", `${active.label} done — your toast is ready!`);
    const isFocus = active.id === "pomo" || active.id === "deep" || active.id.startsWith("custom-focus");
    if (isFocus) {
      if (user) {
        recordPomodoro(active.label, active.duration);
      } else {
        toast("Sign in to save this 🥑 to the cloud");
      }
    }
    toast(`${active.label} done! Time for a bite 🥑`, {
      description: "Great work — your toast is ready.",
    });
  };

  const handleCustom = (focusMin: number, breakMin: number, focusName: string) => {
    const focusId = `custom-focus-${Date.now()}`;
    const breakId = `custom-break-${Date.now()}`;
    const focusMode: TimerMode = {
      id: focusId,
      label: focusName,
      duration: Math.max(1, focusMin) * 60,
      color: "carrot",
      emoji: "✨",
    };
    const breakMode: TimerMode = {
      id: breakId,
      label: `${focusName} Break`,
      duration: Math.max(1, breakMin) * 60,
      color: "kiwi",
      emoji: "🥒",
    };
    setModes((prev) => [...prev, focusMode, breakMode]);
    setActive(focusMode);
    toast(`"${focusName}" set: ${focusMin}min focus / ${breakMin}min break 🥑`);
  };

  const handleDelete = (id: string) => {
    setModes((prev) => {
      const next = prev.filter((m) => m.id !== id);
      if (active.id === id) {
        setActive(next[0] ?? DEFAULT_MODES[0]);
      }
      return next;
    });
    toast("Custom timer removed");
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

        {/* Stats + audio/notification controls */}
        <div className="mb-6">
          <StatsBar
            todayCount={todayCount}
            streak={streak}
            muted={muted}
            onToggleMute={() => setMuted((m) => !m)}
            notify={notify}
            onToggleNotify={handleToggleNotify}
            soundPicker={<SoundSettings selected={chime} onSelect={setChime} />}
          />
        </div>

        {/* Mode selector */}
        <div className="mb-8">
          <ModeSelector
            modes={modes}
            active={active.id}
            onChange={setActive}
            onCustom={handleCustom}
            onDelete={handleDelete}
          />
        </div>

        {/* Main grid */}
        <div className="grid gap-8 lg:grid-cols-[1fr_400px] items-start">
          <section className="chunky-card-lg bg-cream p-8 md:p-10 flex justify-center">
            <Timer
              mode={active}
              onComplete={handleComplete}
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
