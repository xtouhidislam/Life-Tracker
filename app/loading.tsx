import React from "react";

export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Top Banner Skeleton */}
      <div className="h-44 rounded-2xl glass-card bg-white/[0.03] border border-[var(--border-subtle)]" />

      {/* Metric Cards Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-28 rounded-2xl glass-card bg-white/[0.03] border border-[var(--border-subtle)]"
          />
        ))}
      </div>

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-96 rounded-2xl glass-card bg-white/[0.03] border border-[var(--border-subtle)]" />
        <div className="h-96 rounded-2xl glass-card bg-white/[0.03] border border-[var(--border-subtle)]" />
      </div>
    </div>
  );
}
