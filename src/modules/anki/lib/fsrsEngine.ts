import {
  fsrs,
  Rating as FSRSRating,
  State as FSRSState,
  createEmptyCard,
  Card as FSRSCard,
  FSRS,
} from "ts-fsrs";

// Inisialisasi scheduler FSRS dengan parameter default optimal (termasuk short-term learning steps)
export const fsrsInstance: FSRS = fsrs();

export interface AnkiProgressRecord {
  interval?: number;
  ease?: number;
  repetitions?: number;
  dueDate?: Date | string;
  stability?: number;
  difficulty?: number;
  elapsedDays?: number;
  scheduledDays?: number;
  reps?: number;
  lapses?: number;
  state?: number;
  learningSteps?: number;
  lastReview?: Date | string | null;
  updatedAt?: Date | string;
}

export interface FSRSScheduleResult {
  card: FSRSCard;
  scheduledDays: number;
  dueDate: Date;
  stability: number;
  difficulty: number;
  reps: number;
  lapses: number;
  state: number;
  learningSteps: number;
  lastReview: Date;
}

export type FSRSGrade =
  | FSRSRating.Again
  | FSRSRating.Hard
  | FSRSRating.Good
  | FSRSRating.Easy;

/**
 * Konversi rating angka (1-4) ke enum FSRSRating
 * 1: Again, 2: Hard, 3: Good, 4: Easy
 */
export function toFsrsRating(rating: number): FSRSGrade {
  switch (rating) {
    case 1:
      return FSRSRating.Again;
    case 2:
      return FSRSRating.Hard;
    case 3:
      return FSRSRating.Good;
    case 4:
      return FSRSRating.Easy;
    default:
      return FSRSRating.Good;
  }
}

/**
 * Mengubah record database AnkiProgress (baik format baru FSRS maupun legacy SM-2)
 * menjadi objek Card FSRS yang valid.
 */
export function progressToFsrsCard(progress?: AnkiProgressRecord | null): FSRSCard {
  const now = new Date();

  if (!progress) {
    return createEmptyCard(now);
  }

  // Jika sudah memiliki state FSRS (stability > 0 atau state > 0 atau reps > 0)
  if (
    (progress.stability !== undefined && progress.stability > 0) ||
    (progress.state !== undefined && progress.state > 0) ||
    (progress.reps !== undefined && progress.reps > 0)
  ) {
    const due = progress.dueDate ? new Date(progress.dueDate) : now;
    const lastRev = progress.lastReview ? new Date(progress.lastReview) : undefined;

    return {
      due,
      stability: progress.stability ?? 0,
      difficulty: progress.difficulty ?? 0,
      elapsed_days: progress.elapsedDays ?? 0,
      scheduled_days: progress.scheduledDays ?? progress.interval ?? 0,
      reps: progress.reps ?? progress.repetitions ?? 0,
      lapses: progress.lapses ?? 0,
      learning_steps: progress.learningSteps ?? 0,
      state: (progress.state ?? FSRSState.New) as FSRSState,
      last_review: lastRev,
    };
  }

  // Jika record lama SM-2 (migrasi halus tanpa reset kartu yang sudah dipelajari)
  const reps = progress.repetitions ?? 0;
  const interval = progress.interval ?? 0;
  const ease = progress.ease ?? 2.5;
  const due = progress.dueDate ? new Date(progress.dueDate) : now;

  if (reps > 0 || interval > 0) {
    // Estimasi stability dari interval dan ease
    const estimatedStability = Math.max(0.5, interval > 0 ? interval : reps * 1.5);
    // Estimasi difficulty (skala FSRS 1-10, default ~5, ease lebih rendah -> difficulty lebih tinggi)
    const estimatedDifficulty = Math.max(1, Math.min(10, 5 + (2.5 - ease) * 3));

    return {
      due,
      stability: estimatedStability,
      difficulty: estimatedDifficulty,
      elapsed_days: 0,
      scheduled_days: interval,
      reps,
      lapses: 0,
      learning_steps: 0,
      state: FSRSState.Review,
      last_review: progress.updatedAt ? new Date(progress.updatedAt) : undefined,
    };
  }

  return createEmptyCard(due);
}

/**
 * Menghitung jadwal review berikutnya menggunakan FSRS
 */
export function scheduleWithFSRS(
  currentProgress: AnkiProgressRecord | null | undefined,
  rating: number,
  reviewDate = new Date(),
): FSRSScheduleResult {
  const card = progressToFsrsCard(currentProgress);
  const fsrsRating = toFsrsRating(rating);

  const nextResult = fsrsInstance.next(card, reviewDate, fsrsRating);
  const nextCard = nextResult.card;

  return {
    card: nextCard,
    scheduledDays: nextCard.scheduled_days,
    dueDate: nextCard.due,
    stability: nextCard.stability,
    difficulty: nextCard.difficulty,
    reps: nextCard.reps,
    lapses: nextCard.lapses,
    state: nextCard.state,
    learningSteps: nextCard.learning_steps,
    lastReview: reviewDate,
  };
}

/**
 * Format selisih waktu jatuh tempo ke label yang ringkas (e.g. 1m, 10m, 2d, 1mo)
 */
export function formatFsrsInterval(due: Date, now = new Date()): string {
  const diffMs = due.getTime() - now.getTime();
  if (diffMs <= 0) return "< 1m";
  const diffMinutes = Math.round(diffMs / 60000);
  if (diffMinutes < 60) return `${Math.max(1, diffMinutes)}m`;
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  if (diffHours < 24) return `${diffHours}h`;
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays < 30) return `${diffDays}d`;
  const diffMonths = (diffDays / 30).toFixed(1);
  if (diffDays < 365) return `${diffMonths.replace(/\.0$/, "")}mo`;
  const diffYears = (diffDays / 365).toFixed(1);
  return `${diffYears.replace(/\.0$/, "")}y`;
}

export interface FSRSIntervalPreviews {
  again: string;
  hard: string;
  good: string;
  easy: string;
}

/**
 * Menghasilkan estimasi live interval untuk tombol Again, Hard, Good, Easy
 */
export function getFsrsPreviewIntervals(
  currentProgress: AnkiProgressRecord | null | undefined,
  now = new Date(),
): FSRSIntervalPreviews {
  const card = progressToFsrsCard(currentProgress);
  const againRes = fsrsInstance.next(card, now, FSRSRating.Again);
  const hardRes = fsrsInstance.next(card, now, FSRSRating.Hard);
  const goodRes = fsrsInstance.next(card, now, FSRSRating.Good);
  const easyRes = fsrsInstance.next(card, now, FSRSRating.Easy);

  return {
    again: formatFsrsInterval(againRes.card.due, now),
    hard: formatFsrsInterval(hardRes.card.due, now),
    good: formatFsrsInterval(goodRes.card.due, now),
    easy: formatFsrsInterval(easyRes.card.due, now),
  };
}
