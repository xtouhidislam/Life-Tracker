"use client";

import React from "react";
import { CategoryBudget } from "@/app/actions/expenses";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

interface CategoryBudgetCardProps {
  categories: CategoryBudget[];
}

export function CategoryBudgetCard({ categories }: CategoryBudgetCardProps) {
  return (
    <Card className="bg-white border-zinc-200/90 shadow-2xs rounded-3xl">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold text-zinc-900">
            Category Budgets
          </CardTitle>
          <span className="text-xs font-semibold text-zinc-400">
            Monthly Target
          </span>
        </div>
        <CardDescription className="text-xs text-zinc-500">
          Spending distribution & allowance caps in ৳ BDT
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-1">
        {categories.map((cat) => {
          const isOverBudget = cat.percentage >= 100;
          const isNearLimit = cat.percentage >= 80 && !isOverBudget;

          return (
            <div
              key={cat.category_id}
              className="p-3 rounded-2xl bg-zinc-50/60 border border-zinc-100 space-y-2 hover:bg-zinc-50 transition-colors"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: cat.category_color }}
                  />
                  <span className="font-bold text-zinc-900 truncate">
                    {cat.category_name}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 font-mono">
                  <span className="font-bold text-zinc-900">
                    ৳ {cat.spent_amount.toLocaleString()}
                  </span>
                  <span className="text-zinc-400 font-normal">
                    / ৳ {cat.budget_amount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-2 w-full bg-zinc-200/70 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, cat.percentage)}%`,
                    backgroundColor: isOverBudget
                      ? "#E11D48"
                      : isNearLimit
                      ? "#F59E0B"
                      : cat.category_color,
                  }}
                />
              </div>

              {/* Status footer */}
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-zinc-400">
                  {cat.percentage}% of allocation used
                </span>

                {isOverBudget ? (
                  <span className="text-rose-600 font-bold flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" /> Over Budget
                  </span>
                ) : isNearLimit ? (
                  <span className="text-amber-600 font-bold flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" /> Near Limit
                  </span>
                ) : (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> On Track
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
