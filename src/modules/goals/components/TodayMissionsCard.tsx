"use client";

import React from "react";
import { CheckCircle2, Circle, Sparkles } from "lucide-react";
import { MissionItem } from "../services/goalService";

interface TodayMissionsCardProps {
  initialMissions: MissionItem[];
}

export const TodayMissionsCard: React.FC<TodayMissionsCardProps> = ({ initialMissions }) => {
  const completedCount = initialMissions.filter((m) => m.completed).length;

  return (
    <div className="flex flex-col justify-between h-full gap-3 p-4 sm:p-5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md text-slate-900 dark:text-slate-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-800 dark:text-slate-300 font-extrabold text-sm sm:text-base">
          <Sparkles className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
          <span>Today's Missions ({completedCount}/{initialMissions.length})</span>
        </div>
      </div>

      <div className="flex flex-col gap-2.5 flex-1 justify-center py-1">
        {initialMissions.map((m) => (
          <div
            key={m.id}
            className={`flex items-center justify-between p-2.5 sm:p-3 rounded-xl border transition-all text-left select-none ${
              m.completed
                ? "bg-emerald-500/10 border-emerald-500/20 text-slate-600 dark:text-slate-300"
                : "bg-white dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
            }`}
          >
            <div className="flex items-center gap-2.5">
              {m.completed ? (
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 dark:text-emerald-400 shrink-0" />
              ) : (
                <Circle className="w-4.5 h-4.5 text-slate-400 dark:text-slate-600 shrink-0" />
              )}
              <span className={`text-xs sm:text-sm font-semibold ${m.completed ? "line-through text-slate-400" : ""}`}>
                {m.title}
              </span>
            </div>

            <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-400 border border-slate-300/60 dark:border-slate-700">
              {m.module}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
