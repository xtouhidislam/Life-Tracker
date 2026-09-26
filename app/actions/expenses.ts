"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { CreateExpenseSchema } from "@/lib/validation/schemas";
import { checkRateLimit } from "@/lib/security/rate-limiter";

export interface ExpenseItem {
  id: string;
  user_id?: string;
  category_id?: string | null;
  category_name: string;
  category_color: string;
  amount: number;
  currency: string;
  description: string;
  date: string;
  created_at?: string;
}

export interface CategoryBudget {
  category_id: string;
  category_name: string;
  category_color: string;
  budget_amount: number;
  spent_amount: number;
  percentage: number;
}

export interface ExpenseSummary {
  total_spent: number;
  total_budget: number;
  remaining_allowance: number;
  daily_average: number;
  currency: string;
  expenses_count: number;
}

export interface CreateExpenseInput {
  amount: number;
  description: string;
  category_name: string;
  category_color?: string;
  date?: string;
  currency?: string;
}

export const DEFAULT_EXPENSE_CATEGORIES = [
  { name: "Food & Dining", color: "#10B981", default_budget: 12000 },
  { name: "Education & Tech Tools", color: "#154D38", default_budget: 8000 },
  { name: "Transport & Fuel", color: "#0D9488", default_budget: 6000 },
  { name: "Bills & Utilities", color: "#F59E0B", default_budget: 10000 },
  { name: "Personal & Health", color: "#6366F1", default_budget: 14000 },
];

const INITIAL_EXPENSES: ExpenseItem[] = [
  {
    id: "init-exp-1",
    description: "Domain & Server VPS Hosting",
    category_name: "Education & Tech Tools",
    category_color: "#154D38",
    amount: 1450,
    currency: "BDT",
    date: new Date().toISOString().split("T")[0],
    created_at: new Date().toISOString(),
  },
  {
    id: "init-exp-2",
    description: "Weekly Grocery & Meal Prep",
    category_name: "Food & Dining",
    category_color: "#10B981",
    amount: 2850,
    currency: "BDT",
    date: new Date().toISOString().split("T")[0],
    created_at: new Date().toISOString(),
  },
  {
    id: "init-exp-3",
    description: "High-Speed Fiber Broadband",
    category_name: "Bills & Utilities",
    category_color: "#F59E0B",
    amount: 1200,
    currency: "BDT",
    date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "init-exp-4",
    description: "Motorbike Fuel Tank Refill",
    category_name: "Transport & Fuel",
    category_color: "#0D9488",
    amount: 1100,
    currency: "BDT",
    date: new Date(Date.now() - 172800000).toISOString().split("T")[0],
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: "init-exp-5",
    description: "Coffee & Study Session",
    category_name: "Food & Dining",
    category_color: "#10B981",
    amount: 420,
    currency: "BDT",
    date: new Date(Date.now() - 259200000).toISOString().split("T")[0],
    created_at: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: "init-exp-6",
    description: "OpenAI API Platform Credits",
    category_name: "Education & Tech Tools",
    category_color: "#154D38",
    amount: 2200,
    currency: "BDT",
    date: new Date(Date.now() - 345600000).toISOString().split("T")[0],
    created_at: new Date(Date.now() - 345600000).toISOString(),
  },
  {
    id: "init-exp-7",
    description: "Pharmacy & Vitamins",
    category_name: "Personal & Health",
    category_color: "#6366F1",
    amount: 850,
    currency: "BDT",
    date: new Date(Date.now() - 432000000).toISOString().split("T")[0],
    created_at: new Date(Date.now() - 432000000).toISOString(),
  },
];

/**
 * Retrieve user expenses, computed categories, and summary metrics.
 */
