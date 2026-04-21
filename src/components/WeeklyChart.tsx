import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts";
import type { DayCount } from "@/hooks/useCloudStats";

interface WeeklyChartProps {
  data: DayCount[];
  signedIn: boolean;
}

export const WeeklyChart = ({ data, signedIn }: WeeklyChartProps) => {
  const total = data.reduce((s, d) => s + d.count, 0);
  const max = Math.max(...data.map((d) => d.count), 1);
  const todayIdx = data.length - 1;

  return (
    <section className="chunky-card bg-cream p-5 md:p-6">
      <div className="flex items-end justify-between mb-3">
        <div>
          <h2 className="font-display text-xl text-forest leading-none">This week</h2>
          <p className="text-xs font-bold uppercase tracking-widest text-forest/60 mt-1">
            {signedIn ? `${total} pomodoros · last 7 days` : "Sign in to sync your stats"}
          </p>
        </div>
        <span className="text-2xl">📊</span>
      </div>
      <div className="h-40">
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
      </div>
    </section>
  );
};