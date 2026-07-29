export const KAKOU_MODES = [
  "DAILY_MIX",
  "GUIDED_JOURNAL",
  "COPY_CHANGE_CREATE",
  "GRAMMAR_CHALLENGE",
  "CONJUGATION_DRILL",
] as const;

export const KAKOU_LEVELS = ["N5", "N4", "N3"] as const;
export const KAKOU_DURATIONS = [5, 10, 20] as const;
export const KAKOU_DIFFICULTIES = ["EASY", "OKAY", "DIFFICULT"] as const;

export type KakouMode = (typeof KAKOU_MODES)[number];
export type KakouLevel = (typeof KAKOU_LEVELS)[number];
export type KakouDuration = (typeof KAKOU_DURATIONS)[number];
export type KakouDifficulty = (typeof KAKOU_DIFFICULTIES)[number];
export type KakouPromptKind =
  | "JOURNAL"
  | "COPY_CHANGE_CREATE"
  | "GRAMMAR"
  | "SENTENCE_BUILDER"
  | "CONJUGATION";

export interface KakouPrompt {
  id: string;
  kind: KakouPromptKind;
  level: KakouLevel;
  title: string;
  japanese: string;
  instruction: string;
  pattern?: string;
  example?: string;
  hints?: string[];
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
  startedAt: string;
  completedAt: string | null;
}

export interface KakouOverview {
  activeSession: KakouSessionView | null;
  history: KakouSessionView[];
  stats: {
    completedSessions: number;
    totalMinutes: number;
    thisWeek: number;
  };
}

export const KAKOU_MODE_LABELS: Record<KakouMode, { title: string; description: string }> = {
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
