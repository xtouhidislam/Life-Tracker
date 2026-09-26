"use client";

import React, { useState, useEffect, useTransition } from "react";
import { Plus, Wallet, Sparkles, Filter, Download, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ExpenseItem,
  CategoryBudget,
  ExpenseSummary,
  CreateExpenseInput,
  getExpensesAction,
  createExpenseAction,
  deleteExpenseAction,
  DEFAULT_EXPENSE_CATEGORIES,
} from "@/app/actions/expenses";
import { BudgetOverviewCards } from "@/components/expenses/BudgetOverviewCards";
import { ExpenseBreakdownChart } from "@/components/expenses/ExpenseBreakdownChart";
import { CategoryBudgetCard } from "@/components/expenses/CategoryBudgetCard";
import { TransactionTable } from "@/components/expenses/TransactionTable";
import { CreateExpenseModal } from "@/components/expenses/CreateExpenseModal";
import { soundEffects } from "@/lib/audio/sound-effects";
import { triggerHaptic } from "@/lib/ui/haptics";
import {
  getLocalExpenses,
  saveLocalExpenses,
  addLocalExpense,
  deleteLocalExpense,
} from "@/lib/storage/local-store";

function computeLocalSummaries(items: ExpenseItem[]): { categories: CategoryBudget[]; summary: ExpenseSummary } {
  const total_spent = items.reduce((acc, curr) => acc + curr.amount, 0);
  const total_budget = 50000;
  const currentDay = Math.max(1, new Date().getDate());

  const categoryMap = new Map<string, { budget: number; spent: number; color: string }>();
  DEFAULT_EXPENSE_CATEGORIES.forEach((c) => {
    categoryMap.set(c.name, {
      budget: c.default_budget,
      spent: 0,
      color: c.color,
    });
  });

  items.forEach((e) => {
    const existing = categoryMap.get(e.category_name);
    if (existing) {
      existing.spent += e.amount;
    } else {
      categoryMap.set(e.category_name, {
        budget: 5000,
        spent: e.amount,
        color: e.category_color,
      });
    }
  });

  const categories: CategoryBudget[] = Array.from(categoryMap.entries()).map(([name, val], idx) => ({
    category_id: `cat-${idx}`,
    category_name: name,
    category_color: val.color,
    budget_amount: val.budget,
    spent_amount: val.spent,
    percentage: Math.min(100, Math.round((val.spent / (val.budget || 1)) * 100)),
  }));

  const summary: ExpenseSummary = {
    total_spent,
    total_budget,
    remaining_allowance: Math.max(0, total_budget - total_spent),
    daily_average: Math.round(total_spent / currentDay),
    currency: "BDT",
    expenses_count: items.length,
  };

  return { categories, summary };
}

