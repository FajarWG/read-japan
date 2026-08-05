import type { StudyTimerOverview } from "@/src/modules/study-timer/types";
import type { SidebarForm } from "@/src/modules/katsuyou/data/conjugationForms";
import type { BunpouLesson } from "@/src/modules/bunpou/data/bunpouData";

// "PRACTICE" is the only mode new sessions are created with (auto-sequential,
// driven by Katsuyou/Bunpou progress). The rest are kept only so old session
// history (frozen promptSnapshot/mode from before this redesign) still
// type-checks and displays correctly.
export const KAKOU_MODES = [
  "PRACTICE",
  "DAILY_MIX",
  "GUIDED_JOURNAL",
  "COPY_CHANGE_CREATE",
  "GRAMMAR_CHALLENGE",
  "CONJUGATION_DRILL",
] as const;

export const KAKOU_LEVELS = ["N5", "N4", "N3"] as const;
export const KAKOU_DURATIONS = [5, 10, 20] as const;
export const KAKOU_DIFFICULTIES = ["EASY", "OKAY", "DIFFICULT"] as const;

/**
 * Which slice of the auto-sequential queue a session pulls from:
 * MIXED (default) = due reviews first, then new items to fill remaining slots.
 * REVIEW = only due Katsuyou reviews (nothing new introduced).
 * NEW = only never-practiced Katsuyou forms / incomplete Bunpou patterns.
 */
export const KAKOU_SESSION_FOCUSES = ["MIXED", "REVIEW", "NEW"] as const;

export type KakouMode = (typeof KAKOU_MODES)[number];
export type KakouSessionFocus = (typeof KAKOU_SESSION_FOCUSES)[number];
export type KakouLevel = (typeof KAKOU_LEVELS)[number];
export type KakouDuration = (typeof KAKOU_DURATIONS)[number];
export type KakouDifficulty = (typeof KAKOU_DIFFICULTIES)[number];
export type KakouPromptKind =
  | "JOURNAL"
  | "COPY_CHANGE_CREATE"
  | "GRAMMAR"
  | "SENTENCE_BUILDER"
  | "CONJUGATION";

export type KakouSourceType = "BUNPOU" | "KATSUYOU";

export interface KakouSource {
  type: KakouSourceType;
  id: string;
  href: string;
  label: string;
  /** Set for KATSUYOU sources: which of mockVerbs this prompt pinned, so
   *  SRS updates can key KatsuyouReviewCard by (verbId, conjugationForm). */
  verbId?: string;
}

export interface KakouReminderExample {
  japanese: string;
  reading?: string;
  meaning?: string;
}

export interface KakouReminder {
  title: string;
  meaning: string;
  structures: string[];
  examples: KakouReminderExample[];
  commonMistakes?: string[];
  source?: KakouSource;
}

export interface KakouPrompt {
  id: string;
  kind: KakouPromptKind;
  level: KakouLevel;
  title: string;
  japanese: string;
  instruction: string;
  pattern?: string;
  example?: string;
  /** An Indonesian-language example sentence idea — reference only, to help
   *  when stuck on what to write. Not the required answer. */
  exampleIndonesian?: string;
  hints?: string[];
  source?: KakouSource;
  reminder?: KakouReminder;
}

export interface KakouSentenceFeedback {
  original: string;
  corrected: string;
  improved?: string;
  meaning?: string;
  explanation?: string;
  suggestedKanji?: string[];
}

export interface KakouAdditionalExample {
  japanese: string;
  meaning: string;
}

export interface KakouPerPromptFeedback {
  /** 1-based, matching the numbered "Latihan" list the prompt was built from. */
  promptIndex: number;
  score: number;
  sentences: KakouSentenceFeedback[];
  errorPatterns?: string[];
  reviewPoints?: string[];
  /** Fresh AI-generated example sentences using the same pattern — reference
   *  only, not a correction of what the user wrote. */
  additionalExamples?: KakouAdditionalExample[];
}

export interface KakouFeedback {
  overallFeedback?: string;
  perPrompt: KakouPerPromptFeedback[];
}

export interface KakouSessionView {
  id: number;
  mode: KakouMode;
  level: KakouLevel;
  durationMinutes: number;
  prompts: KakouPrompt[];
  progress: number;
  status: "ACTIVE" | "COMPLETED" | "ABANDONED";
  difficulty: KakouDifficulty | null;
  score: number | null;
  feedbackJson: KakouFeedback | null;
  userWriting: string | null;
  startedAt: string;
  completedAt: string | null;
  actualSeconds: number;
}

export interface KakouOverview {
  activeSession: KakouSessionView | null;
  history: KakouSessionView[];
  timer: StudyTimerOverview;
  stats: {
    completedSessions: number;
    todaySeconds: number;
    weekSeconds: number;
    totalSeconds: number;
  };
}

export interface KakouMaterials {
  katsuyou: {
    forms: SidebarForm[];
    completedLessons: string[];
    dueReviewsByForm: Record<string, number>;
  };
  bunpou: {
    lessons: BunpouLesson[];
    completedPatternIds: string[];
  };
}

export type KakouMaterialSelection =
  | { type: "KATSUYOU"; id: string }
  | { type: "BUNPOU"; id: string };

export const KAKOU_MODE_LABELS: Record<KakouMode, { title: string; description: string }> = {
  PRACTICE: {
    title: "Practice",
    description: "Auto-picked from what's due or new in Katsuyou and Bunpou.",
  },
  DAILY_MIX: {
    title: "Daily Mix",
    description: "A balanced page of journaling, grammar, sentences, and conjugation.",
  },
  GUIDED_JOURNAL: {
    title: "Guided Journal",
    description: "Write a short diary entry with structured Japanese questions.",
  },
  COPY_CHANGE_CREATE: {
    title: "Copy → Change → Create",
    description: "Copy a model sentence, modify it, then create your own.",
  },
  GRAMMAR_CHALLENGE: {
    title: "Grammar Challenge",
    description: "Use one grammar pattern in several original sentences.",
  },
  CONJUGATION_DRILL: {
    title: "Conjugation Drill",
    description: "Write verb forms by hand, then use one in context.",
  },
};
