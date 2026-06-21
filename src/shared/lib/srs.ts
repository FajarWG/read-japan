/**
 * SM-2 spaced repetition algorithm.
 *
 * Rating: 1=Again, 2=Hard, 3=Good, 4=Easy.
 *
 * Referensi: https://super-memory.com/english/ol/sm2.htm
 */

export interface SrsState {
  ease: number;
  interval: number; // days
  repetitions: number;
  dueDate: Date;
}

export type SrsRating = 1 | 2 | 3 | 4;

export interface SrsInput {
  ease: number;
  interval: number;
  repetitions: number;
  dueDate: Date;
}

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Hitung SRS state berikutnya setelah user memberi rating.
 *
 * @param prev State sebelumnya
 * @param rating 1=Again (lupa), 2=Hard, 3=Good, 4=Easy
 * @returns State baru
 */
export function applySrsRating(prev: SrsInput, rating: SrsRating): SrsState {
  let { ease, interval, repetitions } = prev;
  const now = new Date();

  // Update E-factor berdasarkan rating (SM-2 formula)
  // q = rating 0..5; kita pakai 1..4 → map ke 1..5 (rating+1)
  const q = rating + 1; // 2..5
  ease = Math.max(
    1.3,
    ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)),
  );

  if (rating === 1) {
    // Lupa total → reset repetitions, interval pendek (10 menit ~ 0.007 hari)
    repetitions = 0;
    interval = 0.007;
  } else if (rating === 2) {
    // Hard → interval tidak bertambah banyak, repetitions++
    repetitions += 1;
    if (repetitions === 1) interval = 1;
    else if (repetitions === 2) interval = 3;
    else interval = Math.round(interval * 1.2);
  } else {
    // Good (3) atau Easy (4) → gunakan ease multiplier
    repetitions += 1;
    if (repetitions === 1) interval = 1;
    else if (repetitions === 2) interval = 6;
    else interval = Math.round(interval * ease);
    // Easy bonus
    if (rating === 4) interval = Math.round(interval * 1.3);
  }

  const dueDate = new Date(now.getTime() + interval * DAY_MS);
  return { ease, interval, repetitions, dueDate };
}

/**
 * Default state untuk card baru (belum pernah di-rate).
 */
export function newSrsState(): SrsState {
  return {
    ease: 2.5,
    interval: 0,
    repetitions: 0,
    dueDate: new Date(), // langsung due
  };
}

/**
 * Pilih sesi review: ambil kartu yang dueDate <= now, sort by overdue terlama.
 * Tambahkan 'new' cards sampai 'limit' jika ada slot.
 *
 * @param all semua progress cards
 * @param newCards accessor untuk character/kanji field dari cards baru
 * @param limit max kartu per sesi
 */
export function pickReviewSession<T>(
  all: T[],
  isNew: (card: T) => boolean,
  isDue: (card: T) => boolean,
  getDue: (card: T) => Date,
  limit: number,
): T[] {
  const due = all
    .filter((c) => !isNew(c) && isDue(c))
    .sort((a, b) => getDue(a).getTime() - getDue(b).getTime());
  const news = all.filter(isNew).slice(0, limit);

  const remaining = Math.max(0, limit - due.length);
  return [...due, ...news.slice(0, remaining)];
}
