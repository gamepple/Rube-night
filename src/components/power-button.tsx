import { Power } from "lucide-react";
import { cn } from "@/lib/utils";

type PowerButtonProps = {
  on: boolean;
  paused: boolean;
  onToggle: () => void;
};

export function PowerButton({ on, paused, onToggle }: PowerButtonProps) {
  const label = on ? "일시정지" : paused ? "다시 듣기" : "소리 켜기";

  return (
    <button
      type="button"
      className={cn("power", on && "is-on", paused && "is-paused")}
      aria-label={label}
      aria-pressed={on}
      onClick={onToggle}
    >
      <span className="power-halo" />
      <span className="power-ring" />
      <span className="power-core">
        <Power className="power-icon" strokeWidth={1.5} />
      </span>
    </button>
  );
}
