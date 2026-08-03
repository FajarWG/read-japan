"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { ChevronDown, ChevronUp, Check, X, Filter, Search } from "lucide-react";
import { getSomatomeHistory, type SomatomeHistoryEntry } from "@/src/modules/somatome/actions/somatomeActions";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function HistoryPanel({ bookId }: { bookId: number }) {
  const [entries, setEntries] = useState<SomatomeHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [selectedDayFilter, setSelectedDayFilter] = useState<number | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const rows = await getSomatomeHistory(bookId);
    setEntries(rows);
    setLoading(false);
  }, [bookId]);

  useEffect(() => {
    load();
  }, [load]);

  const availableDays = useMemo(() => {
    return Array.from(new Set(entries.map((e) => e.day))).sort((a, b) => a - b);
  }, [entries]);

  const filteredEntries = useMemo(() => {
    let result = entries;
    if (selectedDayFilter !== "all") {
      result = result.filter((e) => e.day === selectedDayFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().replace("day", "").trim();
      result = result.filter((e) => String(e.day).includes(q));
    }
    return result;
  }, [entries, selectedDayFilter, searchQuery]);

  if (loading) return <p className="text-xs text-muted text-center py-10">Loading history...</p>;

  if (entries.length === 0) {
    return <p className="text-xs text-muted text-center py-10">No attempt history for this book yet.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Day Searchable Dropdown & Filter Control */}
      <div className="flex flex-col gap-2 p-2.5 rounded-xl border border-border bg-surface">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <Filter size={13} className="text-indigo-500" /> Filter Day:
          </span>
          <select
            value={selectedDayFilter}
            onChange={(e) => setSelectedDayFilter(e.target.value === "all" ? "all" : Number(e.target.value))}
            className="text-xs font-semibold bg-background border border-border rounded-lg px-2 py-1 focus:outline-none focus:border-indigo-500 cursor-pointer max-w-[140px]"
          >
            <option value="all">All Days ({entries.length})</option>
            {availableDays.map((d) => (
              <option key={d} value={d}>
                Day {d}
              </option>
            ))}
          </select>
        </div>

        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-2.5 text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Day (e.g. 2 or Day 4)..."
            className="w-full text-xs bg-background border border-border rounded-lg pl-8 pr-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {filteredEntries.length === 0 ? (
        <p className="text-xs text-muted text-center py-8">
          No history records match the search filter.
        </p>
      ) : (
        <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto pr-1">
          {filteredEntries.map((entry) => {
            const expanded = expandedId === entry.id;
            const percentage = entry.total > 0 ? Math.round((entry.score / entry.total) * 100) : 0;
            return (
              <div key={entry.id} className="rounded-xl border border-border bg-surface overflow-hidden">
                <button
                  type="button"
                  onClick={() => setExpandedId(expanded ? null : entry.id)}
                  className="w-full flex items-center justify-between gap-2 p-3 cursor-pointer hover:bg-surface-muted/30 transition-colors"
                >
                  <div className="flex flex-col items-start gap-0.5">
                    <span className="text-xs font-bold text-foreground">Day {entry.day}</span>
                    <span className="text-[10px] text-muted">{formatDate(entry.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={[
                        "text-xs font-extrabold px-2.5 py-1 rounded-full",
                        percentage >= 70
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-red-500/10 text-red-600 dark:text-red-400",
                      ].join(" ")}
                    >
                      {entry.score}/{entry.total}
                    </span>
                    {expanded ? <ChevronUp size={15} className="text-muted" /> : <ChevronDown size={15} className="text-muted" />}
                  </div>
                </button>

                {expanded && (
                  <div className="flex flex-col gap-1.5 border-t border-border p-3">
                    {entry.detail.map((d) => (
                      <div key={d.questionId} className="flex items-center justify-between text-xs">
                        <span className="text-foreground">
                          No. {d.number}
                        </span>
                        {d.isCorrect ? (
                          <span className="flex items-center gap-0.5 font-semibold text-emerald-600 dark:text-emerald-400">
                            <Check size={12} /> {d.userAnswer}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 font-semibold text-red-600 dark:text-red-400">
                            <X size={12} /> {d.userAnswer} (key: {d.correctAnswer})
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}



