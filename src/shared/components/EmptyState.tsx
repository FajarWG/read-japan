"use client";

import React from "react";
import Link from "next/link";
import { Inbox, ArrowRight } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
  icon?: React.ComponentType<{ className?: string }>;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  actionHref,
  onAction,
  icon: Icon = Inbox,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 bg-slate-900/40 rounded-3xl border border-slate-800/80 text-center gap-4 animate-in fade-in duration-300">
      <div className="p-4 rounded-2xl bg-slate-800/60 text-slate-400 border border-slate-700/50">
        <Icon className="w-8 h-8" />
      </div>

      <div className="flex flex-col gap-1 max-w-sm">
        <h3 className="text-lg font-extrabold text-white">{title}</h3>
        <p className="text-xs text-slate-400 font-medium">{description}</p>
      </div>

      {actionText && (
        actionHref ? (
          <Link
            href={actionHref}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-400 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-blue-500/20"
          >
            <span>{actionText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        ) : (
          <button
            onClick={onAction}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-400 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-blue-500/20 cursor-pointer"
          >
            <span>{actionText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )
      )}
    </div>
  );
};
