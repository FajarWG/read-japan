"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, Layers, Pencil, MessageSquare, Compass, Sparkles, Activity } from "lucide-react";

export const QuickActionGrid: React.FC = () => {
  const actions = [
    {
      title: "Review Flashcards",
      desc: "Anki SRS Spaced Repetition",
      href: "/anki",
      icon: Layers,
      color: "border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400",
    },
    {
      title: "Explore Knowledge",
      desc: "Kanji & Vocab Tree",
      href: "/anki",
      icon: Compass,
      color: "border-purple-200 dark:border-purple-500/30 text-purple-600 dark:text-purple-400",
    },
    {
      title: "Adaptive Weakness",
      desc: "Weak Kanji & Confusions",
      href: "/adaptive",
      icon: Activity,
      color: "border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400",
    },
    {
      title: "Writing Canvas",
      desc: "Kakou Guided Handwriting",
      href: "/kakou",
      icon: Pencil,
      color: "border-amber-200 dark:border-amber-500/30 text-amber-600 dark:text-amber-400",
    },
    {
      title: "Verb Conjugation",
      desc: "Katsuyou Lessons",
      href: "/katsuyou",
      icon: BookOpen,
      color: "border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "AI Conversation",
      desc: "3D VRM Avatar Practice",
      href: "/conversation",
      icon: MessageSquare,
      color: "border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400",
    },
  ];

  return (
    <div className="flex flex-col gap-4 text-slate-900 dark:text-slate-100">
      <div className="flex items-center gap-2 text-slate-800 dark:text-slate-300 font-bold text-base px-1">
        <Sparkles className="w-4 h-4 text-blue-500 dark:text-blue-400" />
        <span>Quick Actions</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((act, idx) => {
          const Icon = act.icon;
          return (
            <Link
              key={idx}
              href={act.href}
              className={`flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800/80 border transition-all duration-200 hover:scale-[1.02] shadow-sm ${act.color}`}
            >
              <div className="p-3 rounded-xl bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                  {act.title}
                </span>
                <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  {act.desc}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
