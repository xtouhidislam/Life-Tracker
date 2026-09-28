"use client";

import React, { useState, useEffect, useMemo, useTransition } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckSquare,
  Clock,
  Sparkles,
  Wallet,
  CheckCircle2,
  Plus,
  Play,
  ArrowRight,
  TrendingUp,
  Target,
  Dumbbell,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { getTasksAction, toggleTaskCompletionAction, type TaskItem } from "@/app/actions/tasks";
import { getHabitsAction, type HabitItem } from "@/app/actions/habits";
import { getRoutinesAction } from "@/app/actions/routines";
import { getExpensesAction, type ExpenseSummary } from "@/app/actions/expenses";
import {
  type RoutineBlock,
  getActiveBlockState,
  formatTo12Hour,
  DEFAULT_WEEKDAY_BLOCKS,
  DEFAULT_WEEKEND_BLOCKS,
} from "@/lib/routines/routine-utils";
import { CreateTaskModal } from "@/components/tasks/CreateTaskModal";
import { XPToast } from "@/components/tasks/XPToast";
import Link from "next/link";
import {
  getLocalTasks,
  saveLocalTasks,
  addLocalTask,
  toggleLocalTask,
  getLocalHabits,
  saveLocalHabits,
  getLocalRoutines,
  saveLocalRoutines,
  getLocalExpenses,
  getLocalUserStats,
  recordLocalWorkoutSession,
} from "@/lib/storage/local-store";
import { DashboardKPIs } from "@/components/dashboard/DashboardKPIs";
import { OverallScoreCard } from "@/components/dashboard/OverallScoreCard";
import { WeeklyAnalyticsCard } from "@/components/dashboard/WeeklyAnalyticsCard";
import { WEEKLY_SCHEDULE } from "@/lib/exercises/calisthenics-data";

