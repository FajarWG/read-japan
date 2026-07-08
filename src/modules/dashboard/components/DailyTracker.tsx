"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Check, Trash2, ListChecks } from "lucide-react";

interface HabitItem {
  id: string;
  label: string;
}

const HABITS_KEY = "daily_habits";
const DONE_KEY_PREFIX = "daily_habits_done_"; // + YYYY-MM-DD

const DEFAULT_HABITS: HabitItem[] = [
  { id: "anki", label: "Anki review" },
  { id: "kotoba", label: "Add / learn new kotoba" },
  { id: "bunpou", label: "1 grammar point (Bunpou)" },
  { id: "katsuyou", label: "Verb conjugation (Katsuyou)" },
];

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/**
 * A per-day study checklist. The list of habits persists across days
 * (`localStorage["daily_habits"]`); the checked state is scoped to the current
 * date (`localStorage["daily_habits_done_<date>"]`) so it resets each morning.
 * Fully client-side — no server involvement.
 */
export function DailyTracker() {
  const [habits, setHabits] = useState<HabitItem[]>(DEFAULT_HABITS);
  const [doneIds, setDoneIds] = useState<string[]>([]);
  const [newLabel, setNewLabel] = useState("");
  const [hydrated, setHydrated] = useState(false);

  const dateKey = useMemo(() => todayKey(), []);

  // Load from localStorage after mount
  useEffect(() => {
    const storedHabits = localStorage.getItem(HABITS_KEY);
    if (storedHabits) {
      try {
        const parsed = JSON.parse(storedHabits) as HabitItem[];
        if (Array.isArray(parsed)) setHabits(parsed);
      } catch {
        /* ignore malformed */
      }
    }
    const storedDone = localStorage.getItem(DONE_KEY_PREFIX + dateKey);
    if (storedDone) {
      try {
        const parsed = JSON.parse(storedDone) as string[];
        if (Array.isArray(parsed)) setDoneIds(parsed);
      } catch {
        /* ignore malformed */
      }
    }
    setHydrated(true);
  }, [dateKey]);

  const persistHabits = (next: HabitItem[]) => {
    setHabits(next);
    localStorage.setItem(HABITS_KEY, JSON.stringify(next));
  };

  const persistDone = (next: string[]) => {
    setDoneIds(next);
    localStorage.setItem(DONE_KEY_PREFIX + dateKey, JSON.stringify(next));
  };

  const toggle = (id: string) => {
    persistDone(
      doneIds.includes(id) ? doneIds.filter((x) => x !== id) : [...doneIds, id],
    );
  };

  const addHabit = () => {
    const label = newLabel.trim();
    if (!label) return;
    const id = `h-${Date.now()}`;
    persistHabits([...habits, { id, label }]);
    setNewLabel("");
  };

  const removeHabit = (id: string) => {
    persistHabits(habits.filter((h) => h.id !== id));
    if (doneIds.includes(id)) persistDone(doneIds.filter((x) => x !== id));
  };

  const doneCount = habits.filter((h) => doneIds.includes(h.id)).length;
  const allDone = habits.length > 0 && doneCount === habits.length;

  return (
    <section className="rounded-2xl border border-border bg-surface px-5 py-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <ListChecks size={15} className="text-accent" /> Daily study
        </p>
        <span
          className={[
            "rounded-full px-2 py-0.5 text-[11px] font-bold tabular-nums",
            allDone ? "bg-accent/15 text-accent" : "bg-surface-muted text-muted",
          ].join(" ")}
        >
          {doneCount}/{habits.length} done
        </span>
      </div>

      <ul className="flex flex-col gap-1.5">
        {habits.map((h) => {
          const checked = doneIds.includes(h.id);
          return (
            <li key={h.id} className="group flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => toggle(h.id)}
                aria-pressed={checked}
                className={[
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors cursor-pointer",
                  checked
                    ? "border-accent bg-accent text-white"
                    : "border-border bg-background text-transparent hover:border-accent/60",
                ].join(" ")}
              >
                <Check size={13} strokeWidth={3} />
              </button>
              <button
                type="button"
                onClick={() => toggle(h.id)}
                className={[
                  "flex-1 text-left text-sm transition-colors cursor-pointer",
                  checked ? "text-muted line-through" : "text-foreground",
                ].join(" ")}
              >
                {h.label}
              </button>
              <button
                type="button"
                onClick={() => removeHabit(h.id)}
                aria-label={`Remove ${h.label}`}
                className="text-muted/0 group-hover:text-muted hover:!text-red-500 transition-colors cursor-pointer"
              >
                <Trash2 size={14} />
              </button>
            </li>
          );
        })}
        {hydrated && habits.length === 0 && (
          <li className="py-2 text-center text-xs text-muted italic">
            No items yet — add what you want to do each day.
          </li>
        )}
      </ul>

      {/* Add item */}
      <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
        <input
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addHabit();
          }}
          placeholder="Add a daily task…"
          className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground outline-none placeholder:text-muted/60 focus:border-accent"
        />
        <button
          type="button"
          onClick={addHabit}
          disabled={!newLabel.trim()}
          className="flex items-center gap-1 rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40 cursor-pointer"
        >
          <Plus size={14} /> Add
        </button>
      </div>
    </section>
  );
}
