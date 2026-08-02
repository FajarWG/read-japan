"use client";

import React, { useState } from "react";

interface StrokeViewerProps {
  kanji: string;
  unicode: string;
  strokeCount?: number;
}

export const StrokeViewer: React.FC<StrokeViewerProps> = ({ kanji, unicode, strokeCount }) => {
  const [error, setError] = useState(false);
  const svgUrl = `/kanjivg/${unicode.toLowerCase()}.svg`;

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner">
      <div className="relative w-36 h-36 flex items-center justify-center bg-white dark:bg-slate-950/80 rounded-xl border border-slate-200 dark:border-slate-800/80 p-2 overflow-hidden shadow-lg">
        {error ? (
          <div className="text-4xl font-extrabold text-slate-800 dark:text-slate-400 select-none font-japanese">
            {kanji}
          </div>
        ) : (
          <img
            src={svgUrl}
            alt={`KanjiVG stroke order for ${kanji}`}
            className="w-full h-full object-contain dark:invert opacity-90 transition-all duration-300"
            onError={() => setError(true)}
          />
        )}
        <div className="absolute bottom-1 right-2 text-[10px] font-mono text-slate-600 dark:text-slate-500 bg-slate-100 dark:bg-slate-900/80 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-800">
          U+{unicode.toUpperCase()}
        </div>
      </div>
      {strokeCount && (
        <span className="mt-2 text-xs font-medium text-slate-600 dark:text-slate-400">
          {strokeCount} Strokes (画)
        </span>
      )}
    </div>
  );
};
