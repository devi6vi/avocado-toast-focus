import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { ChimeSound, FocusSound } from "@/lib/chime";

export type Settings = {
  // Auto-flow
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  longBreakInterval: number; // every N pomodoros -> long break

  // Alarm (chime when timer finishes)
  alarmSound: ChimeSound;
  alarmVolume: number; // 0..1
  alarmRepeat: number; // 1..10

  // Focus background sound
  focusSound: FocusSound;
  focusVolume: number; // 0..1

  // Notifications
  notifyEnabled: boolean;

  // Tasks
  autoCheckTask: boolean;
};

const DEFAULTS: Settings = {
  autoStartBreaks: false,
  autoStartPomodoros: false,
  longBreakInterval: 4,
  alarmSound: "bell",
  alarmVolume: 0.8,
  alarmRepeat: 1,
  focusSound: "none",
  focusVolume: 0.4,
  notifyEnabled: false,
  autoCheckTask: false,
};

const STORAGE_KEY = "avocado-toast-settings-v1";

const load = (): Settings => {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return DEFAULTS;
  }
};

type Ctx = {
  settings: Settings;
  update: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  reset: () => void;
};

const SettingsContext = createContext<Ctx | null>(null);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings>(load);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)); } catch { /* ignore */ }
  }, [settings]);

  const value = useMemo<Ctx>(() => ({
    settings,
    update: (key, value) => setSettings((s) => ({ ...s, [key]: value })),
    reset: () => setSettings(DEFAULTS),
  }), [settings]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
};