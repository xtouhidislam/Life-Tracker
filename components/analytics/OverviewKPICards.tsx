"use client";

import React from "react";
import { ArrowUpRight, Zap, Target, Flame, Wallet, Trophy } from "lucide-react";
import { OverviewAnalyticsData } from "@/app/actions/analytics";

interface OverviewKPICardsProps {
  data: OverviewAnalyticsData;
}

export function OverviewKPICards({ data }: OverviewKPICardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Hero Card: Player Level & Total XP (Donezo Forest Green) */}
      <div className="relative overflow-hidden rounded-3xl bg-[#154D38] text-white p-6 sm:p-7 shadow-sm transition-transform hover:scale-[1.01]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-emerald-100/90 tracking-wide flex items-center gap-1.5">
            <Trophy className="h-3.5 w-3.5 text-amber-300" />
            Lifetime XP & Mastery
          </span>
          <div className="h-8 w-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-4">
          <div className="text-3xl sm:text-4xl font-black font-sans tracking-tight text-white">
            {data.totalXp.toLocaleString()} <span className="text-lg font-bold text-emerald-200">XP</span>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/15 text-emerald-100 border border-white/20">
              <span>Level {data.level} Master &middot; 🔥 {data.streak} Day Streak</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Task Execution Rate */}
      <div className="rounded-3xl bg-white border border-zinc-200/90 p-6 sm:p-7 shadow-2xs transition-transform hover:scale-[1.01]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-500 tracking-wide">
            Task Execution Rate
          </span>
          <div className="h-8 w-8 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-600">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-4">
          <div className="text-3xl sm:text-4xl font-black font-sans tracking-tight text-zinc-900">
            {data.taskCompletionRate}%
          </div>

          <div className="mt-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <span>{data.totalTasksCompleted} / {data.totalTasksCount} Objectives Cleared</span>
            </span>
          </div>
        </div>
      </div>

      {/* 3. Deep Work & Focus Allocation */}
      <div className="rounded-3xl bg-white border border-zinc-200/90 p-6 sm:p-7 shadow-2xs transition-transform hover:scale-[1.01]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-500 tracking-wide">
            Deep Work & Focus
          </span>
          <div className="h-8 w-8 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-600">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-4">
          <div className="text-3xl sm:text-4xl font-black font-sans tracking-tight text-zinc-900">
            {data.totalFocusHours} <span className="text-lg font-bold text-zinc-500">hrs</span>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <span className="text-[11px] font-medium text-zinc-500">
              Across {data.totalFocusSessions} Pomodoro sessions ({data.averageFocusMinutes}m avg)
            </span>
          </div>
        </div>
      </div>

      {/* 4. Financial Discipline Score */}
      <div className="rounded-3xl bg-white border border-zinc-200/90 p-6 sm:p-7 shadow-2xs transition-transform hover:scale-[1.01]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-500 tracking-wide">
            Financial Runway Score
          </span>
          <div className="h-8 w-8 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-600">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-4">
          <div className="text-3xl sm:text-4xl font-black font-sans tracking-tight text-zinc-900">
            {100 - data.budgetUtilizationPct}% <span className="text-lg font-bold text-zinc-500">buffer</span>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <span className="text-[11px] font-medium text-zinc-500 font-mono">
              ৳ {data.totalExpenses.toLocaleString()} spent this month
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
