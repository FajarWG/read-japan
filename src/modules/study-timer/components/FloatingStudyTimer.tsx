"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { usePathname } from "next/navigation";
import { AlertTriangle, ChevronDown, Clock3, Pause, Play, RotateCcw, Square, X } from "lucide-react";

import {
  getStudyTimerOverview,
  heartbeatStudyTimer,
  pauseStudyTimer,
  resetTodayStudyTimer,
  resumeStudyTimer,
  startManualStudyTimer,
  stopStudyTimer,
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

const HIDDEN_ROUTES = ["/login", "/register"];

/**
 * Detik berjalan sisi-klien supaya angka bergerak tanpa polling ke server.
 * `lastPingAt` (waktu heartbeat lokal terakhir berhasil dikirim) dipakai
 * sebagai batas atas — kalau tab ditutup / device tidur, interval heartbeat
 * ikut berhenti dan angka ini otomatis berhenti bertambah juga, sama seperti
 * yang dihitung server.
 */
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

export function FloatingStudyTimer() {
  const pathname = usePathname();
  const { user } = useAuth();

  const [overview, setOverview] = useState<StudyTimerOverview | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const [hideForced, setHideForced] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [lastPingAt, setLastPingAt] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const loadedRef = useRef(false);

  const timer = overview?.activeTimer ?? null;
  const running = timer?.status === "RUNNING";

  // Total hari ini = yang sudah tersimpan + detik sesi aktif yang belum di-commit.
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

  // Muat state awal dari server & otomatis mulai belajar jika user sedang aktif di tab
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

  // Tick 1 detik hanya saat timer berjalan.
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [running]);

  // Heartbeat ke server selagi berjalan — kalau tab ditutup / device tidur,
  // ping ini berhenti dan server otomatis stop menghitung setelah grace period
  // (bukan terus jalan sampai halaman dibuka lagi nanti).
  useEffect(() => {
    if (!running || !timer) {
      return;
    }
    const timerId = timer.id;
    const ping = () => {
      setLastPingAt(Date.now());
      void heartbeatStudyTimer(timerId);
    };
    ping();
    const id = window.setInterval(ping, HEARTBEAT_INTERVAL_MS);
    return () => {
      window.clearInterval(id);
      setLastPingAt(null);
    };
  }, [running, timer]);

  // Ikut aturan BottomNav: sembunyi saat sesi review memaksa nav tersembunyi.
  useEffect(() => {
    const check = () =>
      setHideForced(document.body.classList.contains("hide-study-timer"));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  // Mengecilkan komponen jika pengguna mengklik di luar komponen
  useEffect(() => {
    if (!expanded) return;
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (showResetConfirm) return;
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [expanded, showResetConfirm]);

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
      // Update optimistis supaya UI langsung responsif...
      setOverview((prev) => (prev ? { ...prev, activeTimer: result.timer } : prev));
      setNow(Date.now());
      // ...lalu ambil ulang statistik harian dari server agar totalnya akurat.
      await refresh();
    });
  };

  const toggle = () => {
    if (!timer) {
      setExpanded(true);
      return run(() => startManualStudyTimer());
    }
    if (running) return run(() => pauseStudyTimer(timer.id));
    return run(() => resumeStudyTimer(timer.id));
  };

  const stop = () => {
    if (!timer) return;
    run(() => stopStudyTimer(timer.id));
    setExpanded(false);
  };

  const handleResetToday = () => {
    run(async () => {
      const result = await resetTodayStudyTimer();
      if (result.success) {
        showToast("Timer hari ini berhasil direset", "success");
      }
      return result;
    });
    setShowResetConfirm(false);
  };

  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("read_japan_timer_position");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (typeof parsed.x === "number" && typeof parsed.y === "number") {
            return parsed;
          }
        }
      } catch {
        // Ignore
      }
    }
    return null;
  });

  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const initialPosRef = useRef({ x: 0, y: 0 });
  const hasDraggedRef = useRef(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("input") || target.closest("a")) {
      return;
    }

    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    dragStartRef.current = { x: e.clientX, y: e.clientY };

    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      initialPosRef.current = { x: rect.left, y: rect.top };
    }

    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;

    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      hasDraggedRef.current = true;
    }

    const containerW = containerRef.current?.offsetWidth || 56;
    const containerH = containerRef.current?.offsetHeight || 56;
    const maxX = Math.max(0, window.innerWidth - containerW - 12);
    const maxY = Math.max(0, window.innerHeight - containerH - 12);

    const newX = Math.max(12, Math.min(maxX, initialPosRef.current.x + dx));
    const newY = Math.max(12, Math.min(maxY, initialPosRef.current.y + dy));

    setDragPos({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }

    if (dragPos) {
      try {
        localStorage.setItem("read_japan_timer_position", JSON.stringify(dragPos));
      } catch {
        // Ignore
      }
    }
  };

  if (!user || HIDDEN_ROUTES.includes(pathname) || hideForced) return null;

  const isKakouTimer = timer?.source === "KAKOU";

  return (
    <>
      {/* Container tunggal yang mekar/melebar & mengecil secara mulus (Draggable) */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={
          dragPos
            ? {
                left: `${dragPos.x}px`,
                top: `${dragPos.y}px`,
                bottom: "auto",
                right: "auto",
                touchAction: "none",
              }
            : { touchAction: "none" }
        }
        className={`fixed z-50 border shadow-xl backdrop-blur-xl transition-all duration-300 ease-in-out overflow-hidden select-none cursor-grab active:cursor-grabbing ${
          !dragPos ? "bottom-22 right-4 sm:bottom-6 sm:right-6" : ""
        } ${
          expanded
            ? "w-64 rounded-3xl border-border bg-surface/95 p-4 text-foreground shadow-2xl"
            : timer
            ? `h-12 rounded-full border-border px-4 py-2 hover:border-accent/50 ${
                running
                  ? "border-accent bg-accent text-white"
                  : "bg-surface/95 text-foreground"
              }`
            : "h-12 w-12 rounded-full border-border bg-surface/95 text-foreground hover:border-accent/50 flex items-center justify-center"
        }`}
      >
        {expanded ? (
          <div className="flex flex-col gap-3 animate-in fade-in duration-200">
            {/* Header */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
                  Today
                </span>
                {(todayTotal > 0 || timer !== null) && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowResetConfirm(true);
                    }}
                    disabled={isPending}
                    title="Reset timer hari ini"
                    aria-label="Reset timer hari ini"
                    className="flex cursor-pointer items-center gap-0.5 rounded px-1 py-0.5 text-[10px] font-medium text-muted transition-colors hover:bg-red-500/10 hover:text-red-500 disabled:opacity-50"
                  >
                    <RotateCcw size={10} />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1">
                <span className="font-mono text-base font-bold tabular-nums text-foreground">
                  {formatStudyTime(todayTotal)}
                </span>
                <button
                  type="button"
                  onClick={() => setExpanded(false)}
                  aria-label="Minimize study timer"
                  className="cursor-pointer rounded-lg p-1 text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
                >
                  <ChevronDown size={16} />
                </button>
              </div>
            </div>

            {/* Session Time Box */}
            <div className="flex items-baseline justify-between rounded-xl bg-surface-muted px-3 py-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
                Session
              </span>
              <span className="font-mono text-sm font-bold tabular-nums text-foreground">
                {formatStudyTime(liveSeconds)}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={toggle}
                disabled={isPending}
                className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                  running
                    ? "bg-surface-muted text-foreground hover:bg-border"
                    : "bg-accent text-white hover:brightness-95"
                }`}
              >
                {running ? <Pause size={13} /> : <Play size={13} />}
                {running ? "Pause" : timer ? "Resume" : "Start"}
              </button>
              {timer && !isKakouTimer && (
                <button
                  type="button"
                  onClick={stop}
                  disabled={isPending}
                  aria-label="Stop and save study session"
                  className="cursor-pointer rounded-xl border border-border px-3 py-2 text-muted transition-colors hover:bg-surface-muted hover:text-foreground disabled:opacity-60"
                >
                  <Square size={13} fill="currentColor" />
                </button>
              )}
            </div>

            {isKakouTimer && (
              <p className="text-[10px] leading-snug text-muted">
                This session can only be finished from where it started.
              </p>
            )}
          </div>
        ) : (
          /* Collapsed State */
          <button
            type="button"
            onClick={() => {
              if (hasDraggedRef.current) return;
              if (timer) setExpanded(true);
              else toggle();
            }}
            disabled={isPending}
            aria-label={timer ? "Open study timer" : "Start study timer"}
            className="flex h-full w-full cursor-pointer items-center justify-center gap-2 outline-none disabled:opacity-60"
          >
            {timer ? (
              running ? (
                <Clock3 size={16} className="shrink-0" />
              ) : (
                <Pause size={16} className="shrink-0" />
              )
            ) : (
              <Play size={16} className="shrink-0" />
            )}
            {timer && (
              <span className="font-mono text-sm font-bold tabular-nums">
                {formatStudyTime(liveSeconds)}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Confirmation Modal for Resetting Today's Timer */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="reset-timer-title"
            className="relative w-full max-w-sm rounded-2xl border border-border bg-surface p-5 shadow-2xl backdrop-blur-xl text-foreground"
          >
            <button
              type="button"
              onClick={() => setShowResetConfirm(false)}
              aria-label="Tutup modal"
              className="absolute top-4 right-4 cursor-pointer rounded-lg p-1 text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-500 border border-red-500/20">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 id="reset-timer-title" className="font-bold text-base text-foreground">
                  Reset Timer Hari Ini?
                </h3>
                <p className="text-xs text-muted">Konfirmasi Tindakan</p>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-muted mb-5">
              Waktu belajar hari ini ({formatStudyTime(todayTotal)}) akan direset menjadi <span className="font-mono font-bold text-foreground">00:00:00</span> dan sesi timer yang sedang berjalan (jika ada) akan dihentikan. Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                disabled={isPending}
                className="cursor-pointer rounded-xl border border-border px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-surface-muted disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleResetToday}
                disabled={isPending}
                className="cursor-pointer rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                {isPending ? "Mereset..." : "Ya, Reset"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
