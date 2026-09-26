"use client";

import React, { useMemo, useState } from "react";
import { format, subDays, eachDayOfInterval } from "date-fns";
import type { HabitItem } from "@/app/actions/habits";
import { Calendar, Flame } from "lucide-react";

interface HabitHeatmapProps {
  habits: HabitItem[];
  daysCount?: number;
}

export function HabitHeatmap({ habits, daysCount = 90 }: HabitHeatmapProps) {
  const [hoveredDay, setHoveredDay] = useState<{ date: string; count: number } | null>(null);

  const today = useMemo(() => new Date(), []);

  // Generate date array for the last X days
  const dateInterval = useMemo(() => {
    return eachDayOfInterval({
      start: subDays(today, daysCount - 1),
      end: today,
    });
  }, [today, daysCount]);

  // Map each date string (YYYY-MM-DD) to completion count across all habits
  const countByDate = useMemo(() => {
    const map = new Map<string, number>();

    habits.forEach((habit) => {
      // Completed today
      if (habit.is_completed_today) {
        const todayStr = format(today, "yyyy-MM-dd");
        map.set(todayStr, (map.get(todayStr) || 0) + 1);
      }

      // 30 days history
      habit.history_30_days.forEach((dateStr) => {
        if (dateStr !== format(today, "yyyy-MM-dd")) {
          map.set(dateStr, (map.get(dateStr) || 0) + 1);
        }
      });
    });

    return map;
  }, [habits, today]);

  // Aggregate stats
  const totalCompletions = useMemo(() => {
    let sum = 0;
    countByDate.forEach((v) => (sum += v));
    return sum;
  }, [countByDate]);

  const activeDaysCount = useMemo(() => {
    let count = 0;
    countByDate.forEach((v) => {
      if (v > 0) count++;
    });
    return count;
  }, [countByDate]);

  const consistencyPct = daysCount > 0 ? Math.round((activeDaysCount / daysCount) * 100) : 0;

  const getColorClass = (count: number) => {
    if (count === 0) return "bg-zinc-100 border-zinc-200/80";
    if (count <= 2) return "bg-emerald-100 border-emerald-300 text-emerald-800";
    if (count <= 4) return "bg-emerald-300 border-emerald-400 text-emerald-950";
    return "bg-[#154D38] border-[#0F382A] text-white shadow-2xs";
  };

  return (
    <div className="p-5 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs space-y-4 select-none">
      {/* Heatmap Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100">
        <div>
          <div className="flex items-center gap-2 font-bold text-zinc-900 text-sm">
            <Calendar className="h-4 w-4 text-[#154D38]" />
            <span>90-Day Momentum & Consistency Matrix</span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Visualizing unbroken daily habit check-ins over the past quarter
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5 text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <Flame className="h-3.5 w-3.5 fill-emerald-600 text-emerald-600" />
            <span>{consistencyPct}% consistency rate</span>
          </div>
          <div className="text-zinc-500">
            <span className="font-bold text-zinc-900">{totalCompletions}</span> total check-ins
          </div>
        </div>
      </div>

      {/* Grid Container */}
      <div className="overflow-x-auto pb-1">
        <div className="min-w-[650px] space-y-2">
          {/* Day Cells Grid */}
          <div className="grid grid-flow-col grid-rows-7 gap-1.5">
            {dateInterval.map((date) => {
              const dateStr = format(date, "yyyy-MM-dd");
              const count = countByDate.get(dateStr) || 0;

              return (
                <div
                  key={dateStr}
                  onMouseEnter={() => setHoveredDay({ date: dateStr, count })}
                  onMouseLeave={() => setHoveredDay(null)}
                  className={`h-3.5 w-3.5 rounded-sm border transition-all cursor-pointer hover:scale-125 ${getColorClass(
                    count
                  )}`}
                  title={`${dateStr}: ${count} habit${count === 1 ? "" : "s"} completed`}
                />
              );
            })}
          </div>

          {/* Hover Tooltip Status Bar */}
          <div className="h-5 flex items-center justify-between text-xs text-zinc-400 pt-1">
            <div>
              {hoveredDay ? (
                <span className="text-zinc-800 font-medium">
                  <span className="text-[#154D38] font-bold">{hoveredDay.count}</span> habits
                  checked on {hoveredDay.date}
                </span>
              ) : (
                <span>Hover over any cell to inspect consistency records</span>
              )}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
              <span>Less</span>
              <div className="h-2.5 w-2.5 rounded-xs bg-zinc-100 border border-zinc-200" />
              <div className="h-2.5 w-2.5 rounded-xs bg-emerald-100 border border-emerald-300" />
              <div className="h-2.5 w-2.5 rounded-xs bg-emerald-300 border border-emerald-400" />
              <div className="h-2.5 w-2.5 rounded-xs bg-[#154D38] border border-[#0F382A]" />
              <span>More</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
