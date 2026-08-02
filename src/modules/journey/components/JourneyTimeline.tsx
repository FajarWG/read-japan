"use client";

import React from "react";
import { History, CheckCircle2, BookOpen, Layers } from "lucide-react";
import { ActivityItem } from "../services/journeyService";

interface JourneyTimelineProps {
  timeline: ActivityItem[];
}

export const JourneyTimeline: React.FC<JourneyTimelineProps> = ({ timeline }) => {
  return (
    <div className="flex flex-col gap-4 p-6 bg-slate-900/60 rounded-3xl border border-slate-800 shadow-xl">
      <div className="flex items-center gap-2 text-slate-300 font-bold text-base">
        <History className="w-4 h-4 text-indigo-400" />
        <span>Recent Learning Timeline</span>
      </div>

      {timeline.length === 0 ? (
        <div className="p-4 text-center text-xs text-slate-500 bg-slate-950/40 rounded-2xl border border-slate-800/60">
          No recent activity logged yet today. Start a review session!
        </div>
      ) : (
        <div className="flex flex-col gap-3 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
          {timeline.map((item) => (
            <div key={item.id} className="flex items-start gap-3 relative z-10">
              <div className="w-7 h-7 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center text-blue-400 shrink-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex flex-col gap-0.5 pt-1">
                <span className="text-xs font-bold text-slate-200 capitalize">
                  {item.type.replace(/_/g, " ")}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  {item.createdAt}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
