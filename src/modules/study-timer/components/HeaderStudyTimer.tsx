"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { Popover } from "@heroui/react";
import {
  Clock3,
  Pause,
  Play,
  RotateCcw,
  AlertTriangle,
  X,
  Flame,
} from "lucide-react";

import {
  getStudyTimerOverview,
  heartbeatStudyTimer,
  pauseStudyTimer,
  resetTodayStudyTimer,
  resumeStudyTimer,
  startManualStudyTimer,
} from "@/src/modules/study-timer/actions/studyTimerActions";
import { formatStudyTime } from "@/src/modules/study-timer/components/StudyTimerBar";
import {
  HEARTBEAT_GRACE_MS,
  HEARTBEAT_INTERVAL_MS,
} from "@/src/modules/study-timer/constants";
import type {
  StudyTimerOverview,
  StudyTimerView,
} from "@/src/modules/study-timer/types";
import { useAuth } from "@/src/modules/auth/components/AuthProvider";
import { showToast } from "@/src/shared/components/ToastProvider";

function liveElapsed(
  timer: StudyTimerView | null,
  now: number,
  lastPingAt: number | null,
): number {
  if (!timer) return 0;
  if (timer.status !== "RUNNING" || !timer.lastStartedAt) {
    return timer.accumulatedSeconds;
  }
  const started = new Date(timer.lastStartedAt).getTime();
  const referenceMs =
    lastPingAt ??
    (timer.lastHeartbeatAt ? new Date(timer.lastHeartbeatAt).getTime() : started);
  const cappedNow = Math.min(now, referenceMs + HEARTBEAT_GRACE_MS);
  return timer.accumulatedSeconds + Math.max(0, Math.floor((cappedNow - started) / 1000));
}

