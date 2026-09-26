// ==============================================================================
// LifeQuest Background Reminder Scheduler
// Phase 10: Automatic interval-based evaluation of routine & task reminders
// ==============================================================================

import { webPush } from "./web-push";
import { RoutineBlock, getActiveBlockState, formatTo12Hour } from "@/lib/routines/routine-utils";
import { TaskItem } from "@/app/actions/tasks";
import { HabitItem } from "@/app/actions/habits";

class ReminderScheduler {
  private intervalId: NodeJS.Timeout | null = null;
  private notifiedKeys = new Set<string>();

  /**
   * Start evaluating reminder triggers every 30 seconds
   */
  public start(
    blocks: RoutineBlock[],
    tasks: TaskItem[],
    habits: HabitItem[],
    currentStreak: number
  ) {
    if (this.intervalId) return;

    // Run initial check
    this.evaluate(blocks, tasks, habits, currentStreak);

    this.intervalId = setInterval(() => {
      this.evaluate(blocks, tasks, habits, currentStreak);
    }, 30000);
  }

  /**
   * Stop background scheduler
   */
  public stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Core rule evaluation loop
   */
  private evaluate(
    blocks: RoutineBlock[],
    tasks: TaskItem[],
    habits: HabitItem[],
    currentStreak: number
  ) {
    if (webPush.getPermissionStatus() !== "granted") return;

    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentDayStr = now.toISOString().split("T")[0];

    // --------------------------------------------------------------------------
    // 1. ROUTINE TRANSITION EVALUATION (5 mins before next block)
    // --------------------------------------------------------------------------
    if (blocks && blocks.length > 0) {
      const activeState = getActiveBlockState(blocks, now);
      if (activeState.nextBlock) {
        const next = activeState.nextBlock;
        const [nextH, nextM] = next.start_time.split(":").map(Number);
        const minutesDiff = nextH * 60 + nextM - (currentHours * 60 + currentMinutes);

        if (minutesDiff > 0 && minutesDiff <= 5) {
          const key = `routine-${next.id}-${currentDayStr}`;
          if (!this.notifiedKeys.has(key)) {
            this.notifiedKeys.add(key);
            webPush.notifyRoutineTransition(
              next.title,
              formatTo12Hour(next.start_time),
              minutesDiff
            );
          }
        }
      }
    }

    // --------------------------------------------------------------------------
    // 2. EVENING STREAK DEFENSE WARNING (After 20:00 PM if incomplete)
    // --------------------------------------------------------------------------
    if (currentHours >= 20 && habits && habits.length > 0) {
      const hasPendingHabits = habits.some((h) => !h.is_completed_today);
      if (hasPendingHabits) {
        const key = `streak-defense-${currentDayStr}`;
        if (!this.notifiedKeys.has(key)) {
          this.notifiedKeys.add(key);
          webPush.notifyStreakWarning(currentStreak);
        }
      }
    }

    // --------------------------------------------------------------------------
    // 3. TASK DUE ALERT (Within 15 minutes)
    // --------------------------------------------------------------------------
    if (tasks && tasks.length > 0) {
      const dueToday = tasks.filter(
        (t) => !t.is_completed && t.due_date === currentDayStr && t.due_time
      );

      for (const t of dueToday) {
        if (!t.due_time) continue;
        const [dueH, dueM] = t.due_time.split(":").map(Number);
        const diff = dueH * 60 + dueM - (currentHours * 60 + currentMinutes);

        if (diff > 0 && diff <= 15) {
          const key = `task-due-${t.id}-${currentDayStr}`;
          if (!this.notifiedKeys.has(key)) {
            this.notifiedKeys.add(key);
            webPush.showNotification({
              title: `⏰ Task Due in ${diff}m: ${t.title}`,
              body: `Scheduled for ${t.due_time}. Jump in and complete your objective (+${t.xp_value} XP).`,
              url: "/tasks",
              tag: `task-${t.id}`,
            });
          }
        }
      }
    }
  }
}

export const reminderScheduler = new ReminderScheduler();
