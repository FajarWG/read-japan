"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

interface RecommendationItem {
  module: string;
  title: string;
  description: string;
  href: string;
  badge: string;
}

interface RecommendationSectionProps {
  recommendations: RecommendationItem[];
}

export const RecommendationSection: React.FC<RecommendationSectionProps> = ({
  recommendations,
}) => {
  return (
    <div className="flex flex-col gap-4 p-6 bg-gradient-to-br from-slate-900/90 via-slate-900/50 to-blue-950/30 rounded-3xl border border-slate-800 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
          <Sparkles className="w-4 h-4" />
          <span>Recommended Next Practice</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {recommendations.map((rec, idx) => (
          <Link
            key={idx}
            href={rec.href}
            className="flex flex-col justify-between p-4 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 rounded-2xl transition-all group gap-3"
          >
            <div className="flex flex-col gap-1.5">
              <span className="self-start px-2 py-0.5 text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-md">
                {rec.badge}
              </span>
              <h3 className="text-sm font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
                {rec.title}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2">
                {rec.description}
              </p>
            </div>

            <div className="flex items-center text-xs font-semibold text-amber-400 gap-1 group-hover:translate-x-1 transition-transform">
              <span>Start Practice</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