export function HeaderStudyTimer() {
  const { user } = useAuth();

  const [overview, setOverview] = useState<StudyTimerOverview | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [lastPingAt, setLastPingAt] = useState<number | null>(null);

  const loadedRef = useRef(false);

  const timer = overview?.activeTimer ?? null;
  const running = timer?.status === "RUNNING";

  const storedToday = overview?.stats.todaySeconds ?? 0;
  const liveSeconds = liveElapsed(timer, now, lastPingAt);
  const todayTotal = timer
    ? storedToday - timer.accumulatedSeconds + liveSeconds
    : storedToday;

  const refresh = useCallback(async () => {
    const next = await getStudyTimerOverview();
    setOverview(next);
    setNow(Date.now());
  }, []);

  // Muat state awal dari server & otomatis mulai timer saat tab aktif dibuka
  useEffect(() => {
    if (!user || loadedRef.current) return;
    loadedRef.current = true;

    async function initAutoTimer() {
      const next = await getStudyTimerOverview();
      if (!next) return;

      if (!next.activeTimer && document.visibilityState === "visible") {
        const started = await startManualStudyTimer();
        if (started.success) {
          setOverview({ ...next, activeTimer: started.timer });
          setNow(Date.now());
          return;
        }
      } else if (
        next.activeTimer &&
        next.activeTimer.status === "PAUSED" &&
        document.visibilityState === "visible"
      ) {
        const resumed = await resumeStudyTimer(next.activeTimer.id);
        if (resumed.success) {
          setOverview({ ...next, activeTimer: resumed.timer });
          setNow(Date.now());
          return;
        }
      }

      setOverview(next);
      setNow(Date.now());
    }

    void initAutoTimer();
  }, [user]);

  // Otomatis pause saat tab disembunyikan/minimize, dan otomatis resume saat tab kembali dibuka/fokus
  useEffect(() => {
    if (!user) return;

    const handleVisibility = () => {
      if (document.visibilityState === "hidden") {
        if (timer && timer.status === "RUNNING") {
          void pauseStudyTimer(timer.id).then((res) => {
            if (res.success) {
              setOverview((prev) =>
                prev ? { ...prev, activeTimer: res.timer } : prev,
              );
              setNow(Date.now());
            }
          });
        }
      } else if (document.visibilityState === "visible") {
        if (timer && timer.status === "PAUSED") {
          void resumeStudyTimer(timer.id).then((res) => {
            if (res.success) {
              setOverview((prev) =>
                prev ? { ...prev, activeTimer: res.timer } : prev,
              );
              setNow(Date.now());
            }
          });
        } else if (!timer) {
          void startManualStudyTimer().then((res) => {
            if (res.success) {
              setOverview((prev) =>
                prev ? { ...prev, activeTimer: res.timer } : prev,
              );
              setNow(Date.now());
            }
          });
        } else {
          void refresh();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", handleVisibility);
    };
  }, [user, timer, refresh]);

  // Tick 1 detik saat timer berjalan
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [running]);

  // Heartbeat ping
  useEffect(() => {
    if (!running || !timer) return;
    let cancelled = false;

    const ping = async () => {
      const result = await heartbeatStudyTimer(timer.id);
      if (cancelled) return;
      if (!result.success) {
        await refresh();
        return;
      }
      setLastPingAt(Date.now());
    };

    void ping();
    const intervalId = window.setInterval(() => {
      void ping();
    }, HEARTBEAT_INTERVAL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [running, timer, refresh]);

  const run = (
    action: () => Promise<
      | { success: true; timer: StudyTimerView }
      | { success: true; overview: StudyTimerOverview }
      | { success: false; error: string }
    >,
  ) => {
    startTransition(async () => {
      const result = await action();
      if (!result.success) {
        showToast(result.error, "error");
        return;
      }
      if ("overview" in result) {
        setOverview(result.overview);
        setNow(Date.now());
        return;
      }
      setOverview((prev) => (prev ? { ...prev, activeTimer: result.timer } : prev));
      setNow(Date.now());
      await refresh();
    });
  };

  const toggle = () => {
    if (!timer) {
      return run(() => startManualStudyTimer());
    }
    if (running) return run(() => pauseStudyTimer(timer.id));
    return run(() => resumeStudyTimer(timer.id));
  };

  const handleResetToday = () => {
    run(async () => {
      const result = await resetTodayStudyTimer();
      if (result.success) {
        showToast("Study timer reset successfully", "success");
      }
      return result;
    });
    setShowResetConfirm(false);
  };

  if (!user) return null;

  const isKakouTimer = timer?.source === "KAKOU";

  return (
    <>
      <Popover isOpen={isOpen} onOpenChange={setIsOpen}>
        <Popover.Trigger>
          <button
            type="button"
            aria-label="Study Timer"
            className={`inline-flex items-center gap-1.5 h-8 px-2.5 sm:px-3 rounded-full border transition-all cursor-pointer select-none text-xs font-mono font-bold shrink-0 ${
              running
                ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 shadow-2xs"
                : timer
                ? "border-amber-500/50 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20"
                : "border-border bg-surface text-foreground hover:bg-surface-muted"
            }`}
          >
            {running ? (
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            ) : (
              <Clock3 size={13} className="text-muted" />
            )}
            <span className="tabular-nums">
              {formatStudyTime(liveSeconds > 0 ? liveSeconds : todayTotal)}
            </span>
          </button>
        </Popover.Trigger>

        <Popover.Content
          className="w-60 p-3 rounded-2xl bg-surface border border-border shadow-2xl text-foreground flex flex-col gap-3"
          placement="bottom end"
        >
          <Popover.Dialog className="outline-hidden flex flex-col gap-3">
            {/* Header: Title & Status */}
            <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-2">
              <div className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-xs font-bold text-foreground">
                  Today&apos;s Study Timer
                </span>
              </div>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  running
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : timer
                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    : "bg-surface-muted text-muted"
                }`}
              >
                {running ? "● Active" : timer ? "⏸ Paused" : "Inactive"}
              </span>
            </div>

            {/* Single Large Timer Display */}
            <div className="flex flex-col items-center justify-center py-2 bg-surface-muted/40 rounded-xl border border-border/50">
              <span className="font-mono text-2xl font-black tabular-nums text-foreground tracking-tight">
                {formatStudyTime(todayTotal)}
              </span>
              <span className="text-[10px] text-muted font-medium mt-0.5">
                Total time studied today
              </span>
            </div>

            {/* Action Buttons: Pause/Resume & Reset */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={toggle}
                disabled={isPending}
                className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold text-white shadow-xs transition-colors disabled:opacity-60 ${
                  running
                    ? "bg-amber-500 hover:bg-amber-600"
                    : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                {running ? (
                  <>
                    <Pause size={13} fill="currentColor" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play size={13} fill="currentColor" />
                    <span>{timer ? "Resume" : "Start"}</span>
                  </>
                )}
              </button>

              {(todayTotal > 0 || timer !== null) && (
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(true)}
                  disabled={isPending}
                  title="Reset today's timer"
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl bg-surface-muted text-muted transition-colors hover:bg-red-500/10 hover:text-red-500 border border-border disabled:opacity-60 shrink-0"
                >
                  <RotateCcw size={13} />
                </button>
              )}
            </div>

            {isKakouTimer && (
              <p className="text-[10px] leading-snug text-muted text-center">
                This Kakou session is tracked automatically.
              </p>
            )}
          </Popover.Dialog>
        </Popover.Content>
      </Popover>

      {/* Confirmation Modal for Resetting Today's Timer */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="reset-timer-title"
            className="relative w-full max-w-sm rounded-2xl border border-border bg-surface p-5 shadow-2xl text-foreground flex flex-col gap-4"
          >
            <button
              type="button"
              onClick={() => setShowResetConfirm(false)}
              aria-label="Close modal"
              className="absolute top-4 right-4 rounded-lg p-1 text-muted transition-colors hover:bg-surface-muted hover:text-foreground cursor-pointer"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-3 text-red-500">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500/10">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 id="reset-timer-title" className="text-sm font-bold text-foreground">
                  Reset Today&apos;s Timer?
                </h3>
                <p className="text-xs text-muted">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-muted leading-relaxed">
              All accumulated study time for today ({formatStudyTime(todayTotal)}) will be reset to 0.
            </p>

            <div className="flex justify-end gap-2 pt-2 border-t border-border/60">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="cursor-pointer rounded-xl border border-border px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-surface-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetToday}
                disabled={isPending}
                className="cursor-pointer rounded-xl bg-red-600 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                {isPending ? "Resetting..." : "Reset to 0"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
