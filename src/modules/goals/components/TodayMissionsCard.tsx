"use client";

import React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Circle,
  Sunrise,
  Sun,
  Moon,
  ArrowRight,
  Flame,
  Clock,
} from "lucide-react";
import { MissionItem } from "../services/goalService";

interface TodayMissionsCardProps {
  initialMissions: MissionItem[];
}

const SLOT_CONFIG: Record<
  "morning" | "afternoon" | "evening",
  {
    icon: typeof Sunrise;
    iconColor: string;
    bgColor: string;
    borderColor: string;
    period: string;
  }
> = {
  morning: {
    icon: Sunrise,
    iconColor: "text-amber-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
    period: "Pagi",
  },
  afternoon: {
    icon: Sun,
    iconColor: "text-sky-500",
    bgColor: "bg-sky-500/10",
    borderColor: "border-sky-500/20",
    period: "Siang",
  },
  evening: {
    icon: Moon,
    iconColor: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
    borderColor: "border-indigo-500/20",
    period: "Sore/Malam",
  },
};

export const TodayMissionsCard: React.FC<TodayMissionsCardProps> = ({
  initialMissions,
}) => {
  const completedCount = initialMissions.filter((m) => m.completed).length;
  const isAllCompleted = completedCount === initialMissions.length;

  return (
    <div className="flex flex-col justify-between h-full gap-4 p-4 sm:p-5 bg-surface rounded-2xl border border-border shadow-xs text-foreground">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base leading-tight text-foreground flex items-center gap-2">
              <span>Today&apos;s Missions</span>
              <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                {completedCount}/3 Sesi
              </span>
            </h3>
            <p className="text-[11px] text-muted">
              Target min. 5 kartu Anki atau 3 menit per sesi
            </p>
          </div>
        </div>

        {isAllCompleted ? (
          <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-xl shadow-2xs">
            🎉 All Completed!
          </span>
        ) : (
          <Link
            href="/anki"
            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors"
          >
            <span>Review Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* Segmented Progress Bar */}
      <div className="grid grid-cols-3 gap-1.5 w-full">
        {initialMissions.map((m, idx) => (
          <div
            key={idx}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              m.completed
                ? "bg-emerald-500 shadow-xs shadow-emerald-500/30"
                : m.isCurrentSlot
                  ? "bg-indigo-500/40 animate-pulse"
                  : "bg-surface-muted border border-border/50"
            }`}
          />
        ))}
      </div>

      {/* 3 Slots Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {initialMissions.map((m) => {
          const cfg = SLOT_CONFIG[m.slotKey] || SLOT_CONFIG.morning;
          const Icon = cfg.icon;

          return (
            <div
              key={m.id}
              className={[
                "relative flex flex-col justify-between p-3 rounded-xl border transition-all text-left group",
                m.completed
                  ? "bg-emerald-500/5 border-emerald-500/30 text-foreground shadow-2xs"
                  : m.isCurrentSlot
                    ? "bg-surface-muted border-indigo-500/50 shadow-xs ring-1 ring-indigo-500/30"
                    : "bg-surface-muted/40 border-border/70 text-muted",
              ].join(" ")}
            >
              {/* Active Now Pill */}
              {m.isCurrentSlot && !m.completed && (
                <span className="absolute -top-2 right-2.5 px-1.5 py-0.2 text-[9px] font-black uppercase tracking-wider bg-indigo-600 text-white rounded-full shadow-xs animate-bounce">
                  Active Now
                </span>
              )}

              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`p-1.5 rounded-lg ${cfg.bgColor} ${cfg.borderColor} border`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${cfg.iconColor}`} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-foreground">
                      {m.title}
                    </span>
                    <span className="text-[10px] text-muted flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5" />
                      {m.timeRange}
                    </span>
                  </div>
                </div>

                <div>
                  {m.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-muted/40 shrink-0" />
                  )}
                </div>
              </div>

              {/* Progress Count */}
              <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-border/50">
                <span className="text-muted text-[10px]">Reviewed</span>
                <span
                  className={`font-black text-[11px] ${
                    m.completed
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-foreground"
                  }`}
                >
                  {m.currentCount} / {m.targetCount} cards
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

