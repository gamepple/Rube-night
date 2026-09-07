const DEFAULT_VIDEO_URL = "https://youtu.be/-u98Ob6R8AU";
const DEFAULT_VIDEO_ID = "-u98Ob6R8AU";
const STORAGE_KEY = "rube-night-settings";
const SEOUL = { lat: 37.5665, lon: 126.978, place: "서울" };
const ID_RE = /^[\w-]{11}$/;

const QUOTES = [
  "천천히 일어나도, 하루는 너를 기다려 준다.",
  "잘 쉰 마음은 더 멀리 간다.",
  "새로운 하루는 아직 아무 말도 하지 않았다.",
  "숨이 고르다면, 이미 충분히 잘한 것이다.",
  "밤은 너를 비난하지 않는다. 아침도 마찬가지다.",
  "오늘 해야 할 일은, 오늘을 부드럽게 시작하는 일이다.",
  "별이 진 자리에도 빛은 남는다.",
  "서두르지 않아도 계절은 너를 지나치지 않는다.",
  "쉼은 멈춤이 아니라, 다시 걷기 위한 정렬이다.",
  "네가 눈을 뜨는 순간, 세상은 다시 한 번 너를 맞이한다.",
];

function parseYouTubeId(input) {
  const trimmed = String(input || "").trim();
  if (!trimmed) return null;
  if (ID_RE.test(trimmed)) return trimmed;
  try {
    const url = new URL(trimmed);
    const host = url.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0]?.slice(0, 11);
      return id && ID_RE.test(id) ? id : null;
    }
    if (
      host === "youtube.com" ||
      host === "m.youtube.com" ||
      host === "music.youtube.com" ||
      host === "youtube-nocookie.com"
    ) {
      const v = url.searchParams.get("v");
      if (v && ID_RE.test(v)) return v;
      const parts = url.pathname.split("/").filter(Boolean);
      const nestedId = parts[1];
      if (
        nestedId &&
        (parts[0] === "embed" || parts[0] === "shorts" || parts[0] === "live" || parts[0] === "v") &&
        ID_RE.test(nestedId)
      ) {
        return nestedId;
      }
    }
  } catch {
    return null;
  }
  return null;
}

function youtubeErrorMessage(code) {
  if (code === 2) return "영상 주소가 올바르지 않아요.";
  if (code === 100) return "영상을 찾을 수 없어요.";
  if (code === 101 || code === 150) return "이 영상은 여기서 재생할 수 없어요.";
  return "소리를 불러오지 못했어요. 링크를 확인해 주세요.";
}

function loadSettings() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
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

function saveSettings(videoUrl, volume) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ videoUrl, volume }));
}

function formatElapsedClock(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

function formatElapsedKorean(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  if (h === 0 && m === 0) return "잠시";
  if (h === 0) return `${m}분`;
  if (m === 0) return `${h}시간`;
  return `${h}시간 ${m}분`;
}

function formatToday(date = new Date()) {
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
  return { weekday, dateLabel, greeting };
}

function quoteForToday(date = new Date()) {
  const key = date.getFullYear() * 400 + date.getMonth() * 32 + date.getDate();
  return QUOTES[key % QUOTES.length];
}

function weatherCopy(code) {
  if (code === 0) return { label: "맑음", detail: "하늘이 맑고 깨끗해요." };
  if (code === 1) return { label: "대체로 맑음", detail: "햇살이 부드럽게 비쳐요." };
  if (code === 2) return { label: "구름 조금", detail: "구름이 살짝 걸려 있어요." };
  if (code === 3) return { label: "흐림", detail: "하늘이 차분하게 흐려요." };
  if (code === 45 || code === 48) return { label: "안개", detail: "안개가 내려앉아 있어요." };
  if (code >= 51 && code <= 57) return { label: "이슬비", detail: "가느다란 비가 내려요." };
  if (code >= 61 && code <= 67) return { label: "비", detail: "비가 와요. 우산을 챙기세요." };
  if (code >= 71 && code <= 77) return { label: "눈", detail: "눈이 내려요. 따뜻하게 입으세요." };
  if (code >= 80 && code <= 82) return { label: "소나기", detail: "소나기가 지나갈 수 있어요." };
  if (code >= 85 && code <= 86) return { label: "눈 소나기", detail: "눈이 잠시 흩날려요." };
  if (code >= 95) return { label: "뇌우", detail: "천둥이 칠 수 있어요. 실내가 더 안전해요." };
  return { label: "변화하는 하늘", detail: "하늘이 조금씩 바뀌고 있어요." };
}

function getCoords() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({ ...SEOUL, usedFallback: true });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          usedFallback: false,
        }),
      () => resolve({ ...SEOUL, usedFallback: true }),
      { enableHighAccuracy: false, timeout: 4500, maximumAge: 30 * 60 * 1000 },
    );
  });
}

