"use client";

import React from "react";
import {
  Trophy,
  Award,
  Medal,
  Flame,
  Timer,
  Sparkles,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Achievement {
  id: string;
  title: string;
  description: string;
  tier: "bronze" | "silver" | "gold" | "platinum";
  xpBonus: number;
  icon: React.ElementType;
  isUnlocked: boolean;
  unlockedAt?: string;
  progressText?: string;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_task",
    title: "First Blood",
    description: "Completed your first recorded operational objective.",
    tier: "bronze",
    xpBonus: 25,
    icon: CheckCircle2,
    isUnlocked: false,
    progressText: "0 / 1 Completed",
  },
  {
    id: "tasks_10",
    title: "Task Decathlete",
    description: "Completed 10 operational objectives across your quests.",
    tier: "bronze",
    xpBonus: 50,
    icon: Award,
    isUnlocked: false,
    progressText: "0 / 10 Completed",
  },
  {
    id: "streak_7_days",
    title: "Unstoppable Flame",
    description: "Maintained an unbroken 7-day daily habit streak.",
    tier: "silver",
    xpBonus: 100,
    icon: Flame,
    isUnlocked: false,
    progressText: "0 / 7 Days",
  },
  {
    id: "focus_10_hours",
    title: "Deep Work Monk",
    description: "Completed 10 cumulative hours of uninterrupted deep work focus.",
    tier: "silver",
    xpBonus: 150,
    icon: Timer,
    isUnlocked: false,
    progressText: "0 / 10 Hours",
  },
  {
    id: "tasks_50",
    title: "Centurion Aspirant",
    description: "Complete 50 tasks across your operational queues.",
    tier: "silver",
    xpBonus: 150,
    icon: Medal,
    isUnlocked: false,
    progressText: "0 / 50 Completed",
  },
  {
    id: "streak_30_days",
    title: "Habit Titan",
    description: "Maintain an unbroken 30-day consistency streak across core habits.",
    tier: "gold",
    xpBonus: 300,
    icon: Trophy,
    isUnlocked: false,
    progressText: "0 / 30 Days",
  },
  {
    id: "zenin_milestone_1",
    title: "AI Pioneer",
    description: "Complete Month 1 of Zenin AI Implementation Engineer roadmap.",
    tier: "gold",
    xpBonus: 500,
    icon: Sparkles,
    isUnlocked: false,
    progressText: "0% In Progress",
  },
];

const TIER_STYLES: Record<string, { badge: string; border: string; glow: string }> = {
  bronze: {
    badge: "border-amber-200 bg-amber-50 text-amber-800",
    border: "border-amber-200",
    glow: "bg-amber-50",
  },
  silver: {
    badge: "border-zinc-200 bg-zinc-100 text-zinc-700",
    border: "border-zinc-200",
    glow: "bg-zinc-50",
  },
  gold: {
    badge: "border-yellow-200 bg-yellow-50 text-yellow-800",
    border: "border-yellow-200",
    glow: "bg-yellow-50",
  },
  platinum: {
    badge: "border-emerald-200 bg-emerald-50 text-[#154D38]",
    border: "border-emerald-200",
    glow: "bg-emerald-50",
  },
};

export function AchievementGrid() {
  const unlockedCount = ACHIEVEMENTS.filter((a) => a.isUnlocked).length;

  return (
    <div className="space-y-4 select-none">
      <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
        <div>
          <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
            <Trophy className="h-4 w-4 text-amber-500" />
            <span>Player Achievements & Badges</span>
          </h3>
          <p className="text-xs text-zinc-400">
            Milestone achievements awarded for consistency, focus, and mastery
          </p>
        </div>
        <Badge variant="amber" className="font-bold text-xs">
          {unlockedCount} / {ACHIEVEMENTS.length} Unlocked
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
        {ACHIEVEMENTS.map((ach) => {
          const Icon = ach.icon;
          const tierStyle = TIER_STYLES[ach.tier] || TIER_STYLES.bronze;

          return (
            <div
              key={ach.id}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-3 relative overflow-hidden ${
                ach.isUnlocked
                  ? `bg-white ${tierStyle.border} shadow-2xs`
                  : "bg-zinc-50/60 border-zinc-200/60 opacity-60"
              }`}
            >
              {/* Icon Container */}
              <div
                className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border ${
                  ach.isUnlocked
                    ? `${tierStyle.badge} shadow-2xs`
                    : "border-zinc-200 bg-zinc-100 text-zinc-400"
                }`}
              >
                {ach.isUnlocked ? <Icon className="h-5 w-5" /> : <Lock className="h-4 w-4" />}
              </div>

              {/* Text Info */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-1">
                  <span
                    className={`text-xs font-bold truncate ${
                      ach.isUnlocked ? "text-zinc-900" : "text-zinc-500"
                    }`}
                  >
                    {ach.title}
                  </span>
                  <span
                    className={`text-[9px] uppercase font-black px-1.5 py-0.5 rounded border ${tierStyle.badge}`}
                  >
                    {ach.tier}
                  </span>
                </div>

                <p className="text-[11px] text-zinc-500 leading-tight line-clamp-2">
                  {ach.description}
                </p>

                <div className="flex items-center justify-between pt-1 text-[10px]">
                  <span className="text-amber-700 font-bold">+{ach.xpBonus} XP</span>
                  <span className="text-zinc-400 font-medium">
                    {ach.isUnlocked ? `Unlocked ${ach.unlockedAt}` : ach.progressText}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
