"use client";

import React, { useState, useEffect, useMemo, useTransition } from "react";
import {
  Flame,
  Plus,
  CheckCircle2,
  Sparkles,
  Trophy,
  Filter,
  Layers,
  Calendar,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HabitCard } from "@/components/habits/HabitCard";
import { HabitHeatmap } from "@/components/habits/HabitHeatmap";
import { CreateHabitModal } from "@/components/habits/CreateHabitModal";
import { AchievementGrid } from "@/components/gamification/AchievementGrid";
import { XPToast } from "@/components/tasks/XPToast";
import { StatCard } from "@/components/dashboard/StatCard";
import type { HabitItem } from "@/app/actions/habits";
import {
  getHabitsAction,
  toggleHabitCompletionAction,
} from "@/app/actions/habits";
import { useAuth } from "@/hooks/useAuth";
import { soundEffects } from "@/lib/audio/sound-effects";
import { triggerHaptic } from "@/lib/ui/haptics";
import { triggerCelebration } from "@/lib/ui/celebration";
import {
  getLocalHabits,
  saveLocalHabits,
  addLocalHabit,
  toggleLocalHabit,
} from "@/lib/storage/local-store";

const FILTER_TABS = [
  { id: "all", label: "All Habits" },
  { id: "morning", label: "Morning Rituals" },
  { id: "evening", label: "Evening Shutdown" },
  { id: "health", label: "Health & Fitness" },
  { id: "engineering", label: "Engineering & Study" },
];

export default function HabitsPage() {
  const { user, refreshProfile } = useAuth();
  const [habits, setHabits] = useState<HabitItem[]>(() => getLocalHabits());
  const [activeTab, setActiveTab] = useState("all");
  const [viewSection, setViewSection] = useState<"habits" | "achievements">("habits");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showXpToast, setShowXpToast] = useState(false);
  const [lastEarnedXp, setLastEarnedXp] = useState(15);
  const [isPending, startTransition] = useTransition();

  // Load habits on mount with local storage hydration
  useEffect(() => {
    setHabits(getLocalHabits());
    if (!user) return;

    async function load() {
      try {
        const res = await getHabitsAction();
        if (res.habits && res.habits.length > 0) {
          setHabits(res.habits);
          saveLocalHabits(res.habits);
        }
      } catch (err) {
        console.warn("Habits cloud sync fallback to local storage:", err);
      }
    }
    load();
  }, [user]);

  // Handle habit check in
  const handleToggle = async (
    habitId: string,
    currentStatus: boolean,
    xpValue: number,
    title: string
  ) => {
    const nextStatus = !currentStatus;
    const todayStr = new Date().toISOString().split("T")[0];

    // Immediately persist in local storage
    const updated = toggleLocalHabit(habitId, todayStr);
    setHabits(updated);

    if (nextStatus) {
      const updatedHabit = updated.find((h) => h.id === habitId);
      const nextStreak = updatedHabit?.current_streak ?? 1;

      if (nextStreak > 0 && nextStreak % 7 === 0) {
        soundEffects.playLevelUp();
        triggerHaptic("levelUp");
        triggerCelebration("grand");
      } else {
        soundEffects.playCheckmark();
        triggerHaptic("success");
        triggerCelebration("small");
      }

      setLastEarnedXp(xpValue);
      setShowXpToast(true);
      setTimeout(() => setShowXpToast(false), 3200);
    } else {
      soundEffects.playClick();
      triggerHaptic("light");
    }

    startTransition(async () => {
      await toggleHabitCompletionAction(habitId, undefined, xpValue, title);
      await refreshProfile();
    });
  };

  const handleHabitCreated = (newHabit: HabitItem) => {
    const updated = addLocalHabit(newHabit);
    setHabits(updated);
  };

  // Filtered habits
  const filteredHabits = useMemo(() => {
    return habits.filter((h) => {
      switch (activeTab) {
        case "morning":
          return h.time_of_day === "morning";
        case "evening":
          return h.time_of_day === "evening";
        case "health":
          return h.category_name.toLowerCase().includes("health");
        case "engineering":
          return (
            h.category_name.toLowerCase().includes("engineering") ||
            h.category_name.toLowerCase().includes("study") ||
            h.category_name.toLowerCase().includes("knowledge")
          );
        case "all":
        default:
          return true;
      }
    });
  }, [habits, activeTab]);

  // KPIs
  const completedTodayCount = habits.filter((h) => h.is_completed_today).length;
  const totalHabitsCount = habits.length || 1;
  const todayConsistencyPct = Math.round((completedTodayCount / totalHabitsCount) * 100);
  const longestStreak = habits.reduce(
    (max, h) => Math.max(max, h.current_streak),
    0
  );
  const totalEarnedToday = completedTodayCount * 15;

  return (
    <div className="space-y-6 max-w-6xl pb-12 select-none">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-900 flex items-center gap-2.5">
            <span>Habits & Rituals</span>
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Maintain daily momentum, build unbreakable streaks, and earn player achievements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Section Switcher: Habits vs Achievements */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white border border-zinc-200">
            <button
              onClick={() => setViewSection("habits")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewSection === "habits"
                  ? "bg-[#154D38] text-white font-bold shadow-xs"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              Habits Matrix
            </button>
            <button
              onClick={() => setViewSection("achievements")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                viewSection === "achievements"
                  ? "bg-amber-500 text-slate-950 font-black shadow-xs"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              <Trophy className="h-3.5 w-3.5" />
              <span>Achievements</span>
            </button>
          </div>

          <Button
            variant="primary"
            onClick={() => setIsModalOpen(true)}
            className="gap-2 px-5 bg-[#154D38] hover:bg-[#0F382A] text-white shadow-xs font-bold"
          >
            <Plus className="h-4 w-4" />
            <span>New Habit</span>
          </Button>
        </div>
      </div>

      {/* KPI Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          title="Completed Today"
          value={`${completedTodayCount} / ${totalHabitsCount}`}
          isHero={true}
          trend={{ value: `${todayConsistencyPct}% consistency`, positive: true }}
        />
        <StatCard
          title="Current Streak"
          value={`${longestStreak} Days`}
          trend={{ value: "Flame streak active", positive: true }}
        />
        <StatCard
          title="Consistency Index"
          value="91% Overall"
          subtext="Past 30 days"
        />
        <StatCard
          title="Earned Today"
          value={`+${totalEarnedToday} XP`}
          subtext="Habit check-ins"
        />
      </div>

      {/* SECTION 1: HABITS VIEW */}
      {viewSection === "habits" && (
        <>
          {/* 90-Day Rolling Momentum Matrix */}
          <HabitHeatmap habits={habits} />

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-2">
            {FILTER_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-[#154D38] text-white font-bold shadow-xs"
                      : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 border border-zinc-200/80 bg-white"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Habit Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredHabits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onToggle={handleToggle}
              />
            ))}
          </div>
        </>
      )}

      {/* SECTION 2: ACHIEVEMENTS VIEW */}
      {viewSection === "achievements" && (
        <Card className="p-6 border-zinc-200 bg-white">
          <AchievementGrid />
        </Card>
      )}

      {/* Habit Creation Modal */}
      <CreateHabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onHabitCreated={handleHabitCreated}
      />

      {/* Celebratory XP Toast */}
      <XPToast xp={lastEarnedXp} message="Daily Habit Objective Checked In!" visible={showXpToast} />
    </div>
  );
}
