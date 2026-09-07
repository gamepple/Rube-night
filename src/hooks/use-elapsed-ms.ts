import { useEffect, useState } from "react";
import { useSleepStore } from "@/lib/sleep-store";

export function useElapsedMs() {
  const phase = useSleepStore((s) => s.phase);
  const accumulatedMs = useSleepStore((s) => s.accumulatedMs);
  const startedAt = useSleepStore((s) => s.startedAt);
  const lastSessionMs = useSleepStore((s) => s.lastSessionMs);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (phase !== "playing") return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [phase]);

  if (phase === "morning") return lastSessionMs;
  if (phase === "idle") return 0;
  return accumulatedMs + (startedAt ? now - startedAt : 0);
}