export async function getExpensesAction(
  filterPeriod: "this_month" | "last_30_days" | "all" = "this_month"
): Promise<{
  success: boolean;
  expenses: ExpenseItem[];
  categories: CategoryBudget[];
  summary: ExpenseSummary;
  error?: string;
}> {
  // Allowlist the filterPeriod parameter to prevent injection
  const validPeriods = ["this_month", "last_30_days", "all"] as const;
  const safePeriod = validPeriods.includes(filterPeriod as any) ? filterPeriod : "this_month";
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return computeFallbackDataset(INITIAL_EXPENSES);
    }

    // 1. Fetch user categories
    const { data: dbCategories } = await supabase
      .from("categories")
      .select("*")
      .eq("user_id", user.id);

    // 2. Fetch expenses
    let expenseQuery = supabase
      .from("expenses")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false });

    const now = new Date();
    if (safePeriod === "this_month") {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString()
        .split("T")[0];
      expenseQuery = expenseQuery.gte("date", startOfMonth);
    } else if (safePeriod === "last_30_days") {
      const past30 = new Date(Date.now() - 30 * 86400000)
        .toISOString()
        .split("T")[0];
      expenseQuery = expenseQuery.gte("date", past30);
    }

    const { data: dbExpenses, error: expError } = await expenseQuery;

    if (expError || !dbExpenses || dbExpenses.length === 0) {
      return computeFallbackDataset(INITIAL_EXPENSES);
    }

    // Create category lookup map
    const catLookup = new Map<string, { name: string; color: string }>();
    if (dbCategories) {
      dbCategories.forEach((c) => {
        catLookup.set(c.id, { name: c.name, color: c.color });
      });
    }

    // Map to ExpenseItem
    const expenses: ExpenseItem[] = dbExpenses.map((exp) => {
      const matchedCat = exp.category_id ? catLookup.get(exp.category_id) : null;
      return {
        id: exp.id,
        user_id: exp.user_id,
        category_id: exp.category_id,
        category_name: matchedCat?.name || "General",
        category_color: matchedCat?.color || "#10B981",
        amount: Number(exp.amount),
        currency: exp.currency || "BDT",
        description: exp.description || "Expense",
        date: exp.date,
        created_at: exp.created_at,
      };
    });

    // Aggregate category spent vs budgets
    const categoryMap = new Map<string, { budget: number; spent: number; color: string }>();

    DEFAULT_EXPENSE_CATEGORIES.forEach((c) => {
      categoryMap.set(c.name, {
        budget: c.default_budget,
        spent: 0,
        color: c.color,
      });
    });

    expenses.forEach((e) => {
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

    const categories: CategoryBudget[] = Array.from(categoryMap.entries()).map(
      ([name, val], idx) => ({
        category_id: `cat-${idx}`,
        category_name: name,
        category_color: val.color,
        budget_amount: val.budget,
        spent_amount: val.spent,
        percentage: Math.min(100, Math.round((val.spent / (val.budget || 1)) * 100)),
      })
    );

    const total_spent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const total_budget = categories.reduce((acc, curr) => acc + curr.budget_amount, 0);
    const currentDay = Math.max(1, now.getDate());

    const summary: ExpenseSummary = {
      total_spent,
      total_budget,
      remaining_allowance: Math.max(0, total_budget - total_spent),
      daily_average: Math.round(total_spent / currentDay),
      currency: "BDT",
      expenses_count: expenses.length,
    };

    return {
      success: true,
      expenses,
      categories,
      summary,
    };
  } catch (err: any) {
    console.error("getExpensesAction error:", err);
    return computeFallbackDataset(INITIAL_EXPENSES);
  }
}

/**
 * Log a new expense
 */
