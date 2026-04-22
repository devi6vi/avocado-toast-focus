import { useEffect, useState } from "react";
import { Check, Sparkles, Crown, Tag, X } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const FEATURES_FREE = [
  "Unlimited Pomodoros",
  "Custom timers & sounds",
  "Cloud sync across devices",
  "Today + streak stats",
];

const FEATURES_PRO = [
  "Everything in Free",
  "Weekly chart 📊",
  "No ads, ever 🚫",
  "More sounds & notifications 🔔",
  "Monthly tracking graphs & calendar 🗓️",
  "Connected to Google Sheets 📑",
];

interface PricingButtonProps {
  className?: string;
}

export const PricingButton = ({ className = "" }: PricingButtonProps) => {
  const [open, setOpen] = useState(false);

  // Allow other components (e.g. WeeklyChart "See plans") to open the dialog
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-pricing", handler);
    return () => window.removeEventListener("open-pricing", handler);
  }, []);

  const handleUpgrade = (plan: string) => {
    toast(`${plan} checkout coming soon 🥑`, {
      description: "Payments aren't wired up yet — stay tuned!",
    });
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`chunky-btn bg-carrot text-cream px-4 h-12 flex items-center gap-2 ${className}`}
      >
        <Tag className="h-4 w-4" strokeWidth={2.5} />
        <span className="text-sm">Pricing</span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="max-w-4xl border-0 bg-transparent shadow-none p-0 [&>button]:hidden"
        >
          <div className="chunky-card-lg bg-cream p-6 md:p-8 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute top-4 right-4 chunky-btn bg-cream h-9 w-9 flex items-center justify-center z-10"
            >
              <X className="h-4 w-4 text-forest" strokeWidth={2.5} />
            </button>

            <div className="text-center mb-6">
              <span className="inline-block chunky-card bg-sunshine px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-forest mb-3">
                Pricing 🥑
              </span>
              <DialogTitle asChild>
                <h2 className="font-display text-3xl md:text-4xl text-forest leading-none">
                  Go <span className="text-carrot">crunchy</span>, ditch the ads
                </h2>
              </DialogTitle>
              <DialogDescription asChild>
                <p className="text-forest/70 font-medium text-sm md:text-base mt-2">
                  Support the toast. Unlock deeper insights. Cancel anytime.
                </p>
              </DialogDescription>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {/* Free */}
              <article className="chunky-card bg-cream p-5 flex flex-col">
                <header className="mb-3">
                  <h3 className="font-display text-2xl text-forest leading-none">Free</h3>
                  <p className="text-xs font-bold uppercase tracking-widest text-forest/60 mt-2">
                    The crunchy basics
                  </p>
                </header>
                <div className="mb-4">
                  <span className="font-display text-4xl text-forest tabular-nums">$0</span>
                  <span className="text-forest/60 font-bold text-sm ml-1">/forever</span>
                </div>
                <ul className="space-y-2 mb-5 flex-1">
                  {FEATURES_FREE.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm font-medium text-forest">
                      <Check className="h-4 w-4 mt-0.5 text-kiwi shrink-0" strokeWidth={3} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  disabled
                  className="chunky-btn bg-cream text-forest/60 h-11 w-full cursor-not-allowed"
                >
                  Current plan
                </button>
              </article>

              {/* Monthly Pro */}
              <article className="chunky-card-lg bg-kiwi/30 p-5 flex flex-col relative">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 chunky-card bg-carrot text-cream px-3 py-1 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 whitespace-nowrap">
                  <Sparkles className="h-3 w-3" strokeWidth={3} /> Most popular
                </span>
                <header className="mb-3 mt-2">
                  <h3 className="font-display text-2xl text-forest leading-none">Pro Monthly</h3>
                  <p className="text-xs font-bold uppercase tracking-widest text-forest/60 mt-2">
                    All the toppings
                  </p>
                </header>
                <div className="mb-4">
                  <span className="font-display text-4xl text-forest tabular-nums">$2</span>
                  <span className="text-forest/60 font-bold text-sm ml-1">/month</span>
                </div>
                <ul className="space-y-2 mb-5 flex-1">
                  {FEATURES_PRO.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm font-medium text-forest">
                      <Check className="h-4 w-4 mt-0.5 text-carrot shrink-0" strokeWidth={3} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleUpgrade("Pro Monthly")}
                  className="chunky-btn bg-carrot text-cream h-11 w-full"
                >
                  Upgrade — $2/mo
                </button>
              </article>

              {/* Yearly Pro */}
              <article className="chunky-card bg-cream p-5 flex flex-col relative">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 chunky-card bg-sunshine text-forest px-3 py-1 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 whitespace-nowrap">
                  <Crown className="h-3 w-3" strokeWidth={3} /> Save 37%
                </span>
                <header className="mb-3 mt-2">
                  <h3 className="font-display text-2xl text-forest leading-none">Pro Yearly</h3>
                  <p className="text-xs font-bold uppercase tracking-widest text-forest/60 mt-2">
                    Best value
                  </p>
                </header>
                <div className="mb-4">
                  <span className="font-display text-4xl text-forest tabular-nums">$15</span>
                  <span className="text-forest/60 font-bold text-sm ml-1">/year</span>
                  <p className="text-xs font-bold text-kiwi mt-1">≈ $1.25/month</p>
                </div>
                <ul className="space-y-2 mb-5 flex-1">
                  {FEATURES_PRO.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm font-medium text-forest">
                      <Check className="h-4 w-4 mt-0.5 text-kiwi shrink-0" strokeWidth={3} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleUpgrade("Pro Yearly")}
                  className="chunky-btn bg-sunshine text-forest h-11 w-full"
                >
                  Upgrade — $15/yr
                </button>
              </article>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
