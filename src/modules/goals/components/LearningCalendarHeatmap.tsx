"use client";

import React from "react";
import { Calendar } from "lucide-react";

interface CalendarItem {
  date: string;
  count: number;
  isExamDay?: boolean;
}

interface LearningCalendarHeatmapProps {
  data: CalendarItem[];
}

export const LearningCalendarHeatmap: React.FC<LearningCalendarHeatmapProps> = ({ data }) => {
  const getIntensityClass = (count: number, isExamDay?: boolean) => {
    if (isExamDay) return "bg-rose-500 border-rose-400 text-white font-bold ring-2 ring-rose-400 animate-pulse";
    if (count === 0) return "bg-slate-950 border-slate-800/60";
    if (count < 10) return "bg-emerald-950/60 border-emerald-800/40 text-emerald-500";
    if (count < 25) return "bg-emerald-700/80 border-emerald-600 text-emerald-200";
    return "bg-emerald-500 border-emerald-400 text-slate-950 font-bold";
  };

  return (
    <div className="flex flex-col gap-4 p-6 bg-slate-900/60 rounded-3xl border border-slate-800 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-300 font-bold text-base">
          <Calendar className="w-4 h-4 text-emerald-400" />
          <span>Study Consistency Heatmap & Exam Timeline</span>
        </div>
        <span className="text-xs text-slate-500">📍 Exam Marker Included</span>
      </div>

      <div className="grid grid-cols-6 sm:grid-cols-10 gap-2 p-3 bg-slate-950/40 rounded-2xl border border-slate-800/60">
        {data.map((item, idx) => (
          <div
            key={idx}
            className={`w-full aspect-square rounded-xl border flex items-center justify-center text-[10px] transition-transform hover:scale-110 cursor-pointer ${getIntensityClass(
              item.count,
              item.isExamDay
            )}`}
            title={item.isExamDay ? `📍 Exam Day (${item.date})` : `${item.date}: ${item.count} activity points`}
          >
            {item.isExamDay ? "📍" : item.count > 0 ? item.count : ""}
          </div>
        ))}
      </div>
    </div>
  );
};
