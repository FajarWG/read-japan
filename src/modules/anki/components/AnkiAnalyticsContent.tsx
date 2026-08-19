"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Event = { direction: string; rating: number; responseTimeMs: number | null; createdAt: string };
type Scheduled = { cardKey: string; direction: string; dueDate: string; repetitions: number };
type CustomCard = { id: string; kanji: string; hiragana: string; translation: string };
const labels: Record<string, string> = {
  kanji_to_reading: "Kanji → Furigana", kanji_to_meaning: "Kanji → Arti",
  reading_to_meaning: "Furigana → Arti", meaning_to_kanji: "Arti → Kanji",
};

export function AnkiAnalyticsContent() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [scheduled, setScheduled] = useState<Scheduled[]>([]);
  const [customCards, setCustomCards] = useState<CustomCard[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetch("/api/anki/analytics").then((r) => r.json()).then((d) => { setEvents(d.events || []); setScheduled(d.scheduled || []); setCustomCards(d.customCards || []); }).finally(() => setLoading(false)); }, []);
  const directions = useMemo(() => Object.entries(labels).map(([direction, label]) => {
    const rows = events.filter((e) => e.direction === direction);
    const correct = rows.filter((e) => e.rating >= 3).length;
    const timings = rows.map((e) => e.responseTimeMs).filter((v): v is number => v !== null);
    return { label, count: rows.length, accuracy: rows.length ? Math.round(correct / rows.length * 100) : 0, time: timings.length ? (timings.reduce((a, b) => a + b, 0) / timings.length / 1000).toFixed(1) : "—" };
  }), [events]);
  const daily = useMemo(() => Array.from({ length: 7 }, (_, i) => {
    const date = new Date(); date.setDate(date.getDate() - (6 - i)); const key = date.toDateString();
    return { label: date.toLocaleDateString(undefined, { weekday: "short" }), count: events.filter((e) => new Date(e.createdAt).toDateString() === key).length };
  }), [events]);
  const max = Math.max(1, ...daily.map((d) => d.count));
  const reviewRows = scheduled.map((item) => {
    const custom = item.cardKey.startsWith("custom-") ? customCards.find((card) => card.id === item.cardKey.slice(7)) : null;
    const parts = item.cardKey.split("-");
    return { ...item, word: custom?.kanji || parts[2] || item.cardKey, reading: custom?.hiragana || parts[3] || "", meaning: custom?.translation || "" };
  });
  const dueRows = reviewRows.filter((row) => new Date(row.dueDate) <= new Date());
  return <main className="mx-auto min-h-screen max-w-3xl bg-background px-4 py-8 text-foreground">
    <div className="mb-6 flex items-center justify-between"><div><h1 className="text-xl font-bold">Anki Analytics</h1><p className="text-xs text-muted">Last 30 days of automatic quiz reviews.</p></div><button type="button" onClick={() => router.back()} className="rounded-xl border border-border px-3 py-2 text-xs font-bold">Back</button></div>
    {loading ? <p className="text-sm text-muted">Loading analytics…</p> : <div className="flex flex-col gap-5">
      <section className="rounded-2xl border border-border bg-surface p-5"><h2 className="text-sm font-bold">Reviews this week</h2><div className="mt-4 flex h-36 items-end gap-3">{daily.map((d) => <div key={d.label} className="flex flex-1 flex-col items-center gap-1"><span className="text-[10px] font-bold">{d.count}</span><div className="w-full rounded-t bg-indigo-500" style={{ height: `${Math.max(4, d.count / max * 100)}%` }} /><span className="text-[10px] text-muted">{d.label}</span></div>)}</div></section>
      <section className="rounded-2xl border border-border bg-surface p-5"><h2 className="text-sm font-bold">Strength by direction</h2><div className="mt-3 grid gap-3 sm:grid-cols-2">{directions.map((d) => <div key={d.label} className="rounded-xl border border-border p-3"><p className="text-xs font-bold">{d.label}</p><p className="mt-2 text-lg font-black">{d.accuracy}%</p><p className="text-[10px] text-muted">{d.count} reviews · avg {d.time}s</p></div>)}</div></section>
      <section className="rounded-2xl border border-border bg-surface p-5"><h2 className="text-sm font-bold">Review Kanji & Words</h2><p className="mt-1 text-[10px] text-muted">{dueRows.length} due now · {reviewRows.length} scheduled</p><div className="mt-3 flex flex-col gap-2">{reviewRows.slice(0, 50).map((row) => <div key={`${row.cardKey}:${row.direction}`} className="flex items-center justify-between gap-3 rounded-xl border border-border p-3"><div><p className="font-jp text-lg font-bold">{row.word}</p><p className="text-xs text-indigo-500">{row.reading}</p><p className="text-[10px] text-muted">{row.meaning}</p></div><div className="text-right"><p className="text-[10px] font-bold">{labels[row.direction] || row.direction}</p><p className="text-[10px] text-muted">{new Date(row.dueDate) <= new Date() ? "Due now" : new Date(row.dueDate).toLocaleDateString()}</p></div></div>)}</div></section>
    </div>}
  </main>;
}
