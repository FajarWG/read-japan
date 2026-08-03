/**
 * Interval heartbeat yang dikirim klien ke server selagi timer RUNNING.
 * Server memakai heartbeat terakhir untuk tahu klien masih "hidup" — kalau
 * heartbeat berhenti (tab ditutup, device tidur, browser crash) lebih lama
 * dari HEARTBEAT_GRACE_MS, sesi dianggap berhenti di titik itu, bukan terus
 * dihitung sampai halaman dibuka lagi nanti.
 *
 * Dipakai di server (lib/timer.ts) dan klien (FloatingStudyTimer,
 * StudyTimerBar) — harus tetap sinkron di kedua sisi.
 */
export const HEARTBEAT_INTERVAL_MS = 30_000;
export const HEARTBEAT_GRACE_MS = 90_000;
