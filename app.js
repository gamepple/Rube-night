const DEFAULT_VIDEO_URL = "https://youtu.be/-u98Ob6R8AU";
const DEFAULT_VIDEO_ID = "-u98Ob6R8AU";
const STORAGE_KEY = "rube-night-settings";
const SEOUL = { lat: 37.5665, lon: 126.978, place: "서울" };
const ID_RE = /^[\w-]{11}$/;
const MAX_PLAYLIST = 20;
const ENDED = 0;

const QUOTES = [
  {
    "text": "간밤의 별빛이 네 꿈속에 예쁜 흔적을 남겼기를."
  },
  {
    "text": "창밖의 아침 공기가 너를 포근하게 반겨주는 시간이야."
  },
  {
    "text": "지난밤의 어둠은 너를 쉬게 하려던 다정한 그림자였어."
  },
  {
    "text": "기지개를 켜면, 어제의 무거웠던 마음은 가볍게 흩어질 거야."
  },
  {
    "text": "네가 눈뜬 오늘, 세상에는 너를 위한 햇살이 한 가득 준비되어 있어."
  },
  {
    "text": "서두를 필요 없어. 좋은 아침은 천천히 머금는 거니까."
  },
  {
    "text": "오늘 하루는 너에게 유난히 부드러운 바람을 불어줄 거야."
  },
  {
    "text": "푹 자고 일어난 네 표정은 새벽하늘의 샛별보다 맑아."
  },
  {
    "text": "마음의 온도를 기분 좋게 데웠으니, 이제 사뿐히 걸어가 볼까."
  },
  {
    "text": "달님이 머물다 간 자리에 따스한 온기만 가득 남았네."
  },
  {
    "text": "네가 편안히 잠든 사이, 세상은 너를 맞이할 준비를 정성껏 마쳤어."
  },
  {
    "text": "눈을 뜬 것만으로도 오늘의 첫걸음은 이미 반짝이고 있어."
  },
  {
    "text": "깊은 숨 한 번 들이쉬고, 네가 편한 속도대로 걸어가도 괜찮아."
  },
  {
    "text": "밤새 조용히 잠들었던 씨앗이 오늘 예쁜 꽃을 피워낼 거야."
  },
  {
    "text": "오늘 마주칠 모든 순간들이 너에게 다정했으면 좋겠어."
  },
  {
    "text": "잠결에 스친 좋은 꿈 하나, 오늘 하루 주머니에 소중히 품고 가렴."
  },
  {
    "text": "따뜻한 차 한 잔처럼 마음이 몽글몽글해지는 아침이 되길."
  },
  {
    "text": "긴 밤을 무사히 건너온 네 아침에 다정한 인사를 건넬게."
  },
  {
    "text": "네 안의 작은 등불이 오늘 더 은은하고 편안하게 빛나길 바라."
  },
  {
    "text": "좋은 쉼이었기를. 이제 네가 더 빛날 차례야."
  },
  {
    "text": "잠은 우리가 매일 받는 최고의 축복이자 휴식이다.",
    "by": "미겔 데 세르반테스"
  },
  {
    "text": "낮은 생각하는 시간이고, 밤은 꿈꾸는 시간이다.",
    "by": "토마스 브라운"
  },
  {
    "text": "가장 어두운 밤도 언젠가는 끝나고, 태양은 다시 떠오를 것이다.",
    "by": "빅토르 위고"
  },
  {
    "text": "휴식은 게으름도, 멈춤도 아니다. 마음의 밭을 다시 일구는 일이다.",
    "by": "존 러벅"
  },
  {
    "text": "내일은 아직 아무런 실수도 저지르지 않은 깨끗한 날이다.",
    "by": "L. M. 몽고메리"
  },
  {
    "text": "별을 보기 위해서는 어둠이 필요하다.",
    "by": "랄프 왈도 에머슨"
  },
  {
    "text": "밤이 깊을수록 별은 더욱 빛난다.",
    "by": "표도르 도스토옙스키"
  },
  {
    "text": "잠은 지친 자의 유일한 피난처이자 영혼의 어머니이다.",
    "by": "윌리엄 셰익스피어"
  },
  {
    "text": "모든 아침은 새로운 시작이며, 백지처럼 열려 있는 가능성이다.",
    "by": "장 폴 사르트르"
  },
  {
    "text": "희망은 잠들어 있지 않은 자가 꾸는 꿈이다.",
    "by": "아리스토텔레스"
  },
  {
    "text": "천천히 걷는 것을 두려워하지 말고, 그저 멈추는 것을 경계하라.",
    "by": "동양 격언"
  },
  {
    "text": "평화는 잘 쉬고 일어난 영혼의 고요한 숨결 속에 깃든다.",
    "by": "요한 볼프강 폰 괴테"
  },
  {
    "text": "오늘이라는 날은 두 번 다시 찾아오지 않는 가장 귀한 선물이다.",
    "by": "단테 알리기에리"
  },
  {
    "text": "별을 바라보는 사람은 발밑의 어둠을 두려워하지 않는다.",
    "by": "임마누엘 칸트"
  },
  {
    "text": "땅도 쉬어야 비옥해지듯, 사람의 마음도 쉼 속에서 자란다.",
    "by": "오비디우스"
  },
  {
    "text": "충분한 수면은 영혼의 피로를 씻어내는 가장 성스러운 목욕이다.",
    "by": "아서 쇼펜하우어"
  },
  {
    "text": "어둠이 지나가야 비로소 빛의 아름다움을 마주할 수 있다.",
    "by": "프란츠 카프카"
  },
  {
    "text": "보람찬 하루 끝에 평온한 잠이 찾아오듯, 정성껏 쉰 마음에는 맑은 아침이 온다.",
    "by": "레오나르도 다 빈치"
  },
  {
    "text": "하루를 시작하기 전, 고요한 마음을 먼저 챙겨라.",
    "by": "마르쿠스 아우렐리우스"
  },
  {
    "text": "태양은 날마다 새롭다.",
    "by": "헤라클레이토스"
  },
  {
    "text": "괜찮아, 바람이 불고 있어. 오늘 하루도 살아가는 거야.",
    "by": "영화 《바람이 분다》"
  },
  {
    "text": "어두운 밤이 지나면, 반드시 눈부신 아침이 찾아와.",
    "by": "애니메이션 《귀멸의 칼날》"
  },
  {
    "text": "비록 먼 길을 돌아가더라도, 네가 걷는 그 길이 바로 너만의 이야기야.",
    "by": "게임 《파이널 판타지 XIV》"
  },
  {
    "text": "화톳불 옆에서 푹 쉬었니? 밤이 지나면 새로운 여행이 시작될 거야.",
    "by": "게임 《다크 소울》"
  },
  {
    "text": "바람 소리에 귀를 기울여봐. 세상 속에도 너를 응원하는 숨결이 있어.",
    "by": "애니메이션 《이웃집 토토로》"
  },
  {
    "text": "어제는 역사이고 내일은 미스터리지만, 오늘은 선물이야.",
    "by": "애니메이션 영화 《쿵푸팬더》"
  },
  {
    "text": "별을 올려다보는 것을 잊지 마. 넌 언제나 우주의 소중한 일부야.",
    "by": "영화 《인터스텔라》"
  },
  {
    "text": "잠깐 멈춰 쉬어가도 돼. 태양은 내일도 틀림없이 떠오를 테니까.",
    "by": "애니메이션 《강철의 연금술사》"
  },
  {
    "text": "당신이 포근한 잠에 들 수 있다면, 세상은 조금 더 따뜻해질 거예요.",
    "by": "게임 《니어: 오토마타》"
  },
  {
    "text": "마음의 준비가 될 때까지는 천천히 걸어가도 좋아.",
    "by": "애니메이션 《나츠메 우인장》"
  },
  {
    "text": "포근한 잠자리에서 잘 쉬었니? 이제 너만의 마법을 펼쳐볼 시간이야.",
    "by": "애니메이션 《마녀 배달부 키키》"
  },
  {
    "text": "별들이 밤새 널 지켜보고 있었어. 넌 결코 혼자가 아니야.",
    "by": "애니메이션 영화 《라이온 킹》"
  },
  {
    "text": "아무리 험한 폭풍우 속에서도, 구름 위에는 언제나 별이 빛나고 있어.",
    "by": "애니메이션 《천공의 성 라퓨타》"
  },
  {
    "text": "오늘을 무사히 맞이한 너는 이미 하나의 커다란 기적이야.",
    "by": "영화 《원더》"
  },
  {
    "text": "충분히 쉬었으니, 다음 세이브 포인트까지 천천히 나아가 볼까.",
    "by": "게임 《언더테일》"
  },
  {
    "text": "꿈에서 본 반짝이는 풍경을 오늘 하루의 나침반으로 삼아봐.",
    "by": "애니메이션 영화 《센과 치히로의 행방불명》"
  },
  {
    "text": "햇살이 다정하게 비추는 아침이야. 네 하루도 그렇게 따스하길.",
    "by": "애니메이션 《하울의 움직이는 성》"
  },
  {
    "text": "때로는 아무것도 하지 않는 시간이, 가장 좋은 것을 만들어내기도 해.",
    "by": "영화 《곰돌이 푸 다시 만나 행복해》"
  },
  {
    "text": "빛을 잃지 마. 세상은 아직 네가 발견하지 못한 아름다움으로 가득해.",
    "by": "게임 《젤다의 전설: 브레스 오브 더 와일드》"
  },
  {
    "text": "잘 잤어? 새로운 아침이 온다는 건 언제나 다시 시작할 수 있다는 뜻이야.",
    "by": "영화 《트루먼 쇼》"
  }
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

function toWatchUrl(id) {
  return `https://youtu.be/${id}`;
}

function normalizePlaylist(urls) {
  const seen = new Set();
  const next = [];
  for (const url of urls || []) {
    const id = parseYouTubeId(url);
    if (!id || seen.has(id)) continue;
    seen.add(id);
    next.push(toWatchUrl(id));
    if (next.length >= MAX_PLAYLIST) break;
  }
  return next.length > 0 ? next : [DEFAULT_VIDEO_URL];
}

function nextIndex(length, current, mode) {
  if (length <= 1) return 0;
  const safeCurrent = ((current % length) + length) % length;
  if (mode === "shuffle") {
    let next = safeCurrent;
    let guard = 0;
    while (next === safeCurrent && guard < 24) {
      next = Math.floor(Math.random() * length);
      guard += 1;
    }
    return next;
  }
  return (safeCurrent + 1) % length;
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
    const fromLegacy = typeof parsed.videoUrl === "string" ? [parsed.videoUrl] : [];
    const playlist = normalizePlaylist(
      Array.isArray(parsed.playlist) && parsed.playlist.length > 0 ? parsed.playlist : fromLegacy,
    );
    return {
      playlist,
      playMode: parsed.playMode === "shuffle" ? "shuffle" : "sequence",
      volume: typeof parsed.volume === "number" ? Math.min(100, Math.max(0, parsed.volume)) : 80,
      stayAwake: parsed.stayAwake !== false,
    };
  } catch {
    return { playlist: [DEFAULT_VIDEO_URL], playMode: "sequence", volume: 80, stayAwake: true };
  }
}

