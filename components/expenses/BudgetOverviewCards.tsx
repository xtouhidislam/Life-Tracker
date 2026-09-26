"use client";

import React from "react";
import { ArrowUpRight, TrendingDown, Wallet, Calendar, AlertCircle } from "lucide-react";
import { ExpenseSummary } from "@/app/actions/expenses";

interface BudgetOverviewCardsProps {
  summary: ExpenseSummary;
  monthName?: string;
}

export function BudgetOverviewCards({
  summary,
  monthName = "September",
}: BudgetOverviewCardsProps) {
  const percentSpent = summary.total_budget > 0
    ? Math.round((summary.total_spent / summary.total_budget) * 100)
    : 0;

  const percentRemaining = Math.max(0, 100 - percentSpent);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Hero Card: Total Spent (Donezo forest green card) */}
      <div className="relative overflow-hidden rounded-3xl bg-[#154D38] text-white p-6 sm:p-7 shadow-sm transition-transform hover:scale-[1.01]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-emerald-100/90 tracking-wide">
            Total Spent ({monthName})
          </span>
          <div className="h-8 w-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-4">
          <div className="text-3xl sm:text-4xl font-black font-sans tracking-tight text-white">
            ৳ {summary.total_spent.toLocaleString()}
          </div>

          <div className="mt-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/15 text-emerald-100 border border-white/20">
              <span>{percentSpent}% of budget used</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Remaining Allowance */}
      <div className="rounded-3xl bg-white border border-zinc-200/90 p-6 sm:p-7 shadow-2xs transition-transform hover:scale-[1.01]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-500 tracking-wide">
            Remaining Allowance
          </span>
          <div className="h-8 w-8 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-600">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-4">
          <div className="text-3xl sm:text-4xl font-black font-sans tracking-tight text-zinc-900">
            ৳ {summary.remaining_allowance.toLocaleString()}
          </div>

          <div className="mt-4 flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
              percentRemaining > 20
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-rose-50 text-rose-800 border border-rose-200"
            }`}>
              <span>{percentRemaining}% buffer remaining</span>
            </span>
          </div>
        </div>
      </div>

      {/* 3. Daily Burn Rate */}
      <div className="rounded-3xl bg-white border border-zinc-200/90 p-6 sm:p-7 shadow-2xs transition-transform hover:scale-[1.01]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-500 tracking-wide">
            Daily Average Spend
          </span>
          <div className="h-8 w-8 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-600">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-4">
          <div className="text-3xl sm:text-4xl font-black font-sans tracking-tight text-zinc-900">
            ৳ {summary.daily_average.toLocaleString()}
          </div>

          <div className="mt-4 flex items-center gap-2">
            <span className="text-[11px] font-medium text-zinc-500">
              Projected monthly: ৳ {(summary.daily_average * 30).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Total Monthly Budget */}
      <div className="rounded-3xl bg-white border border-zinc-200/90 p-6 sm:p-7 shadow-2xs transition-transform hover:scale-[1.01]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-500 tracking-wide">
            Allocated Budget Cap
          </span>
          <div className="h-8 w-8 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-600">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-4">
          <div className="text-3xl sm:text-4xl font-black font-sans tracking-tight text-zinc-900">
            ৳ {summary.total_budget.toLocaleString()}
          </div>

          <div className="mt-4 flex items-center gap-2">
            <span className="text-[11px] font-medium text-zinc-500">
              Across {summary.expenses_count} logged transactions
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
