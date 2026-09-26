"use client";

import React, { useState, useEffect } from "react";
import { Download, Sparkles, Filter, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  TimeRange,
  OverviewAnalyticsData,
  getOverviewAnalyticsAction,
} from "@/app/actions/analytics";
import { OverviewKPICards } from "@/components/analytics/OverviewKPICards";
import { RhythmVelocityChart } from "@/components/analytics/RhythmVelocityChart";
import { DomainBalanceCard } from "@/components/analytics/DomainBalanceCard";
import { CrossSystemSynthesis } from "@/components/analytics/CrossSystemSynthesis";
import { DataExportModal } from "@/components/analytics/DataExportModal";
import { useAuth } from "@/hooks/useAuth";
import {
  getLocalUserStats,
  getLocalTasks,
  getLocalHabits,
  getLocalExpenses,
} from "@/lib/storage/local-store";

function computeLocalOverviewData(range: TimeRange): OverviewAnalyticsData {
  const stats = getLocalUserStats();
  const tasks = getLocalTasks();
  const habits = getLocalHabits();
  const expenses = getLocalExpenses();

  const totalTasksCount = tasks.length;
  const totalTasksCompleted = tasks.filter((t) => t.is_completed).length;
  const taskCompletionRate = totalTasksCount > 0 ? Math.round((totalTasksCompleted / totalTasksCount) * 100) : 0;

  const totalHabitsCompleted = habits.filter((h) => h.is_completed_today).length;
  const habitConsistencyRate = habits.length > 0 ? Math.round((totalHabitsCompleted / habits.length) * 100) : 0;

  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const totalBudget = 50000;
  const budgetUtilizationPct = Math.min(100, Math.round((totalExpenses / totalBudget) * 100));

  const totalFocusHours = Math.round((stats.total_focus_minutes / 60) * 10) / 10;
  const averageFocusMinutes = stats.total_focus_minutes > 0 ? Math.min(60, stats.total_focus_minutes) : 0;

  const domains = [
    {
      name: "Zenin AI & Deep Coding",
      hours: totalFocusHours > 0 ? Math.round(totalFocusHours * 0.44 * 10) / 10 : 0,
      percentage: totalFocusHours > 0 ? 44 : 0,
      color: "#154D38",
    },
    {
      name: "Office & Operations",
      hours: totalFocusHours > 0 ? Math.round(totalFocusHours * 0.28 * 10) / 10 : 0,
      percentage: totalFocusHours > 0 ? 28 : 0,
      color: "#0D9488",
    },
    {
      name: "Study & Skill Tree",
      hours: totalFocusHours > 0 ? Math.round(totalFocusHours * 0.16 * 10) / 10 : 0,
      percentage: totalFocusHours > 0 ? 16 : 0,
      color: "#10B981",
    },
    {
      name: "Trading & Finance",
      hours: totalFocusHours > 0 ? Math.round(totalFocusHours * 0.12 * 10) / 10 : 0,
      percentage: totalFocusHours > 0 ? 12 : 0,
      color: "#F59E0B",
    },
  ];

  const trendPoints = [
    { label: "Mon", dateStr: "2026-09-22", completionRate: 0, focusMinutes: 0, xpEarned: 0 },
    { label: "Tue", dateStr: "2026-09-23", completionRate: 0, focusMinutes: 0, xpEarned: 0 },
    { label: "Wed", dateStr: "2026-09-24", completionRate: 0, focusMinutes: 0, xpEarned: 0 },
    { label: "Thu", dateStr: "2026-09-25", completionRate: 0, focusMinutes: 0, xpEarned: 0 },
    { label: "Fri", dateStr: "2026-09-26", completionRate: taskCompletionRate, focusMinutes: stats.total_focus_minutes, xpEarned: stats.total_xp, isToday: true },
  ];

  return {
    timeRange: range,
    totalXp: stats.total_xp,
    level: stats.current_level,
    streak: stats.current_streak,
    taskCompletionRate,
    totalTasksCompleted,
    totalTasksCount,
    habitConsistencyRate,
    totalHabitsCompleted,
    totalFocusHours,
    totalFocusSessions: stats.total_focus_minutes > 0 ? 1 : 0,
    averageFocusMinutes,
    totalExpenses,
    budgetUtilizationPct,
    domains,
    trendPoints,
  };
}

export default function OverviewPage() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState<TimeRange>("month");
  const [data, setData] = useState<OverviewAnalyticsData | null>(() => computeLocalOverviewData("month"));
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loadData = async (range = timeRange) => {
    setData(computeLocalOverviewData(range));
    if (!user) return;

    setIsLoading(true);
    try {
      const res = await getOverviewAnalyticsAction(range);
      if (res.success && res.data) {
        setData(res.data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData(timeRange);
  }, [timeRange, user]);

  const rangeLabels: Record<TimeRange, string> = {
    day: "Today (Hourly Velocity)",
    week: "Current Week (7-Day Rhythm)",
    month: "Current Month (September)",
    year: "Year-to-Date (Quarterly Projection)",
  };

  return (
    <div className="space-y-6 max-w-7xl pb-16 font-sans">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900">
              Life Analytics & Performance
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E8F5E9] text-[#154D38] border border-emerald-200">
              Cross-System Synthesis
            </span>
          </div>
          <p className="text-sm text-zinc-500 mt-1">
            Aggregated metrics answering: &ldquo;How is my life actually progressing across all pillars?&rdquo;
          </p>
        </div>

        {/* Action Controls: Export Data */}
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            onClick={() => setIsExportModalOpen(true)}
            className="gap-2 text-xs border-zinc-200 text-zinc-700 hover:bg-zinc-50 font-semibold"
          >
            <Download className="h-3.5 w-3.5 text-zinc-500" />
            <span>Export Data</span>
          </Button>
        </div>
      </div>

      {/* Time Horizon Filter Bar */}
      <div className="flex items-center justify-between gap-4 border-b border-zinc-200/80 pb-3">
        <div className="flex items-center p-1 rounded-2xl bg-zinc-100 border border-zinc-200 shadow-inner">
          {(["day", "week", "month", "year"] as TimeRange[]).map((period) => (
            <button
              key={period}
              onClick={() => setTimeRange(period)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                timeRange === period
                  ? "bg-[#154D38] text-white shadow-sm"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              {period}
            </button>
          ))}
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-zinc-400 font-mono">
          <span>Active Filter: {rangeLabels[timeRange]}</span>
        </div>
      </div>

      {/* High-level KPIs */}
      {data && <OverviewKPICards data={data} />}

      {/* Velocity Chart & Domain Distribution Grid */}
      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RhythmVelocityChart
              trendPoints={data.trendPoints}
              timeRangeLabel={rangeLabels[timeRange]}
            />
          </div>

          <div className="lg:col-span-1">
            <DomainBalanceCard domains={data.domains} />
          </div>
        </div>
      )}

      {/* Cross-System Synthesis Matrix (All 6 Modules) */}
      {data && (
        <CrossSystemSynthesis
          stats={{
            tasksCompleted: data.totalTasksCompleted,
            tasksTotal: data.totalTasksCount,
            streak: data.streak,
            habitRate: data.habitConsistencyRate,
            focusHours: data.totalFocusHours,
            expensesSpent: data.totalExpenses,
            remainingBuffer: Math.max(0, 50000 - data.totalExpenses),
          }}
        />
      )}

      {/* Data Export Modal */}
      <DataExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  );
}
