"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";

export interface ToastItem {
  id: string;
  message: string;
  type?: "success" | "error" | "info";
}

let toastListeners: Array<(toast: ToastItem) => void> = [];

export function showToast(message: string, type: "success" | "error" | "info" = "success") {
  const toast: ToastItem = {
    id: Math.random().toString(36).substring(2, 9),
    message,
    type,
  };
  toastListeners.forEach((fn) => fn(toast));
}

export const ToastProvider: React.FC = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handleNewToast = (toast: ToastItem) => {
      setToasts((prev) => [...prev, toast]);

      // Auto dismiss after 3 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 3000);
    };

    toastListeners.push(handleNewToast);
    return () => {
      toastListeners = toastListeners.filter((fn) => fn !== handleNewToast);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto flex items-center justify-between p-4 bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-2xl shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-5 duration-300 gap-3"
        >
          <div className="flex items-center gap-3">
            {t.type === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />}
            {t.type === "error" && <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />}
            {t.type === "info" && <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />}
            <span className="text-xs font-semibold">{t.message}</span>
          </div>

          <button
            onClick={() => setToasts((prev) => prev.filter((item) => item.id !== t.id))}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
