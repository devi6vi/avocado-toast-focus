import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts";
import { Lock } from "lucide-react";
import type { DayCount } from "@/hooks/useCloudStats";

interface WeeklyChartProps {
  data: DayCount[];
  signedIn: boolean;
  isPremium?: boolean;
}

export const WeeklyChart = ({ data, signedIn, isPremium = false }: WeeklyChartProps) => {
  const total = data.reduce((s, d) => s + d.count, 0);
  const max = Math.max(...data.map((d) => d.count), 1);
  const todayIdx = data.length - 1;
  const locked = !isPremium;

  return (
    <section className="chunky-card bg-cream p-5 md:p-6">
      <div className="flex items-end justify-between mb-3">
        <div>
          <h2 className="font-display text-xl text-forest leading-none">This week</h2>
          <p className="text-xs font-bold uppercase tracking-widest text-forest/60 mt-1">
            {locked
              ? "Premium · weekly & yearly reports"
              : signedIn
                ? `${total} pomodoros · last 7 days`
                : "Sign in to sync your stats"}
          </p>
        </div>
        <span className="text-2xl">📊</span>
      </div>
      <div className="h-40 relative">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 4, left: -24, bottom: 0 }}>
            <XAxis
              dataKey="label"
              tick={{ fill: "hsl(var(--forest))", fontSize: 11, fontWeight: 700 }}
              axisLine={{ stroke: "hsl(var(--forest))", strokeWidth: 2 }}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              domain={[0, Math.max(max, 4)]}
              tick={{ fill: "hsl(var(--forest) / 0.6)", fontSize: 10, fontWeight: 700 }}
              axisLine={false}
              tickLine={false}
              width={32}
            />
            <Tooltip
              cursor={{ fill: "hsl(var(--forest) / 0.08)" }}
              contentStyle={{
                background: "hsl(var(--cream))",
                border: "3px solid hsl(var(--forest))",
                borderRadius: "12px",
                fontWeight: 700,
                color: "hsl(var(--forest))",
              }}
              formatter={(v: number) => [`${v} 🍅`, "Pomos"]}
            />
            <Bar dataKey="count" radius={[8, 8, 0, 0]} stroke="hsl(var(--forest))" strokeWidth={2}>
              {data.map((_, i) => (
                <Cell
                  key={i}
                  fill={i === todayIdx ? "hsl(var(--crisp-carrot))" : "hsl(var(--kiwi))"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        {locked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 backdrop-blur-md bg-cream/40 rounded-lg">
            <div className="chunky-card bg-sunshine px-3 py-2 flex items-center gap-2">
              <Lock className="h-4 w-4 text-forest" strokeWidth={2.5} />
              <span className="text-xs font-bold uppercase tracking-widest text-forest">
                Unlock with Pro
              </span>
            </div>
            <a
              href="#pricing"
              className="text-xs font-bold text-forest underline underline-offset-2 hover:text-carrot"
            >
              See plans →
            </a>
          </div>
        )}
      </div>
    </section>
  );
};