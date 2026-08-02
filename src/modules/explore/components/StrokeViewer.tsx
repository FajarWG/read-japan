"use client";

import React, { useState, useEffect } from "react";
import { RotateCcw } from "lucide-react";

interface StrokeViewerProps {
  kanji: string;
  unicode: string;
  strokeCount?: number;
}

export const StrokeViewer: React.FC<StrokeViewerProps> = ({ kanji, unicode, strokeCount }) => {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [key, setKey] = useState(0); // Replay key

  useEffect(() => {
    async function loadSvg() {
      setError(false);
      try {
        const res = await fetch(`/kanjivg/${unicode.toLowerCase()}.svg`);
        if (!res.ok) throw new Error("SVG not found");
        const text = await res.text();

        if (typeof text === "string" && text.includes("<svg")) {
          // Parse SVG and apply staggered keyframe animation to each stroke path
          const parser = new DOMParser();
          const doc = parser.parseFromString(text, "image/svg+xml");
          const paths = doc.querySelectorAll("path");

          paths.forEach((path, idx) => {
            const length = 300; // Standard SVG path length approximation
            path.style.strokeDasharray = `${length}`;
            path.style.strokeDashoffset = `${length}`;
            path.style.animation = `drawStroke 0.7s ease-in-out ${idx * 0.4}s forwards`;
          });

          const serializer = new XMLSerializer();
          setSvgContent(serializer.serializeToString(doc.documentElement));
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      }
    }

    loadSvg();
  }, [unicode, key]);

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner gap-2">
      <style>{`
        @keyframes drawStroke {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>

      <div className="relative w-36 h-36 flex items-center justify-center bg-white dark:bg-slate-950/80 rounded-xl border border-slate-200 dark:border-slate-800/80 p-2 overflow-hidden shadow-lg">
        {error || !svgContent ? (
          <div className="text-5xl font-black text-slate-800 dark:text-slate-300 font-japanese select-none">
            {kanji}
          </div>
        ) : (
          <div
            key={key}
            className="w-full h-full object-contain dark:invert opacity-95 transition-all duration-300 [&_svg]:w-full [&_svg]:h-full"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        )}
        <div className="absolute bottom-1 right-2 text-[10px] font-mono text-slate-600 dark:text-slate-500 bg-slate-100 dark:bg-slate-900/80 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-800">
          U+{unicode.toUpperCase()}
        </div>
      </div>

      <div className="flex items-center justify-between w-full px-1 gap-2">
        {strokeCount && (
          <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
            {strokeCount} Strokes (画)
          </span>
        )}
        <button
          onClick={() => setKey((prev) => prev + 1)}
          className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 rounded-md transition-colors cursor-pointer"
          title="Replay Stroke Animation"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Replay</span>
        </button>
      </div>
    </div>
  );
};
