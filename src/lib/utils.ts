import { VpSource } from '@/db/schema';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

const IMAGE_BASE_PATH = '/images/dune-tracker';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** "intrigue_the_sleeper_must_awaken" -> "Intrigue The Sleeper Must Awaken"
 *  "conflict_iii" -> "Conflict III"
 */
export function prettyLabel(s: string) {
  // 1) underscores → spaces, Title Case
  const titled = s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  // 2) any standalone consecutive i's -> uppercase (ii, iii, iiii, ...)
  //    uses word boundaries so we don't touch words like "final"
  return titled.replace(/\b(i+)\b/gi, (m) => m.toUpperCase());
}

// Default image resolver (e.g., /public/images/dune-tracker/<source>.jpg)
export function resolveSourceImgPath(source: VpSource) {
  return `${IMAGE_BASE_PATH}/${source}.jpg`;
}
