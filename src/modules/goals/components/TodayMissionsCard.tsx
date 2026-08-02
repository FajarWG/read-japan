"use client";

import React, { useState } from "react";
import { CheckCircle2, Circle, Sparkles } from "lucide-react";
import { MissionItem } from "../services/goalService";

interface TodayMissionsCardProps {
  initialMissions: MissionItem[];
}

export const TodayMissionsCard: React.FC<TodayMissionsCardProps> = ({ initialMissions }) => {
  const [missions, setMissions] = useState<MissionItem[]>(initialMissions);

  const toggleMission = async (id: number, currentCompleted: boolean) => {
    const nextCompleted = !currentCompleted;
    setMissions((prev) =>
      prev.map((m) => (m.id === id ? { ...m, completed: nextCompleted } : m))
    );

    try {
      await fetch("/api/missions/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ missionId: id, completed: nextCompleted }),
      });
    } catch (err) {
      console.error("Failed to update mission state:", err);
    }
  };

  const completedCount = missions.filter((m) => m.completed).length;

  return (
    <div className="flex flex-col gap-4 p-6 bg-slate-50 dark:bg-slate-900/60 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl text-slate-900 dark:text-slate-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-800 dark:text-slate-300 font-bold text-base">
          <Sparkles className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
          <span>Today's Missions ({completedCount}/{missions.length})</span>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        {missions.map((m) => (
          <button
            key={m.id}
            onClick={() => toggleMission(m.id, m.completed)}
            className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left cursor-pointer ${
              m.completed
                ? "bg-emerald-500/10 border-emerald-500/20 text-slate-600 dark:text-slate-300"
                : "bg-white dark:bg-slate-950/60 hover:bg-slate-100 dark:hover:bg-slate-800/80 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
            }`}
          >
            <div className="flex items-center gap-3">
              {m.completed ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-slate-400 dark:text-slate-600 shrink-0" />
              )}
              <span className={`text-sm font-semibold ${m.completed ? "line-through text-slate-400" : ""}`}>
                {m.title}
              </span>
            </div>

            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400 border border-slate-300 dark:border-slate-700">
              {m.module}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
