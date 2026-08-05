export type Sm2Rating = "easy" | "good" | "hard";

export interface Sm2State {
  repetitions: number;
  easeFactor: number;
  interval: number;
}

/**
 * Modified SM-2 spaced-repetition step. Pure function (no DB access) so it can
 * be shared between the Katsuyou review-card flow and Kakou's closing-the-loop
 * update — both just fetch/upsert a card, call this, then persist the result.
 */
export function applySm2(state: Sm2State, rating: Sm2Rating): Sm2State & { nextReview: Date } {
  let { repetitions, easeFactor, interval } = state;

  if (rating === "hard") {
    repetitions = 0;
    interval = 1; // back to 1 day
    easeFactor = Math.max(1.3, easeFactor - 0.2);
  } else if (rating === "good") {
    repetitions += 1;
    if (repetitions === 1) {
      interval = 1;
    } else if (repetitions === 2) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    // easeFactor remains the same
  } else {
    repetitions += 1;
    if (repetitions === 1) {
      interval = 2;
    } else if (repetitions === 2) {
      interval = 8;
    } else {
      interval = Math.round(interval * easeFactor * 1.3);
    }
    easeFactor = Math.min(3.0, easeFactor + 0.15);
  }

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);
  // Remove minutes/seconds to keep reviews structured by days
  nextReview.setHours(0, 0, 0, 0);

  return { repetitions, easeFactor, interval, nextReview };
}

/** score 0-100 (from Kakou AI review) -> SM-2 rating, using the same thresholds
 *  already baked into the review-prompt scoring rubric. */
export function ratingFromScore(score: number): Sm2Rating {
  if (score >= 75) return "easy";
  if (score >= 60) return "good";
  return "hard";
}
