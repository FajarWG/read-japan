"use client";

import React, { useEffect, useState } from "react";
import { Loader2, Layers, Command, Clock } from "lucide-react";
import { ContinueLearningCard } from "./ContinueLearningCard";
import { QuickActionGrid } from "./QuickActionGrid";
import { TodayMissionsCard } from "@/src/modules/goals/components/TodayMissionsCard";
import { DashboardSkeleton } from "@/src/shared/components/LoadingSkeleton";
import { openGlobalSearch } from "@/src/shared/components/GlobalSearchModal";

import { ContinueLearningState, ActivityItem } from "../services/journeyService";
import { GoalDetails, MissionItem } from "@/src/modules/goals/services/goalService";

interface DashboardData {
  continueState: ContinueLearningState;
  timeline: ActivityItem[];
  recommendations: any[];
  stats: {
    srsDueCount: number;
    weakKanjiCount: number;
  };
  goal: GoalDetails | null;
  missions: MissionItem[];
  calendar: Array<{ date: string; count: number }>;
}

export const LearningHub: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      try {
        const [dashRes, goalRes, calRes] = await Promise.all([
          fetch("/api/journey/dashboard"),
          fetch("/api/planner/today"),
          fetch("/api/calendar"),
        ]);

        let dashJson = {};
        let goalJson = {};
        let calJson = {};

        if (dashRes.ok) dashJson = await dashRes.json();
        if (goalRes.ok) goalJson = await goalRes.json();
        if (calRes.ok) calJson = await calRes.json();

        setData({
          continueState: (dashJson as any).continueState,
          timeline: (dashJson as any).timeline || [],
          recommendations: (dashJson as any).recommendations || [],
          stats: (dashJson as any).stats || { srsDueCount: 0, weakKanjiCount: 0 },
          goal: (goalJson as any).goal || null,
          missions: (goalJson as any).missions || [],
          calendar: (calJson as any).calendar || [],
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
    plannerMode: defaultDays > 60 ? ("Normal" as const) : defaultDays > 7 ? ("Intensive" as const) : ("Review Focus" as const),
    remainingMaterial: { vocabCount: 1500, grammarCount: 120, kanjiCount: 300 },
  };

  return (
    <div className="flex flex-col gap-8 py-2">
      {/* 1. Continue Learning Hero Section */}
      <ContinueLearningCard state={data.continueState} />

      {/* 2. Today's Missions & Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 items-stretch">
        <div className="lg:col-span-2 h-full">
          <TodayMissionsCard initialMissions={data.missions} />
        </div>
        <div className="flex flex-col gap-3 justify-between h-full">
          <div className="flex items-center gap-3 p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex-1">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-slate-900 dark:text-white">{data.stats.srsDueCount}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">SRS Due Today</span>
            </div>
          </div>

          <button
            onClick={openGlobalSearch}
            className="flex items-center gap-3 p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 transition-all cursor-pointer text-left shadow-sm flex-1"
          >
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Command className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-extrabold text-slate-900 dark:text-white">Cmd + K</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Click to Search</span>
            </div>
          </button>

          {/* Exam Time Remaining Card */}
          <div className="flex items-center justify-between p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-slate-900 dark:text-slate-100 flex-1">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                <Clock className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  {activeGoal.type.replace(/_/g, " ")} Exam
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  {new Date(activeGoal.examDate || activeGoal.targetDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-sm font-black text-blue-600 dark:text-blue-400">
                {activeGoal.daysRemaining} Days Left
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                ({activeGoal.weeksRemaining} Weeks)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Quick Action Grid */}
      <QuickActionGrid />
    </div>
  );
};
