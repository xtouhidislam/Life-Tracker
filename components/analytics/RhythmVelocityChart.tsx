"use client";

import React, { useState } from "react";
import { DayPerformancePoint } from "@/app/actions/analytics";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

interface RhythmVelocityChartProps {
  trendPoints: DayPerformancePoint[];
  timeRangeLabel: string;
}

export function RhythmVelocityChart({
  trendPoints,
  timeRangeLabel,
}: RhythmVelocityChartProps) {
  const [metric, setMetric] = useState<"rate" | "focus" | "xp">("rate");

  const getMetricValue = (p: DayPerformancePoint) => {
    if (metric === "rate") return p.completionRate;
    if (metric === "focus") return p.focusMinutes;
    return p.xpEarned;
  };

  const getFormattedLabel = (p: DayPerformancePoint) => {
    if (metric === "rate") return `${p.completionRate}%`;
    if (metric === "focus") return `${p.focusMinutes}m`;
    return `+${p.xpEarned} XP`;
  };

  const maxVal = Math.max(10, ...trendPoints.map(getMetricValue));

  return (
    <Card className="bg-white border-zinc-200/90 shadow-2xs rounded-3xl">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <CardTitle className="text-base font-bold text-zinc-900">
            Performance Velocity & Rhythm
          </CardTitle>
          <CardDescription className="text-xs text-zinc-500">
            Aggregated momentum across {timeRangeLabel}
          </CardDescription>
        </div>

        {/* Metric Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-zinc-100 border border-zinc-200 shadow-inner">
          <button
            onClick={() => setMetric("rate")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              metric === "rate"
                ? "bg-[#154D38] text-white shadow-2xs font-bold"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            Completion %
          </button>
          <button
            onClick={() => setMetric("focus")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              metric === "focus"
                ? "bg-[#154D38] text-white shadow-2xs font-bold"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            Focus Time
          </button>
          <button
            onClick={() => setMetric("xp")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              metric === "xp"
                ? "bg-[#154D38] text-white shadow-2xs font-bold"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            XP Velocity
          </button>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        {/* Capsule Bars Container matching Donezo reference screenshot */}
        <div className="flex items-end justify-between gap-2.5 sm:gap-4 h-48 px-2 pb-2 border-b border-zinc-100">
          {trendPoints.map((point, idx) => {
            const val = getMetricValue(point);
            const heightPct = Math.max(12, Math.round((val / maxVal) * 100));
            const hasData = val > 0;

            return (
              <div
                key={point.label}
                className="flex-1 flex flex-col items-center gap-2 group relative"
              >
                {/* Tooltip on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 px-2.5 py-0.5 rounded-md bg-zinc-900 text-white text-[11px] font-mono font-bold pointer-events-none whitespace-nowrap z-10 shadow-sm">
                  {getFormattedLabel(point)}
                </div>

                {/* Vertical Capsule Bar */}
                <div className="w-full max-w-[42px] h-40 rounded-full overflow-hidden flex flex-col justify-end bg-zinc-100/80 p-0.5 border border-zinc-200/60">
                  {hasData ? (
                    <div
                      className={`w-full rounded-full transition-all duration-700 ${
                        point.isToday
                          ? "bg-[#154D38] shadow-sm"
                          : idx % 2 === 0
                          ? "bg-[#10B981]"
                          : "bg-[#0D9488]"
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                  ) : (
                    <div className="w-full h-full hatched-pattern rounded-full opacity-60" />
                  )}
                </div>

                {/* Label */}
                <span
                  className={`text-[11px] font-bold ${
                    point.isToday ? "text-[#154D38]" : "text-zinc-400"
                  }`}
                >
                  {point.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between pt-3 text-xs text-zinc-500 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#154D38]" /> Current Interval
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#10B981]" /> Baseline Rhythm
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-zinc-200 border border-zinc-300" /> Pending / Rest
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