function saveSettings() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      playlist: state.playlist,
      playMode: state.playMode,
      volume: state.volume,
      stayAwake: state.stayAwake,
    }),
  );
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

function pickMorningQuote() {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)] ?? QUOTES[0];
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
  playlist: initial.playlist,
  playMode: initial.playMode,
  currentIndex: 0,
  volume: initial.volume,
  stayAwake: initial.stayAwake,
  accumulatedMs: 0,
  startedAt: null,
  lastSessionMs: 0,
  playerError: null,
};

function currentUrl() {
  return state.playlist[state.currentIndex] ?? DEFAULT_VIDEO_URL;
}

function currentId() {
  return parseYouTubeId(currentUrl()) ?? DEFAULT_VIDEO_ID;
}

let player = null;
let playerReady = false;
let loadedId = null;
let wakeLock = null;
let lastEndedAt = 0;
let dimTimer = 0;
let dimmed = false;

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
  playlist: document.getElementById("playlist"),
  modeSequence: document.getElementById("mode-sequence"),
  modeShuffle: document.getElementById("mode-shuffle"),
  modeAwake: document.getElementById("mode-awake"),
  modeSleepOff: document.getElementById("mode-sleep-off"),
  sleepVeil: document.getElementById("sleep-veil"),
  skyWash: document.getElementById("sky-wash"),
  weatherCard: document.getElementById("weather-card"),
  greeting: document.getElementById("morning-greeting"),
  weekday: document.getElementById("weekday"),
  dateLabel: document.getElementById("date-label"),
  sleepSummary: document.getElementById("sleep-summary"),
  quote: document.getElementById("quote"),
  quoteBy: document.getElementById("quote-by"),
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
      sub: state.stayAwake
        ? "잠시 뒤 화면만 어둡게 둘게요. 소리는 그대로예요."
        : "화면은 잊어도 돼요. 소리만 곁에 둘게요.",
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

