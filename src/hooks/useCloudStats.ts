import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export type DayCount = { date: string; label: string; count: number };

const dayKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const WEEK_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const buildEmptyWeek = (): DayCount[] => {
  const out: DayCount[] = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    out.push({ date: dayKey(d), label: WEEK_LABELS[d.getDay()], count: 0 });
  }
  return out;
};

export const useCloudStats = (user: User | null) => {
  const [todayCount, setTodayCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [weekly, setWeekly] = useState<DayCount[]>(buildEmptyWeek);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setTodayCount(0);
      setStreak(0);
      setWeekly(buildEmptyWeek());
      return;
    }
    setLoading(true);
    const since = new Date();
    since.setDate(since.getDate() - 60);
    since.setHours(0, 0, 0, 0);
    const { data, error } = await supabase
      .from("pomodoro_sessions")
      .select("completed_at")
      .gte("completed_at", since.toISOString())
      .order("completed_at", { ascending: false });
    setLoading(false);
    if (error || !data) return;

    // Bucket by local day
    const byDay = new Map<string, number>();
    for (const row of data) {
      const d = new Date(row.completed_at);
      const k = dayKey(d);
      byDay.set(k, (byDay.get(k) ?? 0) + 1);
    }

    // Weekly (last 7 days incl today)
    const week = buildEmptyWeek().map((d) => ({ ...d, count: byDay.get(d.date) ?? 0 }));
    setWeekly(week);

    // Today
    const todayK = dayKey(new Date());
    setTodayCount(byDay.get(todayK) ?? 0);

    // Streak: walk back from today (or yesterday if today empty)
    let streakCount = 0;
    const cursor = new Date();
    if (!byDay.has(todayK)) cursor.setDate(cursor.getDate() - 1);
    while (byDay.has(dayKey(cursor))) {
      streakCount++;
      cursor.setDate(cursor.getDate() - 1);
    }
    setStreak(streakCount);
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const recordPomodoro = useCallback(
    async (modeLabel: string, durationSeconds: number) => {
      if (!user) return;
      const { error } = await supabase.from("pomodoro_sessions").insert({
        user_id: user.id,
        mode_label: modeLabel,
        duration_seconds: durationSeconds,
      });
      if (!error) await refresh();
    },
    [user, refresh],
  );

  return { todayCount, streak, weekly, loading, recordPomodoro, refresh };
};