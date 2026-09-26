"use client";

import React from "react";
import { Flame, Check, Sparkles, Clock, Sun, Sunset } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { HabitItem } from "@/app/actions/habits";
import { cn } from "@/lib/utils";

interface HabitCardProps {
  habit: HabitItem;
  onToggle: (habitId: string, currentStatus: boolean, xp: number, title: string) => void;
}

const TIME_ICONS: Record<string, React.ElementType> = {
  morning: Sun,
  afternoon: Sun,
  evening: Sunset,
  anytime: Clock,
};

export function HabitCard({ habit, onToggle }: HabitCardProps) {
  const isCompleted = habit.is_completed_today;
  const TimeIcon = TIME_ICONS[habit.time_of_day] || Clock;

  return (
    <div
      className={cn(
        "p-5 rounded-2xl border transition-all duration-300 relative select-none flex flex-col justify-between gap-4 bg-white",
        isCompleted
          ? "border-zinc-200/80 bg-zinc-50/50"
          : "border-zinc-200/90 shadow-2xs hover:shadow-xs"
      )}
    >
      {/* Category Accent Indicator */}
      {habit.category_color && (
        <div
          className="absolute left-0 top-4 bottom-4 w-1 rounded-r-full"
          style={{ backgroundColor: habit.category_color }}
        />
      )}

      {/* Top Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Category */}
            <span className="text-[11px] font-semibold text-zinc-500 flex items-center gap-1.5">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: habit.category_color }}
              />
              <span>{habit.category_name}</span>
            </span>

            {/* Time of Day */}
            <span className="text-[11px] text-zinc-400 flex items-center gap-1">
              <TimeIcon className="h-3 w-3" />
              <span className="capitalize">{habit.time_of_day}</span>
            </span>
          </div>

          <h3
            className={cn(
              "text-base font-bold tracking-tight transition-colors",
              isCompleted ? "text-zinc-500 line-through" : "text-zinc-900"
            )}
          >
            {habit.title}
          </h3>

          {habit.description && (
            <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">
              {habit.description}
            </p>
          )}
        </div>

        {/* Streak Flame Pill */}
        <div className="shrink-0 flex flex-col items-end gap-1">
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200/70 text-xs font-bold text-amber-700">
            <Flame className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
            <span>{habit.current_streak}d</span>
          </div>
          <span className="text-[10px] text-zinc-400 font-medium">
            Best: {habit.longest_streak}d
          </span>
        </div>
      </div>

      {/* 7-Day Completion Mini Dot Matrix */}
      <div className="space-y-2 pt-1 border-t border-zinc-100">
        <div className="flex items-center justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
          <span>7-DAY CONSISTENCY</span>
          <span className="text-emerald-700 font-semibold">
            {habit.consistency_pct}% consistent
          </span>
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {habit.history_7_days.map((item, idx) => {
            const isTodayItem = idx === habit.history_7_days.length - 1;
            const itemCompleted = isTodayItem ? isCompleted : item.completed;

            return (
              <div key={item.date} className="flex flex-col items-center gap-1">
                <span className="text-[9px] font-semibold text-zinc-400">
                  {item.dayName}
                </span>
                <div
                  className={cn(
                    "h-7 w-7 rounded-xl flex items-center justify-center text-xs transition-all",
                    itemCompleted
                      ? "bg-[#154D38] border border-[#154D38] text-white shadow-2xs font-black"
                      : isTodayItem
                      ? "border-2 border-dashed border-[#154D38] bg-emerald-50 text-[#154D38]"
                      : "bg-zinc-100 border border-zinc-200 text-zinc-400"
                  )}
                  title={`${item.date}: ${itemCompleted ? "Completed" : "Missed"}`}
                >
                  {itemCompleted ? (
                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                  ) : isTodayItem ? (
                    <span className="h-1.5 w-1.5 rounded-full bg-[#154D38] animate-pulse" />
                  ) : (
                    <span className="text-[10px]">&middot;</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Check In Action Button */}
      <Button
        type="button"
        variant={isCompleted ? "secondary" : "primary"}
        onClick={() => onToggle(habit.id, isCompleted, habit.xp_per_completion, habit.title)}
        className={cn(
          "w-full h-10 font-bold text-xs gap-2 transition-all mt-1",
          isCompleted
            ? "border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
            : "bg-[#154D38] hover:bg-[#0F382A] text-white shadow-xs"
        )}
      >
        {isCompleted ? (
          <>
            <Check className="h-4 w-4 text-emerald-700 stroke-[3]" />
            <span>Checked In for Today (+{habit.xp_per_completion} XP)</span>
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            <span>Check In Today (+{habit.xp_per_completion} XP)</span>
          </>
        )}
      </Button>
    </div>
  );
}
