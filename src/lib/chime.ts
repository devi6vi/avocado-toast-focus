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

/** Play the chime several times in a row, spaced ~1.4s apart. */
export const playChimeRepeat = (sound: ChimeSound = "bell", times = 1) => {
  const n = Math.max(1, Math.min(10, Math.floor(times)));
  for (let i = 0; i < n; i++) {
    setTimeout(() => playChime(sound), i * 1400);
  }
};

/* ---------- Focus background sounds (looping ambience) ---------- */
export type FocusSound = "none" | "rain" | "brown-noise" | "lofi-hum" | "fireplace";

export const FOCUS_SOUND_OPTIONS: { id: FocusSound; label: string; emoji: string }[] = [
  { id: "none", label: "None", emoji: "🚫" },
  { id: "rain", label: "Rain", emoji: "🌧️" },
  { id: "brown-noise", label: "Brown Noise", emoji: "🟤" },
  { id: "lofi-hum", label: "Lofi Hum", emoji: "🎧" },
  { id: "fireplace", label: "Fireplace", emoji: "🔥" },
];

let focusNodes: { stop: () => void } | null = null;

const makeNoiseBuffer = (ac: AudioContext, kind: "white" | "brown" | "pink") => {
  const len = ac.sampleRate * 2;
  const buffer = ac.createBuffer(1, len, ac.sampleRate);
  const data = buffer.getChannelData(0);
  let lastOut = 0;
  for (let i = 0; i < len; i++) {
    const white = Math.random() * 2 - 1;
    if (kind === "white") data[i] = white;
    else if (kind === "brown") {
      lastOut = (lastOut + 0.02 * white) / 1.02;
      data[i] = lastOut * 3.5;
    } else {
      // simple pink
      lastOut = 0.98 * lastOut + 0.02 * white;
      data[i] = lastOut * 2.5;
    }
  }
  return buffer;
};

export const stopFocusSound = () => {
  if (focusNodes) {
    try { focusNodes.stop(); } catch { /* ignore */ }
    focusNodes = null;
  }
};

export const playFocusSound = (sound: FocusSound, volume = 0.4) => {
  stopFocusSound();
  if (sound === "none") return;
  const ac = getCtx();
  if (!ac) return;
  if (ac.state === "suspended") ac.resume();

  const master = ac.createGain();
  master.gain.value = Math.max(0, Math.min(1, volume));
  master.connect(ac.destination);

  const stoppers: Array<() => void> = [];

  if (sound === "rain") {
    const src = ac.createBufferSource();
    src.buffer = makeNoiseBuffer(ac, "pink");
    src.loop = true;
    const hp = ac.createBiquadFilter();
    hp.type = "highpass"; hp.frequency.value = 600;
    src.connect(hp).connect(master);
    src.start();
    stoppers.push(() => src.stop());
  } else if (sound === "brown-noise") {
    const src = ac.createBufferSource();
    src.buffer = makeNoiseBuffer(ac, "brown");
    src.loop = true;
    src.connect(master);
    src.start();
    stoppers.push(() => src.stop());
  } else if (sound === "lofi-hum") {
    const src = ac.createBufferSource();
    src.buffer = makeNoiseBuffer(ac, "pink");
    src.loop = true;
    const lp = ac.createBiquadFilter();
    lp.type = "lowpass"; lp.frequency.value = 800;
    src.connect(lp).connect(master);
    src.start();
    stoppers.push(() => src.stop());

    const osc = ac.createOscillator();
    osc.type = "sine"; osc.frequency.value = 110;
    const og = ac.createGain(); og.gain.value = 0.05;
    osc.connect(og).connect(master);
    osc.start();
    stoppers.push(() => osc.stop());
  } else if (sound === "fireplace") {
    const src = ac.createBufferSource();
    src.buffer = makeNoiseBuffer(ac, "brown");
    src.loop = true;
    const lp = ac.createBiquadFilter();
    lp.type = "lowpass"; lp.frequency.value = 1200;
    src.connect(lp).connect(master);
    src.start();
    stoppers.push(() => src.stop());
    // crackles
    const crackle = window.setInterval(() => {
      const t = ac.currentTime;
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = "square"; o.frequency.value = 1200 + Math.random() * 800;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.08, t + 0.005);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
      o.connect(g).connect(master);
      o.start(t); o.stop(t + 0.07);
    }, 220);
    stoppers.push(() => window.clearInterval(crackle));
  }

  focusNodes = {
    stop: () => { stoppers.forEach((s) => { try { s(); } catch { /* ignore */ } }); master.disconnect(); },
  };
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