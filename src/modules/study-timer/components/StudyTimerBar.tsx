"use client";

import { useEffect, useState, useTransition } from "react";
import { Clock3, Pause, Play } from "lucide-react";

import {
  heartbeatStudyTimer,
  pauseStudyTimer,
  resumeStudyTimer,
  startStudyTimer,
} from "@/src/modules/study-timer/actions/studyTimerActions";
import {
  HEARTBEAT_GRACE_MS,
  HEARTBEAT_INTERVAL_MS,
} from "@/src/modules/study-timer/constants";
import type { StudyTimerView } from "@/src/modules/study-timer/types";

export function formatStudyTime(totalSeconds: number, showSeconds = true): string {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainder = seconds % 60;
  if (!showSeconds) {
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  }
  return [hours, minutes, remainder]
    .map((part) => String(part).padStart(2, "0"))
    .join(":");
}

/**
 * Sama seperti liveElapsed di FloatingStudyTimer: dibatasi oleh heartbeat
 * lokal supaya tidak ikut menumpuk jam kosong kalau tab ditinggal.
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

export function StudyTimerBar({
  kakouSessionId,
  timer,
  onChange,
  onError,
}: {
  kakouSessionId: number;
  timer: StudyTimerView | null;
  onChange: (timer: StudyTimerView) => void;
  onError: (message: string) => void;
}) {
  const [now, setNow] = useState(() => Date.now());
  const [lastPingAt, setLastPingAt] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const running = timer?.status === "RUNNING";

  useEffect(() => {
    if (!running) return;
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, [running]);

  // Heartbeat lokal — sama seperti di FloatingStudyTimer. Boleh berjalan
  // berbarengan dengan heartbeat pill floating; server cukup update timestamp
  // yang sama jadi tidak ada efek samping dari dua ping ke timer yang sama.
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

  const elapsed = liveElapsed(timer, now, lastPingAt);

  const toggle = () => {
    startTransition(async () => {
      const result = !timer
        ? await startStudyTimer(kakouSessionId)
        : running
          ? await pauseStudyTimer(timer.id)
          : await resumeStudyTimer(timer.id);
      if (!result.success) {
        onError(result.error);
        return;
      }
      setNow(Date.now());
      onChange(result.timer);
    });
  };

  return (
    <section className="sticky top-2 z-40 flex items-center justify-between gap-3 rounded-2xl border border-border bg-surface/95 px-4 py-3 shadow-md backdrop-blur-xl">
      <div className="flex min-w-0 items-center gap-3">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
            running ? "bg-accent/12 text-accent" : "bg-surface-muted text-muted"
          }`}
        >
          <Clock3 size={18} />
        </span>
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
            Study timer · {running ? "On" : timer ? "Paused" : "Off"}
          </p>
          <p className="font-mono text-xl font-bold tabular-nums text-foreground">
            {formatStudyTime(elapsed)}
          </p>
        </div>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={running}
        onClick={toggle}
        disabled={isPending}
        className={`inline-flex min-w-24 cursor-pointer items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
          running
            ? "bg-surface-muted text-foreground hover:bg-border"
            : "bg-accent text-white hover:brightness-95"
        }`}
      >
        {running ? <Pause size={14} /> : <Play size={14} />}
        {isPending ? "Please wait" : running ? "Pause" : timer ? "Resume" : "Start"}
      </button>
    </section>
  );
}