function renderPlaylist() {
  el.playlist.replaceChildren(
    ...state.playlist.map((url, index) => {
      const id = parseYouTubeId(url) ?? url;
      const item = document.createElement("li");
      item.className = index === state.currentIndex ? "playlist-item is-current" : "playlist-item";
      const pick = document.createElement("button");
      pick.type = "button";
      pick.className = "playlist-pick";
      pick.innerHTML = `<span class="playlist-index">${String(index + 1).padStart(2, "0")}</span><span class="playlist-url"></span>${
        index === state.currentIndex ? '<span class="playlist-now">지금</span>' : ""
      }`;
      pick.querySelector(".playlist-url").textContent = id;
      pick.addEventListener("click", () => {
        if (state.currentIndex === index) return;
        state.currentIndex = index;
        state.playerError = null;
        loadCurrentVideo();
        renderPlaylist();
        renderNight();
      });
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "icon-btn playlist-remove";
      remove.setAttribute("aria-label", `${id} 삭제`);
      remove.disabled = state.playlist.length <= 1;
      remove.textContent = "×";
      remove.addEventListener("click", () => removeVideo(index));
      item.append(pick, remove);
      return item;
    }),
  );
  el.modeSequence.classList.toggle("is-on", state.playMode === "sequence");
  el.modeShuffle.classList.toggle("is-on", state.playMode === "shuffle");
  el.modeSequence.setAttribute("aria-pressed", state.playMode === "sequence" ? "true" : "false");
  el.modeShuffle.setAttribute("aria-pressed", state.playMode === "shuffle" ? "true" : "false");
  if (el.modeAwake) {
    el.modeAwake.classList.toggle("is-on", state.stayAwake);
    el.modeSleepOff.classList.toggle("is-on", !state.stayAwake);
    el.modeAwake.setAttribute("aria-pressed", state.stayAwake ? "true" : "false");
    el.modeSleepOff.setAttribute("aria-pressed", state.stayAwake ? "false" : "true");
  }
}

