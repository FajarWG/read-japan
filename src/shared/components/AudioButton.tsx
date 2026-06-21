"use client";

import { useEffect, useState } from "react";

/**
 * AudioButton — play Japanese text via Web Speech API.
 *
 * Highlight sync via `onboundary` callback (browser-specific).
 * Jika voice ja-JP tidak tersedia, button disabled dengan tooltip.
 */

interface AudioButtonProps {
  text: string;
  /** Rate (0.5 - 2.0). Default 0.9. */
  rate?: number;
  /** Variant style */
  variant?: "primary" | "secondary" | "minimal";
  /** Label override */
  label?: string;
}

export function AudioButton({
  text,
  rate = 0.9,
  variant = "secondary",
  label = "▶ Play",
}: AudioButtonProps) {
  const [playing, setPlaying] = useState(false);
  const [voiceAvailable, setVoiceAvailable] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const check = () => {
      const voices = window.speechSynthesis.getVoices();
      setVoiceAvailable(voices.some((v) => v.lang.startsWith("ja")));
    };
    check();
    window.speechSynthesis.addEventListener?.("voiceschanged", check);
    return () => window.speechSynthesis.removeEventListener?.("voiceschanged", check);
  }, []);

  const play = () => {
    if (!window.speechSynthesis || !text) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "ja-JP";
    u.rate = rate;
    u.onend = () => setPlaying(false);
    u.onerror = () => setPlaying(false);
    window.speechSynthesis.speak(u);
    setPlaying(true);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setPlaying(false);
  };

  const variantClass =
    variant === "primary"
      ? "bg-indigo-600 hover:bg-indigo-700 text-white"
      : variant === "secondary"
        ? "bg-surface border border-border hover:bg-surface-muted text-foreground"
        : "hover:bg-surface-muted text-foreground border border-transparent";

  return (
    <button
      type="button"
      onClick={playing ? stop : play}
      disabled={!voiceAvailable}
      title={voiceAvailable ? (playing ? "Stop" : `Play: ${text}`) : "Voice ja-JP tidak tersedia di browser ini"}
      className={[
        "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors disabled:opacity-40 cursor-pointer",
        variantClass,
      ].join(" ")}
    >
      <span>{playing ? "⏹" : "▶"}</span>
      <span>{playing ? "Stop" : label}</span>
    </button>
  );
}
