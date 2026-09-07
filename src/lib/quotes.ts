const MORNING_QUOTES = [
  "천천히 일어나도, 하루는 너를 기다려 준다.",
  "잘 쉬 마음은 더 멀리 간다.",
  "새로운 하루는 아직 아무 말도 하지 않았다.",
  "숨이 고르다면, 이미 충분히 잘한 것이다.",
  "밤은 너를 비난하지 않는다. 아침도 마찬가지다.",
  "오늘 해야 할 일은, 오늘을 부드럽게 시작하는 일이다.",
  "별이 진 자리에도 빛은 남는다.",
  "서두르지 않아도 계절은 너를 지나치지 않는다.",
  "쉬은 멈춤이 아니라, 다시 걷기 위한 정렬이다.",
  "네가 눈을 뜨는 순간, 세상은 다시 한 번 너를 맞이한다.",
];

export function quoteForToday(date = new Date()): string {
  const key = date.getFullYear() * 400 + date.getMonth() * 32 + date.getDate();
  return MORNING_QUOTES[key % MORNING_QUOTES.length] ?? MORNING_QUOTES[0];
}
