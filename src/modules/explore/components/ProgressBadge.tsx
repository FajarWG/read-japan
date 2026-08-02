"use client";

import React from "react";

export type ProgressStatus = "learned" | "learning" | "weak" | "new";

interface ProgressBadgeProps {
  status: ProgressStatus;
  size?: "sm" | "md";
}

export const ProgressBadge: React.FC<ProgressBadgeProps> = ({ status, size = "md" }) => {
  const config = {
    learned: {
      label: "Learned",
      bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      dot: "bg-emerald-500",
    },
    learning: {
      label: "Learning",
      bg: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      dot: "bg-amber-500",
    },
    weak: {
      label: "Weak",
      bg: "bg-rose-500/10 text-rose-400 border-rose-500/20",
      dot: "bg-rose-500",
    },
    new: {
      label: "New",
      bg: "bg-slate-500/10 text-slate-400 border-slate-500/20",
      dot: "bg-slate-500",
    },
  };

  const curr = config[status] || config.new;
  const isSm = size === "sm";

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold border rounded-full ${curr.bg} ${
        isSm ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"
      }`}
    >
      <span className={`rounded-full animate-pulse ${curr.dot} ${isSm ? "w-1.5 h-1.5" : "w-2 h-2"}`} />
      {curr.label}
    </span>
  );
};
