import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Timer, TimerMode } from "@/components/Timer";
import { ModeSelector } from "@/components/ModeSelector";
import { TaskList, TaskListHandle } from "@/components/TaskList";
import { StatsBar } from "@/components/StatsBar";
import { SettingsDialog } from "@/components/SettingsDialog";
import { AuthBar } from "@/components/AuthBar";
import { WeeklyChart } from "@/components/WeeklyChart";
import { PricingButton } from "@/components/PricingSection";
import { useAuth } from "@/hooks/useAuth";
import { useCloudStats } from "@/hooks/useCloudStats";
import { useSettings } from "@/hooks/useSettings";
import {
  playChimeRepeat,
  playFocusSound,
  stopFocusSound,
  requestNotifyPermission,
  sendNotification,
} from "@/lib/chime";
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
  const [autoStart, setAutoStart] = useState(false);
  const completedFocusRef = useRef(0); // counts toward long-break interval
  const taskListRef = useRef<TaskListHandle>(null);
  const { user } = useAuth();
  const { todayCount, streak, weekly, recordPomodoro } = useCloudStats(user);
  const { settings, update } = useSettings();

  const handleToggleNotify = async () => {
    if (!settings.notifyEnabled) {
      const result = await requestNotifyPermission();
      if (result === "granted") {
        update("notifyEnabled", true);
        toast("Notifications on 🔔");
      } else if (result === "unsupported") {
        toast("Notifications not supported in this browser");
      } else {
        toast("Notification permission denied", {
          description: "Enable it in your browser settings.",
        });
      }
    } else {
      update("notifyEnabled", false);
      toast("Notifications off");
    }
  };

  const isFocusMode = (m: TimerMode) =>
    m.id === "pomo" || m.id === "deep" || m.id.startsWith("custom-focus");
  const isBreakMode = (m: TimerMode) =>
    m.id === "short" || m.id === "long" || m.id.startsWith("custom-break");

  const handleComplete = () => {
    playChimeRepeat(settings.alarmSound, settings.alarmRepeat);
    if (settings.notifyEnabled)
      sendNotification("Avocado Toast 🥑", `${active.label} done — your toast is ready!`);
    stopFocusSound();

    const wasFocus = isFocusMode(active);
    if (wasFocus) {
      if (user) {
        recordPomodoro(active.label, active.duration);
      } else {
        toast("Sign in to save this 🥑 to the cloud");
      }
      // Auto-check next task
      if (settings.autoCheckTask) {
        const checked = taskListRef.current?.checkTopTask();
        if (checked) toast(`Auto-checked: ${checked} ✅`);
      }
      completedFocusRef.current += 1;
    }

    toast(`${active.label} done! Time for a bite 🥑`, {
      description: "Great work — your toast is ready.",
    });

    // Auto-flow between focus and break
    if (wasFocus && settings.autoStartBreaks) {
      const useLong =
        completedFocusRef.current > 0 &&
        completedFocusRef.current % Math.max(1, settings.longBreakInterval) === 0;
      const nextBreak =
        modes.find((m) => (useLong ? m.id === "long" : m.id === "short")) ?? null;
      if (nextBreak) {
        setAutoStart(true);
        setActive(nextBreak);
      }
    } else if (isBreakMode(active) && settings.autoStartPomodoros) {
      const nextFocus = modes.find((m) => m.id === "pomo") ?? modes.find(isFocusMode) ?? null;
      if (nextFocus) {
        setAutoStart(true);
        setActive(nextFocus);
      }
    }
  };

  // Manual mode change clears autoStart so the user controls Start
  const handleModeChange = (m: TimerMode) => {
    setAutoStart(false);
    setActive(m);
  };

  // Drive the focus background sound: play during focus mode, stop otherwise
  useEffect(() => {
    if (settings.focusSound !== "none" && isFocusMode(active)) {
      playFocusSound(settings.focusSound, settings.focusVolume);
    } else {
      stopFocusSound();
    }
    return () => stopFocusSound();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active.id, settings.focusSound, settings.focusVolume]);

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
    handleModeChange(focusMode);
    toast(`"${focusName}" set: ${focusMin}min focus / ${breakMin}min break 🥑`);
  };

  const handleDelete = (id: string) => {
    setModes((prev) => {
      const next = prev.filter((m) => m.id !== id);
      if (active.id === id) {
        handleModeChange(next[0] ?? DEFAULT_MODES[0]);
      }
      return next;
    });
    toast("Custom timer removed");
  };

  return (
    <main className="min-h-screen px-4 py-8 md:py-12">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <header className="relative mb-10 text-center">
          <div className="absolute right-4 top-4 md:right-8 md:top-8 flex flex-col items-end gap-2">
            <AuthBar user={user} />
            <PricingButton />
          </div>
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
            settingsButton={<SettingsDialog onToggleNotify={handleToggleNotify} />}
          />
        </div>

        {/* Mode selector */}
        <div className="mb-8">
          <ModeSelector
            modes={modes}
            active={active.id}
            onChange={handleModeChange}
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
              autoStart={autoStart}
            />
          </section>

          <aside className="space-y-6">
            <WeeklyChart data={weekly} signedIn={!!user} isPremium={false} />
            <TaskList ref={taskListRef} />
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
