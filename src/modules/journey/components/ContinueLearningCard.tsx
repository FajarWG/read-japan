"use client";

import React from "react";
import Link from "next/link";
import { Play, Sparkles, Clock } from "lucide-react";
import { ContinueLearningState } from "../services/journeyService";

interface ContinueLearningCardProps {
  state: ContinueLearningState;
}

export const ContinueLearningCard: React.FC<ContinueLearningCardProps> = ({ state }) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-slate-100 dark:from-blue-900/40 dark:via-indigo-900/30 dark:to-slate-900/60 rounded-2xl border border-blue-200 dark:border-blue-500/30 shadow-md gap-3 relative overflow-hidden text-slate-900 dark:text-slate-100">
      <div className="flex items-center gap-3 z-10">
        <div className="w-10 h-10 rounded-xl bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center shadow-md shadow-blue-500/30 shrink-0">
          <Play className="w-5 h-5 fill-white ml-0.5" />
        </div>
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              {state.module}
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              <Clock className="w-3 h-3" /> {state.lastActive}
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
            {state.title}
          </h2>
        </div>
      </div>

      <Link
        href={state.href}
        className="z-10 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md shadow-blue-500/20 hover:shadow-blue-500/35 shrink-0"
      >
        <span>Continue Learning</span>
        <Sparkles className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
};
