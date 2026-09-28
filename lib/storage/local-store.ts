/**
 * LifeQuest Local Storage & Offline Persistence Layer
 *
 * Ensures all user progress, quests, habits, expenses, routines, and focus sessions
 * are reliably persisted in the browser and NEVER overwritten by unauthenticated
 * server fallbacks or page navigations.
 */

import type { TaskItem } from "@/app/actions/tasks";
import type { HabitItem } from "@/app/actions/habits";
import type { ExpenseItem } from "@/app/actions/expenses";
import type { FocusSessionRecord } from "@/app/actions/focus";
import type { RoutineBlock } from "@/lib/routines/routine-utils";
import { DEFAULT_WEEKDAY_BLOCKS, DEFAULT_WEEKEND_BLOCKS } from "@/lib/routines/routine-utils";
import type { ForestTreeRecord } from "@/lib/focus/forest-data";
import { DEFAULT_ISLAND_TREES } from "@/lib/focus/forest-data";

const KEYS = {
  TASKS: "lifequest_tasks_v2",
  HABITS: "lifequest_habits_v2",
  EXPENSES: "lifequest_expenses_v2",
  FOCUS: "lifequest_focus_v2",
  FOREST: "lifequest_forest_trees_v2",
  ROUTINES_WEEKDAY: "lifequest_routines_weekday_v2",
  ROUTINES_WEEKEND: "lifequest_routines_weekend_v2",
  STATS: "lifequest_user_stats_v2",
  PROFILE: "lifequest_user_profile_v2",
  GUEST_MODE: "lifequest_guest_mode",
};

export interface LocalUserStats {
  total_xp: number;
  current_level: number;
  current_streak: number;
  longest_streak: number;
  total_tasks_completed: number;
  total_habits_completed: number;
  total_focus_minutes: number;
  total_workout_sessions: number;
  total_completed_projects: number;
  last_active_date?: string;
}

export interface LocalUserProfile {
  display_name: string;
  primary_currency: string;
  theme: string;
  sound_enabled: boolean;
  particles_enabled: boolean;
}

const DEFAULT_STATS: LocalUserStats = {
  total_xp: 0,
  current_level: 1,
  current_streak: 0,
  longest_streak: 0,
  total_tasks_completed: 0,
  total_habits_completed: 0,
  total_focus_minutes: 0,
  total_workout_sessions: 0,
  total_completed_projects: 0,
};

const DEFAULT_PROFILE: LocalUserProfile = {
  display_name: "Commander Touhid",
  primary_currency: "BDT",
  theme: "graphite",
  sound_enabled: true,
  particles_enabled: true,
};

const INITIAL_TASKS: TaskItem[] = [
  {
    id: "init-task-1",
    title: "Implement FastAPI support ticket CRUD routes",
    category_name: "Zenin AI",
    category_color: "#6366F1",
    priority: "high",
    difficulty: "difficult",
    xp_value: 20,
    due_date: new Date().toISOString().split("T")[0],
    due_time: "11:00",
    estimated_duration_minutes: 90,
    is_recurring: false,
    is_completed: false,
    completed_at: null,
  },
  {
    id: "init-task-2",
    title: "Write Pydantic schema validation for ticket creation",
    category_name: "Zenin AI",
    category_color: "#6366F1",
    priority: "high",
    difficulty: "normal",
    xp_value: 10,
    due_date: new Date().toISOString().split("T")[0],
    due_time: "14:00",
    estimated_duration_minutes: 45,
    is_recurring: false,
    is_completed: false,
    completed_at: null,
  },
  {
    id: "init-task-3",
    title: "Read PostgreSQL indexing & transaction isolation docs",
    category_name: "Engineering",
    category_color: "#06B6D4",
    priority: "medium",
    difficulty: "normal",
    xp_value: 10,
    due_date: new Date().toISOString().split("T")[0],
    due_time: "20:00",
    estimated_duration_minutes: 60,
    is_recurring: false,
    is_completed: false,
  },
  {
    id: "init-task-4",
    title: "Conduct daily Forex / Crypto session review",
    category_name: "Trading",
    category_color: "#F59E0B",
    priority: "medium",
    difficulty: "normal",
    xp_value: 10,
    due_date: new Date().toISOString().split("T")[0],
    due_time: "22:30",
    estimated_duration_minutes: 30,
    is_recurring: true,
    recurrence_rule: "daily",
    is_completed: false,
  },
  {
    id: "init-task-5",
    title: "Setup Docker container for FastAPI & PostgreSQL service",
    category_name: "Zenin AI",
    category_color: "#6366F1",
    priority: "urgent",
    difficulty: "difficult",
    xp_value: 20,
    due_date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    due_time: "09:00",
    estimated_duration_minutes: 120,
    is_recurring: false,
    is_completed: false,
  },
  {
    id: "init-task-6",
    title: "Organize expense receipts and update monthly budget",
    category_name: "Personal",
    category_color: "#10B981",
    priority: "low",
    difficulty: "small",
    xp_value: 5,
    due_date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    due_time: "18:00",
    estimated_duration_minutes: 20,
    is_recurring: false,
    is_completed: false,
  },
];

