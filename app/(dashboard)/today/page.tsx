"use client";

import React, { useState, useEffect, useMemo, useTransition } from "react";
import { CircularProgress } from "@/components/dashboard/CircularProgress";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckSquare,
  Flame,
  Target,
  Zap,
  Clock,
  Sparkles,
  Compass,
  Wallet,
  CheckCircle2,
  Plus,
  Play,
  ArrowRight,
  TrendingUp,
  Calendar,
  Layers,
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
  toggleLocalHabit,
  getLocalRoutines,
  saveLocalRoutines,
  getLocalExpenses,
  getLocalUserStats,
} from "@/lib/storage/local-store";

export default function TodayPage() {
  const { user, profile, stats, refreshProfile } = useAuth();
  const [tasks, setTasks] = useState<TaskItem[]>(() => getLocalTasks());
  const [habits, setHabits] = useState<HabitItem[]>(() => getLocalHabits());
  const [routineBlocks, setRoutineBlocks] = useState<RoutineBlock[]>(() => {
    const routineType = (typeof window !== "undefined" && (new Date().getDay() === 0 || new Date().getDay() === 6)) ? "weekend" : "weekday";
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

  const [localStats, setLocalStats] = useState(() => getLocalUserStats());

  useEffect(() => {
    const routineType = (new Date().getDay() === 0 || new Date().getDay() === 6) ? "weekend" : "weekday";
    
    // Always refresh state from local store on mount/tab activation
    setTasks(getLocalTasks());
    setHabits(getLocalHabits());
    setRoutineBlocks(getLocalRoutines(routineType));
    setLocalStats(getLocalUserStats());

    // If user is guest/unauthenticated, do NOT call server actions that could overwrite local progress
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

  const displayName =
    profile?.display_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Touhid";

  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

  // Filter tasks due today or pending
  const todayTasks = useMemo(() => {
    const list = tasks.filter((t) => !t.due_date || t.due_date <= todayStr);
    return list.slice(0, 6);
  }, [tasks, todayStr]);

  const completedTasksCount = tasks.filter((t) => t.is_completed).length;
  const totalTasksCount = tasks.length;

  const completedHabitsCount = habits.filter((h) => h.is_completed_today).length;
  const totalHabitsCount = habits.length;

  const totalActions = totalTasksCount + totalHabitsCount;
  const completedActions = completedTasksCount + completedHabitsCount;
  const dailyLifeScore = totalActions > 0 ? Math.round((completedActions / totalActions) * 100) : 0;

  const routineState = useMemo(() => {
    const blocks = routineBlocks.length > 0
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

  const streak = stats?.current_streak ?? localStats.current_streak ?? 0;

  return (
    <div className="space-y-6 max-w-7xl pb-12 font-sans select-none">
      {/* Toast Notification */}
      <XPToast
        visible={showXpToast}
        xp={lastEarnedXp}
        message="Quest Objective Completed!"
      />

      {/* Top Header matching Donezo Reference */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-900">
            Dashboard
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Plan, prioritize, and accomplish your tasks with ease.
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
              <span>৳ {expenseSummary?.remaining_allowance.toLocaleString() ?? "17,550"} Buffer</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 KPI Metric Cards (With signature Forest Green Hero card) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Tasks"
          value={tasks.length || 24}
          isHero={true}
          trend={{ value: `${completedTasksCount} Completed today`, positive: true }}
        />
        <StatCard
          title="Ended Projects"
          value={completedTasksCount || 10}
          trend={{ value: `${dailyLifeScore}% completion rate`, positive: true }}
        />
        <StatCard
          title="Running Habits"
          value={`${completedHabitsCount} / ${habits.length || 6}`}
          trend={{ value: "91% consistency", positive: true }}
        />
        <StatCard
          title="Pending Objectives"
          value={tasks.length - completedTasksCount || 2}
          subtext="On schedule for today"
        />
      </div>

      {/* Middle Analytical Row (Project Analytics, Reminders & Circular Progress) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* 1. Project / Focus Analytics (Weekly Capsule Bars) */}
        <Card className="lg:col-span-5 bg-white border border-zinc-200/90 shadow-2xs">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-zinc-900">
                Weekly Focus Analytics
              </CardTitle>
              <CardDescription className="text-xs">
                Deep work intensity across the current cycle
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-[10px]">
              This Week
            </Badge>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="flex items-end justify-between gap-2.5 h-36 px-2">
              {[
                { day: "S", height: "45%", type: "hatched" },
                { day: "M", height: "80%", type: "mint" },
                { day: "T", height: "65%", type: "mint", badge: "76%" },
                { day: "W", height: "95%", type: "forest" },
                { day: "T", height: "55%", type: "hatched" },
                { day: "F", height: "60%", type: "hatched" },
                { day: "S", height: "50%", type: "hatched" },
              ].map((bar, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  {bar.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white border border-zinc-200 text-zinc-800 shadow-2xs">
                      {bar.badge}
                    </span>
                  )}
                  <div
                    className={`w-full max-w-[28px] rounded-full transition-all duration-500 ${
                      bar.type === "forest"
                        ? "bg-[#154D38]"
                        : bar.type === "mint"
                        ? "bg-emerald-400"
                        : "hatched-pattern border border-zinc-200"
                    }`}
                    style={{ height: bar.height }}
                  />
                  <span className="text-xs font-semibold text-zinc-500 font-mono">
                    {bar.day}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 2. Reminders & Current Daily Rhythm (Center) */}
        <Card className="lg:col-span-4 bg-white border border-zinc-200/90 shadow-2xs flex flex-col justify-between">
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
                  ? `${formatTo12Hour(routineState.activeBlock.start_time)} – ${formatTo12Hour(routineState.activeBlock.end_time)}`
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

        {/* 3. Time Tracker Card (Inspired by Bottom-Right widget in screenshot) */}
        <div className="lg:col-span-3 rounded-2xl bg-gradient-to-br from-[#123E2E] via-[#0D2F22] to-[#071A13] text-white p-5 flex flex-col justify-between shadow-md relative overflow-hidden">
          {/* Subtle silk wave ambient effect */}
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between text-xs text-emerald-200">
            <span className="font-semibold flex items-center gap-1.5">
              <Target className="h-3.5 w-3.5 text-emerald-400" />
              Time Tracker
            </span>
            <Badge variant="forest" className="bg-emerald-800/60 text-[10px]">
              Pomodoro
            </Badge>
          </div>

          <div className="text-center py-4 space-y-1">
            <div className="text-3xl font-mono font-black tracking-wider text-white">
              01:24:08
            </div>
            <p className="text-[11px] text-emerald-200/80">Deep Work Sprint Active</p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <Link href="/focus">
              <button className="h-9 px-4 rounded-full bg-white hover:bg-emerald-50 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs">
                <Play className="h-3 w-3 fill-slate-950" />
                <span>Open Timer</span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Grid: Execution Queue & Project Progress */}
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
                  Scheduled deliverables and focus objectives
                </CardDescription>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs font-semibold">
                  {tasks.length - completedTasksCount} Pending
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

        {/* Project Progress Gauge (4 Columns) */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="bg-white border border-zinc-200/90 shadow-2xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold text-zinc-900">
                Daily Life Score
              </CardTitle>
              <CardDescription className="text-xs text-zinc-500">
                Holistic score combining tasks and habits
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-2 flex flex-col items-center">
              <CircularProgress
                value={dailyLifeScore}
                size={170}
                strokeWidth={14}
                completedText={`${completedActions} / ${totalActions} Done`}
                subText="Daily Life Score"
              />

              {/* Progress Legend matching Donezo gauge */}
              <div className="flex items-center justify-center gap-4 text-[11px] text-zinc-600 font-medium pt-4 border-t border-zinc-100 w-full mt-2">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Completed
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#154D38]" />
                  Active
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-zinc-300" />
                  Pending
                </span>
              </div>
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