function renderNight() {
  const playing = state.phase === "playing";
  const paused = state.phase === "paused";
  const copy = copyForPhase(state.phase);
  const sleeping = playing && dimmed && state.stayAwake;

  el.app.classList.toggle("is-dawn", false);
  el.app.classList.toggle("is-sleeping", sleeping);
  el.night.hidden = false;
  el.morning.hidden = true;
  el.moon.classList.toggle("is-lit", playing && !sleeping);
  el.moon.classList.toggle("is-dawn", false);
  el.moon.classList.toggle("is-still", playing || paused);
  el.skyWash?.classList.toggle("is-still", playing || paused);
  el.power.classList.toggle("is-on", playing);
  el.power.classList.toggle("is-paused", paused);
  el.power.setAttribute("aria-pressed", playing ? "true" : "false");
  el.power.setAttribute("aria-label", copy.power);
  el.eyebrow.textContent = copy.eyebrow;
  el.title.textContent = copy.title;
  el.sub.textContent = copy.sub;
  if (el.sleepVeil) el.sleepVeil.hidden = !sleeping;

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
  const morningQuote = pickMorningQuote();
  el.quote.textContent = morningQuote.text;
  if (el.quoteBy) {
    el.quoteBy.textContent = morningQuote.by || "";
    el.quoteBy.hidden = !morningQuote.by;
  }
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

function tickTimer() {
  if (state.phase === "playing" || state.phase === "paused") {
    el.timerValue.textContent = formatElapsedClock(elapsedMs());
  }
}

function scheduleDim() {
  window.clearTimeout(dimTimer);
  if (state.phase !== "playing" || !state.stayAwake || !el.settings.hidden) {
    dimmed = false;
    renderNight();
    return;
  }
  dimTimer = window.setTimeout(() => {
    dimmed = true;
    renderNight();
  }, 4000);
}

function syncMediaSession() {
  if (!("mediaSession" in navigator)) return;
  try {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: "루베의 밤",
      artist: "소리만 곁에",
    });
    navigator.mediaSession.playbackState =
      state.phase === "playing" ? "playing" : state.phase === "paused" ? "paused" : "none";
  } catch {
    /* ignore */
  }
}

function preferTiny() {
  try {
    player?.setPlaybackQuality?.("tiny");
  } catch {
    try {
      player?.setPlaybackQuality?.("small");
    } catch {
      /* ignore */
    }
  }
}