const INITIAL_HABITS: HabitItem[] = [
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
    history_7_days: [],
    history_30_days: [],
    consistency_pct: 0,
  },
  {
    id: "habit-2",
    title: "Deep Work Coding Sprint (50 mins)",
    description: "High-leverage engineering block with zero notifications or browser tabs",
    category_name: "Engineering",
    category_color: "#154D38",
    frequency: "weekdays",
    target_days_per_week: 5,
    time_of_day: "morning",
    current_streak: 0,
    longest_streak: 0,
    xp_per_completion: 20,
    is_completed_today: false,
    history_7_days: [],
    history_30_days: [],
    consistency_pct: 0,
  },
  {
    id: "habit-3",
    title: "Technical Reading & Architecture Study",
    description: "Study PostgreSQL architecture, vector databases, and system design docs",
    category_name: "Knowledge",
    category_color: "#6366F1",
    frequency: "daily",
    target_days_per_week: 7,
    time_of_day: "afternoon",
    current_streak: 0,
    longest_streak: 0,
    xp_per_completion: 15,
    is_completed_today: false,
    history_7_days: [],
    history_30_days: [],
    consistency_pct: 0,
  },
  {
    id: "habit-4",
    title: "Daily Financial Tracking & Currency Balance",
    description: "Audit all transactions in BDT, calculate burn rate and expense categories",
    category_name: "Trading",
    category_color: "#F59E0B",
    frequency: "daily",
    target_days_per_week: 7,
    time_of_day: "evening",
    current_streak: 0,
    longest_streak: 0,
    xp_per_completion: 10,
    is_completed_today: false,
    history_7_days: [],
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
    history_7_days: [],
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
    history_7_days: [],
    history_30_days: [],
    consistency_pct: 0,
  },
];

function isClient(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

// ---------------------------------------------------------------------------
// TASKS
// ---------------------------------------------------------------------------

export function getLocalTasks(): TaskItem[] {
  if (!isClient()) return INITIAL_TASKS;
  const raw = localStorage.getItem(KEYS.TASKS);
  if (raw === null) {
    localStorage.setItem(KEYS.TASKS, JSON.stringify(INITIAL_TASKS));
    return INITIAL_TASKS;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_TASKS;
  }
}

export function saveLocalTasks(tasks: TaskItem[]): void {
  if (!isClient()) return;
  localStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));
}

export function addLocalTask(task: TaskItem): TaskItem[] {
  const current = getLocalTasks();
  const next = [task, ...current];
  saveLocalTasks(next);
  return next;
}

export function toggleLocalTask(taskId: string, isCompleted: boolean, xpValue: number = 10): TaskItem[] {
  const current = getLocalTasks();
  const next = current.map((t) => {
    if (t.id === taskId) {
      return {
        ...t,
        is_completed: isCompleted,
        completed_at: isCompleted ? new Date().toISOString() : null,
      };
    }
    return t;
  });
  saveLocalTasks(next);

  if (isCompleted) {
    recordLocalXp(xpValue, "task");
  } else {
    deductLocalXp(xpValue, "task");
  }

  return next;
}

export function deleteLocalTask(taskId: string): TaskItem[] {
  const current = getLocalTasks();
  const next = current.filter((t) => t.id !== taskId);
  saveLocalTasks(next);
  return next;
}

// ---------------------------------------------------------------------------
// HABITS
// ---------------------------------------------------------------------------

