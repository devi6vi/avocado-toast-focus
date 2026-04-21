import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "avocado-toast-stats-v1";

type StatsState = {
  todayKey: string; // YYYY-MM-DD
  todayCount: number;
  totalCount: number;
  streak: number;
  lastDayKey: string | null; // last day a pomo was completed
};

const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const yesterdayKey = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const defaults = (): StatsState => ({
  todayKey: todayKey(),
  todayCount: 0,
  totalCount: 0,
  streak: 0,
  lastDayKey: null,
});

const load = (): StatsState => {
  if (typeof window === "undefined") return defaults();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults();
    const parsed = JSON.parse(raw) as StatsState;
    const today = todayKey();
    // Roll over day
    if (parsed.todayKey !== today) {
      // If last completion wasn't yesterday or today, streak resets
      const y = yesterdayKey();
      const stillStreaking = parsed.lastDayKey === y || parsed.lastDayKey === today;
      return {
        ...parsed,
        todayKey: today,
        todayCount: 0,
        streak: stillStreaking ? parsed.streak : 0,
      };
    }
    return parsed;
  } catch {
    return defaults();
  }
};

export const usePomodoroStats = () => {
  const [stats, setStats] = useState<StatsState>(defaults);

  useEffect(() => {
    setStats(load());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  }, [stats]);

  const recordPomodoro = useCallback(() => {
    setStats((prev) => {
      const today = todayKey();
      const y = yesterdayKey();
      let streak = prev.streak;
      if (prev.lastDayKey === today) {
        // already counted today, streak unchanged
      } else if (prev.lastDayKey === y) {
        streak = prev.streak + 1;
      } else {
        streak = 1;
      }
      const sameDay = prev.todayKey === today;
      return {
        todayKey: today,
        todayCount: (sameDay ? prev.todayCount : 0) + 1,
        totalCount: prev.totalCount + 1,
        streak,
        lastDayKey: today,
      };
    });
  }, []);

  const reset = useCallback(() => setStats(defaults()), []);

  return { ...stats, recordPomodoro, reset };
};