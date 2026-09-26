/**
 * LifeQuest Local Storage & Offline Persistence Layer
 *
 * Ensures all user progress, quests, habits, expenses, routines, and focus sessions
 * are reliably persisted in the browser even when the user is in Guest/Demo mode,
 * offline, or before the remote Supabase database tables are migrated.
 */

import type { TaskItem } from "@/app/actions/tasks";
import type { HabitItem } from "@/app/actions/habits";
import type { ExpenseItem } from "@/app/actions/expenses";
import type { FocusSessionRecord } from "@/app/actions/focus";
import type { RoutineBlock } from "@/lib/routines/routine-utils";
import { DEFAULT_WEEKDAY_BLOCKS, DEFAULT_WEEKEND_BLOCKS } from "@/lib/routines/routine-utils";

const KEYS = {
  TASKS: "lifequest_tasks_v1",
  HABITS: "lifequest_habits_v1",
  EXPENSES: "lifequest_expenses_v1",
  FOCUS: "lifequest_focus_v1",
  ROUTINES_WEEKDAY: "lifequest_routines_weekday_v1",
  ROUTINES_WEEKEND: "lifequest_routines_weekend_v1",
  STATS: "lifequest_user_stats_v1",
  PROFILE: "lifequest_user_profile_v1",
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
};

const DEFAULT_PROFILE: LocalUserProfile = {
  display_name: "Commander Touhid",
  primary_currency: "BDT",
  theme: "graphite",
  sound_enabled: true,
  particles_enabled: true,
};

function isClient(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function getItem<T>(key: string, defaultValue: T): T {
  if (!isClient()) return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`[LocalStore] Failed to read ${key}:`, err);
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`[LocalStore] Failed to write ${key}:`, err);
  }
}

// ---------------------------------------------------------------------------
// TASKS
// ---------------------------------------------------------------------------

export function getLocalTasks(fallback: TaskItem[] = []): TaskItem[] {
  return getItem<TaskItem[]>(KEYS.TASKS, fallback);
}

export function saveLocalTasks(tasks: TaskItem[]): void {
  setItem(KEYS.TASKS, tasks);
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

export function getLocalHabits(fallback: HabitItem[] = []): HabitItem[] {
  return getItem<HabitItem[]>(KEYS.HABITS, fallback);
}

export function saveLocalHabits(habits: HabitItem[]): void {
  setItem(KEYS.HABITS, habits);
}

export function addLocalHabit(habit: HabitItem): HabitItem[] {
  const current = getLocalHabits();
  const next = [habit, ...current];
  saveLocalHabits(next);
  return next;
}

export function toggleLocalHabit(habitId: string, completedDate: string): HabitItem[] {
  const current = getLocalHabits();
  const next = current.map((h) => {
    if (h.id === habitId) {
      const alreadyLogged = h.history_30_days.includes(completedDate);
      const nextDates = alreadyLogged
        ? h.history_30_days.filter((d) => d !== completedDate)
        : [...h.history_30_days, completedDate];

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
        history_7_days: h.history_7_days.map((item) =>
          item.date === completedDate ? { ...item, completed: !alreadyLogged } : item
        ),
      };
    }
    return h;
  });

  saveLocalHabits(next);
  recordLocalXp(15, "habit");
  return next;
}

// ---------------------------------------------------------------------------
// EXPENSES
// ---------------------------------------------------------------------------

export function getLocalExpenses(fallback: ExpenseItem[] = []): ExpenseItem[] {
  return getItem<ExpenseItem[]>(KEYS.EXPENSES, fallback);
}

export function saveLocalExpenses(expenses: ExpenseItem[]): void {
  setItem(KEYS.EXPENSES, expenses);
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

export function getLocalFocusSessions(fallback: FocusSessionRecord[] = []): FocusSessionRecord[] {
  return getItem<FocusSessionRecord[]>(KEYS.FOCUS, fallback);
}

export function addLocalFocusSession(session: FocusSessionRecord): FocusSessionRecord[] {
  const current = getLocalFocusSessions();
  const next = [session, ...current];
  setItem(KEYS.FOCUS, next);

  const minutes = Math.round(session.duration_seconds / 60);
  recordLocalFocusTime(minutes, session.xp_earned);

  return next;
}

// ---------------------------------------------------------------------------
// ROUTINES
// ---------------------------------------------------------------------------

export function getLocalRoutines(type: "weekday" | "weekend"): RoutineBlock[] {
  const key = type === "weekday" ? KEYS.ROUTINES_WEEKDAY : KEYS.ROUTINES_WEEKEND;
  const fallback = type === "weekday" ? DEFAULT_WEEKDAY_BLOCKS : DEFAULT_WEEKEND_BLOCKS;
  return getItem<RoutineBlock[]>(key, fallback);
}

export function saveLocalRoutines(type: "weekday" | "weekend", blocks: RoutineBlock[]): void {
  const key = type === "weekday" ? KEYS.ROUTINES_WEEKDAY : KEYS.ROUTINES_WEEKEND;
  setItem(key, blocks);
}

export function toggleLocalRoutineBlock(type: "weekday" | "weekend", blockId: string, isCompleted: boolean): RoutineBlock[] {
  const current = getLocalRoutines(type);
  const next = current.map((b) => (b.id === blockId ? { ...b, is_completed: isCompleted } : b));
  saveLocalRoutines(type, next);
  if (isCompleted) {
    recordLocalXp(5, "routine");
  }
  return next;
}

// ---------------------------------------------------------------------------
// USER STATS & LEVELING
// ---------------------------------------------------------------------------

export function getLocalUserStats(): LocalUserStats {
  return getItem<LocalUserStats>(KEYS.STATS, DEFAULT_STATS);
}

export function saveLocalUserStats(stats: LocalUserStats): void {
  setItem(KEYS.STATS, stats);
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
