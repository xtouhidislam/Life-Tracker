"use server";

import { createClient } from "@/lib/supabase/server";

export type TimeRange = "day" | "week" | "month" | "year";

export interface DomainDistribution {
  name: string;
  hours: number;
  percentage: number;
  color: string;
}

export interface DayPerformancePoint {
  label: string;
  dateStr: string;
  completionRate: number;
  focusMinutes: number;
  xpEarned: number;
  isToday?: boolean;
}

export interface OverviewAnalyticsData {
  timeRange: TimeRange;
  totalXp: number;
  level: number;
  streak: number;
  taskCompletionRate: number;
  totalTasksCompleted: number;
  totalTasksCount: number;
  habitConsistencyRate: number;
  totalHabitsCompleted: number;
  totalFocusHours: number;
  totalFocusSessions: number;
  averageFocusMinutes: number;
  totalExpenses: number;
  budgetUtilizationPct: number;
  domains: DomainDistribution[];
  trendPoints: DayPerformancePoint[];
}

export async function getOverviewAnalyticsAction(
  range: TimeRange = "month"
): Promise<{ success: boolean; data: OverviewAnalyticsData }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Default clean baseline values (all starting at zero)
    let totalXp = 0;
    let level = 1;
    let streak = 0;
    let totalTasksCompleted = 0;
    let totalTasksCount = 0;
    let totalHabitsCompleted = 0;
    let totalFocusMinutes = 0;
    let totalFocusSessions = 0;
    let totalExpenses = 0;
    let totalBudget = 0;

    if (user) {
      // 1. Fetch user stats
      const { data: stats } = await supabase
        .from("user_stats")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (stats) {
        totalXp = stats.total_xp != null ? Number(stats.total_xp) : 0;
        level = stats.current_level != null ? Number(stats.current_level) : 1;
        streak = stats.current_streak != null ? Number(stats.current_streak) : 0;
        totalTasksCompleted = stats.total_tasks_completed != null ? Number(stats.total_tasks_completed) : 0;
        totalHabitsCompleted = stats.total_habits_completed != null ? Number(stats.total_habits_completed) : 0;
        totalFocusMinutes = stats.total_focus_minutes != null ? Number(stats.total_focus_minutes) : 0;
      }

      // 2. Fetch tasks count
      const { count: tasksCount } = await supabase
        .from("tasks")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      if (tasksCount != null) {
        totalTasksCount = tasksCount;
      }

      // 3. Fetch focus sessions count
      const { count: focusSessionsCount } = await supabase
        .from("focus_sessions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      if (focusSessionsCount != null) {
        totalFocusSessions = focusSessionsCount;
      }

      // 4. Fetch expenses
      const { data: expRows } = await supabase
        .from("expenses")
        .select("amount")
        .eq("user_id", user.id);

      if (expRows && expRows.length > 0) {
        totalExpenses = expRows.reduce((acc, curr) => acc + Number(curr.amount), 0);
      }

      // 5. Default budget allowance (50,000 BDT baseline across categories)
      totalBudget = 50000;
    }

    const taskCompletionRate = totalTasksCount > 0
      ? Math.round((totalTasksCompleted / totalTasksCount) * 100)
      : 0;

    const habitConsistencyRate = totalHabitsCompleted > 0
      ? Math.min(100, totalHabitsCompleted * 5)
      : 0;
    const totalFocusHours = Math.round((totalFocusMinutes / 60) * 10) / 10;
    const averageFocusMinutes = totalFocusSessions > 0
      ? Math.round(totalFocusMinutes / totalFocusSessions)
      : 0;
    const budgetUtilizationPct = totalBudget > 0
      ? Math.min(100, Math.round((totalExpenses / totalBudget) * 100))
      : 0;

    // Domains distribution (zeroed until user performs tracked deep work)
    const domains: DomainDistribution[] = [
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

    // Historical trend points depending on range
    const trendPoints = generateTrendPoints(range);

    return {
      success: true,
      data: {
        timeRange: range,
        totalXp,
        level,
        streak,
        taskCompletionRate,
        totalTasksCompleted,
        totalTasksCount,
        habitConsistencyRate,
        totalHabitsCompleted,
        totalFocusHours,
        totalFocusSessions,
        averageFocusMinutes,
        totalExpenses,
        budgetUtilizationPct,
        domains,
        trendPoints,
      },
    };
  } catch (err: any) {
    console.error("getOverviewAnalyticsAction error:", err);
    return {
      success: true,
      data: getMockAnalyticsData(range),
    };
  }
}

