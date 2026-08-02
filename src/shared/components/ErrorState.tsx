"use client";

import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Something went wrong",
  message = "Failed to load requested data. Please try again.",
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-rose-950/20 border border-rose-900/40 rounded-3xl text-center gap-4 animate-in fade-in">
      <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400">
        <AlertCircle className="w-7 h-7" />
      </div>

      <div className="flex flex-col gap-1 max-w-md">
        <h3 className="text-base font-extrabold text-white">{title}</h3>
        <p className="text-xs text-rose-200/80">{message}</p>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-rose-600/20 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
};
