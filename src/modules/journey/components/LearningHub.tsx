"use client";

import React, { useEffect, useState } from "react";
import { Loader2, Flame, Layers, Command } from "lucide-react";
import { ContinueLearningCard } from "./ContinueLearningCard";
import { QuickActionGrid } from "./QuickActionGrid";
import { JourneyTimeline } from "./JourneyTimeline";
import { RecommendationSection } from "./RecommendationSection";
import { GoalProgressCard } from "@/src/modules/goals/components/GoalProgressCard";
import { TodayMissionsCard } from "@/src/modules/goals/components/TodayMissionsCard";
import { LearningCalendarHeatmap } from "@/src/modules/goals/components/LearningCalendarHeatmap";
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

  return (
    <div className="flex flex-col gap-8 py-2">
      {/* 1. Goal Progress Card (if set) */}
      {data.goal && <GoalProgressCard goal={data.goal} />}

      {/* 2. Continue Learning Hero Section */}
      <ContinueLearningCard state={data.continueState} />

      {/* 3. Today's Missions & Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TodayMissionsCard initialMissions={data.missions} />
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 p-4 bg-slate-900/60 rounded-2xl border border-slate-800">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-white">{data.stats.srsDueCount}</span>
              <span className="text-xs text-slate-400 font-medium">SRS Due Today</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-slate-900/60 rounded-2xl border border-slate-800">
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Flame className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-white">{data.stats.weakKanjiCount}</span>
              <span className="text-xs text-slate-400 font-medium">Weak Kanji Confusions</span>
            </div>
          </div>

          <button
            onClick={openGlobalSearch}
            className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 transition-all cursor-pointer text-left shadow-sm"
          >
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Command className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-extrabold text-slate-900 dark:text-white">Cmd + K</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Click to Search</span>
            </div>
          </button>
        </div>
      </div>

      {/* 4. Learning Consistency Calendar Heatmap */}
      <LearningCalendarHeatmap data={data.calendar} />

      {/* 5. Recommended Next Practice */}
      <RecommendationSection recommendations={data.recommendations} />

      {/* 6. Quick Action Grid */}
      <QuickActionGrid />

      {/* 7. Recent Activity Timeline */}
      <JourneyTimeline timeline={data.timeline} />
    </div>
  );
};