export function getLocalHabits(): HabitItem[] {
  if (!isClient()) return INITIAL_HABITS;
  const raw = localStorage.getItem(KEYS.HABITS);
  if (raw === null) {
    localStorage.setItem(KEYS.HABITS, JSON.stringify(INITIAL_HABITS));
    return INITIAL_HABITS;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_HABITS;
  }
}

export function saveLocalHabits(habits: HabitItem[]): void {
  if (!isClient()) return;
  localStorage.setItem(KEYS.HABITS, JSON.stringify(habits));
}

export function addLocalHabit(habit: HabitItem): HabitItem[] {
  const current = getLocalHabits();
  const next = [habit, ...current];
  saveLocalHabits(next);
  return next;
}

export function toggleLocalHabit(habitId: string, completedDate: string): HabitItem[] {
  const current = getLocalHabits();
  let isCheckingIn = false;
  let habitXp = 15;

  const next = current.map((h) => {
    if (h.id === habitId) {
      habitXp = h.xp_per_completion || 15;
      const dates = Array.isArray(h.history_30_days) ? h.history_30_days : [];
      const alreadyLogged = dates.includes(completedDate);
      isCheckingIn = !alreadyLogged;
      const nextDates = alreadyLogged
        ? dates.filter((d) => d !== completedDate)
        : [...dates, completedDate];

      const todayStr = new Date().toISOString().split("T")[0];
      const isCompletedToday = nextDates.includes(todayStr);

      const streakChange = !alreadyLogged ? 1 : Math.max(0, h.current_streak - 1);
      const newStreak = !alreadyLogged ? h.current_streak + 1 : streakChange;

      return {
        ...h,
        is_completed_today: isCompletedToday,
        history_30_days: nextDates,
        current_streak: newStreak,
        longest_streak: Math.max(h.longest_streak, newStreak),
        history_7_days: (h.history_7_days || []).map((item) =>
          item.date === completedDate ? { ...item, completed: !alreadyLogged } : item
        ),
      };
    }
    return h;
  });

  saveLocalHabits(next);
  if (isCheckingIn) {
    recordLocalXp(habitXp, "habit");
  } else {
    deductLocalXp(habitXp, "habit");
  }
  return next;
}

// ---------------------------------------------------------------------------
// EXPENSES
// ---------------------------------------------------------------------------

