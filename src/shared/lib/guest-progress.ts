/**
 * Utilities for managing guest (non-logged-in) learning progress
 * stored in browser localStorage.
 *
 * Key: "rj-guest-progress"
 * Value: Record<character, { clickCount, wrongCount }>
 */

const STORAGE_KEY = "rj-guest-progress";

export type GuestProgressMap = Record<
  string,
  { clickCount: number; wrongCount: number }
>;

export function getGuestProgress(): GuestProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as GuestProgressMap;
  } catch {
    return {};
  }
}

export function saveGuestProgress(map: GuestProgressMap): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export function recordGuestClick(char: string): void {
  const map = getGuestProgress();
  const entry = map[char] ?? { clickCount: 0, wrongCount: 0 };
  entry.clickCount += 1;
  map[char] = entry;
  saveGuestProgress(map);
}

export function recordGuestWrong(chars: string[]): void {
  const map = getGuestProgress();
  for (const char of chars) {
    const entry = map[char] ?? { clickCount: 0, wrongCount: 0 };
    entry.wrongCount += 1;
    map[char] = entry;
  }
  saveGuestProgress(map);
}

export function recordGuestPerfect(chars: string[]): void {
  const map = getGuestProgress();
  for (const char of chars) {
    const entry = map[char];
    if (!entry) continue;
    if (entry.wrongCount > 0) {
      entry.wrongCount -= 1;
    } else if (entry.clickCount > 0) {
      entry.clickCount -= 1;
    }
    map[char] = entry;
  }
  saveGuestProgress(map);
}

export function getGuestStats(): {
  totalClicks: number;
  totalWrong: number;
  totalDebt: number;
} {
  const map = getGuestProgress();
  let totalClicks = 0;
  let totalWrong = 0;
  for (const entry of Object.values(map)) {
    totalClicks += entry.clickCount;
    totalWrong += entry.wrongCount;
  }
  return { totalClicks, totalWrong, totalDebt: totalClicks + totalWrong };
}