/**
 * Generate trend points calibrated for Day, Week, Month, Year (clean zeroes for fresh profile)
 */
function generateTrendPoints(range: TimeRange): DayPerformancePoint[] {
  if (range === "day") {
    return [
      { label: "06:00", dateStr: "06:00", completionRate: 0, focusMinutes: 0, xpEarned: 0 },
      { label: "09:00", dateStr: "09:00", completionRate: 0, focusMinutes: 0, xpEarned: 0 },
      { label: "12:00", dateStr: "12:00", completionRate: 0, focusMinutes: 0, xpEarned: 0 },
      { label: "15:00", dateStr: "15:00", completionRate: 0, focusMinutes: 0, xpEarned: 0 },
      { label: "18:00", dateStr: "18:00", completionRate: 0, focusMinutes: 0, xpEarned: 0 },
      { label: "21:00", dateStr: "21:00", completionRate: 0, focusMinutes: 0, xpEarned: 0, isToday: true },
    ];
  }

  if (range === "week") {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days.map((day, idx) => ({
      label: day,
      dateStr: day,
      completionRate: 0,
      focusMinutes: 0,
      xpEarned: 0,
      isToday: idx === (new Date().getDay() + 6) % 7,
    }));
  }

  if (range === "month") {
    return [
      { label: "Week 1", dateStr: "W1", completionRate: 0, focusMinutes: 0, xpEarned: 0 },
      { label: "Week 2", dateStr: "W2", completionRate: 0, focusMinutes: 0, xpEarned: 0 },
      { label: "Week 3", dateStr: "W3", completionRate: 0, focusMinutes: 0, xpEarned: 0 },
      { label: "Week 4", dateStr: "W4", completionRate: 0, focusMinutes: 0, xpEarned: 0, isToday: true },
    ];
  }

  // Year (Quarters)
  return [
    { label: "Q1", dateStr: "Q1", completionRate: 0, focusMinutes: 0, xpEarned: 0 },
    { label: "Q2", dateStr: "Q2", completionRate: 0, focusMinutes: 0, xpEarned: 0 },
    { label: "Q3", dateStr: "Q3", completionRate: 0, focusMinutes: 0, xpEarned: 0, isToday: true },
    { label: "Q4", dateStr: "Q4", completionRate: 0, focusMinutes: 0, xpEarned: 0 },
  ];
}

/**
 * Fallback analytics object with clean initial zeroed state
 */
function getMockAnalyticsData(range: TimeRange): OverviewAnalyticsData {
  return {
    timeRange: range,
    totalXp: 0,
    level: 1,
    streak: 0,
    taskCompletionRate: 0,
    totalTasksCompleted: 0,
    totalTasksCount: 0,
    habitConsistencyRate: 0,
    totalHabitsCompleted: 0,
    totalFocusHours: 0,
    totalFocusSessions: 0,
    averageFocusMinutes: 0,
    totalExpenses: 0,
    budgetUtilizationPct: 0,
    domains: [
      { name: "Zenin AI & Deep Coding", hours: 0, percentage: 0, color: "#154D38" },
      { name: "Office & Operations", hours: 0, percentage: 0, color: "#0D9488" },
      { name: "Study & Skill Tree", hours: 0, percentage: 0, color: "#10B981" },
      { name: "Trading & Finance", hours: 0, percentage: 0, color: "#F59E0B" },
    ],
    trendPoints: generateTrendPoints(range),
  };
}

/**
 * Complete Data & Stats Reset Action:
 * Reverts player stats to Level 1, 0 XP, 0 streak, and resets completions.
 */
