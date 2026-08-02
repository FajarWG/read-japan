"use client";

import React from "react";

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = "" }) => {
  return (
    <div
      className={`animate-pulse bg-slate-800/60 rounded-2xl ${className}`}
    />
  );
};

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Hero Skeleton */}
      <Skeleton className="w-full h-36" />

      {/* Grid Stats Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton className="lg:col-span-2 h-48" />
        <Skeleton className="h-48" />
      </div>

      {/* Heatmap Skeleton */}
      <Skeleton className="w-full h-32" />

      {/* Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
    </div>
  );
};

export const ExploreSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="flex items-center gap-4">
        <Skeleton className="w-24 h-24 rounded-3xl shrink-0" />
        <div className="flex flex-col gap-2 flex-1">
          <Skeleton className="w-48 h-8" />
          <Skeleton className="w-32 h-5" />
          <Skeleton className="w-64 h-4" />
        </div>
      </div>
      <Skeleton className="w-full h-40" />
      <Skeleton className="w-full h-48" />
    </div>
  );
};