async function requestWakeLock() {
  if (state.phase !== "playing" || !state.stayAwake || !("wakeLock" in navigator)) return;
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
  if (!player || !playerReady) return;
  try {
    if (state.phase === "playing") {
      player.unMute();
      player.setVolume(state.volume);
      preferTiny();
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

function loadCurrentVideo() {
  if (!player || !playerReady) return;
  const id = currentId();
  if (loadedId === id) {
    if (state.phase === "playing") applyPlayerPhase();
    return;
  }
  loadedId = id;
  try {
    if (state.phase === "playing") player.loadVideoById(id);
    else player.cueVideoById(id);
  } catch {
    /* ignore */
  }
}

function advanceTrack() {
  const upcoming = nextIndex(state.playlist.length, state.currentIndex, state.playMode);
  if (upcoming === state.currentIndex) {
    try {
      player?.seekTo(0, true);
      player?.playVideo();
    } catch {
      try {
        player?.loadVideoById(currentId());
      } catch {
        /* ignore */
      }
    }
    return;
  }
  state.currentIndex = upcoming;
  state.playerError = null;
  loadCurrentVideo();
  renderPlaylist();
}

async function setupPlayer() {
  const mount = document.getElementById("yt-mount");
  if (!mount || player) return;
  const host = document.createElement("div");
  mount.appendChild(host);
  const initialId = currentId();

  try {
    const YT = await loadYouTubeApi();
    player = new YT.Player(host, {
      width: 8,
      height: 8,
      videoId: initialId,
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        fs: 0,
        modestbranding: 1,
        rel: 0,
        playsinline: 1,
        iv_load_policy: 3,
        cc_load_policy: 0,
        vq: "tiny",
        origin: window.location.origin,
      },
      events: {
        onReady: () => {
          playerReady = true;
          loadedId = initialId;
          state.playerError = null;
          try {
            player.unMute();
            player.setVolume(state.volume);
            preferTiny();
            if (currentId() !== initialId) loadCurrentVideo();
            else applyPlayerPhase();
          } catch {
            /* ignore */
          }
          renderNight();
        },
        onError: (event) => {
          state.playerError = youtubeErrorMessage(event.data);
          renderNight();
          if (state.phase === "playing" && state.playlist.length > 1) advanceTrack();
        },
        onStateChange: (event) => {
          if (event.data === 1) preferTiny();
          if (event.data !== ENDED) return;
          if (state.phase !== "playing") return;
          const now = Date.now();
          if (now - lastEndedAt < 1000) return;
          lastEndedAt = now;
          advanceTrack();
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
    syncMediaSession();
    scheduleDim();
  } else {
    const extra = state.startedAt ? Date.now() - state.startedAt : 0;
    state.phase = "paused";
    state.startedAt = null;
    state.accumulatedMs += extra;
    releaseWakeLock();
    dimmed = false;
    window.clearTimeout(dimTimer);
    syncMediaSession();
  }
  renderNight();
  applyPlayerPhase();
}

function endSession() {
  const extra = state.startedAt ? Date.now() - state.startedAt : 0;
  state.lastSessionMs = state.accumulatedMs + extra;
  state.phase = "morning";
  state.startedAt = null;
  state.accumulatedMs = 0;
  dimmed = false;
  window.clearTimeout(dimTimer);
  releaseWakeLock();
  syncMediaSession();
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
  el.videoUrl.value = "";
  el.volume.value = String(state.volume);
  el.volumeLabel.textContent = `음량 ${state.volume}`;
  el.urlError.hidden = true;
  dimmed = false;
  window.clearTimeout(dimTimer);
  renderPlaylist();
  renderNight();
  el.settings.hidden = false;
  el.videoUrl.focus();
}

function closeSettings() {
  el.settings.hidden = true;
  scheduleDim();
}

function addVideo(raw) {
  const id = parseYouTubeId(raw);
  if (!id) return "유튜브 주소 또는 영상 ID를 넣어 주세요.";
  if (state.playlist.some((item) => parseYouTubeId(item) === id)) {
    return "이미 목록에 있는 영상이에요.";
  }
  if (state.playlist.length >= MAX_PLAYLIST) return "목록은 20개까지 넣을 수 있어요.";
  state.playlist.push(toWatchUrl(id));
  saveSettings();
  renderPlaylist();
  return null;
}

function removeVideo(index) {
  if (state.playlist.length <= 1) return;
  state.playlist.splice(index, 1);
  if (index === state.currentIndex) {
    state.currentIndex = Math.min(index, state.playlist.length - 1);
    loadCurrentVideo();
  } else if (index < state.currentIndex) {
    state.currentIndex -= 1;
  }
  saveSettings();
  renderPlaylist();
  renderNight();
}

function startStars() {
  const canvas = document.getElementById("stars");
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let stars = [];
  let raf = 0;

  function paint(t, still) {
    const w = window.innerWidth;
    const h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);
    const dawnFade = state.phase === "morning" ? 0.18 : still ? 0.45 : 1;
    for (const star of stars) {
      const twinkle = reduceMotion || still ? 0 : Math.sin(t * 0.001 * star.speed + star.phase);
      const alpha = Math.max(0.08, star.base + twinkle * 0.28) * dawnFade;
      ctx.beginPath();
      ctx.fillStyle = `rgba(236, 234, 228, ${alpha})`;
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function resize() {
    const still = state.phase === "playing" || state.phase === "paused";
    const dpr = still ? 1 : Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = still ? (w < 480 ? 36 : 56) : w < 480 ? 70 : w < 900 ? 110 : 150;
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h * 0.92,
      r: Math.random() < 0.12 ? 1.35 : Math.random() < 0.5 ? 0.9 : 0.55,
      base: 0.22 + Math.random() * 0.55,
      speed: 0.35 + Math.random() * 1.1,
      phase: Math.random() * Math.PI * 2,
    }));
    paint(0, still);
  }

  function draw(t) {
    const still = state.phase === "playing" || state.phase === "paused" || state.phase === "morning";
    if (still) {
      paint(t, true);
      return;
    }
    paint(t, false);
    raf = window.requestAnimationFrame(draw);
  }

  resize();
  raf = window.requestAnimationFrame(draw);
  window.addEventListener("resize", resize);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      requestWakeLock();
      if (state.phase === "playing") applyPlayerPhase();
    }
  });
  window.setInterval(() => {
    if (state.phase === "idle") {
      window.cancelAnimationFrame(raf);
      raf = window.requestAnimationFrame(draw);
    }
  }, 4000);
}

el.power.addEventListener("click", togglePower);
el.endBtn.addEventListener("click", endSession);
document.getElementById("back-to-night").addEventListener("click", returnToNight);
document.getElementById("open-settings").addEventListener("click", openSettings);
document.getElementById("close-settings").addEventListener("click", closeSettings);
document.getElementById("settings-backdrop").addEventListener("click", closeSettings);
el.modeSequence.addEventListener("click", () => {
  state.playMode = "sequence";
  saveSettings();
  renderPlaylist();
});
el.modeShuffle.addEventListener("click", () => {
  state.playMode = "shuffle";
  saveSettings();
  renderPlaylist();
});
el.modeAwake?.addEventListener("click", () => {
  state.stayAwake = true;
  saveSettings();
  renderPlaylist();
  scheduleDim();
});
el.modeSleepOff?.addEventListener("click", () => {
  state.stayAwake = false;
  dimmed = false;
  window.clearTimeout(dimTimer);
  saveSettings();
  releaseWakeLock();
  renderPlaylist();
  renderNight();
});
el.sleepVeil?.addEventListener("click", () => {
  dimmed = false;
  renderNight();
  scheduleDim();
});
el.volume.addEventListener("input", () => {
  state.volume = Number(el.volume.value);
  el.volumeLabel.textContent = `음량 ${state.volume}`;
  saveSettings();
  try {
    player?.setVolume(state.volume);
  } catch {
    /* ignore */
  }
});
document.getElementById("settings-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const message = addVideo(el.videoUrl.value);
  if (message) {
    el.urlError.hidden = false;
    el.urlError.textContent = message;
    return;
  }
  el.videoUrl.value = "";
  el.urlError.hidden = true;
});
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeSettings();
});

renderNight();
renderPlaylist();
startStars();
window.setInterval(tickTimer, 1000);
setupPlayer();
try {
  if ("mediaSession" in navigator) {
    navigator.mediaSession.setActionHandler("play", () => {
      if (state.phase === "idle" || state.phase === "paused") togglePower();
    });
    navigator.mediaSession.setActionHandler("pause", () => {
      if (state.phase === "playing") togglePower();
    });
  }
} catch {
  /* ignore */
}
