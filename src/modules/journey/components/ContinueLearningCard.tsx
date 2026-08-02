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
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900/60 rounded-3xl border border-blue-500/30 shadow-xl gap-4 relative overflow-hidden">
      <div className="flex items-center gap-4 z-10">
        <div className="w-14 h-14 rounded-2xl bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 shrink-0">
          <Play className="w-7 h-7 fill-white ml-1" />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
              {state.module}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 font-medium">
              <Clock className="w-3 h-3" /> {state.lastActive}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {state.title}
          </h2>
        </div>
      </div>

      <Link
        href={state.href}
        className="z-10 inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-400 text-white font-extrabold rounded-2xl transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 shrink-0"
      >
        <span>Continue Learning</span>
        <Sparkles className="w-4 h-4" />
      </Link>
    </div>
  );
};
