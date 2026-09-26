"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { format, subDays, eachDayOfInterval } from "date-fns";
import { CreateHabitSchema, verifyAndClampXp } from "@/lib/validation/schemas";
import { checkRateLimit } from "@/lib/security/rate-limiter";

export interface HabitItem {
  id: string;
  user_id?: string;
  title: string;
  description?: string | null;
  category_name: string;
  category_color: string;
  frequency: "daily" | "weekdays" | "weekends" | "weekly";
  target_days_per_week: number;
  time_of_day: "morning" | "afternoon" | "evening" | "anytime";
  current_streak: number;
  longest_streak: number;
  xp_per_completion: number;
  is_completed_today: boolean;
  history_7_days: { date: string; dayName: string; completed: boolean }[];
  history_30_days: string[]; // YYYY-MM-DD completion dates
  consistency_pct: number;
}

export interface CreateHabitInput {
  title: string;
  description?: string;
  category_name?: string;
  frequency: "daily" | "weekdays" | "weekends" | "weekly";
  target_days_per_week: number;
  time_of_day: "morning" | "afternoon" | "evening" | "anytime";
  xp_per_completion?: number;
}

const DEFAULT_HABITS: HabitItem[] = [
  {
    id: "habit-1",
    title: "Morning Hydration & Mobility Routine",
    description: "Drink 500ml water, dynamic joint mobility and spine decompression",
    category_name: "Health",
    category_color: "#10B981",
    frequency: "daily",
    target_days_per_week: 7,
    time_of_day: "morning",
    current_streak: 0,
    longest_streak: 0,
    xp_per_completion: 15,
    is_completed_today: false,
    history_7_days: [
      { date: "2026-09-20", dayName: "Sun", completed: false },
      { date: "2026-09-21", dayName: "Mon", completed: false },
      { date: "2026-09-22", dayName: "Tue", completed: false },
      { date: "2026-09-23", dayName: "Wed", completed: false },
      { date: "2026-09-24", dayName: "Thu", completed: false },
      { date: "2026-09-25", dayName: "Fri", completed: false },
      { date: "2026-09-26", dayName: "Sat", completed: false },
    ],
    history_30_days: [],
    consistency_pct: 0,
  },
  {
    id: "habit-2",
    title: "Daily Technical Coding Sprint (Zenin AI)",
    description: "45-90 minutes uninterrupted implementation on FastAPI & agent pipelines",
    category_name: "Engineering",
    category_color: "#6366F1",
    frequency: "daily",
    target_days_per_week: 7,
    time_of_day: "afternoon",
    current_streak: 0,
    longest_streak: 0,
    xp_per_completion: 15,
    is_completed_today: false,
    history_7_days: [
      { date: "2026-09-20", dayName: "Sun", completed: false },
      { date: "2026-09-21", dayName: "Mon", completed: false },
      { date: "2026-09-22", dayName: "Tue", completed: false },
      { date: "2026-09-23", dayName: "Wed", completed: false },
      { date: "2026-09-24", dayName: "Thu", completed: false },
      { date: "2026-09-25", dayName: "Fri", completed: false },
      { date: "2026-09-26", dayName: "Sat", completed: false },
    ],
    history_30_days: [],
    consistency_pct: 0,
  },
  {
    id: "habit-3",
    title: "Evening Knowledge & AI Research (08:00 - 09:30)",
    description: "Study PostgreSQL architecture, vector databases, and system design docs",
    category_name: "Knowledge",
    category_color: "#8B5CF6",
    frequency: "daily",
    target_days_per_week: 7,
    time_of_day: "evening",
    current_streak: 0,
    longest_streak: 0,
    xp_per_completion: 15,
    is_completed_today: false,
    history_7_days: [
      { date: "2026-09-20", dayName: "Sun", completed: false },
      { date: "2026-09-21", dayName: "Mon", completed: false },
      { date: "2026-09-22", dayName: "Tue", completed: false },
      { date: "2026-09-23", dayName: "Wed", completed: false },
      { date: "2026-09-24", dayName: "Thu", completed: false },
      { date: "2026-09-25", dayName: "Fri", completed: false },
      { date: "2026-09-26", dayName: "Sat", completed: false },
    ],
    history_30_days: [],
    consistency_pct: 0,
  },
  {
    id: "habit-4",
    title: "Market Analysis & Trading Review",
    description: "Review daily crypto/forex sessions, record key liquidity levels and journal",
    category_name: "Trading",
    category_color: "#F59E0B",
    frequency: "weekdays",
    target_days_per_week: 5,
    time_of_day: "evening",
    current_streak: 0,
    longest_streak: 0,
    xp_per_completion: 15,
    is_completed_today: false,
    history_7_days: [
      { date: "2026-09-20", dayName: "Sun", completed: false },
      { date: "2026-09-21", dayName: "Mon", completed: false },
      { date: "2026-09-22", dayName: "Tue", completed: false },
      { date: "2026-09-23", dayName: "Wed", completed: false },
      { date: "2026-09-24", dayName: "Thu", completed: false },
      { date: "2026-09-25", dayName: "Fri", completed: false },
      { date: "2026-09-26", dayName: "Sat", completed: false },
    ],
    history_30_days: [],
    consistency_pct: 0,
  },
  {
    id: "habit-5",
    title: "Clean Nutrition & Caloric Deficit Protocol",
    description: "Zero refined sugars, hit minimum 120g protein target, log food in BDT tracker",
    category_name: "Health",
    category_color: "#10B981",
    frequency: "daily",
    target_days_per_week: 7,
    time_of_day: "anytime",
    current_streak: 0,
    longest_streak: 0,
    xp_per_completion: 15,
    is_completed_today: false,
    history_7_days: [
      { date: "2026-09-20", dayName: "Sun", completed: false },
      { date: "2026-09-21", dayName: "Mon", completed: false },
      { date: "2026-09-22", dayName: "Tue", completed: false },
      { date: "2026-09-23", dayName: "Wed", completed: false },
      { date: "2026-09-24", dayName: "Thu", completed: false },
      { date: "2026-09-25", dayName: "Fri", completed: false },
      { date: "2026-09-26", dayName: "Sat", completed: false },
    ],
    history_30_days: [],
    consistency_pct: 0,
  },
  {
    id: "habit-6",
    title: "Evening Shutdown & Next-Day Preparation",
    description: "Clear terminal windows, review git branches, plan tomorrow's 3 priority tasks",
    category_name: "Personal",
    category_color: "#F43F5E",
    frequency: "daily",
    target_days_per_week: 7,
    time_of_day: "evening",
    current_streak: 0,
    longest_streak: 0,
    xp_per_completion: 15,
    is_completed_today: false,
    history_7_days: [
      { date: "2026-09-20", dayName: "Sun", completed: false },
      { date: "2026-09-21", dayName: "Mon", completed: false },
      { date: "2026-09-22", dayName: "Tue", completed: false },
      { date: "2026-09-23", dayName: "Wed", completed: false },
      { date: "2026-09-24", dayName: "Thu", completed: false },
      { date: "2026-09-25", dayName: "Fri", completed: false },
      { date: "2026-09-26", dayName: "Sat", completed: false },
    ],
    history_30_days: [],
    consistency_pct: 0,
  },
];

