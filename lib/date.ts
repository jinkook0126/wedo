const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'] as const;
const DAY_MS = 24 * 60 * 60 * 1000;

export const weekdayLabels = WEEKDAYS;

export function formatKoreanDate(date: Date) {
  return `${date.getMonth() + 1}월 ${date.getDate()}일 ${WEEKDAYS[date.getDay()]}요일`;
}

/** "11월 6일 (금)" */
export function formatShortDate(date: Date) {
  return `${date.getMonth() + 1}월 ${date.getDate()}일 (${WEEKDAYS[date.getDay()]})`;
}

export function formatMonthDay(date: Date) {
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

export function fromDateKey(key: string) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** Every day from `start` to `end`, inclusive. */
export function eachDay(start: Date, end: Date) {
  return Array.from(
    { length: Math.max(daysBetween(start, end), 0) + 1 },
    (_, i) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + i),
  );
}

/** Date → "15:00" */
export function toTimeKey(date: Date) {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

/** "15:00" → "오후 3:00" */
export function formatKoreanTime(time: string) {
  const [h, m] = time.split(':').map(Number);
  const period = h < 12 ? '오전' : '오후';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${period} ${hour12}:${String(m).padStart(2, '0')}`;
}

export function toDateKey(date: Date) {
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${m}-${d}`;
}

/** Whole calendar days from `from` to `to`, ignoring time of day and DST shifts. */
export function daysBetween(from: Date, to: Date) {
  const a = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
  const b = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.round((b - a) / DAY_MS);
}

export function isSameDay(a: Date, b: Date) {
  return daysBetween(a, b) === 0;
}

/** Sunday-first weeks covering the whole month, padded with adjacent-month days. */
export function buildMonthWeeks(year: number, month: number): Date[][] {
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const weekCount = Math.ceil((first.getDay() + daysInMonth) / 7);

  return Array.from({ length: weekCount }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => new Date(year, month, 1 - first.getDay() + w * 7 + d)),
  );
}
