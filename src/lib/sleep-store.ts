import { create } from "zustand";
import { DEFAULT_VIDEO_URL, parseYouTubeId } from "@/lib/youtube";

export type Phase = "idle" | "playing" | "paused" | "morning";

const STORAGE_KEY = "luves-night-settings";

type Settings = { videoUrl: string; volume: number };

function loadSettings(): Settings {
  if (typeof window === "undefined") {
    return { videoUrl: DEFAULT_VIDEO_URL, volume: 80 };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { videoUrl: DEFAULT_VIDEO_URL, volume: 80 };
    const parsed = JSON.parse(raw) as Partial<Settings>;
    const videoUrl =
      typeof parsed.videoUrl === "string" && parseYouTubeId(parsed.videoUrl)
        ? parsed.videoUrl
        : DEFAULT_VIDEO_URL;
    const volume =
      typeof parsed.volume === "number" ? Math.min(100, Math.max(0, parsed.volume)) : 80;
    return { videoUrl, volume };
  } catch {
    return { videoUrl: DEFAULT_VIDEO_URL, volume: 80 };
  }
}

function saveSettings(videoUrl: string, volume: number) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ videoUrl, volume }));
}

export interface SleepState {
  phase: Phase;
  videoUrl: string;
  volume: number;
  accumulatedMs: number;
  startedAt: number | null;
  lastSessionMs: number;
  playerReady: boolean;
  playerError: string | null;
  settingsOpen: boolean;
  setPlayerReady: (ready: boolean) => void;
  setPlayerError: (error: string | null) => void;
  setVolume: (volume: number) => void;
  setVideoUrl: (url: string) => boolean;
  setSettingsOpen: (open: boolean) => void;
  togglePower: () => void;
  endSession: () => void;
  returnToNight: () => void;
}

export const useSleepStore = create<SleepState>((set, get) => {
  const initial = loadSettings();
  return {
    phase: "idle",
    videoUrl: initial.videoUrl,
    volume: initial.volume,
    accumulatedMs: 0,
    startedAt: null,
    lastSessionMs: 0,
    playerReady: false,
    playerError: null,
    settingsOpen: false,
    setPlayerReady: (playerReady) => set({ playerReady }),
    setPlayerError: (playerError) => set({ playerError }),
    setVolume: (volume) => {
      const next = Math.min(100, Math.max(0, volume));
      set({ volume: next });
      saveSettings(get().videoUrl, next);
    },
    setVideoUrl: (url) => {
      const id = parseYouTubeId(url);
      if (!id) return false;
      const videoUrl = url.trim();
      set({ videoUrl, playerError: null, playerReady: false });
      saveSettings(videoUrl, get().volume);
      return true;
    },
    setSettingsOpen: (settingsOpen) => set({ settingsOpen }),
    togglePower: () => {
      const { phase } = get();
      if (phase === "morning") return;
      if (phase === "idle" || phase === "paused") {
        set({ phase: "playing", startedAt: Date.now() });
        return;
      }
      const { startedAt, accumulatedMs } = get();
      const extra = startedAt ? Date.now() - startedAt : 0;
      set({
        phase: "paused",
        startedAt: null,
        accumulatedMs: accumulatedMs + extra,
      });
    },
    endSession: () => {
      const { startedAt, accumulatedMs } = get();
      const extra = startedAt ? Date.now() - startedAt : 0;
      set({
        phase: "morning",
        startedAt: null,
        accumulatedMs: 0,
        lastSessionMs: accumulatedMs + extra,
        settingsOpen: false,
      });
    },
    returnToNight: () => {
      set({
        phase: "idle",
        accumulatedMs: 0,
        startedAt: null,
        lastSessionMs: 0,
        playerError: null,
      });
    },
  };
});
