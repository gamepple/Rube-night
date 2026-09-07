import { useEffect } from "react";
import { useSleepStore } from "@/lib/sleep-store";

type WakeLockSentinel = { release: () => Promise<void> };

type WakeLockNavigator = Navigator & {
  wakeLock?: { request: (type: "screen") => Promise<WakeLockSentinel> };
};

export function useWakeLock() {
  const phase = useSleepStore((s) => s.phase);

  useEffect(() => {
    if (phase !== "playing") return;
    const nav = navigator as WakeLockNavigator;
    if (!nav.wakeLock) return;

    let sentinel: WakeLockSentinel | null = null;
    let cancelled = false;

    async function request() {
      try {
        sentinel = await nav.wakeLock!.request("screen");
      } catch {
        sentinel = null;
      }
    }

    function onVisibility() {
      if (cancelled) return;
      if (document.visibilityState === "visible" && useSleepStore.getState().phase === "playing") {
        void request();
      }
    }

    void request();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisibility);
      void sentinel?.release();
    };
  }, [phase]);
}
