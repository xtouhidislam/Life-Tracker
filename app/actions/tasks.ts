"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { CreateTaskSchema, verifyAndClampXp } from "@/lib/validation/schemas";
import { checkRateLimit } from "@/lib/security/rate-limiter";

export interface TaskItem {
  id: string;
  user_id?: string;
  category_id?: string | null;
  category_name?: string;
  category_color?: string;
  title: string;
  description?: string | null;
  priority: "low" | "medium" | "high" | "urgent";
  difficulty: "small" | "normal" | "difficult" | "milestone";
  xp_value: number;
  due_date?: string | null;
  due_time?: string | null;
  estimated_duration_minutes?: number | null;
  is_recurring?: boolean;
  recurrence_rule?: string | null;
  parent_goal_id?: string | null;
  is_completed: boolean;
  completed_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  category_id?: string;
  category_name?: string;
  priority: "low" | "medium" | "high" | "urgent";
  difficulty: "small" | "normal" | "difficult" | "milestone";
  due_date?: string;
  due_time?: string;
  estimated_duration_minutes?: number;
  is_recurring?: boolean;
  recurrence_rule?: string;
}

const DEFAULT_INITIAL_TASKS: Omit<TaskItem, "user_id">[] = [
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
    is_completed: true,
    completed_at: new Date().toISOString(),
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
    is_completed: true,
    completed_at: new Date().toISOString(),
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

export async function getTasksAction(): Promise<{ tasks: TaskItem[]; error?: string }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { tasks: DEFAULT_INITIAL_TASKS as TaskItem[] };
    }

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return { tasks: DEFAULT_INITIAL_TASKS as TaskItem[] };
    }

    const tasks: TaskItem[] = data.map((t) => ({
      id: t.id,
      user_id: t.user_id,
      category_id: t.category_id,
      title: t.title,
      description: t.description,
      priority: t.priority,
      difficulty: t.difficulty,
      xp_value: t.xp_value,
      due_date: t.due_date,
      due_time: t.due_time,
      estimated_duration_minutes: t.estimated_duration_minutes,
      is_recurring: t.is_recurring,
      recurrence_rule: t.recurrence_rule,
      parent_goal_id: t.parent_goal_id,
      is_completed: t.is_completed,
      completed_at: t.completed_at,
      created_at: t.created_at,
      updated_at: t.updated_at,
    }));

    return { tasks };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error fetching tasks";
    return { tasks: DEFAULT_INITIAL_TASKS as TaskItem[], error: message };
  }
}

export async function createTaskAction(
  input: CreateTaskInput
): Promise<{ success: boolean; task?: TaskItem; error?: string }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // --- INPUT VALIDATION (Zod) ---
    const parsed = CreateTaskSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Invalid task input",
      };
    }
    const safe = parsed.data;

    // --- SERVER-AUTHORITATIVE XP ---
    const xp_value = verifyAndClampXp("task", 0, { difficulty: safe.difficulty });

    // --- RATE LIMITING (authenticated users only): 10 per minute ---
    if (user) {
      const rl = checkRateLimit("create_task", user.id, 10, 60_000);
      if (!rl.allowed) {
        return {
          success: false,
          error: `Too many tasks created. Try again in ${rl.retryAfterSeconds}s.`,
        };
      }
    }

    const newTaskData = {
      title: safe.title,
      description: safe.description || null,
      category_id: safe.category_id || null,
      priority: safe.priority,
      difficulty: safe.difficulty,
      xp_value,
      due_date: safe.due_date || null,
      due_time: safe.due_time || null,
      estimated_duration_minutes: safe.estimated_duration_minutes || null,
      is_recurring: safe.is_recurring,
      recurrence_rule: safe.recurrence_rule || null,
      is_completed: false,
    };

    if (user) {
      const { data, error } = await supabase
        .from("tasks")
        .insert({
          ...newTaskData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      revalidatePath("/tasks");
      revalidatePath("/today");
      revalidatePath("/calendar");

      return { success: true, task: data as TaskItem };
    }

    // Fallback item for demo mode
    const fallbackTask: TaskItem = {
      id: "task-" + Date.now(),
      ...newTaskData,
      category_name: safe.category_name || "General",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return { success: true, task: fallbackTask };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create task";
    return { success: false, error: message };
  }
}

export async function toggleTaskCompletionAction(
  taskId: string,
  currentStatus: boolean,
  xpValue: number = 10,
  taskTitle: string = "Task"
): Promise<{ success: boolean; isCompleted: boolean; xpEarned: number; error?: string }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const nextStatus = !currentStatus;
    const completedAt = nextStatus ? new Date().toISOString() : null;

    if (user) {
      // Update task record
      const { error: taskError } = await supabase
        .from("tasks")
        .update({
          is_completed: nextStatus,
          completed_at: completedAt,
        })
        .eq("id", taskId)
        .eq("user_id", user.id);

      if (taskError) {
        return { success: false, isCompleted: currentStatus, xpEarned: 0, error: taskError.message };
      }

      // If completing, insert into task_completions and xp_events
      if (nextStatus) {
        await Promise.allSettled([
          supabase.from("task_completions").insert({
            task_id: taskId,
            user_id: user.id,
            xp_awarded: xpValue,
          }),
          supabase.from("xp_events").insert({
            user_id: user.id,
            source_type: "task",
            source_id: taskId,
            xp_amount: xpValue,
            description: `Completed task: ${taskTitle}`,
          }),
        ]);
      }

      revalidatePath("/tasks");
      revalidatePath("/today");
      revalidatePath("/calendar");
    }

    return {
      success: true,
      isCompleted: nextStatus,
      xpEarned: nextStatus ? xpValue : 0,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to toggle task";
    return { success: false, isCompleted: currentStatus, xpEarned: 0, error: message };
  }
}

export async function deleteTaskAction(
  taskId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", taskId)
        .eq("user_id", user.id);

      if (error) {
        return { success: false, error: error.message };
      }

      revalidatePath("/tasks");
      revalidatePath("/today");
      revalidatePath("/calendar");
    }

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete task";
    return { success: false, error: message };
  }
}
