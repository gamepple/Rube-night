export const DEFAULT_VIDEO_URL = "https://youtu.be/-u98Ob6R8AU";
export const DEFAULT_VIDEO_ID = "-u98Ob6R8AU";

const ID_RE = /^[\w-]{11}$/;

export function parseYouTubeId(input: string): string | null {
  const trimmed = input.trim();
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
      const nest = parts[0];
      const nestedId = parts[1];
      if (
        nestedId &&
        (nest === "embed" || nest === "shorts" || nest === "live" || nest === "v") &&
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

export function youtubeErrorMessage(code: number): string {
  if (code === 2) return "영상 주소가 올바르지 않아요.";
  if (code === 100) return "영상을 찾을 수 없어요.";
  if (code === 101 || code === 150) return "이 영상은 여기서 재생할 수 없어요.";
  return "소리를 불러오지 못했어요. 링크를 확인해 주세요.";
}
