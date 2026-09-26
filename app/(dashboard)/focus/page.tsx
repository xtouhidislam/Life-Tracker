"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Target,
  Sparkles,
  Zap,
  Clock,
  TrendingUp,
  Award,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { getTasksAction, type TaskItem } from "@/app/actions/tasks";
import {
  getFocusSessionsAction,
  FocusSessionRecord,
} from "@/app/actions/focus";
import { PomodoroTimer } from "@/components/focus/PomodoroTimer";
import { FocusHistoryList } from "@/components/focus/FocusHistoryList";
import { XPToast } from "@/components/tasks/XPToast";
import { StatCard } from "@/components/dashboard/StatCard";

export default function FocusPage() {
  const searchParams = useSearchParams();
  const initialTitleParam = searchParams.get("title") || undefined;
  const initialDurationParam = searchParams.get("duration")
    ? parseInt(searchParams.get("duration")!, 10)
    : 25;

  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [sessions, setSessions] = useState<FocusSessionRecord[]>([]);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [totalSessions, setTotalSessions] = useState(0);
  const [totalXp, setTotalXp] = useState(0);

  // Toast
  const [showXpToast, setShowXpToast] = useState(false);
  const [lastEarnedXp, setLastEarnedXp] = useState(10);
  const [toastMessage, setToastMessage] = useState("Focus Sprint Completed!");

  useEffect(() => {
    let isMounted = true;
    async function load() {
      const [tasksRes, focusRes] = await Promise.all([
        getTasksAction(),
        getFocusSessionsAction(),
      ]);

      if (tasksRes.tasks && isMounted) {
        setTasks(tasksRes.tasks);
      }
      if (focusRes.sessions && isMounted) {
        setSessions(focusRes.sessions);
        setTotalMinutes(focusRes.totalMinutesToday);
        setTotalSessions(focusRes.totalSessionsToday);
        setTotalXp(focusRes.totalXpToday);
      }
    }
    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSessionCompleted = (earnedXp: number, minutes: number) => {
    setLastEarnedXp(earnedXp);
    setToastMessage(`Logged ${minutes}m of deep work focus!`);
    setShowXpToast(true);
    setTimeout(() => setShowXpToast(false), 3500);

    setTotalMinutes((prev) => prev + minutes);
    setTotalSessions((prev) => prev + 1);
    setTotalXp((prev) => prev + earnedXp);

    // Refresh history
    getFocusSessionsAction().then((res) => {
      if (res.sessions) setSessions(res.sessions);
    });
  };

  const formattedHours = useMemo(() => {
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    if (h === 0) return `${m}m`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
  }, [totalMinutes]);

  const targetMinutes = 180; // 3 hours deep work target
  const targetPct = Math.min(100, Math.round((totalMinutes / targetMinutes) * 100));

  const availableTasks = tasks.map((t) => ({
    id: t.id,
    title: t.title,
    category: t.category_name,
  }));

  return (
    <div className="space-y-6 max-w-6xl pb-12 font-sans select-none">
      {/* Toast Notification */}
      <XPToast
        visible={showXpToast}
        xp={lastEarnedXp}
        message={toastMessage}
      />

      {/* Header matching Donezo aesthetic */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-900">
            Time Tracker & Focus
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Distraction-free environment with drift-proof Pomodoro timers and ambient audio.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
            Daily Goal: {formattedHours} / 3h 00m ({targetPct}%)
          </span>
        </div>
      </div>

      {/* KPI Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Deep Work Logged"
          value={formattedHours}
          isHero={true}
          trend={{ value: `${targetPct}% of 3h daily goal`, positive: true }}
        />
        <StatCard
          title="Completed Sprints"
          value={`${totalSessions} Sessions`}
          trend={{ value: "+45m vs avg", positive: true }}
        />
        <StatCard
          title="Focus XP Earned"
          value={`+${totalXp} XP`}
          subtext="Awarded from deep work intervals"
        />
        <StatCard
          title="Optimal Rhythm"
          value="50m / 10m"
          subtext="Engineering Deep Work Sprint"
        />
      </div>

      {/* Luxury Pomodoro Timer Component */}
      <PomodoroTimer
        initialTitle={initialTitleParam}
        initialDurationMinutes={initialDurationParam}
        availableTasks={availableTasks}
        onSessionCompleted={handleSessionCompleted}
      />

      {/* Completed Sessions Log */}
      <FocusHistoryList sessions={sessions} />
    </div>
  );
}