async function fetchWeather() {
  const coords = await getCoords();
  const params = new URLSearchParams({
    latitude: String(coords.lat),
    longitude: String(coords.lon),
    current: "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m",
    timezone: "auto",
  });
  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);
  if (!res.ok) throw new Error("weather failed");
  const json = await res.json();
  const current = json.current;
  if (!current) throw new Error("weather empty");
  const code = current.weather_code ?? 0;
  const copy = weatherCopy(code);
  return {
    temperature: Math.round(current.temperature_2m ?? 0),
    apparent: Math.round(current.apparent_temperature ?? current.temperature_2m ?? 0),
    humidity: Math.round(current.relative_humidity_2m ?? 0),
    wind: Math.round(current.wind_speed_10m ?? 0),
    label: copy.label,
    detail: copy.detail,
    place: coords.usedFallback ? SEOUL.place : "지금 있는 곳",
  };
}

const initial = loadSettings();
const state = {
  phase: "idle",
  videoUrl: initial.videoUrl,
  volume: initial.volume,
  accumulatedMs: 0,
  startedAt: null,
  lastSessionMs: 0,
  playerError: null,
};

let player = null;
let playerVideoId = null;
let wakeLock = null;
let timerRaf = 0;

const el = {
  app: document.getElementById("app"),
  night: document.getElementById("night"),
  morning: document.getElementById("morning"),
  moon: document.getElementById("moon"),
  power: document.getElementById("power"),
  eyebrow: document.getElementById("eyebrow"),
  title: document.getElementById("night-title"),
  sub: document.getElementById("night-sub"),
  timer: document.getElementById("timer"),
  timerValue: document.getElementById("timer-value"),
  timerPlaceholder: document.getElementById("timer-placeholder"),
  playerError: document.getElementById("player-error"),
  endBtn: document.getElementById("end-btn"),
  endSlot: document.getElementById("end-slot"),
  settings: document.getElementById("settings"),
  videoUrl: document.getElementById("video-url"),
  volume: document.getElementById("volume"),
  volumeLabel: document.getElementById("volume-label"),
  urlError: document.getElementById("url-error"),
  weatherCard: document.getElementById("weather-card"),
  greeting: document.getElementById("morning-greeting"),
  weekday: document.getElementById("weekday"),
  dateLabel: document.getElementById("date-label"),
  sleepSummary: document.getElementById("sleep-summary"),
  quote: document.getElementById("quote"),
};

function elapsedMs() {
  const extra = state.startedAt ? Date.now() - state.startedAt : 0;
  return state.accumulatedMs + extra;
}

function copyForPhase(phase) {
  if (phase === "playing") {
    return {
      eyebrow: "이제 괜찮아요",
      title: "잘 자요",
      sub: "화면은 잊어도 돼요. 소리만 곁에 둘게요.",
      power: "일시정지",
    };
  }
  if (phase === "paused") {
    return {
      eyebrow: "아직 여기 있어요",
      title: "잘 자요",
      sub: "잠시 멈췄어요. 다시 켜거나, 아침을 맞을 수 있어요.",
      power: "다시 듣기",
    };
  }
  return {
    eyebrow: "오늘 밤",
    title: "잘 자, 루베",
    sub: "버튼을 켜면 영상 없이, 소리만 흘러요.",
    power: "소리 켜기",
  };
}

function renderNight() {
  const playing = state.phase === "playing";
  const paused = state.phase === "paused";
  const copy = copyForPhase(state.phase);

  el.app.classList.toggle("is-dawn", false);
  el.night.hidden = false;
  el.morning.hidden = true;
  el.moon.classList.toggle("is-lit", playing);
  el.moon.classList.toggle("is-dawn", false);
  el.power.classList.toggle("is-on", playing);
  el.power.classList.toggle("is-paused", paused);
  el.power.setAttribute("aria-pressed", playing ? "true" : "false");
  el.power.setAttribute("aria-label", copy.power);
  el.eyebrow.textContent = copy.eyebrow;
  el.title.textContent = copy.title;
  el.sub.textContent = copy.sub;

  if (playing || paused) {
    el.timer.hidden = false;
    el.timerPlaceholder.hidden = true;
    el.timerValue.textContent = formatElapsedClock(elapsedMs());
  } else {
    el.timer.hidden = true;
    el.timerPlaceholder.hidden = false;
  }

  el.playerError.hidden = !state.playerError;
  el.playerError.textContent = state.playerError || "";
  el.endBtn.hidden = !paused;
  el.endSlot.hidden = paused;
}