export async function getHabitsAction(): Promise<{ habits: HabitItem[]; error?: string }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { habits: DEFAULT_HABITS };
    }

    const { data: dbHabits, error: habitsError } = await supabase
      .from("habits")
      .select("*")
      .eq("is_archived", false)
      .order("created_at", { ascending: true });

    if (habitsError || !dbHabits || dbHabits.length === 0) {
      return { habits: DEFAULT_HABITS };
    }

    // Get completions for the last 30 days
    const today = new Date();
    const thirtyDaysAgoStr = format(subDays(today, 30), "yyyy-MM-dd");
    const todayStr = format(today, "yyyy-MM-dd");

    const { data: completions } = await supabase
      .from("habit_completions")
      .select("habit_id, completion_date")
      .gte("completion_date", thirtyDaysAgoStr);

    const completionMap = new Map<string, Set<string>>();
    if (completions) {
      completions.forEach((c) => {
        const set = completionMap.get(c.habit_id) || new Set<string>();
        set.add(c.completion_date);
        completionMap.set(c.habit_id, set);
      });
    }

    const categoryColorMap: Record<string, string> = {
      Health: "#10B981",
      Engineering: "#6366F1",
      Study: "#8B5CF6",
      Knowledge: "#8B5CF6",
      Trading: "#F59E0B",
      Personal: "#F43F5E",
    };

    const last7DaysInterval = eachDayOfInterval({
      start: subDays(today, 6),
      end: today,
    });

    const habits: HabitItem[] = dbHabits.map((h) => {
      const datesSet = completionMap.get(h.id) || new Set<string>();
      const isCompletedToday = datesSet.has(todayStr);

      const history_7_days = last7DaysInterval.map((d) => {
        const dStr = format(d, "yyyy-MM-dd");
        return {
          date: dStr,
          dayName: format(d, "EEE"),
          completed: datesSet.has(dStr),
        };
      });

      const history_30_days = Array.from(datesSet);
      const consistency_pct = Math.min(100, Math.round((history_30_days.length / 30) * 100));

      return {
        id: h.id,
        user_id: h.user_id,
        title: h.title,
        description: h.description,
        category_name: "General",
        category_color: categoryColorMap["General"] || "#6366F1",
        frequency: h.frequency,
        target_days_per_week: h.target_days_per_week,
        time_of_day: h.time_of_day,
        current_streak: h.current_streak,
        longest_streak: h.longest_streak,
        xp_per_completion: h.xp_per_completion,
        is_completed_today: isCompletedToday,
        history_7_days,
        history_30_days,
        consistency_pct,
      };
    });

    return { habits };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error fetching habits";
    return { habits: DEFAULT_HABITS, error: message };
  }
}

