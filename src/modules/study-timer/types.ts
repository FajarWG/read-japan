export type StudyTimerStatus = "RUNNING" | "PAUSED" | "COMPLETED";

export interface StudyTimerView {
  id: number;
  kakouSessionId: number | null;
  source: string;
  status: StudyTimerStatus;
  accumulatedSeconds: number;
  elapsedSeconds: number;
  lastStartedAt: string | null;
  startedAt: string;
  endedAt: string | null;
}

export interface StudyTimeDay {
  date: string;
  seconds: number;
}

export interface StudyTimeStats {
  todaySeconds: number;
  weekSeconds: number;
  totalSeconds: number;
  byDay: StudyTimeDay[];
}

export interface StudyTimerOverview {
  activeTimer: StudyTimerView | null;
  stats: StudyTimeStats;
}
