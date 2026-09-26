"use client";

import React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  Briefcase,
  Target,
  Dumbbell,
  Wallet,
  ArrowUpRight,
  TrendingUp,
  Plus,
  Flame,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface DashboardKPIsProps {
  completedTasksCount: number;
  remainingDailyTasksCount: number;
  totalCompletedProjects: number;
  totalFocusedHours: number | string;
  totalWorkoutSessions: number;
  totalSpent: number;
  remainingBalance: number;
  monthlyBudget?: number;
  onLogWorkout?: () => void;
  onOpenTaskModal?: () => void;
}

export function DashboardKPIs({
  completedTasksCount,
  remainingDailyTasksCount,
  totalCompletedProjects,
  totalFocusedHours,
  totalWorkoutSessions,
  totalSpent,
  remainingBalance,
  monthlyBudget = 50000,
  onLogWorkout,
  onOpenTaskModal,
}: DashboardKPIsProps) {
  const budgetUtilization = Math.min(
    100,
    Math.round((totalSpent / (monthlyBudget || 1)) * 100)
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {/* =========================================================================
          CARD 1: Task & Project Execution (All Task & Project metrics aligned)
          ========================================================================= */}
      <div className="rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden bg-[#154D38] text-white shadow-sm hover:shadow-md transition-all duration-200">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-emerald-400/15 rounded-full blur-xl pointer-events-none" />

        {/* Card Header */}
        <div className="flex items-center justify-between mb-3 z-10">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-300">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <span className="text-xs font-bold tracking-wide uppercase text-emerald-200">
              Task & Project Velocity
            </span>
          </div>
          <Link href="/tasks">
            <div className="h-7 w-7 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-colors cursor-pointer">
              <ArrowUpRight className="h-3.5 w-3.5" />
            </div>
          </Link>
        </div>

        {/* Primary Metric: Total Completed Tasks */}
        <div className="z-10 mb-4">
          <div className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-baseline gap-2">
            <span>{completedTasksCount}</span>
            <span className="text-xs font-bold text-emerald-200 tracking-normal uppercase">
              Completed Tasks
            </span>
          </div>
          <p className="text-[11px] text-emerald-100/75 mt-0.5 font-medium">
            Lifetime verified objective milestones
          </p>
        </div>

        {/* Aligned Sub-Metrics: Remaining Daily Tasks & Completed Projects */}
        <div className="pt-3 border-t border-emerald-600/35 grid grid-cols-2 gap-3 z-10">
          {/* Remaining Daily Tasks */}
          <div className="rounded-xl bg-black/15 p-2.5 border border-emerald-500/20">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-200">
              <Clock className="h-3 w-3 text-amber-300" />
              <span>Due Today</span>
            </div>
            <div className="text-xl font-black text-white mt-1">
              {remainingDailyTasksCount}
              <span className="text-[10px] font-medium text-emerald-200/80 ml-1">Remaining</span>
            </div>
          </div>

          {/* Total Completed Projects */}
          <div className="rounded-xl bg-black/15 p-2.5 border border-emerald-500/20">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-200">
              <Briefcase className="h-3 w-3 text-cyan-300" />
              <span>Projects</span>
            </div>
            <div className="text-xl font-black text-white mt-1">
              {totalCompletedProjects}
              <span className="text-[10px] font-medium text-emerald-200/80 ml-1">Shipped</span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          CARD 2: Deep Work & Physical Discipline (Focus Hours + Workout Sessions)
          ========================================================================= */}
      <div className="rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden bg-white border border-zinc-200/90 shadow-2xs hover:shadow-xs transition-all duration-200">
        {/* Card Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Target className="h-4 w-4" />
            </div>
            <span className="text-xs font-bold tracking-wide uppercase text-zinc-500">
              Focus & Physical Discipline
            </span>
          </div>
          <Link href="/focus">
            <div className="h-7 w-7 rounded-full bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-700 transition-colors cursor-pointer">
              <ArrowUpRight className="h-3.5 w-3.5" />
            </div>
          </Link>
        </div>

        {/* Primary Metric: Total Focused Hours */}
        <div className="mb-4">
          <div className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900 flex items-baseline gap-2">
            <span>{totalFocusedHours}</span>
            <span className="text-xs font-bold text-zinc-500 tracking-normal uppercase">
              Focused Hours
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-0.5 font-medium">
            Cumulative uninterrupted deep work execution
          </p>
        </div>

        {/* Aligned Sub-Metrics: Workout Sessions & Pomodoro Status */}
        <div className="pt-3 border-t border-zinc-100 grid grid-cols-2 gap-3">
          {/* Total Workout Sessions */}
          <div className="rounded-xl bg-zinc-50/90 p-2.5 border border-zinc-200/70">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-600">
                <Dumbbell className="h-3 w-3 text-rose-500" />
                <span>Workouts</span>
              </div>
              {onLogWorkout && (
                <button
                  onClick={onLogWorkout}
                  className="h-4 w-4 rounded-full bg-zinc-200 hover:bg-rose-500 hover:text-white flex items-center justify-center text-[10px] text-zinc-600 transition-colors"
                  title="Add workout session"
                >
                  +
                </button>
              )}
            </div>
            <div className="text-xl font-black text-zinc-900 mt-1">
              {totalWorkoutSessions}
              <span className="text-[10px] font-medium text-zinc-500 ml-1">Sessions</span>
            </div>
          </div>

          {/* Quick Focus Action */}
          <div className="rounded-xl bg-zinc-50/90 p-2.5 border border-zinc-200/70 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-600">
              <Sparkles className="h-3 w-3 text-amber-500" />
              <span>Sprint Mode</span>
            </div>
            <Link href="/focus" className="mt-1">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-[#154D38] hover:underline">
                Launch Timer &rarr;
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* =========================================================================
          CARD 3: Monthly Financial Runway (Money Spent + Remaining Balance)
          ========================================================================= */}
      <div className="rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden bg-white border border-zinc-200/90 shadow-2xs hover:shadow-xs transition-all duration-200">
        {/* Card Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#154D38]">
              <Wallet className="h-4 w-4" />
            </div>
            <span className="text-xs font-bold tracking-wide uppercase text-zinc-500">
              Monthly Financial Runway
            </span>
          </div>
          <Link href="/expenses">
            <div className="h-7 w-7 rounded-full bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-700 transition-colors cursor-pointer">
              <ArrowUpRight className="h-3.5 w-3.5" />
            </div>
          </Link>
        </div>

        {/* Primary Metric: Total Money Spent This Month */}
        <div className="mb-4">
          <div className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900 flex items-baseline gap-1.5 font-mono">
            <span className="text-lg font-bold text-zinc-400 font-sans">৳</span>
            <span>{totalSpent.toLocaleString()}</span>
            <span className="text-xs font-bold text-zinc-500 tracking-normal font-sans uppercase ml-1">
              Spent
            </span>
          </div>
          {/* Budget progress bar */}
          <div className="w-full bg-zinc-100 rounded-full h-1.5 mt-2.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                budgetUtilization > 85
                  ? "bg-rose-500"
                  : budgetUtilization > 60
                  ? "bg-amber-500"
                  : "bg-[#154D38]"
              }`}
              style={{ width: `${budgetUtilization}%` }}
            />
          </div>
        </div>

        {/* Aligned Sub-Metrics: Remaining Balance & Budget Utilization */}
        <div className="pt-3 border-t border-zinc-100 grid grid-cols-2 gap-3">
          {/* Remaining Balance This Month */}
          <div className="rounded-xl bg-zinc-50/90 p-2.5 border border-zinc-200/70">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-600">
              <TrendingUp className="h-3 w-3 text-emerald-600" />
              <span>Balance Left</span>
            </div>
            <div className="text-lg font-black text-emerald-800 mt-1 font-mono">
              ৳ {remainingBalance.toLocaleString()}
            </div>
          </div>

          {/* Monthly Allowance & Utilization % */}
          <div className="rounded-xl bg-zinc-50/90 p-2.5 border border-zinc-200/70">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-600">
              <span className="h-2 w-2 rounded-full bg-zinc-400" />
              <span>Used Target</span>
            </div>
            <div className="text-lg font-black text-zinc-900 mt-1">
              {budgetUtilization}%
              <span className="text-[10px] font-medium text-zinc-400 ml-1">of ৳50k</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