export async function createExpenseAction(
  input: CreateExpenseInput
): Promise<{ success: boolean; expense?: ExpenseItem; error?: string }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // --- INPUT VALIDATION (Zod) ---
    const parsed = CreateExpenseSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Invalid expense input",
      };
    }
    const safe = parsed.data;

    // --- RATE LIMITING: 30 expenses per minute ---
    if (user) {
      const rl = checkRateLimit("create_expense", user.id, 30, 60_000);
      if (!rl.allowed) {
        return {
          success: false,
          error: `Too many expense entries. Try again in ${rl.retryAfterSeconds}s.`,
        };
      }
    }

    const targetDate = safe.date || new Date().toISOString().split("T")[0];
    const targetCurrency = safe.currency;
    const targetColor =
      input.category_color ||
      DEFAULT_EXPENSE_CATEGORIES.find((c) => c.name === safe.category_name)?.color ||
      "#154D38";

    if (!user) {
      // In demo/guest mode, return client-usable mock expense item
      const newMockItem: ExpenseItem = {
        id: `mock-exp-${Date.now()}`,
        description: safe.description,
        category_name: safe.category_name,
        category_color: targetColor,
        amount: safe.amount,
        currency: targetCurrency,
        date: targetDate,
        created_at: new Date().toISOString(),
      };
      return { success: true, expense: newMockItem };
    }

    // Find or create category in categories table
    let categoryId: string | null = null;
    const { data: existingCat } = await supabase
      .from("categories")
      .select("id")
      .eq("user_id", user.id)
      .eq("name", safe.category_name)
      .single();

    if (existingCat) {
      categoryId = existingCat.id;
    } else {
      const { data: newCat } = await supabase
        .from("categories")
        .insert({
          user_id: user.id,
          name: safe.category_name,
          color: targetColor,
          icon: "wallet",
        })
        .select("id")
        .single();
      if (newCat) categoryId = newCat.id;
    }

    // Insert expense
    const { data: newExpense, error } = await supabase
      .from("expenses")
      .insert({
        user_id: user.id,
        category_id: categoryId,
        amount: safe.amount,
        currency: targetCurrency,
        description: safe.description,
        date: targetDate,
      })
      .select("*")
      .single();

    if (error) throw error;

    revalidatePath("/expenses");
    revalidatePath("/today");

    return {
      success: true,
      expense: {
        id: newExpense.id,
        user_id: newExpense.user_id,
        category_id: newExpense.category_id,
        category_name: input.category_name,
        category_color: targetColor,
        amount: Number(newExpense.amount),
        currency: newExpense.currency,
        description: newExpense.description || input.description,
        date: newExpense.date,
        created_at: newExpense.created_at,
      },
    };
  } catch (err: any) {
    console.error("createExpenseAction error:", err);
    return { success: false, error: err.message || "Failed to create expense" };
  }
}

/**
 * Delete an expense
 */
export async function deleteExpenseAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: true };
    }

    const { error } = await supabase
      .from("expenses")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw error;

    revalidatePath("/expenses");
    revalidatePath("/today");

    return { success: true };
  } catch (err: any) {
    console.error("deleteExpenseAction error:", err);
    return { success: false, error: err.message || "Failed to delete expense" };
  }
}

/**
 * Compute aggregated dataset for demo fallback
 */
function computeFallbackDataset(items: ExpenseItem[]) {
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

  const categories: CategoryBudget[] = Array.from(categoryMap.entries()).map(
    ([name, val], idx) => ({
      category_id: `cat-${idx}`,
      category_name: name,
      category_color: val.color,
      budget_amount: val.budget,
      spent_amount: val.spent,
      percentage: Math.min(100, Math.round((val.spent / (val.budget || 1)) * 100)),
    })
  );

  const total_spent = items.reduce((acc, curr) => acc + curr.amount, 0);
  const total_budget = categories.reduce((acc, curr) => acc + curr.budget_amount, 0);
  const now = new Date();
  const currentDay = Math.max(1, now.getDate());

  const summary: ExpenseSummary = {
    total_spent,
    total_budget,
    remaining_allowance: Math.max(0, total_budget - total_spent),
    daily_average: Math.round(total_spent / currentDay),
    currency: "BDT",
    expenses_count: items.length,
  };

  return {
    success: true,
    expenses: items,
    categories,
    summary,
  };
}
