"use client";

import React, { useState, useMemo } from "react";
import {
  CalendarDays,
  Flame,
  CheckCircle2,
  XCircle,
  Sparkles,
  Trophy,
} from "lucide-react";
import { CalendarDayItem } from "@/src/modules/goals/services/goalService";

interface ActivityHeatmapProps {
  calendar: CalendarDayItem[];
}

export const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({
  calendar,
}) => {
  const [hoveredDay, setHoveredDay] = useState<CalendarDayItem | null>(null);

  // Group days into weeks (columns of 7 days)
  const { weeks, monthLabels, streakStats } = useMemo(() => {
    if (!calendar || calendar.length === 0) {
      return {
        weeks: [],
        monthLabels: [],
        streakStats: { currentStreak: 0, longestStreak: 0, totalActiveDays: 0 },
      };
    }

    // Sort calendar by date ascending
    const sorted = [...calendar].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    // Calculate streaks
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let totalActiveDays = 0;

    for (let i = 0; i < sorted.length; i++) {
      const item = sorted[i];
      if (item.level > 0 || item.count > 0) {
        totalActiveDays++;
        tempStreak++;
        if (tempStreak > longestStreak) longestStreak = tempStreak;
      } else {
        tempStreak = 0;
      }
    }

    // Current streak from the end backwards
    for (let i = sorted.length - 1; i >= 0; i--) {
      const item = sorted[i];
      if (item.level > 0 || item.count > 0) {
        currentStreak++;
      } else if (i === sorted.length - 1) {
        // If today is not yet studied, continue checking from yesterday
        continue;
      } else {
        break;
      }
    }

    // Group into 7-day chunks (columns)
    const groupedWeeks: CalendarDayItem[][] = [];
    let currentWeek: CalendarDayItem[] = [];

    for (let i = 0; i < sorted.length; i++) {
      currentWeek.push(sorted[i]);
      if (currentWeek.length === 7) {
        groupedWeeks.push(currentWeek);
        currentWeek = [];
      }
    }
    if (currentWeek.length > 0) {
      groupedWeeks.push(currentWeek);
    }

    // Extract month labels with column offsets
    const months: Array<{ label: string; weekIndex: number }> = [];
    let lastMonth = "";

    groupedWeeks.forEach((week, wIdx) => {
      const firstDayOfWeek = week[0];
      if (firstDayOfWeek) {
        const monthName = new Date(firstDayOfWeek.date).toLocaleDateString(
          "en-US",
          { month: "short" },
        );
        if (monthName !== lastMonth) {
          months.push({ label: monthName, weekIndex: wIdx });
          lastMonth = monthName;
        }
      }
    });

    return {
      weeks: groupedWeeks,
      monthLabels: months,
      streakStats: { currentStreak, longestStreak, totalActiveDays },
    };
  }, [calendar]);

  const getTileColor = (level: 0 | 1 | 2 | 3) => {
    switch (level) {
      case 3:
        return "bg-emerald-500 border-emerald-400 shadow-2xs ring-1 ring-emerald-400/40";
      case 2:
        return "bg-emerald-500/70 border-emerald-500/80";
      case 1:
        return "bg-emerald-500/35 border-emerald-500/40";
      case 0:
      default:
        return "bg-surface-muted/80 border-border/60 hover:border-indigo-500/50";
    }
  };

  const dayNames = ["Mon", "", "Wed", "", "Fri", "", "Sun"];

  return (
    <div className="w-full flex flex-col gap-5 p-5 sm:p-6 bg-surface rounded-3xl border border-border shadow-xs text-foreground">
      {/* Header & Quick Streak Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/70">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-base sm:text-lg leading-tight text-foreground flex items-center gap-2">
              <span>Learning Activity Heatmap</span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-surface-muted text-muted border border-border">
                Past 26 Weeks
              </span>
            </h3>
            <p className="text-xs text-muted">
              Warna kotak ditentukan oleh penyelesaian 3 sesi belajar harian (Pagi, Siang, Sore)
            </p>
          </div>
        </div>

        {/* Streak Badges */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-500/25 rounded-2xl text-amber-600 dark:text-amber-400 shadow-2xs">
            <Flame className="w-4 h-4 shrink-0" />
            <span className="text-xs font-black">
              {streakStats.currentStreak} Day Streak
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/25 rounded-2xl text-indigo-600 dark:text-indigo-400 shadow-2xs">
            <Trophy className="w-4 h-4 shrink-0" />
            <span className="text-xs font-black">
              Best {streakStats.longestStreak} Days
            </span>
          </div>
        </div>
      </div>

      {/* Full-width Heatmap Grid Area */}
      <div className="relative overflow-x-auto pb-2 -mx-1 px-1">
        <div className="flex flex-col gap-1.5 min-w-[700px]">
          {/* Month Labels Row */}
          <div className="flex text-[11px] font-bold text-muted pl-8 mb-1 relative h-4 select-none">
            {monthLabels.map((m, idx) => (
              <span
                key={idx}
                className="absolute"
                style={{ left: `${m.weekIndex * 21 + 32}px` }}
              >
                {m.label}
              </span>
            ))}
          </div>

          {/* Days Grid with Day Name Labels */}
          <div className="flex gap-2 items-start">
            {/* Day of Week Labels */}
            <div className="flex flex-col gap-1.5 text-[10px] font-bold text-muted/70 pr-1 select-none">
              {dayNames.map((d, idx) => (
                <span
                  key={idx}
                  className="h-3.5 sm:h-4 leading-3.5 sm:leading-4 w-6 text-right"
                >
                  {d}
                </span>
              ))}
            </div>

            {/* Weeks Columns */}
            <div className="flex gap-1.5 flex-1">
              {weeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-1.5">
                  {week.map((day) => {
                    const isHovered = hoveredDay?.date === day.date;

                    return (
                      <button
                        key={day.date}
                        type="button"
                        onMouseEnter={() => setHoveredDay(day)}
                        onMouseLeave={() => setHoveredDay(null)}
                        onClick={() => setHoveredDay(day)}
                        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-[3px] sm:rounded-md border transition-all duration-150 cursor-pointer ${getTileColor(
                          day.level,
                        )} ${
                          isHovered
                            ? "scale-140 ring-2 ring-indigo-500 z-10"
                            : ""
                        }`}
                        title={`${day.date}: ${day.completedSessions}/3 Sesi (${day.count} review)`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Details: Active Popover / Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-border/60 text-xs">
        {/* Hovered Day Details / Default Tip */}
        <div className="min-w-0 flex-1">
          {hoveredDay ? (
            <div className="flex items-center gap-3.5 animate-in fade-in duration-150 flex-wrap">
              <span className="font-black text-foreground text-xs sm:text-sm">
                {new Date(hoveredDay.date).toLocaleDateString("id-ID", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>

              <div className="flex items-center gap-2.5 text-xs">
                <span
                  className={`inline-flex items-center gap-1 font-bold ${
                    hoveredDay.sessions?.morning
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-muted"
                  }`}
                >
                  {hoveredDay.sessions?.morning ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-muted/40" />
                  )}
                  Pagi
                </span>

                <span
                  className={`inline-flex items-center gap-1 font-bold ${
                    hoveredDay.sessions?.afternoon
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-muted"
                  }`}
                >
                  {hoveredDay.sessions?.afternoon ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-muted/40" />
                  )}
                  Siang
                </span>

                <span
                  className={`inline-flex items-center gap-1 font-bold ${
                    hoveredDay.sessions?.evening
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-muted"
                  }`}
                >
                  {hoveredDay.sessions?.evening ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-muted/40" />
                  )}
                  Sore
                </span>
              </div>

              <span className="text-xs text-muted font-medium">
                ({hoveredDay.count} kartu review, ~{hoveredDay.studyMinutes} menit)
              </span>
            </div>
          ) : (
            <span className="text-xs text-muted flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Hover atau klik kotak untuk melihat rincian 3 sesi belajar harian
            </span>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 shrink-0 text-xs text-muted font-bold">
          <span>0 Sesi</span>
          <div className="w-3 h-3 rounded-[3px] bg-surface-muted/80 border border-border/60" />
          <div className="w-3 h-3 rounded-[3px] bg-emerald-500/35 border border-emerald-500/40" />
          <div className="w-3 h-3 rounded-[3px] bg-emerald-500/70 border border-emerald-500/80" />
          <div className="w-3 h-3 rounded-[3px] bg-emerald-500 border border-emerald-400" />
          <span>3 Sesi (Penuh)</span>
        </div>
      </div>
    </div>
  );
};

