"use client";

import React, { useEffect, useState } from "react";
import { Layers, Hourglass, Clock } from "lucide-react";
import { ContinueLearningCard } from "./ContinueLearningCard";
import { DailyStudyHubCard } from "./DailyStudyHubCard";
import { DashboardSkeleton } from "@/src/shared/components/LoadingSkeleton";

import { ContinueLearningState, ActivityItem } from "../services/journeyService";
import {
  GoalDetails,
  MissionItem,
  CalendarDayItem,
} from "@/src/modules/goals/services/goalService";

interface StudyTimeSummary {
  totalSeconds: number;
  avgSecondsPerActiveDay: number;
  activeDays: number;
  todaySeconds: number;
}

const EMPTY_STUDY_TIME: StudyTimeSummary = {
  totalSeconds: 0,
  avgSecondsPerActiveDay: 0,
  activeDays: 0,
  todaySeconds: 0,
};

/** 0 → "0h", 5400 → "1.5h", 900 → "15m" */
function formatHours(totalSeconds: number): string {
  const seconds = Math.max(0, Math.round(totalSeconds));
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
  const hours = seconds / 3600;
  return `${hours >= 10 ? Math.round(hours) : hours.toFixed(1)}h`;
}

interface DashboardData {
  continueState: ContinueLearningState;
  timeline: ActivityItem[];
  recommendations: unknown[];
  stats: {
    srsDueCount: number;
    weakKanjiCount: number;
    studyTime?: StudyTimeSummary;
  };
  goal: GoalDetails | null;
  missions: MissionItem[];
  calendar: CalendarDayItem[];
}

export const LearningHub: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPlannerToday = async (target?: number) => {
    try {
      const url = target ? `/api/planner/today?target=${target}` : "/api/planner/today";
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        setData((prev) =>
          prev
            ? {
                ...prev,
                goal: json.goal || prev.goal,
                missions: json.missions || prev.missions,
              }
            : prev,
        );
      }
    } catch (err) {
      console.error("Failed to re-fetch today missions:", err);
    }
  };

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      try {
        let savedTarget: number | undefined;
        try {
          const val = localStorage.getItem("read_japan_daily_target_cards");
          if (val) savedTarget = parseInt(val, 10);
        } catch {
          // Ignore
        }

        const plannerUrl = savedTarget ? `/api/planner/today?target=${savedTarget}` : "/api/planner/today";

        const [dashRes, goalRes, calRes] = await Promise.all([
          fetch("/api/journey/dashboard"),
          fetch(plannerUrl),
          fetch("/api/calendar"),
        ]);

        let dashJson: Record<string, unknown> = {};
        let goalJson: Record<string, unknown> = {};
        let calJson: Record<string, unknown> = {};

        if (dashRes.ok) dashJson = await dashRes.json();
        if (goalRes.ok) goalJson = await goalRes.json();
        if (calRes.ok) calJson = await calRes.json();

        setData({
          continueState: dashJson.continueState as ContinueLearningState,
          timeline: (dashJson.timeline as ActivityItem[]) || [],
          recommendations: (dashJson.recommendations as unknown[]) || [],
          stats: (dashJson.stats as DashboardData["stats"]) || {
            srsDueCount: 0,
            weakKanjiCount: 0,
          },
          goal: (goalJson.goal as GoalDetails) || null,
          missions: (goalJson.missions as MissionItem[]) || [],
          calendar: (calJson.calendar as CalendarDayItem[]) || [],
        });
      } catch (err) {
        console.error("Failed to load journey dashboard:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!data) return null;

  const defaultExamDate = "2026-12-06T00:00:00Z";
  const now = new Date();
  const diffTime = new Date(defaultExamDate).getTime() - now.getTime();
  const defaultDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  const defaultWeeks = Math.ceil(defaultDays / 7);

  const studyTime = data.stats.studyTime ?? EMPTY_STUDY_TIME;

  const activeGoal = data.goal || {
    id: 0,
    type: "JLPT_N4",
    targetLevel: "N4",
    targetDate: defaultExamDate,
    examDate: defaultExamDate,
    daysRemaining: defaultDays,
    weeksRemaining: defaultWeeks,
    progressPercent: 0,
    status: "On Track" as const,
    plannerMode:
      defaultDays > 60
        ? ("Normal" as const)
        : defaultDays > 7
          ? ("Intensive" as const)
          : ("Review Focus" as const),
    remainingMaterial: {
      vocabCount: 1500,
      grammarCount: 120,
      kanjiCount: 300,
    },
  };

  return (
    <div className="flex flex-col gap-6 sm:gap-8 py-2">
      {/* 1. Continue Learning Hero Section */}
      <ContinueLearningCard state={data.continueState} />

      {/* 2. Top Stats Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* SRS Due Today */}
        <div className="flex items-center gap-3.5 p-4 bg-surface rounded-2xl border border-border shadow-2xs">
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black text-foreground">
              {data.stats.srsDueCount}
            </span>
            <span className="text-xs text-muted font-medium">SRS Due Today</span>
          </div>
        </div>

        {/* Total Studied Time */}
        <div className="flex items-center gap-3.5 p-4 bg-surface rounded-2xl border border-border shadow-2xs">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0">
            <Hourglass className="w-5 h-5" />
          </div>
          <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
            <div className="flex flex-col">
              <span className="text-2xl font-black text-foreground leading-tight">
                {formatHours(studyTime.totalSeconds)}
              </span>
              <span className="text-xs text-muted font-medium">Total Studied</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-sm font-black text-amber-600 dark:text-amber-400 leading-tight">
                {formatHours(studyTime.avgSecondsPerActiveDay)}
              </span>
              <span className="text-[10px] text-muted font-medium">Avg / day</span>
            </div>
          </div>
        </div>

        {/* JLPT Exam Countdown */}
        <div className="flex items-center justify-between p-4 bg-surface rounded-2xl border border-border shadow-2xs text-foreground">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black text-foreground uppercase tracking-wider">
                {activeGoal.type.replace(/_/g, " ")} Exam
              </span>
              <span className="text-[11px] text-muted font-medium">
                {new Date(
                  activeGoal.examDate || activeGoal.targetDate,
                ).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-base font-black text-sky-600 dark:text-sky-400">
              {activeGoal.daysRemaining}d Left
            </span>
            <span className="text-[10px] text-muted font-medium">
              ({activeGoal.weeksRemaining}w)
            </span>
          </div>
        </div>
      </div>

      {/* 3. Daily Study & Activity Hub (Today's Missions + Large Activity Heatmap 2 Columns 50:50) */}
      <DailyStudyHubCard
        missions={data.missions}
        calendar={data.calendar}
        onTargetChange={fetchPlannerToday}
      />
    </div>
  );
};