export default function TodayPage() {
  const { user, profile, stats, refreshProfile } = useAuth();
  const [tasks, setTasks] = useState<TaskItem[]>(() => getLocalTasks());
  const [habits, setHabits] = useState<HabitItem[]>(() => getLocalHabits());
  const [routineBlocks, setRoutineBlocks] = useState<RoutineBlock[]>(() => {
    const routineType =
      typeof window !== "undefined" &&
      (new Date().getDay() === 0 || new Date().getDay() === 6)
        ? "weekend"
        : "weekday";
    return getLocalRoutines(routineType);
  });
  const [expenseSummary, setExpenseSummary] = useState<ExpenseSummary | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showXpToast, setShowXpToast] = useState(false);
  const [lastEarnedXp, setLastEarnedXp] = useState(10);
  const [, startTransition] = useTransition();

  const isWeekend = useMemo(() => {
    const d = new Date().getDay();
    return d === 0 || d === 6;
  }, []);

  const todayWorkoutSchedule = useMemo(() => {
    const d = new Date().getDay();
    return WEEKLY_SCHEDULE.find((item) => item.dayIndex === d) || WEEKLY_SCHEDULE[1];
  }, []);

  const [localStats, setLocalStats] = useState(() => getLocalUserStats());

  useEffect(() => {
    const routineType =
      new Date().getDay() === 0 || new Date().getDay() === 6 ? "weekend" : "weekday";

    // Refresh state from local store on mount / route transition
    setTasks(getLocalTasks());
    setHabits(getLocalHabits());
    setRoutineBlocks(getLocalRoutines(routineType));
    setLocalStats(getLocalUserStats());

    // If unauthenticated / guest, local storage is authoritative
    if (!user) {
      return;
    }

    // Authenticated cloud sync
    async function load() {
      try {
        const [tasksRes, habitsRes, routinesRes, expensesRes] = await Promise.all([
          getTasksAction(),
          getHabitsAction(),
          getRoutinesAction(routineType),
          getExpensesAction("this_month"),
        ]);

        if (tasksRes.tasks && tasksRes.tasks.length > 0) {
          setTasks(tasksRes.tasks);
          saveLocalTasks(tasksRes.tasks);
        }

        if (habitsRes.habits && habitsRes.habits.length > 0) {
          setHabits(habitsRes.habits);
          saveLocalHabits(habitsRes.habits);
        }

        if (routinesRes.blocks && routinesRes.blocks.length > 0) {
          setRoutineBlocks(routinesRes.blocks);
          saveLocalRoutines(routineType, routinesRes.blocks);
        }

        if (expensesRes.summary) {
          setExpenseSummary(expensesRes.summary);
        }
      } catch (err) {
        console.warn("Background cloud sync fallback to local storage:", err);
      }
    }
    load();
  }, [user]);

  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

  // Filter tasks due today or pending
  const todayTasks = useMemo(() => {
    const list = tasks.filter((t) => !t.due_date || t.due_date <= todayStr);
    return list.slice(0, 6);
  }, [tasks, todayStr]);

  // Metric 1: Total Completed Tasks
  const completedTasksCount = useMemo(() => {
    return tasks.filter((t) => t.is_completed).length;
  }, [tasks]);

  // Metric 2: Remaining Daily Task
  const remainingDailyTasksCount = useMemo(() => {
    return todayTasks.filter((t) => !t.is_completed).length;
  }, [todayTasks]);

  // Metric 3: Total Completed Projects
  const totalCompletedProjects = useMemo(() => {
    return (
      localStats.total_completed_projects ||
      tasks.filter(
        (t) =>
          t.is_completed &&
          (t.difficulty === "difficult" ||
            t.category_name?.toLowerCase().includes("zenin") ||
            t.category_name?.toLowerCase().includes("project"))
      ).length ||
      3
    );
  }, [localStats.total_completed_projects, tasks]);

  // Metric 4: Total Focused Hours
  const totalFocusedHours = useMemo(() => {
    const mins = localStats.total_focus_minutes || 0;
    return (mins / 60).toFixed(1);
  }, [localStats.total_focus_minutes]);

  // Metric 5: Total Workout Sessions
  const totalWorkoutSessions = useMemo(() => {
    return (
      localStats.total_workout_sessions ||
      habits.find((h) => h.category_name === "Health")?.history_30_days?.length ||
      6
    );
  }, [localStats.total_workout_sessions, habits]);

  // Metric 6: Total Money Spent This Month
  const totalSpent = useMemo(() => {
    if (expenseSummary?.total_spent != null) return expenseSummary.total_spent;
    const local = getLocalExpenses();
    return local.reduce((acc, curr) => acc + curr.amount, 0);
  }, [expenseSummary]);

  // Metric 7: Remaining Balance This Month
  const remainingBalance = useMemo(() => {
    if (expenseSummary?.remaining_allowance != null) return expenseSummary.remaining_allowance;
    return Math.max(0, 50000 - totalSpent);
  }, [expenseSummary, totalSpent]);

  // Metric 8 & 9: Overall Score (Monthly + Daily)
  const totalActions = tasks.length + habits.length;
  const completedHabitsCount = habits.filter((h) => h.is_completed_today).length;
  const completedActions = completedTasksCount + completedHabitsCount;
  const dailyScore = totalActions > 0 ? Math.round((completedActions / totalActions) * 100) : 0;

  const habitConsistencyPct = useMemo(() => {
    return habits.length > 0 ? Math.round((completedHabitsCount / habits.length) * 100) : 0;
  }, [habits, completedHabitsCount]);

  const monthlyScore = useMemo(() => {
    const base = dailyScore * 0.45 + habitConsistencyPct * 0.55;
    return Math.min(100, Math.max(45, Math.round(base || 82)));
  }, [dailyScore, habitConsistencyPct]);

  // Routine block state
  const routineState = useMemo(() => {
    const blocks =
      routineBlocks.length > 0
        ? routineBlocks
        : isWeekend
        ? DEFAULT_WEEKEND_BLOCKS
        : DEFAULT_WEEKDAY_BLOCKS;
    return getActiveBlockState(blocks, new Date());
  }, [routineBlocks, isWeekend]);

  const handleToggle = async (task: TaskItem) => {
    const nextStatus = !task.is_completed;

    // Immediately update local store & React state
    const updated = toggleLocalTask(task.id, nextStatus, task.xp_value);
    setTasks(updated);
    setLocalStats(getLocalUserStats());

    if (nextStatus) {
      setLastEarnedXp(task.xp_value);
      setShowXpToast(true);
      setTimeout(() => setShowXpToast(false), 3200);
    }

    startTransition(async () => {
      await toggleTaskCompletionAction(task.id, task.is_completed, task.xp_value, task.title);
      await refreshProfile();
    });
  };

  const handleTaskCreated = (newTask: TaskItem) => {
    const updated = addLocalTask(newTask);
    setTasks(updated);
  };

  const handleLogWorkout = () => {
    const updated = recordLocalWorkoutSession(1);
    setLocalStats(updated);
    setLastEarnedXp(15);
    setShowXpToast(true);
    setTimeout(() => setShowXpToast(false), 3200);
  };

  const streak = stats?.current_streak ?? localStats.current_streak ?? 0;

  return (
    <div className="space-y-6 max-w-7xl pb-16 font-sans select-none">
      {/* Toast Notification */}
      <XPToast
        visible={showXpToast}
        xp={lastEarnedXp}
        message="Quest Objective Completed!"
      />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-900">
            Dashboard
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Plan, prioritize, and accomplish your life missions with precision.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            onClick={() => setIsModalOpen(true)}
            className="gap-2 text-xs font-bold"
          >
            <Plus className="h-4 w-4" />
            <span>Add Task</span>
          </Button>

          <Link href="/focus">
            <Button variant="outline" className="gap-2 text-xs font-semibold">
              <Target className="h-4 w-4 text-[#154D38]" />
              <span>Time Tracker</span>
            </Button>
          </Link>

          <Link href="/expenses">
            <Button variant="outline" className="gap-2 text-xs font-semibold">
              <Wallet className="h-4 w-4 text-emerald-600" />
              <span>৳ {remainingBalance.toLocaleString()} Buffer</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* =========================================================================
          SECTION 1: Aligned KPI Command Cards
          - Total Completed Tasks
          - Remaining Daily Tasks
          - Total Completed Projects
          - Total Focused Hours
          - Total Workout Sessions
          - Total Money Spent This Month
          - Remaining Balance This Month
          ========================================================================= */}
      <DashboardKPIs
        completedTasksCount={completedTasksCount}
        remainingDailyTasksCount={remainingDailyTasksCount}
        totalCompletedProjects={totalCompletedProjects}
        totalFocusedHours={totalFocusedHours}
        totalWorkoutSessions={totalWorkoutSessions}
        totalSpent={totalSpent}
        remainingBalance={remainingBalance}
        onLogWorkout={handleLogWorkout}
        onOpenTaskModal={() => setIsModalOpen(true)}
      />

      {/* =========================================================================
          SECTION 2: Overall Score (Monthly + Daily) & Weekly Analytics
          - Overall Score (Monthly + Daily) Card
          - Weekly Analytics (7-Day Velocity & Deep Work Cadence)
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Overall Score: Monthly + Daily Aligned (5 Cols) */}
        <div className="lg:col-span-6">
          <OverallScoreCard
            dailyScore={dailyScore}
            monthlyScore={monthlyScore}
            completedActions={completedActions}
            totalActions={totalActions}
            habitConsistencyPct={habitConsistencyPct}
            streak={streak}
          />
        </div>

        {/* Weekly Analytics (7 Cols) */}
        <div className="lg:col-span-6">
          <WeeklyAnalyticsCard
            averageWeeklyScore={Math.round((monthlyScore + dailyScore) / 2)}
            totalWeeklyHours={Number(totalFocusedHours)}
          />
        </div>
      </div>

      {/* =========================================================================
          SECTION 3: Execution Queue & Daily Rhythm Engine
          - Today's Execution Queue (Remaining daily tasks interactive checklist)
          - Reminders & Scheduled Routine Block
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Today's Execution Queue (8 Columns) */}
        <div className="lg:col-span-8 space-y-4">
          <Card className="bg-white border border-zinc-200/90 shadow-2xs">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold text-zinc-900">
                  Today&apos;s Execution Queue
                </CardTitle>
                <CardDescription className="text-xs text-zinc-500">
                  {remainingDailyTasksCount} remaining daily objectives scheduled
                </CardDescription>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs font-semibold">
                  {remainingDailyTasksCount} Due Today
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsModalOpen(true)}
                  className="h-7 text-xs px-2.5 gap-1"
                >
                  <Plus className="h-3 w-3" />
                  <span>New</span>
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-2.5 pt-1">
              {todayTasks.length > 0 ? (
                todayTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-50/80 border border-zinc-200/70 hover:bg-zinc-100/60 transition-all group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        onClick={() => handleToggle(task)}
                        className={`h-5 w-5 rounded-md border flex items-center justify-center transition-all shrink-0 ${
                          task.is_completed
                            ? "bg-[#154D38] border-[#154D38] text-white shadow-2xs"
                            : "border-zinc-300 hover:border-[#154D38] bg-white text-transparent"
                        }`}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </button>

                      <div className="truncate">
                        <span
                          className={`text-xs font-semibold truncate block ${
                            task.is_completed
                              ? "line-through text-zinc-400"
                              : "text-zinc-900"
                          }`}
                        >
                          {task.title}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          {task.due_time && (
                            <span className="text-[11px] text-zinc-400 flex items-center gap-1 font-mono">
                              <Clock className="h-3 w-3" />
                              {task.due_time}
                            </span>
                          )}
                          {task.category_name && (
                            <span className="text-[10px] text-zinc-500 font-semibold px-1.5 py-0.2 rounded bg-zinc-200/60">
                              {task.category_name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                      +{task.xp_value} XP
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-xs text-zinc-400">
                  No objectives in queue for today.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Reminders & Routine Rhythm (4 Columns) */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="bg-white border border-zinc-200/90 shadow-2xs flex flex-col justify-between h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold tracking-wider text-zinc-400">
                  Reminders & Rhythms
                </span>
                <Badge variant="mint" className="text-[10px]">
                  {routineState.activeBlock ? "Active Now" : "Scheduled"}
                </Badge>
              </div>

              <CardTitle className="text-lg font-bold text-zinc-900 mt-2">
                {routineState.activeBlock
                  ? routineState.activeBlock.title
                  : routineState.nextBlock
                  ? routineState.nextBlock.title
                  : "Deep Work Focus Block"}
              </CardTitle>

              <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
                <Clock className="h-3.5 w-3.5 text-[#154D38]" />
                <span>
                  {routineState.activeBlock
                    ? `${formatTo12Hour(routineState.activeBlock.start_time)} – ${formatTo12Hour(
                        routineState.activeBlock.end_time
                      )}`
                    : "02:00 PM – 04:00 PM"}
                </span>
              </div>
            </CardHeader>

            <CardContent className="pt-2">
              <p className="text-xs text-zinc-500 line-clamp-2 mb-4 leading-relaxed">
                {routineState.activeBlock
                  ? routineState.activeBlock.description
                  : "High-leverage engineering sprint: core project architectures and AI code."}
              </p>

              <Link href="/routine" className="block w-full">
                <Button variant="primary" className="w-full text-xs font-bold gap-2">
                  <Play className="h-3.5 w-3.5 fill-white" />
                  <span>Start Routine Sprint</span>
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Calisthenics 6-Month Protocol Card */}
          <Card className="bg-gradient-to-br from-zinc-900 to-zinc-950 text-white border border-zinc-800 shadow-2xs overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                  Calisthenics Protocol
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-bold">
                  +25 XP
                </span>
              </div>

              <CardTitle className="text-base font-bold text-white mt-1.5 flex items-center gap-2">
                <Dumbbell className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>{todayWorkoutSchedule.focus.split("(")[0]}</span>
              </CardTitle>

              <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
                <Clock className="h-3.5 w-3.5 text-emerald-400" />
                <span>
                  {todayWorkoutSchedule.isRestDay
                    ? "Full Rest / Active Recovery Day"
                    : `${todayWorkoutSchedule.dayName} · ~${todayWorkoutSchedule.durationMinutes} min session`}
                </span>
              </div>
            </CardHeader>

            <CardContent className="pt-2">
              <p className="text-xs text-zinc-300 line-clamp-2 mb-3.5 leading-relaxed">
                {todayWorkoutSchedule.description}
              </p>

              <Link href="/exercise" className="block w-full">
                <Button className="w-full text-xs font-bold gap-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-xs">
                  <Play className="h-3.5 w-3.5 fill-zinc-950" />
                  <span>
                    {todayWorkoutSchedule.isRestDay ? "View Recovery Protocol" : "Launch Calisthenics Hub"}
                  </span>
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTaskCreated={handleTaskCreated}
      />
    </div>
  );
}
