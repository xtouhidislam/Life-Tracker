"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import {
  Target,
  Sparkles,
  Zap,
  Clock,
  TrendingUp,
  Award,
  TreePine,
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
import {
  getLocalFocusSessions,
  getLocalTasks,
  getLocalForestTrees,
} from "@/lib/storage/local-store";
import { ForestTreeRecord } from "@/lib/focus/forest-data";

function FocusContent() {
  const searchParams = useSearchParams();
  const initialTitleParam = searchParams.get("title") || undefined;
  const initialDurationParam = searchParams.get("duration")
    ? parseInt(searchParams.get("duration")!, 10)
    : 25;

  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [sessions, setSessions] = useState<FocusSessionRecord[]>([]);
  const [trees, setTrees] = useState<ForestTreeRecord[]>(() => getLocalForestTrees());
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [totalSessions, setTotalSessions] = useState(0);
  const [totalXp, setTotalXp] = useState(0);

  // Toast
  const [showXpToast, setShowXpToast] = useState(false);
  const [lastEarnedXp, setLastEarnedXp] = useState(10);
  const [toastMessage, setToastMessage] = useState("Focus Sprint Completed!");

  useEffect(() => {
    let isMounted = true;

    // 1. Instant local persistence hydration
    const localSessions = getLocalFocusSessions();
    const localTasks = getLocalTasks();
    const localTrees = getLocalForestTrees();

    if (localTasks.length > 0) setTasks(localTasks);
    if (localTrees.length > 0) setTrees(localTrees);

    if (localSessions.length > 0) {
      setSessions(localSessions);
      const mins = Math.round(localSessions.reduce((acc, s) => acc + s.duration_seconds, 0) / 60);
      const xp = localSessions.reduce((acc, s) => acc + s.xp_earned, 0);
      setTotalMinutes(mins);
      setTotalSessions(localSessions.length);
      setTotalXp(xp);
    }

    // 2. Cloud sync
    async function load() {
      try {
        const [tasksRes, focusRes] = await Promise.all([
          getTasksAction(),
          getFocusSessionsAction(),
        ]);

        if (tasksRes.tasks && isMounted && tasksRes.tasks.length > 0) {
          setTasks(tasksRes.tasks);
        }
        if (focusRes.sessions && isMounted && focusRes.sessions.length > 0) {
          setSessions(focusRes.sessions);
          setTotalMinutes(focusRes.totalMinutesToday);
          setTotalSessions(focusRes.totalSessionsToday);
          setTotalXp(focusRes.totalXpToday);
        }
      } catch (err) {
        console.warn("Focus cloud sync fallback to local storage:", err);
      }
    }
    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSessionCompleted = (earnedXp: number, minutes: number) => {
    setLastEarnedXp(earnedXp);
    setToastMessage(`Cultivated focus tree & logged ${minutes}m of deep work!`);
    setShowXpToast(true);
    setTimeout(() => setShowXpToast(false), 3500);

    setTotalMinutes((prev) => prev + minutes);
    setTotalSessions((prev) => prev + 1);
    setTotalXp((prev) => prev + earnedXp);

    // Refresh history & trees from local store
    const local = getLocalFocusSessions();
    if (local.length > 0) setSessions(local);

    const refreshedTrees = getLocalForestTrees();
    setTrees(refreshedTrees);

    getFocusSessionsAction().then((res) => {
      if (res.sessions && res.sessions.length > 0) setSessions(res.sessions);
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-3xl font-black tracking-tight text-zinc-900">
              Focus Forest & Time Tracker
            </h1>
            <span className="text-xs font-bold text-[#154D38] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
              <TreePine className="h-3 w-3" />
              <span>Flora Ecosystem</span>
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Grow trees and flourish a living botanical forest through distraction-free deep work.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
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
          title="Forest Population"
          value={`${trees.length} Trees`}
          subtext="Healthy thriving forest"
        />
        <StatCard
          title="Focus XP Earned"
          value={`+${totalXp} XP`}
          subtext="Awarded from deep work intervals"
        />
        <StatCard
          title="Completed Sprints"
          value={`${totalSessions} Sessions`}
          trend={{ value: "+45m vs avg", positive: true }}
        />
      </div>

      {/* Luxury Pomodoro Timer with Live Growing Forest Island */}
      <PomodoroTimer
        initialTitle={initialTitleParam}
        initialDurationMinutes={initialDurationParam}
        availableTasks={availableTasks}
        onSessionCompleted={handleSessionCompleted}
        trees={trees}
        totalFocusMinutes={totalMinutes}
      />

      {/* Completed Sessions Log */}
      <FocusHistoryList sessions={sessions} />
    </div>
  );
}

export default function FocusPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-zinc-500">Loading focus tracker...</div>}>
      <FocusContent />
    </Suspense>
  );
}