export default function ExpensesPage() {
  const [filterPeriod, setFilterPeriod] = useState<"this_month" | "last_30_days" | "all">("this_month");
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [categories, setCategories] = useState<CategoryBudget[]>([]);
  const [summary, setSummary] = useState<ExpenseSummary>({
    total_spent: 0,
    total_budget: 50000,
    remaining_allowance: 50000,
    daily_average: 0,
    currency: "BDT",
    expenses_count: 0,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  // Load initial data with local persistence fallback
  const loadData = async (period = filterPeriod) => {
    const localItems = getLocalExpenses();
    if (localItems.length > 0) {
      const { categories: localCats, summary: localSum } = computeLocalSummaries(localItems);
      setExpenses(localItems);
      setCategories(localCats);
      setSummary(localSum);
    }

    try {
      const res = await getExpensesAction(period);
      if (res.success && res.expenses) {
        if (res.expenses.length > 0 || localItems.length === 0) {
          setExpenses(res.expenses);
          setCategories(res.categories);
          setSummary(res.summary);
          saveLocalExpenses(res.expenses);
        }
      }
    } catch (err) {
      console.warn("Expenses cloud sync fallback to local store:", err);
    }
  };

  useEffect(() => {
    loadData(filterPeriod);
  }, [filterPeriod]);

  // Handle new expense creation
  const handleCreateExpense = async (input: CreateExpenseInput) => {
    const tempExpense: ExpenseItem = {
      id: `exp-${Date.now()}`,
      description: input.description,
      category_name: input.category_name,
      category_color: input.category_color || "#154D38",
      amount: input.amount,
      currency: input.currency || "BDT",
      date: input.date || new Date().toISOString().split("T")[0],
      created_at: new Date().toISOString(),
    };

    // Immediately persist in local storage
    const updated = addLocalExpense(tempExpense);
    const { categories: nextCats, summary: nextSum } = computeLocalSummaries(updated);
    setExpenses(updated);
    setCategories(nextCats);
    setSummary(nextSum);

    soundEffects.playCheckmark();
    triggerHaptic("success");

    setToastMessage(`Logged ৳ ${input.amount.toLocaleString()} for ${input.description}`);
    setTimeout(() => setToastMessage(null), 3000);

    startTransition(async () => {
      await createExpenseAction(input);
    });
  };

  // Handle deletion
  const handleDeleteExpense = async (id: string) => {
    soundEffects.playClick();
    triggerHaptic("medium");

    const updated = deleteLocalExpense(id);
    const { categories: nextCats, summary: nextSum } = computeLocalSummaries(updated);
    setExpenses(updated);
    setCategories(nextCats);
    setSummary(nextSum);

    startTransition(async () => {
      await deleteExpenseAction(id);
    });
  };

  return (
    <div className="space-y-6 max-w-7xl pb-16 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-[#154D38] text-white shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900">
              Expenses & Financial Budget
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E8F5E9] text-[#154D38] border border-emerald-200">
              ৳ BDT Localized
            </span>
          </div>
          <p className="text-sm text-zinc-500 mt-1">
            Track daily living expenditures, monitor runway, and maintain strict budget caps.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            onClick={() => setIsModalOpen(true)}
            className="gap-2 px-5 bg-[#154D38] hover:bg-[#0F382A] text-white shadow-sm font-bold text-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Add Expense</span>
          </Button>
        </div>
      </div>

      {/* Period Filter Tabs */}
      <div className="flex items-center justify-between gap-4 border-b border-zinc-200/80 pb-3">
        <div className="flex items-center p-1 rounded-2xl bg-zinc-100 border border-zinc-200 shadow-inner">
          <button
            onClick={() => setFilterPeriod("this_month")}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterPeriod === "this_month"
                ? "bg-[#154D38] text-white shadow-sm"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            This Month (September)
          </button>
          <button
            onClick={() => setFilterPeriod("last_30_days")}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterPeriod === "last_30_days"
                ? "bg-[#154D38] text-white shadow-sm"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            Last 30 Days
          </button>
          <button
            onClick={() => setFilterPeriod("all")}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterPeriod === "all"
                ? "bg-[#154D38] text-white shadow-sm"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            All Time
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-zinc-500">
          <span>Primary Currency:</span>
          <span className="font-bold text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded-md border border-zinc-200">
            BDT (৳)
          </span>
        </div>
      </div>

      {/* Top 4 KPI Metrics Strip */}
      <BudgetOverviewCards summary={summary} monthName="September" />

      {/* Visual Analytics Row: Capsule Bars + Utilization Gauge */}
      <ExpenseBreakdownChart
        categories={categories}
        expenses={expenses}
        totalSpent={summary.total_spent}
        totalBudget={summary.total_budget}
      />

      {/* Categories & Transactions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Category Budgets Breakdown */}
        <div className="lg:col-span-1">
          <CategoryBudgetCard categories={categories} />
        </div>

        {/* Right: Recent Expenditures Table */}
        <div className="lg:col-span-2">
          <TransactionTable expenses={expenses} onDelete={handleDeleteExpense} />
        </div>
      </div>

      {/* Add Expense Modal */}
      <CreateExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateExpense}
      />
    </div>
  );
}
