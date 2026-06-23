"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { TextArea } from "@heroui/react";

import { SettingsDropdown } from "@/src/shared/components/SettingsDropdown";

interface Quota {
  model: string;
  rpm: { used: number; limit: number };
  rpd: { used: number; limit: number };
  remaining: { rpm: number; rpd: number };
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [level, setLevel] = useState<"N5" | "N4" | "N3">("N5");
  const [quota, setQuota] = useState<Quota[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load quota on mount
    fetch("/api/chat")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.quota) setQuota(d.quota);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, pending]);

  const send = () => {
    const msg = input.trim();
    if (!msg || pending) return;
    setInput("");
    setError(null);
    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    startTransition(async () => {
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: msg, level }),
        });
        const data = await res.json();
        if (res.ok) {
          setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
          if (data.quota) setQuota(data.quota);
        } else if (res.status === 429) {
          setError(data.error ?? "Rate limit reached");
          if (data.quota) setQuota(data.quota);
          setMessages((prev) => prev.slice(0, -1));
        } else {
          setError(data.error ?? "Error");
          setMessages((prev) => prev.slice(0, -1));
        }
      } catch (err) {
        console.error("[ChatPage]", err);
        setError("Network error");
        setMessages((prev) => prev.slice(0, -1));
      }
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="flex w-full max-w-3xl flex-col">
        <header className="border-b border-border backdrop-blur-sm rounded-t-2xl">
          <div className="flex items-center justify-between gap-4 px-4 py-4">
            <div>
              <h1 className="text-lg font-bold text-foreground leading-tight">
                🤖 AI Chat Tutor
              </h1>
              <p className="text-xs text-muted">
                Gemini · Powered by Google
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as "N5" | "N4" | "N3")}
                className="rounded-lg border border-border bg-surface px-2 py-1 text-xs font-bold text-foreground"
                aria-label="JLPT level"
              >
                <option value="N5">N5</option>
                <option value="N4">N4</option>
                <option value="N3">N3</option>
              </select>
              <Link
                href="/"
                className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-surface-muted"
              >
                ← Home
              </Link>
              <SettingsDropdown />
            </div>
          </div>
        </header>

        {/* Quota badges */}
        {quota && (
          <div className="px-4 py-2 border-b border-border bg-surface/50 flex flex-wrap items-center gap-2">
            {quota.map((q) => {
              const isLow = q.remaining.rpd === 0;
              return (
                <span
                  key={q.model}
                  className={[
                    "text-[10px] font-bold rounded-md px-2 py-0.5",
                    isLow
                      ? "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300"
                      : "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300",
                  ].join(" ")}
                  title={q.model}
                >
                  {q.model.replace("gemini-", "🤖 ").replace("-flash-lite", " Lite")} · {q.remaining.rpd}/{q.rpd.limit} daily
                </span>
              );
            })}
          </div>
        )}

        <main className="flex-1 flex flex-col px-4 py-4 min-h-[500px]">
          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto flex flex-col gap-3 pb-3 max-h-[60vh]"
          >
            {messages.length === 0 && (
              <div className="flex flex-col items-center gap-3 py-12 text-center">
                <span className="text-5xl">🤖</span>
                <p className="text-sm font-medium text-foreground">
                  Mulai percakapan dengan AI Tutor
                </p>
                <p className="text-xs text-muted max-w-sm">
                  Coba tanya: &ldquo;Bagaimana cara menggunakan partikel に?&rdquo;, &ldquo;Apa bedanya 食べる dan 飲む?&rdquo;
                </p>
              </div>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={[
                  "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                  m.role === "user"
                    ? "self-end bg-indigo-600 text-white"
                    : "self-start bg-surface border border-border text-foreground",
                ].join(" ")}
              >
                <pre className="font-sans whitespace-pre-wrap break-words">{m.content}</pre>
              </div>
            ))}
            {pending && (
              <div className="self-start bg-surface border border-border text-muted rounded-2xl px-4 py-2.5 text-sm italic animate-pulse">
                mengetik…
              </div>
            )}
            {error && (
              <div className="self-center rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 px-4 py-2 text-xs text-red-700 dark:text-red-300">
                ⚠️ {error}
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-border pt-3 flex items-end gap-2">
            <TextArea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Ketik pesan... (Enter untuk kirim, Shift+Enter untuk newline)"
              rows={2}
              variant="primary"
              className="flex-1"
            />
            <button
              type="button"
              onClick={send}
              disabled={pending || !input.trim()}
              className="rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white px-4 py-2.5 text-sm font-semibold transition-colors cursor-pointer"
            >
              Kirim
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
