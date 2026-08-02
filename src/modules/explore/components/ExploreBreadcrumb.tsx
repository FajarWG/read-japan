"use client";

import React from "react";
import { ChevronRight } from "lucide-react";
import { ExploreTarget } from "./ExploreDrawer";

interface ExploreBreadcrumbProps {
  history: ExploreTarget[];
  onSelectIndex: (index: number) => void;
}

export const ExploreBreadcrumb: React.FC<ExploreBreadcrumbProps> = ({
  history,
  onSelectIndex,
}) => {
  if (history.length <= 1) return null;

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto py-1 px-1 scrollbar-none text-xs">
      {history.map((item, idx) => {
        const isLast = idx === history.length - 1;
        return (
          <React.Fragment key={idx}>
            {idx > 0 && <ChevronRight className="w-3 h-3 text-slate-400 dark:text-slate-600 shrink-0" />}
            <button
              onClick={() => onSelectIndex(idx)}
              disabled={isLast}
              className={`px-2 py-0.5 rounded-lg font-japanese font-semibold transition-all shrink-0 cursor-pointer ${
                isLast
                  ? "bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30 cursor-default"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800/60"
              }`}
            >
              {item.query}
            </button>
          </React.Fragment>
        );
      })}
    </div>
  );
};
