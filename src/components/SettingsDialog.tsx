import { Settings as SettingsIcon, Volume2, Bell, ListChecks, Music, Play } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSettings } from "@/hooks/useSettings";
import {
  CHIME_OPTIONS,
  ChimeSound,
  FOCUS_SOUND_OPTIONS,
  FocusSound,
  playChime,
  playFocusSound,
  stopFocusSound,
} from "@/lib/chime";

interface Props {
  onToggleNotify: () => void;
}

const Section = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
  <section className="rounded-2xl border-[2.5px] border-forest bg-background p-4">
    <h3 className="font-display text-sm uppercase tracking-widest text-forest flex items-center gap-2 mb-3">
      {icon} {title}
    </h3>
    <div className="space-y-3">{children}</div>
  </section>
);

const Row = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
  <div className="flex items-center justify-between gap-4">
    <div className="min-w-0">
      <div className="font-bold text-sm text-forest">{label}</div>
      {hint && <div className="text-[11px] text-forest/60">{hint}</div>}
    </div>
    <div className="shrink-0 flex items-center gap-2">{children}</div>
  </div>
);

export const SettingsDialog = ({ onToggleNotify }: Props) => {
  const { settings, update } = useSettings();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          aria-label="Open settings"
          title="Settings"
          className="chunky-btn h-12 w-12 flex items-center justify-center bg-cream text-forest"
        >
          <SettingsIcon className="h-5 w-5" strokeWidth={2.5} />
        </button>
      </DialogTrigger>
      <DialogContent className="chunky-card-lg bg-cream border-[3px] border-forest p-0 max-w-lg max-h-[88vh] overflow-y-auto">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="font-display text-3xl text-forest">Settings ⚙️</DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-4">
          {/* Timer flow */}
          <Section icon={<span>⏱️</span>} title="Timer">
            <Row label="Auto Start Breaks" hint="Begin break automatically when focus ends">
              <Switch
                checked={settings.autoStartBreaks}
                onCheckedChange={(v) => update("autoStartBreaks", v)}
              />
            </Row>
            <Row label="Auto Start Pomodoros" hint="Begin focus automatically when break ends">
              <Switch
                checked={settings.autoStartPomodoros}
                onCheckedChange={(v) => update("autoStartPomodoros", v)}
              />
            </Row>
            <Row label="Long Break Interval" hint="Every N pomodoros → long break">
              <Input
                type="number"
                min={1}
                max={12}
                value={settings.longBreakInterval}
                onChange={(e) => update("longBreakInterval", Math.max(1, Math.min(12, Number(e.target.value) || 1)))}
                className="w-16 h-9 text-center border-[2.5px] border-forest rounded-xl bg-background font-bold"
              />
            </Row>
          </Section>

          {/* Sound */}
          <Section icon={<Volume2 className="h-4 w-4" strokeWidth={2.5} />} title="Sound">
            <Row label="Alarm Sound">
              <Select
                value={settings.alarmSound}
                onValueChange={(v) => {
                  update("alarmSound", v as ChimeSound);
                  playChime(v as ChimeSound);
                }}
              >
                <SelectTrigger className="w-36 h-9 border-[2.5px] border-forest rounded-xl bg-background font-bold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="chunky-card bg-cream border-[2.5px] border-forest">
                  {CHIME_OPTIONS.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.emoji} {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <button
                onClick={() => playChime(settings.alarmSound)}
                aria-label="Preview alarm"
                className="h-9 w-9 rounded-lg border-[2.5px] border-forest bg-background flex items-center justify-center hover:bg-sunshine/40"
              >
                <Play className="h-3.5 w-3.5 fill-forest text-forest" />
              </button>
            </Row>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase text-forest/70">Alarm Volume</span>
                <span className="font-bold text-sm text-forest tabular-nums">{Math.round(settings.alarmVolume * 100)}</span>
              </div>
              <Slider
                value={[Math.round(settings.alarmVolume * 100)]}
                min={0}
                max={100}
                step={1}
                onValueChange={([v]) => update("alarmVolume", v / 100)}
              />
            </div>
            <Row label="Repeat" hint="How many times the chime plays">
              <Input
                type="number"
                min={1}
                max={10}
                value={settings.alarmRepeat}
                onChange={(e) => update("alarmRepeat", Math.max(1, Math.min(10, Number(e.target.value) || 1)))}
                className="w-16 h-9 text-center border-[2.5px] border-forest rounded-xl bg-background font-bold"
              />
            </Row>

            <div className="h-px bg-forest/20 my-2" />

            <Row label="Focus Sound" hint="Background ambience while focusing">
              <Select
                value={settings.focusSound}
                onValueChange={(v) => {
                  const next = v as FocusSound;
                  update("focusSound", next);
                  if (next === "none") stopFocusSound();
                  else playFocusSound(next, settings.focusVolume);
                }}
              >
                <SelectTrigger className="w-36 h-9 border-[2.5px] border-forest rounded-xl bg-background font-bold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="chunky-card bg-cream border-[2.5px] border-forest">
                  {FOCUS_SOUND_OPTIONS.map((f) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.emoji} {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Row>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase text-forest/70">Focus Volume</span>
                <span className="font-bold text-sm text-forest tabular-nums">{settings.focusVolume.toFixed(1)}</span>
              </div>
              <Slider
                value={[Math.round(settings.focusVolume * 100)]}
                min={0}
                max={100}
                step={5}
                onValueChange={([v]) => {
                  const vol = v / 100;
                  update("focusVolume", vol);
                  if (settings.focusSound !== "none") playFocusSound(settings.focusSound, vol);
                }}
              />
            </div>
          </Section>

          {/* Notifications */}
          <Section icon={<Bell className="h-4 w-4" strokeWidth={2.5} />} title="Notifications">
            <Row label="Browser Notifications" hint="Get notified when a session ends">
              <Switch checked={settings.notifyEnabled} onCheckedChange={() => onToggleNotify()} />
            </Row>
          </Section>

          {/* Tasks */}
          <Section icon={<ListChecks className="h-4 w-4" strokeWidth={2.5} />} title="Tasks">
            <Row label="Auto-check Task" hint="Tick the top task each time a focus session finishes">
              <Switch
                checked={settings.autoCheckTask}
                onCheckedChange={(v) => update("autoCheckTask", v)}
              />
            </Row>
          </Section>
        </div>
      </DialogContent>
    </Dialog>
  );
};