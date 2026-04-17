export const TIMER_COLORS = ['red', 'green', 'amber', 'blue'] as const;

export type TimerColor = (typeof TIMER_COLORS)[number];

export const COLOR_META: Record<
  TimerColor,
  { label: string; swatchClass: string; borderClass: string; textClass: string }
> = {
  red: {
    label: 'Red',
    swatchClass: 'bg-red-500',
    borderClass: 'border-red-400/60',
    textClass: 'text-red-200',
  },
  green: {
    label: 'Green',
    swatchClass: 'bg-emerald-500',
    borderClass: 'border-emerald-400/60',
    textClass: 'text-emerald-200',
  },
  amber: {
    label: 'Yellow',
    swatchClass: 'bg-amber-400',
    borderClass: 'border-amber-400/60',
    textClass: 'text-amber-200',
  },
  blue: {
    label: 'Blue',
    swatchClass: 'bg-sky-500',
    borderClass: 'border-sky-400/60',
    textClass: 'text-sky-200',
  },
};

const isTimerColor = (value: string): value is TimerColor =>
  (TIMER_COLORS as readonly string[]).includes(value);

export function parseTimerColors(
  value: string | string[] | undefined,
  expectedCount: number,
): TimerColor[] | null {
  if (!value) return null;

  const raw = Array.isArray(value) ? value[0] : value;
  const parts = raw
    .split(',')
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean);

  if (parts.length !== expectedCount) return null;

  if (!parts.every(isTimerColor)) return null;

  const colors = parts as TimerColor[];
  if (new Set(colors).size !== expectedCount) return null;

  return colors;
}

export function parseTimerNames(
  value: string | string[] | undefined,
  expectedCount: number,
): string[] {
  const emptyNames = Array.from({ length: expectedCount }, () => '');
  if (!value) return emptyNames;

  const raw = Array.isArray(value) ? value[0] : value;

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return emptyNames;

    const names = parsed
      .slice(0, expectedCount)
      .map((name) => (typeof name === 'string' ? name.trim() : ''));

    while (names.length < expectedCount) {
      names.push('');
    }

    return names;
  } catch {
    return emptyNames;
  }
}

export function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}
