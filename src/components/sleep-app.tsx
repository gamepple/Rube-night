import { Settings } from "lucide-react";
import { MorningView } from "@/components/morning-view";
import { NightSky } from "@/components/night-sky";
import { PowerButton } from "@/components/power-button";
import { SettingsPanel } from "@/components/settings-panel";
import { YouTubeAudio } from "@/components/youtube-audio";
import { formatElapsedClock } from "@/lib/format";
import { useElapsedMs } from "@/hooks/use-elapsed-ms";
import { useWakeLock } from "@/hooks/use-wake-lock";
import { useSleepStore } from "@/lib/sleep-store";

export function SleepApp() {
  const phase = useSleepStore((s) => s.phase);
  const playerError = useSleepStore((s) => s.playerError);
  const togglePower = useSleepStore((s) => s.togglePower);
  const endSession = useSleepStore((s) => s.endSession);
  const setSettingsOpen = useSleepStore((s) => s.setSettingsOpen);
  const elapsed = useElapsedMs();
  useWakeLock();

  const playing = phase === "playing";
  const paused = phase === "paused";
  const morning = phase === "morning";

  return (
    <main className={morning ? "app is-dawn" : "app"}>
      <NightSky lit={playing} dawn={morning} />
      <YouTubeAudio />

      {morning ? (
        <MorningView />
      ) : (
        <>
          <header className="top-bar">
            <p className="brand">루베의 밤</p>
            <button
              type="button"
              className="icon-btn"
              aria-label="소리 설정"
              onClick={() => setSettingsOpen(true)}
            >
              <Settings className="size-4" strokeWidth={1.6} />
            </button>
          </header>

          <div className="stage">
            <div className="greeting">
              <p className="eyebrow">
                {playing ? "이제 괜찮아요" : paused ? "아직 여기 있어요" : "오늘 밤"}
              </p>
              <h1 className="night-title">{playing || paused ? "잘 자요" : "잘 자, 루베"}</h1>
              <p className="night-sub">
                {playing
                  ? "화면은 잊어도 돼요. 소리만 견에 둘게요."
                  : paused
                    ? "잠시 멈춰어요. 다시 켜거나, 아침을 맞을 수 있어요."
                    : "버튼을 켜면 영상 없이, 소리만 흘러요."}
              </p>
            </div>

            <PowerButton on={playing} paused={paused} onToggle={togglePower} />

            <div className="status">
              {playing || paused ? (
                <p className="timer" aria-live="polite">
                  <span className="timer-label">잠든 시간</span>
                  <span className="timer-value">{formatElapsedClock(elapsed)}</span>
                </p>
              ) : (
                <p className="timer-placeholder">전원만 켜 두면 돼요</p>
              )}
              {playerError ? <p className="player-error">{playerError}</p> : null}
            </div>

            {paused ? (
              <button type="button" className="end-btn" onClick={endSession}>
                종료하기
              </button>
            ) : (
              <div className="end-btn-slot" />
            )}
          </div>
        </>
      )}

      <SettingsPanel />
    </main>
  );
}
