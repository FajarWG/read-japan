"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Settings, Moon, Sun, Volume2, Eye, Target, Keyboard, ArrowLeft, CheckCircle2 } from "lucide-react";
import { showToast } from "@/src/shared/components/ToastProvider";

export default function SettingsCenterPage() {
  const [theme, setTheme] = useState("dark");
  const [autoPlayAudio, setAutoPlayAudio] = useState(true);
  const [showFurigana, setShowFurigana] = useState(true);

  const handleSave = () => {
    showToast("Settings saved successfully!", "success");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 sm:p-10 font-sans">
      <div className="max-w-3xl mx-auto flex flex-col gap-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex flex-col">
              <h1 className="text-3xl font-extrabold text-white">Settings Center</h1>
              <p className="text-xs text-slate-400">Configure app preferences, audio, furigana, and study goals.</p>
            </div>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="flex flex-col gap-6">
          {/* Theme & Display */}
          <div className="flex flex-col gap-4 p-6 bg-slate-900/60 rounded-3xl border border-slate-800 shadow-xl">
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <Moon className="w-5 h-5 text-blue-400" />
              <span>Appearance & Display</span>
            </h2>

            <div className="flex items-center justify-between p-4 bg-slate-950/60 rounded-2xl border border-slate-800">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-200">App Theme</span>
                <span className="text-xs text-slate-400">Default dark mode tailored for late-night study sessions.</span>
              </div>
              <span className="px-3 py-1 bg-slate-800 text-blue-400 border border-slate-700 text-xs font-bold rounded-xl">
                Dark Mode (Active)
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-950/60 rounded-2xl border border-slate-800">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-200">Display Furigana</span>
                <span className="text-xs text-slate-400">Show phonetic hiragana above kanji reading.</span>
              </div>
              <button
                onClick={() => setShowFurigana(!showFurigana)}
                className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                  showFurigana ? "bg-blue-500" : "bg-slate-800"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    showFurigana ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Audio & Review Settings */}
          <div className="flex flex-col gap-4 p-6 bg-slate-900/60 rounded-3xl border border-slate-800 shadow-xl">
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-purple-400" />
              <span>Audio & Review Options</span>
            </h2>

            <div className="flex items-center justify-between p-4 bg-slate-950/60 rounded-2xl border border-slate-800">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-200">Auto-Play Audio</span>
                <span className="text-xs text-slate-400">Automatically play native audio pronunciation during reviews.</span>
              </div>
              <button
                onClick={() => setAutoPlayAudio(!autoPlayAudio)}
                className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                  autoPlayAudio ? "bg-purple-500" : "bg-slate-800"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    autoPlayAudio ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Goal & Shortcuts */}
          <div className="flex flex-col gap-4 p-6 bg-slate-900/60 rounded-3xl border border-slate-800 shadow-xl">
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-amber-400" />
              <span>Target Goal & Shortcuts</span>
            </h2>

            <Link
              href="/goals/setup"
              className="flex items-center justify-between p-4 bg-slate-950/60 hover:bg-slate-800/80 rounded-2xl border border-slate-800 transition-colors"
            >
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-200">Configure JLPT Goal & Exam Date</span>
                <span className="text-xs text-slate-400">Update your target level and exam countdown.</span>
              </div>
              <span className="text-xs font-bold text-blue-400">Configure →</span>
            </Link>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="py-4 bg-blue-500 hover:bg-blue-400 text-white font-extrabold rounded-2xl transition-all shadow-xl shadow-blue-500/25 text-center cursor-pointer"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
}