function renderMorning() {
  const today = formatToday();
  el.app.classList.toggle("is-dawn", true);
  el.night.hidden = true;
  el.morning.hidden = false;
  el.moon.classList.toggle("is-lit", false);
  el.moon.classList.toggle("is-dawn", true);
  el.greeting.textContent = today.greeting;
  el.weekday.textContent = today.weekday;
  el.dateLabel.textContent = today.dateLabel;
  el.quote.textContent = quoteForToday();
  el.sleepSummary.textContent =
    state.lastSessionMs < 60_000
      ? "짧은 쉼이었어요. 그래도 멈춘 건 잘한 일이에요."
      : `지난밤, ${formatElapsedKorean(state.lastSessionMs)} 동안 소리를 곁에 두었어요.`;
  el.weatherCard.innerHTML = `<p class="morning-muted">하늘을 들여다보는 중…</p>`;
  fetchWeather()
    .then((weather) => {
      if (state.phase !== "morning") return;
      el.weatherCard.innerHTML = `
        <p class="weather-place">${weather.place} · ${weather.label}</p>
        <p class="weather-temp">${weather.temperature}°</p>
        <p class="weather-detail">${weather.detail}</p>
        <ul class="weather-meta">
          <li>체감 ${weather.apparent}°</li>
          <li>습도 ${weather.humidity}%</li>
          <li>바람 ${weather.wind}m/s</li>
        </ul>
      `;
    })
    .catch(() => {
      if (state.phase !== "morning") return;
      el.weatherCard.innerHTML =
        `<p class="morning-muted">날씨는 잠시 쉬고 있어요. 창밖을 한 번 보아도 좋아요.</p>`;
    });
}

function render() {
  if (state.phase === "morning") renderMorning();
  else renderNight();
}

function tickTimer() {
  if (state.phase === "playing" || state.phase === "paused") {
    el.timerValue.textContent = formatElapsedClock(elapsedMs());
  }
  timerRaf = window.requestAnimationFrame(tickTimer);
}

async function requestWakeLock() {
  if (state.phase !== "playing" || !("wakeLock" in navigator)) return;
  try {
    wakeLock = await navigator.wakeLock.request("screen");
    wakeLock.addEventListener("release", () => {
      wakeLock = null;
    });
  } catch {
    wakeLock = null;
  }
}

async function releaseWakeLock() {
  try {
    await wakeLock?.release();
  } catch {
    /* ignore */
  }
  wakeLock = null;
}

function loadYouTubeApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  return new Promise((resolve, reject) => {
    const existing = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
    const prev = window.onYouTubeIframeAPIReady;
    const timer = window.setTimeout(() => reject(new Error("YouTube API timeout")), 12000);
    window.onYouTubeIframeAPIReady = () => {
      window.clearTimeout(timer);
      prev?.();
      if (window.YT?.Player) resolve(window.YT);
      else reject(new Error("YouTube API missing"));
    };
    if (!existing) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      script.onerror = () => {
        window.clearTimeout(timer);
        reject(new Error("YouTube API failed"));
      };
      document.head.appendChild(script);
    }
    if (window.YT?.Player) {
      window.clearTimeout(timer);
      resolve(window.YT);
    }
  });
}

function applyPlayerPhase() {
  if (!player) return;
  try {
    if (state.phase === "playing") {
      player.unMute();
      player.setVolume(state.volume);
      player.playVideo();
    } else if (state.phase === "paused") {
      player.pauseVideo();
    } else {
      player.pauseVideo();
      player.seekTo(0, true);
    }
  } catch {
    /* player not ready */
  }
}

async function setupPlayer() {
  const videoId = parseYouTubeId(state.videoUrl) ?? DEFAULT_VIDEO_ID;
  const mount = document.getElementById("yt-mount");
  if (!mount) return;
  if (player && playerVideoId === videoId) {
    applyPlayerPhase();
    return;
  }

  try {
    player?.destroy();
  } catch {
    /* already gone */
  }
  player = null;
  playerVideoId = videoId;
  mount.replaceChildren();
  const host = document.createElement("div");
  mount.appendChild(host);

  try {
    const YT = await loadYouTubeApi();
    if (playerVideoId !== videoId) return;
    player = new YT.Player(host, {
      width: 8,
      height: 8,
      videoId,
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        fs: 0,
        modestbranding: 1,
        rel: 0,
        playsinline: 1,
        loop: 1,
        playlist: videoId,
        origin: window.location.origin,
      },
      events: {
        onReady: () => {
          state.playerError = null;
          try {
            player.unMute();
            player.setVolume(state.volume);
            applyPlayerPhase();
          } catch {
            /* ignore */
          }
          renderNight();
        },
        onError: (event) => {
          state.playerError = youtubeErrorMessage(event.data);
          renderNight();
        },
        onStateChange: (event) => {
          if (event.data === 0) {
            try {
              player.seekTo(0, true);
              if (state.phase === "playing") player.playVideo();
            } catch {
              /* ignore */
            }
          }
        },
      },
    });
  } catch {
    state.playerError = "소리를 불러오지 못했어요. 잠시 후 다시 눌러 주세요.";
    renderNight();
  }
}

