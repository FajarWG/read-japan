"use client";

import React, { useState, useMemo, useRef } from "react";
import {
  Flame,
  Trophy,
  Sunrise,
  Sun,
  Moon,
  Clock,
  CheckCircle2,
  Circle,
  Sparkles,
  CalendarDays,
  XCircle,
  SlidersHorizontal,
  Check,
} from "lucide-react";
import {
  MissionItem,
  CalendarDayItem,
} from "@/src/modules/goals/services/goalService";

interface DailyStudyHubCardProps {
  missions: MissionItem[];
  calendar: CalendarDayItem[];
  onTargetChange?: (newTarget: number) => void;
}

const SLOT_CONFIG: Record<
  "morning" | "afternoon" | "evening",
  {
    icon: typeof Sunrise;
    iconColor: string;
    bgColor: string;
    borderColor: string;
    englishTitle: string;
  }
> = {
  morning: {
    icon: Sunrise,
    iconColor: "text-amber-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
    englishTitle: "Morning Study",
  },
  afternoon: {
    icon: Sun,
    iconColor: "text-sky-500",
    bgColor: "bg-sky-500/10",
    borderColor: "border-sky-500/20",
    englishTitle: "Afternoon Study",
  },
  evening: {
    icon: Moon,
    iconColor: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
    borderColor: "border-indigo-500/20",
    englishTitle: "Evening Study",
  },
};

const TARGET_PRESETS = [5, 10, 15, 20, 25, 30];

