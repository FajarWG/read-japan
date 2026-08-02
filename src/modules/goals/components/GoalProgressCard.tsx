"use client";

import React, { useState } from "react";
import { Target, Clock, Settings } from "lucide-react";
import { GoalDetails } from "../services/goalService";
import { GoalSetupWizard } from "./GoalSetupWizard";

interface GoalProgressCardProps {
  goal: GoalDetails;
}

export const GoalProgressCard: React.FC<GoalProgressCardProps> = ({ goal }) => {
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  const statusColors = {
    Ahead: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    "On Track": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    Behind: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  };

  const plannerModeBadges = {
    Normal: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    Intensive: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
    "Review Focus": "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30",
  };

  return (
    <>
      <div className="flex flex-col gap-5 p-6 bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50 dark:from-slate-900/95 dark:via-slate-900/70 dark:to-blue-950/40 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl text-slate-900 dark:text-slate-100">
        {/* Top Banner: Exam Countdown */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white dark:bg-slate-950/80 rounded-2xl border border-blue-500/30 gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎌</span>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-slate-900 dark:text-white">{goal.type.replace(/_/g, " ")} Exam Countdown</span>
                <span className={`px-2.5 py-0.5 text-[11px] font-extrabold border rounded-full ${plannerModeBadges[goal.plannerMode]}`}>
                  {goal.plannerMode} Mode
                </span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Exam Date: <strong className="text-slate-800 dark:text-slate-200">{new Date(goal.examDate || goal.targetDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-700 dark:text-blue-300 text-xs font-bold shrink-0">
            <Clock className="w-4 h-4 text-blue-500 dark:text-blue-400" />
            <span>{goal.daysRemaining} Days ({goal.weeksRemaining} Weeks) Left</span>
          </div>
        </div>

        {/* Main Goal Stats Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <Target className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Goal Progress</span>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">{goal.targetLevel} Mastery Target</h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 text-xs font-bold border rounded-full ${statusColors[goal.status]}`}>
              {goal.status}
            </span>
            <button
              onClick={() => setIsWizardOpen(true)}
              className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              title="Configure Goal & Exam Date"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-600 dark:text-slate-400">Mastery Progress</span>
            <span className="text-blue-600 dark:text-blue-400 font-bold">{goal.progressPercent}% Completed</span>
          </div>
          <div className="w-full h-3 bg-slate-200 dark:bg-slate-950 rounded-full overflow-hidden border border-slate-300 dark:border-slate-800 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${goal.progressPercent}%` }}
            />
          </div>
        </div>

        {/* Smart Remaining Progress Estimation */}
        <div className="grid grid-cols-3 gap-3 p-3.5 bg-white dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800/80 text-center shadow-sm">
          <div className="flex flex-col items-center">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Remaining Vocab</span>
            <span className="text-base font-extrabold text-blue-600 dark:text-blue-400">{goal.remainingMaterial.vocabCount}</span>
          </div>
          <div className="flex flex-col items-center border-x border-slate-200 dark:border-slate-800">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Remaining Grammar</span>
            <span className="text-base font-extrabold text-purple-600 dark:text-purple-400">{goal.remainingMaterial.grammarCount}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Remaining Kanji</span>
            <span className="text-base font-extrabold text-amber-600 dark:text-amber-400">{goal.remainingMaterial.kanjiCount}</span>
          </div>
        </div>
      </div>

      {/* Goal Setup Modal Dialog */}
      <GoalSetupWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
      />
    </>
  );
};