function togglePower() {
  if (state.phase === "morning") return;
  if (state.phase === "idle" || state.phase === "paused") {
    state.phase = "playing";
    state.startedAt = Date.now();
    state.playerError = null;
    requestWakeLock();
  } else {
    const extra = state.startedAt ? Date.now() - state.startedAt : 0;
    state.phase = "paused";
    state.startedAt = null;
    state.accumulatedMs += extra;
    releaseWakeLock();
  }
  renderNight();
  setupPlayer();
  applyPlayerPhase();
}

function endSession() {
  const extra = state.startedAt ? Date.now() - state.startedAt : 0;
  state.lastSessionMs = state.accumulatedMs + extra;
  state.phase = "morning";
  state.startedAt = null;
  state.accumulatedMs = 0;
  releaseWakeLock();
  applyPlayerPhase();
  renderMorning();
}

function returnToNight() {
  state.phase = "idle";
  state.accumulatedMs = 0;
  state.startedAt = null;
  state.lastSessionMs = 0;
  state.playerError = null;
  applyPlayerPhase();
  renderNight();
}

function openSettings() {
  el.videoUrl.value = state.videoUrl;
  el.volume.value = String(state.volume);
  el.volumeLabel.textContent = `음량 ${state.volume}`;
  el.urlError.hidden = true;
  el.settings.hidden = false;
  el.videoUrl.focus();
}

function closeSettings() {
  el.settings.hidden = true;
}

function startStars() {
  const canvas = document.getElementById("stars");
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let stars = [];
  let raf = 0;
  let running = true;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = w < 480 ? 70 : w < 900 ? 110 : 150;
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h * 0.92,
      r: Math.random() < 0.12 ? 1.35 : Math.random() < 0.5 ? 0.9 : 0.55,
      base: 0.22 + Math.random() * 0.55,
      speed: 0.35 + Math.random() * 1.1,
      phase: Math.random() * Math.PI * 2,
    }));
  }

  function draw(t) {
    if (!running) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);
    const dawnFade = state.phase === "morning" ? 0.18 : 1;
    for (const star of stars) {
      const twinkle = reduce ? 0 : Math.sin(t * 0.001 * star.speed + star.phase);
      const alpha = Math.max(0.08, star.base + twinkle * 0.28) * dawnFade;
      ctx.beginPath();
      ctx.fillStyle = `rgba(236, 234, 228, ${alpha})`;
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fill();
    }
    raf = window.requestAnimationFrame(draw);
  }

  resize();
  raf = window.requestAnimationFrame(draw);
  window.addEventListener("resize", resize);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") requestWakeLock();
  });
}

el.power.addEventListener("click", togglePower);
el.endBtn.addEventListener("click", endSession);
document.getElementById("back-to-night").addEventListener("click", returnToNight);
document.getElementById("open-settings").addEventListener("click", openSettings);
document.getElementById("close-settings").addEventListener("click", closeSettings);
document.getElementById("settings-backdrop").addEventListener("click", closeSettings);
el.volume.addEventListener("input", () => {
  state.volume = Number(el.volume.value);
  el.volumeLabel.textContent = `음량 ${state.volume}`;
  saveSettings(state.videoUrl, state.volume);
  try {
    player?.setVolume(state.volume);
  } catch {
    /* ignore */
  }
});
document.getElementById("settings-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const draft = el.videoUrl.value;
  if (!parseYouTubeId(draft)) {
    el.urlError.hidden = false;
    el.urlError.textContent = "유튜브 주소 또는 영상 ID를 넣어 주세요.";
    return;
  }
  state.videoUrl = draft.trim();
  state.playerError = null;
  saveSettings(state.videoUrl, state.volume);
  closeSettings();
  setupPlayer();
});
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeSettings();
});

renderNight();
startStars();
tickTimer();
setupPlayer();
