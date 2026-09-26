"use client";

import React from "react";
import {
  Briefcase,
  Laptop,
  BookOpen,
  Coffee,
  Moon,
  Zap,
  CheckCircle2,
  Trophy,
} from "lucide-react";
import {
  RoutineBlock,
  computeRoutineAggregates,
} from "@/lib/routines/routine-utils";
import { Card, CardContent } from "@/components/ui/card";

interface RoutineStatsBarProps {
  blocks: RoutineBlock[];
  scheduleTitle: string;
}

export function RoutineStatsBar({ blocks, scheduleTitle }: RoutineStatsBarProps) {
  const stats = computeRoutineAggregates(blocks);

  const formatHours = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Daily Completion Progress */}
      <Card className="bg-white border-zinc-200/90 shadow-sm rounded-2xl">
        <CardContent className="p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500">
              Daily Rhythm Score
            </span>
            <span className="text-xs font-bold text-[#154D38] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              {stats.completionRate}%
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-zinc-900 tracking-tight">
              {stats.completedBlocks}
            </span>
            <span className="text-xs text-zinc-400 font-medium">
              / {stats.totalBlocks} Blocks Checked
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#154D38] rounded-full transition-all duration-500"
              style={{ width: `${stats.completionRate}%` }}
            />
          </div>

          <p className="text-[11px] text-zinc-500 flex items-center gap-1.5">
            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
            <span>
              {stats.totalBlocks - stats.completedBlocks} blocks remaining today
            </span>
          </p>
        </CardContent>
      </Card>

      {/* 2. Deep Work & Focus Allocation */}
      <Card className="bg-white border-zinc-200/90 shadow-sm rounded-2xl">
        <CardContent className="p-4 sm:p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500">
              Deep Work & Focus
            </span>
            <div className="p-1.5 rounded-xl bg-emerald-50 text-[#154D38]">
              <Laptop className="h-3.5 w-3.5" />
            </div>
          </div>

          <div className="text-2xl font-black text-zinc-900 tracking-tight">
            {formatHours(stats.workMinutes)}
          </div>

          <p className="text-[11px] text-zinc-500">
            High-leverage coding, software builds & market analysis
          </p>
        </CardContent>
      </Card>

      {/* 3. Office & Studies */}
      <Card className="bg-white border-zinc-200/90 shadow-sm rounded-2xl">
        <CardContent className="p-4 sm:p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500">
              Office & AI Study
            </span>
            <div className="p-1.5 rounded-xl bg-blue-50 text-blue-700">
              <BookOpen className="h-3.5 w-3.5" />
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-zinc-900 tracking-tight">
              {formatHours(stats.officeMinutes + stats.studyMinutes)}
            </span>
          </div>

          <p className="text-[11px] text-zinc-500">
            Office shifts ({formatHours(stats.officeMinutes)}) + Study ({formatHours(stats.studyMinutes)})
          </p>
        </CardContent>
      </Card>

      {/* 4. Gamification XP & Bonus */}
      <Card className="bg-white border-zinc-200/90 shadow-sm rounded-2xl">
        <CardContent className="p-4 sm:p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500">
              Routine XP Rewards
            </span>
            <div className="p-1.5 rounded-xl bg-amber-50 text-amber-600">
              <Trophy className="h-3.5 w-3.5" />
            </div>
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-amber-600 tracking-tight">
              +{stats.earnedXp}
            </span>
            <span className="text-xs text-zinc-400">
              / {stats.totalXpAvailable + 10} XP
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-semibold">
            {stats.isFullRoutineCompleted ? (
              <span className="text-emerald-700 flex items-center gap-1">
                <Trophy className="h-3 w-3 fill-emerald-600 text-emerald-600" /> +10 XP Daily Completion Bonus Claimed!
              </span>
            ) : (
              <span className="text-zinc-500 flex items-center gap-1">
                <Zap className="h-3 w-3 text-amber-500" /> Check all blocks for +10 XP Bonus
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
