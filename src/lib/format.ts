export function formatElapsedClock(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

export function formatElapsedKorean(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  if (h === 0 && m === 0) return "잠시";
  if (h === 0) return `${m}분`;
  if (m === 0) return `${h}시간`;
  return `${h}시간 ${m}분`;
}

export function formatToday(date = new Date()) {
  const weekday = date.toLocaleDateString("ko-KR", { weekday: "long" });
  const dateLabel = date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const hour = date.getHours();
  let greeting = "좋은 하루예요";
  if (hour < 5) greeting = "아직 새벽이에요";
  else if (hour < 11) greeting = "좋은 아침이에요";
  else if (hour < 17) greeting = "좋은 오후예요";
  else if (hour < 21) greeting = "좋은 저녁이에요";
  else greeting = "밤이 깊었어요";
  return { weekday, dateLabel, greeting, hour };
}
