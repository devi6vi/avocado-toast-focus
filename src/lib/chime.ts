// Soft chimes using WebAudio — no asset required.
let ctx: AudioContext | null = null;

const getCtx = () => {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  return ctx;
};

type ToneOpts = {
  type?: OscillatorType;
  dur?: number;
  gain?: number;
};

const tone = (freq: number, start: number, opts: ToneOpts = {}) => {
  const { type = "sine", dur = 0.9, gain = 0.18 } = opts;
  const ac = getCtx();
  if (!ac) return;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(0, ac.currentTime + start);
  g.gain.linearRampToValueAtTime(gain, ac.currentTime + start + 0.04);
  g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + start + dur);
  osc.connect(g).connect(ac.destination);
  osc.start(ac.currentTime + start);
  osc.stop(ac.currentTime + start + dur + 0.05);
};

export type ChimeSound = "bell" | "marimba" | "pop" | "zen" | "arcade";

export const CHIME_OPTIONS: { id: ChimeSound; label: string; emoji: string; description: string }[] = [
  { id: "bell", label: "Soft Bell", emoji: "🔔", description: "Gentle 3-note arpeggio" },
  { id: "marimba", label: "Marimba", emoji: "🪵", description: "Warm wooden tones" },
  { id: "pop", label: "Pop", emoji: "🫧", description: "Quick, cheerful blip" },
  { id: "zen", label: "Zen", emoji: "🧘", description: "Calm singing bowl" },
  { id: "arcade", label: "Arcade", emoji: "🕹️", description: "Retro 8-bit ding" },
];

const players: Record<ChimeSound, () => void> = {
  bell: () => {
    tone(523.25, 0);
    tone(659.25, 0.18);
    tone(783.99, 0.36, { dur: 1.1, gain: 0.2 });
  },
  marimba: () => {
    tone(392, 0, { type: "triangle", dur: 0.5, gain: 0.22 });
    tone(523.25, 0.12, { type: "triangle", dur: 0.5, gain: 0.22 });
    tone(659.25, 0.24, { type: "triangle", dur: 0.7, gain: 0.22 });
  },
  pop: () => {
    tone(880, 0, { type: "sine", dur: 0.18, gain: 0.22 });
    tone(1318.5, 0.08, { type: "sine", dur: 0.22, gain: 0.2 });
  },
  zen: () => {
    tone(329.63, 0, { type: "sine", dur: 1.8, gain: 0.18 });
    tone(493.88, 0.05, { type: "sine", dur: 1.8, gain: 0.12 });
  },
  arcade: () => {
    tone(659.25, 0, { type: "square", dur: 0.12, gain: 0.12 });
    tone(987.77, 0.12, { type: "square", dur: 0.18, gain: 0.12 });
  },
};

export const playChime = (sound: ChimeSound = "bell") => {
  const ac = getCtx();
  if (!ac) return;
  if (ac.state === "suspended") ac.resume();
  (players[sound] ?? players.bell)();
};

export const requestNotifyPermission = async () => {
  if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";
  if (Notification.permission === "default") {
    try {
      return await Notification.requestPermission();
    } catch {
      return "denied";
    }
  }
  return Notification.permission;
};

export const sendNotification = (title: string, body: string) => {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;
  try {
    new Notification(title, { body, icon: "/favicon.ico" });
  } catch {
    // ignore
  }
};