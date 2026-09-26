"use client";

import React from "react";
import { CategoryBudget, ExpenseItem } from "@/app/actions/expenses";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BarChart3, PieChart } from "lucide-react";

interface ExpenseBreakdownChartProps {
  categories: CategoryBudget[];
  expenses: ExpenseItem[];
  totalSpent: number;
  totalBudget: number;
}

export function ExpenseBreakdownChart({
  categories,
  expenses,
  totalSpent,
  totalBudget,
}: ExpenseBreakdownChartProps) {
  // Compute spend over last 7 days for the Donezo capsule chart
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();

  const last7Days = Array.from({ length: 7 }).map((_, idx) => {
    const d = new Date();
    d.setDate(today.getDate() - (6 - idx));
    const dateStr = d.toISOString().split("T")[0];
    const dayTotal = expenses
      .filter((e) => e.date === dateStr)
      .reduce((sum, e) => sum + e.amount, 0);

    return {
      dayName: days[d.getDay()],
      dateStr,
      amount: dayTotal,
      isToday: idx === 6,
    };
  });

  const maxDailyAmount = Math.max(1500, ...last7Days.map((d) => d.amount));
  const utilizationPct = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Donezo Capsule Bar Analytics */}
      <Card className="bg-white border-zinc-200/90 shadow-2xs rounded-3xl">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold text-zinc-900">
              Spending Analytics
            </CardTitle>
            <span className="text-xs font-semibold text-zinc-400">
              Last 7 Days (৳ BDT)
            </span>
          </div>
          <CardDescription className="text-xs text-zinc-500">
            Daily velocity and expense distribution
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-4">
          <div className="flex items-end justify-between gap-3 h-44 px-2 pb-2 border-b border-zinc-100">
            {last7Days.map((day, idx) => {
              const heightPct = Math.max(14, Math.round((day.amount / maxDailyAmount) * 100));
              const hasSpend = day.amount > 0;

              return (
                <div key={day.dateStr} className="flex-1 flex flex-col items-center gap-2 group relative">
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 px-2 py-0.5 rounded-md bg-zinc-900 text-white text-[10px] font-mono font-bold pointer-events-none whitespace-nowrap z-10">
                    ৳ {day.amount.toLocaleString()}
                  </div>

                  {/* Capsule Bar */}
                  <div className="w-full max-w-[34px] h-36 rounded-full overflow-hidden flex flex-col justify-end bg-zinc-100/80 p-0.5 border border-zinc-200/60">
                    {hasSpend ? (
                      <div
                        className={`w-full rounded-full transition-all duration-700 ${
                          day.isToday
                            ? "bg-[#154D38]"
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

                  {/* Day Initial */}
                  <span
                    className={`text-[11px] font-bold ${
                      day.isToday ? "text-[#154D38]" : "text-zinc-400"
                    }`}
                  >
                    {day.dayName[0]}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-3 text-xs text-zinc-500 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#154D38]" /> Active Day
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#10B981]" /> Normal Burn
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-zinc-200 border border-zinc-300" /> Zero Spend
            </span>
          </div>
        </CardContent>
      </Card>

      {/* 2. Donezo Gauge: Budget Utilization Progress */}
      <Card className="bg-white border-zinc-200/90 shadow-2xs rounded-3xl">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold text-zinc-900">
              Budget Utilization
            </CardTitle>
            <span className="text-xs font-semibold text-zinc-400">
              Monthly Projection
            </span>
          </div>
          <CardDescription className="text-xs text-zinc-500">
            Total consumed vs remaining allocation
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-2 flex flex-col items-center justify-center">
          {/* Half Ring / Gauge inspired by Donezo reference */}
          <div className="relative w-52 h-28 flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 100 50" className="w-full h-full">
              {/* Background Arc */}
              <path
                d="M 10,50 A 40,40 0 0,1 90,50"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="10"
                strokeLinecap="round"
              />
              {/* Utilized Arc */}
              <path
                d="M 10,50 A 40,40 0 0,1 90,50"
                fill="none"
                stroke="#154D38"
                strokeWidth="10"
                strokeDasharray="125.6"
                strokeDashoffset={`${125.6 * (1 - Math.min(1, utilizationPct / 100))}`}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            {/* Centered Percentage Display */}
            <div className="absolute bottom-1 flex flex-col items-center">
              <span className="text-3xl sm:text-4xl font-black font-sans text-zinc-900 leading-none">
                {utilizationPct}%
              </span>
              <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mt-1">
                Budget Consumed
              </span>
            </div>
          </div>

          {/* Legend Strip matching screenshot */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-zinc-100 w-full text-xs font-semibold text-zinc-600">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#154D38]" />
              <span>Spent (৳ {totalSpent.toLocaleString()})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#10B981]" />
              <span>Remaining (৳ {Math.max(0, totalBudget - totalSpent).toLocaleString()})</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
