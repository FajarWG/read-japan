"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Target, Calendar, CheckCircle2, ArrowRight, Loader2, X } from "lucide-react";
import { showToast } from "@/src/shared/components/ToastProvider";

interface GoalSetupWizardProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
}

export const GoalSetupWizard: React.FC<GoalSetupWizardProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState("JLPT_N4");
  const [selectedLevel, setSelectedLevel] = useState("N4");
  const [durationDays] = useState(126);
  const [examDate, setExamDate] = useState("2026-12-06"); // Official upcoming JLPT Dec 6, 2026
  const [saving, setSaving] = useState(false);

  const goalTypes = [
    { id: "JLPT_N5", title: "JLPT N5 Target", level: "N5", defaultExam: "2026-12-06", desc: "Basic phrases, hiragana/katakana & 100 kanji." },
    { id: "JLPT_N4", title: "JLPT N4 Target", level: "N4", defaultExam: "2026-12-06", desc: "Elementary Japanese, 300 kanji & basic grammar." },
    { id: "JLPT_N3", title: "JLPT N3 Target", level: "N3", defaultExam: "2026-12-06", desc: "Intermediate Japanese, 650 kanji & daily topics." },
    { id: "JLPT_N2", title: "JLPT N2 Target", level: "N2", defaultExam: "2026-12-06", desc: "Business & advanced Japanese, 1,000+ kanji." },
    { id: "CONVERSATION", title: "Daily Conversation", level: "General", defaultExam: "2026-11-01", desc: "Focus on speaking, listening, and essential verbs." },
    { id: "CUSTOM", title: "Custom Study Plan", level: "General", defaultExam: "2026-12-31", desc: "Personalized study goals at your own pace." },
  ];

  const handleSelectGoal = (gt: typeof goalTypes[0]) => {
    setSelectedType(gt.id);
    setSelectedLevel(gt.level);
    if (gt.defaultExam) {
      setExamDate(gt.defaultExam);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: selectedType,
          targetLevel: selectedLevel,
          durationDays,
          examDate,
        }),
      });

      if (res.ok) {
        showToast("Goal & Exam Schedule configured successfully!", "success");
        if (onSuccess) onSuccess();
        if (onClose) onClose();
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to save goal:", err);
    } finally {
      setSaving(false);
    }
  };

  const contentNode = (
    <div className="flex flex-col gap-6 max-w-3xl w-full mx-auto p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl text-slate-900 dark:text-slate-100 relative">
      {/* Close button if Modal */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <Target className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Goal Setup & Exam Planner</h1>
            <p className="text-xs text-slate-600 dark:text-slate-400">Set your official exam date to generate an adaptive study schedule.</p>
          </div>
        </div>
      </div>

      {/* Step 1: Select Target Goal */}
      <div className="flex flex-col gap-3">
        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Step 1: Choose Your Target Level</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {goalTypes.map((gt) => (
            <button
              key={gt.id}
              onClick={() => handleSelectGoal(gt)}
              className={`flex flex-col gap-1.5 p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                selectedType === gt.id
                  ? "bg-blue-500/15 border-blue-500 text-slate-900 dark:text-white shadow-lg shadow-blue-500/10"
                  : "bg-slate-50 dark:bg-slate-950/60 hover:bg-slate-100 dark:hover:bg-slate-800/80 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold">{gt.title}</span>
                {selectedType === gt.id && <CheckCircle2 className="w-4 h-4 text-blue-500 dark:text-blue-400" />}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{gt.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Exam Date Selection */}
      <div className="flex flex-col gap-3">
        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Step 2: Official Exam Date</span>
        <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <Calendar className="w-6 h-6 text-amber-500 dark:text-amber-400 shrink-0" />
          <div className="flex-1 flex flex-col">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-300">JLPT Official / Target Exam Date</span>
            <span className="text-xs text-slate-500">Auto-filled to upcoming official exam session</span>
          </div>
          <input
            type="date"
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white font-mono focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Save Action */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center justify-center gap-2 w-full py-4 bg-blue-600 hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400 text-white font-extrabold rounded-2xl transition-all shadow-xl shadow-blue-500/25 cursor-pointer"
      >
        {saving ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Configuring Exam Countdown...</span>
          </>
        ) : (
          <>
            <span>Save & Launch Exam Schedule</span>
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>
    </div>
  );

  if (isOpen !== undefined) {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in overflow-y-auto">
        <div className="my-8 w-full max-w-3xl">
          {contentNode}
        </div>
      </div>
    );
  }

  return contentNode;
};
