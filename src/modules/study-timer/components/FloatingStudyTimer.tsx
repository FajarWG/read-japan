"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown, Clock3, Pause, Play, Square } from "lucide-react";

import {
  getStudyTimerOverview,
  heartbeatStudyTimer,
  pauseStudyTimer,
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
  const [isPending, startTransition] = useTransition();
  const [lastPingAt, setLastPingAt] = useState<number | null>(null);
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

  // Muat state awal dari server (timer bertahan lintas halaman & reload).
  useEffect(() => {
    if (!user || loadedRef.current) return;
    loadedRef.current = true;
    void refresh();
  }, [user, refresh]);

  // Sinkron ulang saat tab kembali fokus — menjaga akurasi setelah device sleep.
  useEffect(() => {
    if (!user) return;
    const onFocus = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    document.addEventListener("visibilitychange", onFocus);
    window.addEventListener("focus", onFocus);
    return () => {
      document.removeEventListener("visibilitychange", onFocus);
      window.removeEventListener("focus", onFocus);
    };
  }, [user, refresh]);

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
      setLastPingAt(null);
      return;
    }
    const timerId = timer.id;
    const ping = () => {
      setLastPingAt(Date.now());
      void heartbeatStudyTimer(timerId);
    };
    ping();
    const id = window.setInterval(ping, HEARTBEAT_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [running, timer?.id]);

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
    if (!timer) return run(() => startManualStudyTimer());
    if (running) return run(() => pauseStudyTimer(timer.id));
    return run(() => resumeStudyTimer(timer.id));
  };

  const stop = () => {
    if (!timer) return;
    run(() => stopStudyTimer(timer.id));
    setExpanded(false);
  };

  if (!user || HIDDEN_ROUTES.includes(pathname) || hideForced) return null;

  const isKakouTimer = timer?.source === "KAKOU";

  return (
    <div className="fixed bottom-28 right-4 z-50 flex flex-col items-end gap-2 sm:bottom-24 sm:right-6">
      {expanded && (
        <div className="w-56 rounded-2xl border border-border bg-surface/95 p-3 shadow-lg backdrop-blur-xl">
          <div className="mb-3 flex items-start justify-between gap-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
                Today
              </p>
              <p className="font-mono text-lg font-bold tabular-nums text-foreground">
                {formatStudyTime(todayTotal)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setExpanded(false)}
              aria-label="Collapse study timer"
              className="cursor-pointer rounded-lg p-1 text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
            >
              <ChevronDown size={16} />
            </button>
          </div>

          <div className="mb-3 flex items-baseline justify-between rounded-xl bg-surface-muted px-3 py-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
              Session
            </span>
            <span className="font-mono text-sm font-bold tabular-nums text-foreground">
              {formatStudyTime(liveSeconds)}
            </span>
          </div>

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
            <p className="mt-2 text-[10px] leading-snug text-muted">
              This session can only be finished from where it started.
            </p>
          )}
        </div>
      )}

      {/* Pill: bulat saat idle, melebar menampilkan waktu saat ada sesi. */}
      <button
        type="button"
        onClick={() => (expanded ? setExpanded(false) : timer ? setExpanded(true) : toggle())}
        disabled={isPending}
        aria-label={timer ? "Open study timer" : "Start study timer"}
        className={`flex h-12 cursor-pointer items-center gap-2 rounded-full border shadow-lg backdrop-blur-xl transition-all duration-200 disabled:opacity-60 ${
          timer ? "px-4" : "w-12 justify-center"
        } ${
          running
            ? "border-accent bg-accent text-white"
            : "border-border bg-surface/95 text-foreground hover:border-accent/50"
        }`}
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
    </div>
  );
}
