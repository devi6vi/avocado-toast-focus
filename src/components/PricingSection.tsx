import { Check, Sparkles, Crown } from "lucide-react";
import { toast } from "sonner";

const FEATURES_FREE = [
  "Unlimited Pomodoros",
  "Custom timers & sounds",
  "Cloud sync across devices",
  "Today + streak stats",
];

const FEATURES_PRO = [
  "Everything in Free",
  "No ads, ever 🚫",
  "Weekly & yearly reports 📊",
  "Priority support 💌",
];

export const PricingSection = () => {
  const handleUpgrade = (plan: string) => {
    toast(`${plan} checkout coming soon 🥑`, {
      description: "Payments aren't wired up yet — stay tuned!",
    });
  };

  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className="mb-10"
    >
      <div className="text-center mb-6">
        <span className="inline-block chunky-card bg-sunshine px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-forest mb-3">
          Pricing 🥑
        </span>
        <h2
          id="pricing-heading"
          className="font-display text-3xl md:text-4xl text-forest leading-none"
        >
          Go <span className="text-carrot">crunchy</span>, ditch the ads
        </h2>
        <p className="text-forest/70 font-medium text-sm md:text-base mt-2">
          Support the toast. Unlock deeper insights. Cancel anytime.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {/* Free */}
        <article className="chunky-card bg-cream p-6 flex flex-col">
          <header className="mb-4">
            <h3 className="font-display text-2xl text-forest leading-none">Free</h3>
            <p className="text-xs font-bold uppercase tracking-widest text-forest/60 mt-2">
              The crunchy basics
            </p>
          </header>
          <div className="mb-5">
            <span className="font-display text-5xl text-forest tabular-nums">$0</span>
            <span className="text-forest/60 font-bold text-sm ml-1">/forever</span>
          </div>
          <ul className="space-y-2 mb-6 flex-1">
            {FEATURES_FREE.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm font-medium text-forest">
                <Check className="h-4 w-4 mt-0.5 text-kiwi shrink-0" strokeWidth={3} />
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <button
            disabled
            className="chunky-btn bg-cream text-forest/60 h-12 w-full cursor-not-allowed"
          >
            Current plan
          </button>
        </article>

        {/* Monthly Pro */}
        <article className="chunky-card-lg bg-kiwi/30 p-6 flex flex-col relative">
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 chunky-card bg-carrot text-cream px-3 py-1 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
            <Sparkles className="h-3 w-3" strokeWidth={3} /> Most popular
          </span>
          <header className="mb-4">
            <h3 className="font-display text-2xl text-forest leading-none">Pro Monthly</h3>
            <p className="text-xs font-bold uppercase tracking-widest text-forest/60 mt-2">
              All the toppings
            </p>
          </header>
          <div className="mb-5">
            <span className="font-display text-5xl text-forest tabular-nums">$2</span>
            <span className="text-forest/60 font-bold text-sm ml-1">/month</span>
          </div>
          <ul className="space-y-2 mb-6 flex-1">
            {FEATURES_PRO.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm font-medium text-forest">
                <Check className="h-4 w-4 mt-0.5 text-carrot shrink-0" strokeWidth={3} />
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <button
            onClick={() => handleUpgrade("Pro Monthly")}
            className="chunky-btn bg-carrot text-cream h-12 w-full"
          >
            Upgrade — $2/mo
          </button>
        </article>

        {/* Yearly Pro */}
        <article className="chunky-card bg-cream p-6 flex flex-col relative">
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 chunky-card bg-sunshine text-forest px-3 py-1 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
            <Crown className="h-3 w-3" strokeWidth={3} /> Save 37%
          </span>
          <header className="mb-4">
            <h3 className="font-display text-2xl text-forest leading-none">Pro Yearly</h3>
            <p className="text-xs font-bold uppercase tracking-widest text-forest/60 mt-2">
              Best value
            </p>
          </header>
          <div className="mb-5">
            <span className="font-display text-5xl text-forest tabular-nums">$15</span>
            <span className="text-forest/60 font-bold text-sm ml-1">/year</span>
            <p className="text-xs font-bold text-kiwi mt-1">≈ $1.25/month</p>
          </div>
          <ul className="space-y-2 mb-6 flex-1">
            {FEATURES_PRO.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm font-medium text-forest">
                <Check className="h-4 w-4 mt-0.5 text-kiwi shrink-0" strokeWidth={3} />
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <button
            onClick={() => handleUpgrade("Pro Yearly")}
            className="chunky-btn bg-sunshine text-forest h-12 w-full"
          >
            Upgrade — $15/yr
          </button>
        </article>
      </div>
    </section>
  );
};