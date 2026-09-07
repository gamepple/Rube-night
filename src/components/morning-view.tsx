import { useEffect, useState } from "react";
import { Cloud, Droplets, Quote, Thermometer, Wind } from "lucide-react";
import { formatElapsedKorean, formatToday } from "@/lib/format";
import { quoteForToday } from "@/lib/quotes";
import { fetchWeather, type WeatherInfo } from "@/lib/weather";
import { useSleepStore } from "@/lib/sleep-store";

export function MorningView() {
  const lastSessionMs = useSleepStore((s) => s.lastSessionMs);
  const returnToNight = useSleepStore((s) => s.returnToNight);
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [weatherState, setWeatherState] = useState<"loading" | "ready" | "error">("loading");
  const today = formatToday();
  const quote = quoteForToday();
  const slept = formatElapsedKorean(lastSessionMs);

  useEffect(() => {
    let alive = true;
    fetchWeather()
      .then((info) => {
        if (!alive) return;
        setWeather(info);
        setWeatherState("ready");
      })
      .catch(() => {
        if (!alive) return;
        setWeatherState("error");
      });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section className="morning" aria-live="polite">
      <p className="eyebrow">{today.greeting}</p>
      <h1 className="morning-title">좋은 하루 보내, 루베</h1>
      <p className="morning-date">
        오늘은 <em>{today.weekday}</em>
        <span aria-hidden="true"> · </span>
        {today.dateLabel}
      </p>

      <div className="morning-card">
        {weatherState === "loading" ? (
          <p className="morning-muted">하늘을 들여다보는 중…</p>
        ) : weatherState === "error" ? (
          <p className="morning-muted">날씨는 잠시 쉬고 있어요. 창밖을 한 번 보아도 좋아요.</p>
        ) : weather ? (
          <>
            <p className="weather-place">
              {weather.place}
              <span aria-hidden="true"> · </span>
              {weather.label}
            </p>
            <p className="weather-temp">{weather.temperature}°</p>
            <p className="weather-detail">{weather.detail}</p>
            <ul className="weather-meta">
              <li>
                <Thermometer className="size-3.5" strokeWidth={1.6} />
                체감 {weather.apparent}°
              </li>
              <li>
                <Droplets className="size-3.5" strokeWidth={1.6} />
                습도 {weather.humidity}%
              </li>
              <li>
                <Wind className="size-3.5" strokeWidth={1.6} />
                바람 {weather.wind}m/s
              </li>
            </ul>
          </>
        ) : null}
      </div>

      <p className="sleep-summary">
        {lastSessionMs < 60_000
          ? "짧은 쉬이었어요. 그래도 멈춘 건 잘한 일이에요."
          : `지난밤, ${slept} 동안 소리를 견에 두었어요.`}
      </p>

      <blockquote className="morning-quote">
        <Quote className="quote-mark" strokeWidth={1.4} />
        <p>{quote}</p>
      </blockquote>

      <button type="button" className="back-to-night" onClick={returnToNight}>
        <Cloud className="size-4" strokeWidth={1.6} />
        다시, 밤으로
      </button>
    </section>
  );
}