export const DailyStudyHubCard: React.FC<DailyStudyHubCardProps> = ({
  missions: initialMissions,
  calendar,
  onTargetChange,
}) => {
  const calendarCardRef = useRef<HTMLDivElement>(null);
  const [popover, setPopover] = useState<{
    day: CalendarDayItem;
    x: number;
    y: number;
  } | null>(null);

  const [showTargetModal, setShowTargetModal] = useState(false);
  const [targetCards, setTargetCards] = useState<number>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("read_japan_daily_target_cards");
        if (saved) {
          const parsed = parseInt(saved, 10);
          if (!isNaN(parsed) && parsed > 0) return parsed;
        }
      } catch {
        // Ignore
      }
    }
    return 5;
  });
  const [customInputVal, setCustomInputVal] = useState<string>(() =>
    targetCards.toString(),
  );

  // Compute live missions with custom target
  const missions = useMemo(() => {
    return initialMissions.map((m) => {
      const completed = m.currentCount >= targetCards;
      return {
        ...m,
        targetCount: targetCards,
        completed,
      };
    });
  }, [initialMissions, targetCards]);

  const handleSelectPreset = (preset: number) => {
    setTargetCards(preset);
    setCustomInputVal(preset.toString());
    try {
      localStorage.setItem("read_japan_daily_target_cards", preset.toString());
    } catch {
      // Ignore
    }
    setShowTargetModal(false);
    onTargetChange?.(preset);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(customInputVal, 10);
    if (!isNaN(val) && val > 0 && val <= 200) {
      setTargetCards(val);
      try {
        localStorage.setItem("read_japan_daily_target_cards", val.toString());
      } catch {
        // Ignore
      }
      setShowTargetModal(false);
      onTargetChange?.(val);
    }
  };

  const handleMouseEnterDay = (
    e: React.MouseEvent<HTMLButtonElement>,
    day: CalendarDayItem,
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cardRect = calendarCardRef.current?.getBoundingClientRect() ?? {
      left: 0,
      top: 0,
    };
    setPopover({
      day,
      x: rect.left - cardRect.left + rect.width / 2,
      y: rect.top - cardRect.top - 8,
    });
  };

  const handleMouseLeaveDay = () => {
    setPopover(null);
  };

  // Group days into weeks (columns of 7 days) and calculate streaks
  const { weeks, monthLabels, streakStats } = useMemo(() => {
    if (!calendar || calendar.length === 0) {
      return {
        weeks: [],
        monthLabels: [],
        streakStats: { currentStreak: 0, longestStreak: 0, totalActiveDays: 0 },
      };
    }

    const sorted = [...calendar].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

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

    for (let i = sorted.length - 1; i >= 0; i--) {
      const item = sorted[i];
      if (item.level > 0 || item.count > 0) {
        currentStreak++;
      } else if (i === sorted.length - 1) {
        continue;
      } else {
        break;
      }
    }

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

  const completedMissionsCount = missions.filter((m) => m.completed).length;
  const isAllMissionsDone =
    missions.length > 0 && completedMissionsCount === missions.length;

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
    <div className="w-full flex flex-col gap-6 p-5 sm:p-6 bg-surface rounded-3xl border border-border shadow-xs text-foreground relative">
      {/* Top Header with Streaks */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/70">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black tracking-tight text-foreground flex items-center gap-2">
              <span>Daily Study & Activity</span>
            </h2>
            <p className="text-xs text-muted">
              Complete 3 daily sessions to maintain your streak and build lasting study habits
            </p>
          </div>
        </div>

        {/* Streaks Badges */}
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

      {/* 50:50 Two-Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Kolom 1 (50%): Today's Missions */}
        <div className="flex flex-col justify-between gap-4 p-4 sm:p-5 bg-surface-muted/30 rounded-2xl border border-border/80">
          {/* Mission Sub-header */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-black text-foreground">
                Today&apos;s Missions
              </span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                {completedMissionsCount}/3 Sessions
              </span>
            </div>

            {isAllMissionsDone && (
              <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400">
                🎉 Completed!
              </span>
            )}
          </div>

          {/* Segmented Progress Bar */}
          <div className="grid grid-cols-3 gap-1.5 w-full">
            {missions.map((m, idx) => (
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

          {/* 3 Missions List */}
          <div className="flex flex-col gap-2.5 flex-1 justify-center">
            {missions.map((m) => {
              const cfg = SLOT_CONFIG[m.slotKey] || SLOT_CONFIG.morning;
              const Icon = cfg.icon;

              return (
                <div
                  key={m.id}
                  className={[
                    "relative flex items-center justify-between p-3 rounded-xl border transition-all select-none",
                    m.completed
                      ? "bg-emerald-500/5 border-emerald-500/30 text-foreground shadow-2xs"
                      : m.isCurrentSlot
                        ? "bg-surface border-indigo-500/60 shadow-xs ring-1 ring-indigo-500/30"
                        : "bg-surface/50 border-border/70 text-muted",
                  ].join(" ")}
                >
                  {/* Active Now Pill */}
                  {m.isCurrentSlot && !m.completed && (
                    <span className="absolute -top-2 right-3 px-1.5 py-0.2 text-[9px] font-black uppercase tracking-wider bg-indigo-600 text-white rounded-full shadow-xs animate-bounce">
                      Active Now
                    </span>
                  )}

                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-lg ${cfg.bgColor} ${cfg.borderColor} border shrink-0`}
                    >
                      <Icon className={`w-4 h-4 ${cfg.iconColor}`} />
                    </div>

                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-black text-foreground truncate">
                        {cfg.englishTitle}
                      </span>
                      <span className="text-[10px] text-muted flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5 shrink-0" />
                        {m.timeRange}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`font-black text-xs ${
                        m.completed
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-muted"
                      }`}
                    >
                      {m.currentCount} / {m.targetCount}
                    </span>
                    {m.completed ? (
                      <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                    ) : (
                      <Circle className="w-4.5 h-4.5 text-muted/40 shrink-0" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[10px] text-muted pt-1 border-t border-border/40">
            <span>Target: min. {targetCards} cards reviewed per session</span>
            <button
              type="button"
              onClick={() => setShowTargetModal(true)}
              className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer"
            >
              Change Target
            </button>
          </div>
        </div>

        {/* Kolom 2 (50%): Learning Activity Heatmap */}
        <div
          ref={calendarCardRef}
          className="relative flex flex-col justify-between gap-4 p-4 sm:p-5 bg-surface-muted/30 rounded-2xl border border-border/80 min-w-0"
        >
          {/* Floating Tooltip Popover Attached to Square */}
          {popover && (
            <div
              className="absolute z-50 pointer-events-none -translate-x-1/2 -translate-y-full bg-slate-900/95 dark:bg-slate-900/95 text-white px-3 py-2 rounded-xl border border-slate-700/80 shadow-2xl backdrop-blur-md flex flex-col gap-1.5 min-w-[210px] animate-in fade-in zoom-in-95 duration-150"
              style={{ left: `${popover.x}px`, top: `${popover.y}px` }}
            >
              {/* Arrow Indicator */}
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-slate-900/95" />

              <div className="flex items-center justify-between gap-2 border-b border-slate-700/60 pb-1 text-[11px]">
                <span className="font-black text-white">
                  {new Date(popover.day.date).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <span className="text-[10px] font-bold text-slate-300">
                  {popover.day.count} cards reviewed
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 text-[10px]">
                <span
                  className={`inline-flex items-center gap-1 font-bold ${
                    popover.day.sessions?.morning
                      ? "text-emerald-400"
                      : "text-slate-400"
                  }`}
                >
                  {popover.day.sessions?.morning ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <XCircle className="w-3 h-3 text-slate-500" />
                  )}
                  Morning
                </span>

                <span
                  className={`inline-flex items-center gap-1 font-bold ${
                    popover.day.sessions?.afternoon
                      ? "text-emerald-400"
                      : "text-slate-400"
                  }`}
                >
                  {popover.day.sessions?.afternoon ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <XCircle className="w-3 h-3 text-slate-500" />
                  )}
                  Afternoon
                </span>

                <span
                  className={`inline-flex items-center gap-1 font-bold ${
                    popover.day.sessions?.evening
                      ? "text-emerald-400"
                      : "text-slate-400"
                  }`}
                >
                  {popover.day.sessions?.evening ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <XCircle className="w-3 h-3 text-slate-500" />
                  )}
                  Evening
                </span>
              </div>
            </div>
          )}

          {/* Heatmap Sub-header */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-indigo-500" />
              <span className="text-xs sm:text-sm font-black text-foreground">
                Activity Calendar
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-surface text-muted border border-border">
              <span className="sm:hidden">Past 3 Months</span>
              <span className="hidden sm:inline">Past 20 Weeks</span>
            </span>
          </div>

          {/* Grid Area: Spanned across width without scrollbar on mobile */}
          <div className="overflow-hidden pb-1">
            <div className="flex flex-col gap-1.5 w-full">
              {/* Month Labels Aligned with Week Columns */}
              <div className="flex gap-1.5 items-start pl-5 sm:pl-7 h-4 mb-0.5 text-[10px] sm:text-[11px] font-bold text-muted select-none">
                {weeks.map((week, wIdx) => {
                  const isOlder = wIdx < weeks.length - 12;
                  const isMonthStart = monthLabels.find((m) => m.weekIndex === wIdx);
                  return (
                    <div
                      key={wIdx}
                      className={`w-3.5 sm:w-4 relative shrink-0 ${isOlder ? "hidden sm:block" : "block"}`}
                    >
                      {isMonthStart && (
                        <span className="absolute left-0 top-0 whitespace-nowrap">
                          {isMonthStart.label}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Heatmap Grid */}
              <div className="flex gap-1.5 items-start">
                <div className="flex flex-col gap-1.5 text-[9px] sm:text-[10px] font-bold text-muted/70 pr-0.5 select-none shrink-0">
                  {dayNames.map((d, idx) => (
                    <span
                      key={idx}
                      className="h-3.5 sm:h-4 leading-3.5 sm:leading-4 w-4 sm:w-5 text-right"
                    >
                      {d}
                    </span>
                  ))}
                </div>

                <div className="flex gap-1.5 flex-1 justify-between sm:justify-start">
                  {weeks.map((week, wIdx) => {
                    const isOlder = wIdx < weeks.length - 12;
                    return (
                      <div
                        key={wIdx}
                        className={`flex-col gap-1.5 shrink-0 ${
                          isOlder ? "hidden sm:flex" : "flex"
                        }`}
                      >
                        {week.map((day) => {
                          return (
                            <button
                              key={day.date}
                              type="button"
                              onMouseEnter={(e) => handleMouseEnterDay(e, day)}
                              onMouseLeave={handleMouseLeaveDay}
                              onClick={(e) => handleMouseEnterDay(e, day)}
                              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-[3px] sm:rounded-md border transition-all duration-150 cursor-pointer ${getTileColor(
                                day.level,
                              )} hover:scale-140 hover:ring-2 hover:ring-indigo-500 hover:z-10`}
                              title={`${day.date}: ${day.completedSessions}/3 Sessions (${day.count} cards reviewed)`}
                            />
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Static Heatmap Footer (No text replacement jumping!) */}
          <div className="flex items-center justify-between gap-2.5 pt-2.5 border-t border-border/60 text-xs text-muted">
            <span className="text-[11px] font-medium flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Hover over squares for daily session details
            </span>

            {/* Legend */}
            <div className="flex items-center gap-1.5 shrink-0 text-[10px] font-bold">
              <span>0</span>
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-[3px] bg-surface-muted/80 border border-border/60" />
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-[3px] bg-emerald-500/35 border border-emerald-500/40" />
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-[3px] bg-emerald-500/70 border border-emerald-500/80" />
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-[3px] bg-emerald-500 border border-emerald-400" />
              <span>3 Sessions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Target Config Modal / Popover */}
      {showTargetModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setShowTargetModal(false)}
        >
          <div
            className="w-full max-w-sm p-5 bg-surface border border-border rounded-3xl shadow-2xl text-foreground flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-indigo-500" />
                <h3 className="text-sm font-black text-foreground">
                  Custom Daily Review Target
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowTargetModal(false)}
                className="text-muted hover:text-foreground text-xs font-bold"
              >
                Close
              </button>
            </div>

            <p className="text-xs text-muted">
              Choose how many Anki cards to review per study session to mark it as completed:
            </p>

            {/* Presets Grid */}
            <div className="grid grid-cols-3 gap-2">
              {TARGET_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    targetCards === preset
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                      : "bg-surface-muted/60 border-border hover:border-indigo-500/50 text-foreground"
                  }`}
                >
                  {targetCards === preset && <Check className="w-3 h-3" />}
                  <span>{preset} Cards</span>
                </button>
              ))}
            </div>

            {/* Custom Input Form */}
            <form
              onSubmit={handleCustomSubmit}
              className="flex items-center gap-2 pt-2 border-t border-border/60"
            >
              <input
                type="number"
                min="1"
                max="200"
                value={customInputVal}
                onChange={(e) => setCustomInputVal(e.target.value)}
                placeholder="Custom number..."
                className="flex-1 px-3 py-2 text-xs bg-surface-muted/60 border border-border rounded-xl focus:outline-hidden focus:ring-1 focus:ring-indigo-500 font-bold"
              />
              <button
                type="submit"
                className="px-3.5 py-2 text-xs font-black bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Save
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

