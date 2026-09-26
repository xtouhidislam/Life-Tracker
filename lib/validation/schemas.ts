/**
 * Centralized Input Validation & Sanitization Layer.
 * Employs Zod schemas to ensure strict typing, bounds checking,
 * and injection defense across all Next.js Server Actions.
 */

import { z } from "zod";

// ==============================================================================
// 1. TASKS SCHEMAS
// ==============================================================================

export const PriorityEnum = z.enum(["low", "medium", "high", "urgent"]);
export const DifficultyEnum = z.enum(["small", "normal", "difficult", "milestone"]);

export const CreateTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Task title is required")
    .max(200, "Task title cannot exceed 200 characters"),
  description: z
    .string()
    .trim()
    .max(2000, "Description cannot exceed 2000 characters")
    .optional()
    .nullable(),
  category_id: z.string().trim().max(100).optional().nullable(),
  category_name: z.string().trim().max(50).optional().nullable(),
  priority: PriorityEnum.default("medium"),
  difficulty: DifficultyEnum.default("normal"),
  due_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Due date must be in YYYY-MM-DD format")
    .optional()
    .nullable(),
  due_time: z
    .string()
    .regex(/^\d{2}:\d{2}(:\d{2})?$/, "Due time must be in HH:MM format")
    .optional()
    .nullable(),
  estimated_duration_minutes: z
    .number()
    .int()
    .positive("Duration must be positive")
    .max(1440, "Duration cannot exceed 24 hours")
    .optional()
    .nullable(),
  is_recurring: z.boolean().default(false),
  recurrence_rule: z.string().trim().max(100).optional().nullable(),
});

// ==============================================================================
// 2. EXPENSES SCHEMAS
// ==============================================================================

export const CreateExpenseSchema = z.object({
  amount: z
    .number()
    .positive("Expense amount must be greater than zero")
    .max(100_000_000, "Amount exceeds realistic transaction limit"),
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(255, "Description cannot exceed 255 characters"),
  category_name: z
    .string()
    .trim()
    .min(1, "Category name is required")
    .max(50, "Category name cannot exceed 50 characters"),
  category_color: z
    .string()
    .trim()
    .max(30)
    .optional()
    .nullable(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .optional()
    .nullable(),
  currency: z
    .string()
    .trim()
    .min(2)
    .max(5)
    .default("BDT"),
});

// ==============================================================================
// 3. HABITS SCHEMAS
// ==============================================================================

export const HabitFrequencyEnum = z.enum(["daily", "weekdays", "weekends", "weekly"]);
export const HabitTimeOfDayEnum = z.enum(["morning", "afternoon", "evening", "anytime"]);

export const CreateHabitSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Habit title is required")
    .max(120, "Habit title cannot exceed 120 characters"),
  description: z
    .string()
    .trim()
    .max(1000, "Description cannot exceed 1000 characters")
    .optional()
    .nullable(),
  category_name: z.string().trim().max(50).optional().nullable(),
  frequency: HabitFrequencyEnum.default("daily"),
  target_days_per_week: z.number().int().min(1).max(7).default(7),
  time_of_day: HabitTimeOfDayEnum.default("anytime"),
  xp_per_completion: z.number().int().min(5).max(30).default(15),
});

// ==============================================================================
// 4. FOCUS SESSIONS SCHEMAS
// ==============================================================================

export const RecordFocusSessionSchema = z.object({
  taskId: z.string().trim().max(100).optional().nullable(),
  durationSeconds: z
    .number()
    .int()
    .min(30, "Focus duration must be at least 30 seconds")
    .max(14400, "Focus duration cannot exceed 4 hours"),
  environmentSound: z.string().trim().max(50).default("forest"),
  notes: z.string().trim().max(1000).optional().nullable(),
  taskTitle: z.string().trim().max(200).default("Deep Work Focus Session"),
});

// ==============================================================================
// 5. GAMIFICATION XP VERIFICATION & BOUNDS CLAMPING
// ==============================================================================

const TASK_DIFFICULTY_XP: Record<string, number> = {
  small: 5,
  normal: 10,
  difficult: 20,
  milestone: 50,
};

/**
 * Server-authoritative XP validator: prevents client parameter spoofing.
 */
export function verifyAndClampXp(
  activity: "task" | "habit" | "routine" | "focus" | "roadmap",
  requestedXp: number,
  meta?: { difficulty?: string; durationSeconds?: number; milestoneTier?: "week" | "month" | "capstone" }
): number {
  switch (activity) {
    case "task": {
      const difficulty = meta?.difficulty || "normal";
      return TASK_DIFFICULTY_XP[difficulty] || 10;
    }
    case "habit": {
      // Habits reward 15 XP
      return Math.min(15, Math.max(5, requestedXp || 15));
    }
    case "routine": {
      // Routine blocks reward 5 XP (or 10 for full completion bonus)
      return Math.min(10, Math.max(5, requestedXp || 5));
    }
    case "focus": {
      const sec = meta?.durationSeconds || 1500;
      // +10 XP per 25 min (1500s), capped at 100 XP per session max
      const computed = Math.floor(sec / 1500) * 10;
      return Math.min(100, Math.max(10, computed));
    }
    case "roadmap": {
      const tier = meta?.milestoneTier || "month";
      if (tier === "week") return 25;
      if (tier === "capstone") return 250;
      return 100;
    }
    default:
      return 10;
  }
}
