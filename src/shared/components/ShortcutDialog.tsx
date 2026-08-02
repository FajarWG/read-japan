"use client";

import React, { useState, useEffect } from "react";
import { Keyboard, X, Command } from "lucide-react";

export const ShortcutDialog: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "?" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const shortcuts = [
    { key: "Cmd / Ctrl + K", desc: "Open Global Search Modal anywhere" },
    { key: "Shift + ?", desc: "Toggle Keyboard Shortcuts Help" },
    { key: "Space", desc: "Reveal Answer in Anki Review" },
    { key: "1 / 2 / 3 / 4", desc: "Rate Card (Again / Hard / Good / Easy)" },
    { key: "Esc", desc: "Close Explore Drawer or Modals" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col p-6 gap-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Keyboard className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-extrabold text-white">Keyboard Shortcuts</h2>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {shortcuts.map((s, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800/80"
            >
              <span className="text-xs font-semibold text-slate-300">{s.desc}</span>
              <kbd className="px-2.5 py-1 bg-slate-800 text-blue-400 border border-slate-700 text-xs font-mono rounded-lg font-bold">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