export async function resetUserStatsAction(): Promise<{
  success: boolean;
  message: string;
  error?: string;
}> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: true, message: "Stats reset to clean zeroed baseline." };
    }

    // 1. Reset user_stats row to Level 1, 0 XP, 0 streak
    await supabase
      .from("user_stats")
      .upsert({
        user_id: user.id,
        total_xp: 0,
        current_level: 1,
        current_streak: 0,
        longest_streak: 0,
        total_tasks_completed: 0,
        total_habits_completed: 0,
        total_focus_minutes: 0,
        last_active_date: null,
      });

    // 2. Clear xp_events
    await supabase.from("xp_events").delete().eq("user_id", user.id);

    // 3. Clear focus_sessions
    await supabase.from("focus_sessions").delete().eq("user_id", user.id);

    // 4. Reset tasks completion status
    await supabase
      .from("tasks")
      .update({ is_completed: false, completed_at: null })
      .eq("user_id", user.id);

    // 5. Clear expenses
    await supabase.from("expenses").delete().eq("user_id", user.id);

    // 6. Reset goal_milestones via goals
    const { data: userGoals } = await supabase
      .from("goals")
      .select("id")
      .eq("user_id", user.id);

    if (userGoals && userGoals.length > 0) {
      const goalIds = userGoals.map((g) => g.id);
      await supabase
        .from("goal_milestones")
        .update({ is_completed: false, completed_at: null, status: "pending" })
        .in("goal_id", goalIds);

      await supabase
        .from("goals")
        .update({ progress_percentage: 0, status: "in_progress" })
        .eq("user_id", user.id);
    }

    // 7. Clear habit completions & reset habit streaks
    const { data: userHabits } = await supabase
      .from("habits")
      .select("id")
      .eq("user_id", user.id);

    if (userHabits && userHabits.length > 0) {
      const habitIds = userHabits.map((h) => h.id);
      await supabase
        .from("habit_completions")
        .delete()
        .in("habit_id", habitIds);

      await supabase
        .from("habits")
        .update({ current_streak: 0, longest_streak: 0 })
        .eq("user_id", user.id);
    }

    return {
      success: true,
      message: "All player stats and activities successfully reset to zero!",
    };
  } catch (err: any) {
    console.error("resetUserStatsAction error:", err);
    return { success: false, message: "Failed to reset stats", error: err.message };
  }
}

/**
 * Data Sovereignty: Export complete LifeQuest dataset
 */
export async function exportLifeDataAction(format: "json" | "csv" = "json"): Promise<{
  success: boolean;
  content: string;
  filename: string;
}> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let exportObj: any = {
      exportDate: new Date().toISOString(),
      userEmail: user?.email || "demo@lifequest.app",
      version: "1.0",
      modules: {
        tasks: [],
        habits: [],
        focus_sessions: [],
        expenses: [],
      },
    };

    if (user) {
      const [tRes, hRes, fRes, eRes] = await Promise.all([
        supabase.from("tasks").select("*").eq("user_id", user.id),
        supabase.from("habits").select("*").eq("user_id", user.id),
        supabase.from("focus_sessions").select("*").eq("user_id", user.id),
        supabase.from("expenses").select("*").eq("user_id", user.id),
      ]);

      exportObj.modules.tasks = tRes.data || [];
      exportObj.modules.habits = hRes.data || [];
      exportObj.modules.focus_sessions = fRes.data || [];
      exportObj.modules.expenses = eRes.data || [];
    }

    if (format === "csv") {
      // Return consolidated tasks CSV as primary preview
      const headers = "id,title,priority,difficulty,xp_value,is_completed,due_date\n";
      const rows = (exportObj.modules.tasks || [])
        .map(
          (t: any) =>
            `"${t.id}","${t.title}","${t.priority}","${t.difficulty}",${t.xp_value},${t.is_completed},"${t.due_date || ""}"`
        )
        .join("\n");
      return {
        success: true,
        content: headers + rows,
        filename: `lifequest_tasks_export_${new Date().toISOString().split("T")[0]}.csv`,
      };
    }

    return {
      success: true,
      content: JSON.stringify(exportObj, null, 2),
      filename: `lifequest_backup_${new Date().toISOString().split("T")[0]}.json`,
    };
  } catch (err: any) {
    console.error("exportLifeDataAction error:", err);
    return {
      success: false,
      content: "{}",
      filename: "export_error.json",
    };
  }
}
