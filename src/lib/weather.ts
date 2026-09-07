export type WeatherInfo = {
  temperature: number;
  apparent: number;
  humidity: number;
  wind: number;
  code: number;
  label: string;
  detail: string;
  place: string;
  usedFallback: boolean;
};

export const SEOUL = { lat: 37.5665, lon: 126.978, place: "서울" };

export function weatherCopy(code: number): { label: string; detail: string } {
  if (code === 0) return { label: "맑음", detail: "하늘이 맑고 깨끗해요." };
  if (code === 1) return { label: "대체로 맑음", detail: "햇살이 부드럽게 비쳐요." };
  if (code === 2) return { label: "구름 조금", detail: "구름이 산짝 걸려 있어요." };
  if (code === 3) return { label: "흐림", detail: "하늘이 차분하게 흐려요." };
  if (code === 45 || code === 48) return { label: "안개", detail: "안개가 내려않아 있어요." };
  if (code >= 51 && code <= 57) return { label: "이슬비", detail: "가느다란 비가 내려요." };
  if (code >= 61 && code <= 67) return { label: "비", detail: "비가 와요. 우산을 책기세요." };
  if (code >= 71 && code <= 77) return { label: "눈", detail: "눈이 내려요. 따뜻하게 입으세요." };
  if (code >= 80 && code <= 82) return { label: "소나기", detail: "소나기가 지나갈 수 있어요." };
  if (code >= 85 && code <= 86) return { label: "눈 소나기", detail: "눈이 잠시 흘날려요." };
  if (code >= 95) return { label: "뇌우", detail: "천둥이 칠 수 있어요. 실내가 더 안전해요." };
  return { label: "변화하는 하늘", detail: "하늘이 조금씩 바뀌고 있어요." };
}

export function getCoords(): Promise<{ lat: number; lon: number; usedFallback: boolean }> {
  return new Promise((resolve) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
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

type ForecastResponse = {
  current?: {
    temperature_2m?: number;
    apparent_temperature?: number;
    relative_humidity_2m?: number;
    weather_code?: number;
    wind_speed_10m?: number;
  };
};

export async function fetchWeather(): Promise<WeatherInfo> {
  const coords = await getCoords();
  const params = new URLSearchParams({
    latitude: String(coords.lat),
    longitude: String(coords.lon),
    current: "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m",
    timezone: "auto",
  });
  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);
  if (!res.ok) throw new Error("weather failed");
  const json = (await res.json()) as ForecastResponse;
  const current = json.current;
  if (!current) throw new Error("weather empty");
  const code = current.weather_code ?? 0;
  const copy = weatherCopy(code);
  return {
    temperature: Math.round(current.temperature_2m ?? 0),
    apparent: Math.round(current.apparent_temperature ?? current.temperature_2m ?? 0),
    humidity: Math.round(current.relative_humidity_2m ?? 0),
    wind: Math.round(current.wind_speed_10m ?? 0),
    code,
    label: copy.label,
    detail: copy.detail,
    place: coords.usedFallback ? SEOUL.place : "지금 있는 곳",
    usedFallback: coords.usedFallback,
  };
}
