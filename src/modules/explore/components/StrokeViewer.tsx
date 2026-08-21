"use client";

import React, { useState, useEffect } from "react";
import { RotateCcw } from "lucide-react";

interface StrokeViewerProps {
  kanji: string;
  unicode: string;
  strokeCount?: number;
}

export const StrokeViewer: React.FC<StrokeViewerProps> = ({
  kanji,
  unicode,
  strokeCount,
}) => {
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
      } catch {
        setError(true);
      }
    }

    loadSvg();
  }, [unicode, key]);

  return (
    <div className="flex flex-col items-center justify-center p-3 bg-surface rounded-2xl border border-border shadow-2xs gap-2">
      <style>{`
        @keyframes drawStroke {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>

      <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center bg-surface-muted rounded-xl border border-border p-2 overflow-hidden shadow-inner">
        {error || !svgContent ? (
          <div className="text-4xl sm:text-5xl font-black text-foreground font-jp select-none">
            {kanji}
          </div>
        ) : (
          <div
            key={key}
            className="w-full h-full object-contain dark:invert opacity-95 transition-all duration-300 [&_svg]:w-full [&_svg]:h-full"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        )}
        <div className="absolute bottom-1 right-1.5 text-[9px] font-mono text-muted bg-surface/90 px-1 py-0.2 rounded border border-border/70">
          U+{unicode.toUpperCase()}
        </div>
      </div>

      <div className="flex items-center justify-between w-full px-0.5 gap-2">
        {strokeCount ? (
          <span className="text-[10px] font-semibold text-muted">
            {strokeCount}画
          </span>
        ) : <span />}
        <button
          type="button"
          onClick={() => setKey((prev) => prev + 1)}
          className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 rounded-md transition-colors cursor-pointer"
          title="Replay Stroke Animation"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Replay</span>
        </button>
      </div>
    </div>
  );
};