export async function toggleHabitCompletionAction(
  habitId: string,
  targetDateStr?: string,
  xpValue: number = 15,
  habitTitle: string = "Habit"
): Promise<{ success: boolean; isCompleted: boolean; xpEarned: number; error?: string }> {
  // Server-authoritative XP: ignore client-supplied value
  const safeXp = verifyAndClampXp("habit", xpValue);
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const dateToToggle = targetDateStr || format(new Date(), "yyyy-MM-dd");

    if (user) {
      // Check if completion exists
      const { data: existing } = await supabase
        .from("habit_completions")
        .select("id")
        .eq("habit_id", habitId)
        .eq("completion_date", dateToToggle)
        .eq("user_id", user.id)
        .maybeSingle();

      if (existing) {
        // Remove completion
        await supabase
          .from("habit_completions")
          .delete()
          .eq("id", existing.id);

        revalidatePath("/habits");
        revalidatePath("/today");
        revalidatePath("/overview");

        return { success: true, isCompleted: false, xpEarned: 0 };
      } else {
        // Insert completion
        await supabase.from("habit_completions").insert({
          habit_id: habitId,
          user_id: user.id,
          completion_date: dateToToggle,
          xp_awarded: safeXp,
        });

        // Insert XP event
        await supabase.from("xp_events").insert({
          user_id: user.id,
          source_type: "habit",
          source_id: habitId,
          xp_amount: safeXp,
          description: `Checked in habit: ${habitTitle}`,
        });

        revalidatePath("/habits");
        revalidatePath("/today");
        revalidatePath("/overview");

        return { success: true, isCompleted: true, xpEarned: safeXp };
      }
    }

    // Demo fallback toggle
    return { success: true, isCompleted: true, xpEarned: safeXp };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to toggle habit";
    return { success: false, isCompleted: false, xpEarned: 0, error: message };
  }
}

export async function createHabitAction(
  input: CreateHabitInput
): Promise<{ success: boolean; habit?: HabitItem; error?: string }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // --- INPUT VALIDATION (Zod) ---
    const parsed = CreateHabitSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Invalid habit input",
      };
    }
    const safe = parsed.data;

    // --- RATE LIMITING: 10 habits per minute ---
    if (user) {
      const rl = checkRateLimit("create_habit", user.id, 10, 60_000);
      if (!rl.allowed) {
        return {
          success: false,
          error: `Too many habits created. Try again in ${rl.retryAfterSeconds}s.`,
        };
      }
    }

    const xp = safe.xp_per_completion;

    if (user) {
      const { data, error } = await supabase
        .from("habits")
        .insert({
          user_id: user.id,
          title: safe.title,
          description: safe.description || null,
          frequency: safe.frequency,
          target_days_per_week: safe.target_days_per_week,
          time_of_day: safe.time_of_day,
          xp_per_completion: xp,
          current_streak: 1,
          longest_streak: 1,
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      revalidatePath("/habits");
      revalidatePath("/today");

      const created: HabitItem = {
        id: data.id,
        user_id: data.user_id,
        title: data.title,
        description: data.description,
        category_name: safe.category_name || "General",
        category_color: "#6366F1",
        frequency: data.frequency,
        target_days_per_week: data.target_days_per_week,
        time_of_day: data.time_of_day,
        current_streak: 1,
        longest_streak: 1,
        xp_per_completion: data.xp_per_completion,
        is_completed_today: false,
        history_7_days: Array.from({ length: 7 }).map((_, i) => ({
          date: format(subDays(new Date(), 6 - i), "yyyy-MM-dd"),
          dayName: format(subDays(new Date(), 6 - i), "EEE"),
          completed: false,
        })),
        history_30_days: [],
        consistency_pct: 0,
      };

      return { success: true, habit: created };
    }

    const fallbackHabit: HabitItem = {
      id: "habit-" + Date.now(),
      title: safe.title,
      description: safe.description || null,
      category_name: safe.category_name || "General",
      category_color: "#6366F1",
      frequency: safe.frequency,
      target_days_per_week: safe.target_days_per_week,
      time_of_day: safe.time_of_day,
      current_streak: 1,
      longest_streak: 1,
      xp_per_completion: xp,
      is_completed_today: false,
      history_7_days: Array.from({ length: 7 }).map((_, i) => ({
        date: format(subDays(new Date(), 6 - i), "yyyy-MM-dd"),
        dayName: format(subDays(new Date(), 6 - i), "EEE"),
        completed: false,
      })),
      history_30_days: [],
      consistency_pct: 0,
    };

    return { success: true, habit: fallbackHabit };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create habit";
    return { success: false, error: message };
  }
}