export function getLocalExpenses(): ExpenseItem[] {
  if (!isClient()) return [];
  const raw = localStorage.getItem(KEYS.EXPENSES);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveLocalExpenses(expenses: ExpenseItem[]): void {
  if (!isClient()) return;
  localStorage.setItem(KEYS.EXPENSES, JSON.stringify(expenses));
}

export function addLocalExpense(expense: ExpenseItem): ExpenseItem[] {
  const current = getLocalExpenses();
  const next = [expense, ...current];
  saveLocalExpenses(next);
  return next;
}

export function deleteLocalExpense(expenseId: string): ExpenseItem[] {
  const current = getLocalExpenses();
  const next = current.filter((e) => e.id !== expenseId);
  saveLocalExpenses(next);
  return next;
}

// ---------------------------------------------------------------------------
// FOCUS SESSIONS
// ---------------------------------------------------------------------------

export function getLocalFocusSessions(): FocusSessionRecord[] {
  if (!isClient()) return [];
  const raw = localStorage.getItem(KEYS.FOCUS);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function addLocalFocusSession(session: FocusSessionRecord): FocusSessionRecord[] {
  const current = getLocalFocusSessions();
  const next = [session, ...current];
  if (isClient()) {
    localStorage.setItem(KEYS.FOCUS, JSON.stringify(next));
  }

  const minutes = Math.round(session.duration_seconds / 60);
  recordLocalFocusTime(minutes, session.xp_earned);

  return next;
}

// ---------------------------------------------------------------------------
// FOREST TREES & ISOMETRIC GARDEN
// ---------------------------------------------------------------------------

export function getLocalForestTrees(): ForestTreeRecord[] {
  if (!isClient()) return DEFAULT_ISLAND_TREES;
  const raw = localStorage.getItem(KEYS.FOREST);
  if (!raw) {
    localStorage.setItem(KEYS.FOREST, JSON.stringify(DEFAULT_ISLAND_TREES));
    return DEFAULT_ISLAND_TREES;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return DEFAULT_ISLAND_TREES;
  }
}

export function saveLocalForestTrees(trees: ForestTreeRecord[]): void {
  if (!isClient()) return;
  localStorage.setItem(KEYS.FOREST, JSON.stringify(trees));
}

export function addLocalForestTree(tree: ForestTreeRecord): ForestTreeRecord[] {
  const current = getLocalForestTrees();
  const next = [tree, ...current];
  saveLocalForestTrees(next);
  return next;
}


// ---------------------------------------------------------------------------
// ROUTINES
// ---------------------------------------------------------------------------

export function getLocalRoutines(type: "weekday" | "weekend"): RoutineBlock[] {
  const key = type === "weekday" ? KEYS.ROUTINES_WEEKDAY : KEYS.ROUTINES_WEEKEND;
  const fallback = type === "weekday" ? DEFAULT_WEEKDAY_BLOCKS : DEFAULT_WEEKEND_BLOCKS;
  if (!isClient()) return fallback;
  const raw = localStorage.getItem(key);
  if (raw === null) {
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function saveLocalRoutines(type: "weekday" | "weekend", blocks: RoutineBlock[]): void {
  const key = type === "weekday" ? KEYS.ROUTINES_WEEKDAY : KEYS.ROUTINES_WEEKEND;
  if (!isClient()) return;
  localStorage.setItem(key, JSON.stringify(blocks));
}

export function toggleLocalRoutineBlock(type: "weekday" | "weekend", blockId: string, isCompleted: boolean): RoutineBlock[] {
  const current = getLocalRoutines(type);
  const next = current.map((b) => (b.id === blockId ? { ...b, is_completed: isCompleted } : b));
  saveLocalRoutines(type, next);
  if (isCompleted) {
    recordLocalXp(5, "routine");
  } else {
    deductLocalXp(5, "routine");
  }
  return next;
}

export function updateLocalRoutineBlock(
  type: "weekday" | "weekend",
  updatedBlock: RoutineBlock
): RoutineBlock[] {
  const current = getLocalRoutines(type);
  const next = current.map((b) => (b.id === updatedBlock.id ? updatedBlock : b));
  saveLocalRoutines(type, next);
  return next;
}

export function addLocalRoutineBlock(
  type: "weekday" | "weekend",
  newBlock: RoutineBlock
): RoutineBlock[] {
  const current = getLocalRoutines(type);
  const blockWithNum: RoutineBlock = {
    ...newBlock,
    num: current.length + 1,
  };
  const next = [...current, blockWithNum];
  saveLocalRoutines(type, next);
  return next;
}

export function deleteLocalRoutineBlock(
  type: "weekday" | "weekend",
  blockId: string
): RoutineBlock[] {
  const current = getLocalRoutines(type);
  const next = current
    .filter((b) => b.id !== blockId)
    .map((b, idx) => ({
      ...b,
      num: idx + 1,
    }));
  saveLocalRoutines(type, next);
  return next;
}

export function resetLocalRoutines(type: "weekday" | "weekend"): RoutineBlock[] {
  const defaults = type === "weekday" ? DEFAULT_WEEKDAY_BLOCKS : DEFAULT_WEEKEND_BLOCKS;
  saveLocalRoutines(type, defaults);
  return defaults;
}


// ---------------------------------------------------------------------------
// USER STATS & LEVELING
// ---------------------------------------------------------------------------

export function getLocalUserStats(): LocalUserStats {
  if (!isClient()) return DEFAULT_STATS;
  const raw = localStorage.getItem(KEYS.STATS);
  if (raw === null) {
    localStorage.setItem(KEYS.STATS, JSON.stringify(DEFAULT_STATS));
    return DEFAULT_STATS;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return DEFAULT_STATS;
  }
}

export function saveLocalUserStats(stats: LocalUserStats): void {
  if (!isClient()) return;
  localStorage.setItem(KEYS.STATS, JSON.stringify(stats));
}

export function recordLocalXp(amount: number, type: "task" | "habit" | "focus" | "routine"): LocalUserStats {
  const stats = getLocalUserStats();
  const nextXp = (stats.total_xp || 0) + amount;
  const nextLevel = Math.max(1, Math.floor(Math.sqrt(nextXp / 50)) + 1);

  const updated: LocalUserStats = {
    ...stats,
    total_xp: nextXp,
    current_level: nextLevel,
    total_tasks_completed: type === "task" ? stats.total_tasks_completed + 1 : stats.total_tasks_completed,
    total_habits_completed: type === "habit" ? stats.total_habits_completed + 1 : stats.total_habits_completed,
    last_active_date: new Date().toISOString().split("T")[0],
  };

  saveLocalUserStats(updated);
  return updated;
}

export function deductLocalXp(amount: number, type: "task" | "habit" | "focus" | "routine"): LocalUserStats {
  const stats = getLocalUserStats();
  const nextXp = Math.max(0, (stats.total_xp || 0) - amount);
  const nextLevel = Math.max(1, Math.floor(Math.sqrt(nextXp / 50)) + 1);

  const updated: LocalUserStats = {
    ...stats,
    total_xp: nextXp,
    current_level: nextLevel,
    total_tasks_completed: type === "task" ? Math.max(0, stats.total_tasks_completed - 1) : stats.total_tasks_completed,
    total_habits_completed: type === "habit" ? Math.max(0, stats.total_habits_completed - 1) : stats.total_habits_completed,
  };

  saveLocalUserStats(updated);
  return updated;
}

export function recordLocalFocusTime(minutes: number, xp: number): LocalUserStats {
  const stats = getLocalUserStats();
  const nextXp = (stats.total_xp || 0) + xp;
  const nextLevel = Math.max(1, Math.floor(Math.sqrt(nextXp / 50)) + 1);

  const updated: LocalUserStats = {
    ...stats,
    total_xp: nextXp,
    current_level: nextLevel,
    total_focus_minutes: stats.total_focus_minutes + minutes,
    last_active_date: new Date().toISOString().split("T")[0],
  };

  saveLocalUserStats(updated);
  return updated;
}

export function recordLocalWorkoutSession(count: number = 1): LocalUserStats {
  const stats = getLocalUserStats();
  const current = stats.total_workout_sessions || 0;
  const updated: LocalUserStats = {
    ...stats,
    total_workout_sessions: Math.max(0, current + count),
    last_active_date: new Date().toISOString().split("T")[0],
  };
  saveLocalUserStats(updated);
  return updated;
}

export function recordLocalCompletedProject(count: number = 1): LocalUserStats {
  const stats = getLocalUserStats();
  const current = stats.total_completed_projects || 0;
  const updated: LocalUserStats = {
    ...stats,
    total_completed_projects: Math.max(0, current + count),
    last_active_date: new Date().toISOString().split("T")[0],
  };
  saveLocalUserStats(updated);
  return updated;
}

export function getLocalUserProfile(): LocalUserProfile {
  if (!isClient()) return DEFAULT_PROFILE;
  const raw = localStorage.getItem(KEYS.PROFILE);
  if (!raw) return DEFAULT_PROFILE;
  try {
    return JSON.parse(raw);
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function resetAllLocalData(): void {
  if (!isClient()) return;
  localStorage.removeItem(KEYS.TASKS);
  localStorage.removeItem(KEYS.HABITS);
  localStorage.removeItem(KEYS.EXPENSES);
  localStorage.removeItem(KEYS.FOCUS);
  localStorage.removeItem(KEYS.ROUTINES_WEEKDAY);
  localStorage.removeItem(KEYS.ROUTINES_WEEKEND);
  localStorage.removeItem(KEYS.STATS);
  localStorage.removeItem(KEYS.PROFILE);
}

// ---------------------------------------------------------------------------
// GUEST MODE SESSION HELPER
// ---------------------------------------------------------------------------

export function isGuestModeActive(): boolean {
  if (!isClient()) return false;
  return localStorage.getItem(KEYS.GUEST_MODE) === "true";
}

export function setGuestMode(active: boolean): void {
  if (!isClient()) return;
  if (active) {
    localStorage.setItem(KEYS.GUEST_MODE, "true");
    document.cookie = "lifequest_guest=true; path=/; max-age=2592000; SameSite=Lax";
  } else {
    localStorage.removeItem(KEYS.GUEST_MODE);
    document.cookie = "lifequest_guest=; path=/; max-age=0; SameSite=Lax";
  }
}
