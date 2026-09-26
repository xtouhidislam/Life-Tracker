"use client";

import React, { useState, useEffect, useTransition, useMemo } from "react";
import {
  Trophy,
  GitBranch,
  Calendar,
  Layers,
  Filter,
  CheckCircle2,
  DollarSign,
  Briefcase,
  Sparkles,
} from "lucide-react";
import {
  MonthlyMilestone,
  DEFAULT_ROADMAP_MONTHS,
} from "@/lib/roadmap/roadmap-data";
import {
  getRoadmapAction,
  toggleMilestoneAction,
  toggleWeeklyDeliverableAction,
} from "@/app/actions/roadmap";
import { useAuth } from "@/components/providers/AuthProvider";
import { soundEffects } from "@/lib/audio/sound-effects";
import { triggerHaptic } from "@/lib/ui/haptics";
import { triggerCelebration } from "@/lib/ui/celebration";
import { RoadmapHero } from "@/components/roadmap/RoadmapHero";
import { SkillTreeGraph } from "@/components/roadmap/SkillTreeGraph";
import { MonthlyMatrixCard } from "@/components/roadmap/MonthlyMatrixCard";
import { IncomeCheckpointBar } from "@/components/roadmap/IncomeCheckpointBar";
import { XPToast } from "@/components/tasks/XPToast";

export default function RoadmapPage() {
  const { refreshProfile } = useAuth();
  const [, startTransition] = useTransition();

  const [months, setMonths] = useState<MonthlyMilestone[]>(DEFAULT_ROADMAP_MONTHS);
  const [selectedTrack, setSelectedTrack] = useState<string>("all");
  const [selectedPhase, setSelectedPhase] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"tree" | "matrix" | "income">("matrix");

  // XP Toast state
  const [showXpToast, setShowXpToast] = useState(false);
  const [lastEarnedXp, setLastEarnedXp] = useState(100);
  const [toastMessage, setToastMessage] = useState("Milestone Completed!");

  useEffect(() => {
    let isMounted = true;
    async function load() {
      const res = await getRoadmapAction();
      if (res.success && isMounted) {
        setMonths(res.months);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const totalMonths = months.length;
  const completedMonths = months.filter((m) => m.is_completed).length;

  const totalXpAvailable = useMemo(() => {
    let xp = 0;
    months.forEach((m) => {
      xp += m.xp_reward;
      m.weeks.forEach((w) => (xp += w.xp_reward));
    });
    return xp;
  }, [months]);

  const totalXpEarned = useMemo(() => {
    let xp = 0;
    months.forEach((m) => {
      if (m.is_completed) xp += m.xp_reward;
      m.weeks.forEach((w) => {
        if (w.is_completed) xp += w.xp_reward;
      });
    });
    return xp;
  }, [months]);

  // Handle milestone toggle
  const handleToggleMilestone = (monthNumber: number) => {
    const target = months.find((m) => m.month === monthNumber);
    if (!target) return;

    const nextCompleted = !target.is_completed;

    // Optimistic UI update
    setMonths((prev) =>
      prev.map((m) =>
        m.month === monthNumber
          ? {
              ...m,
              is_completed: nextCompleted,
              status: nextCompleted ? "completed" : "in_progress",
            }
          : m
      )
    );

    if (nextCompleted) {
      soundEffects.playLevelUp();
      triggerHaptic("levelUp");
      triggerCelebration("grand");
      setLastEarnedXp(target.xp_reward);
      setToastMessage(`Unlocked Milestone: Month ${monthNumber}!`);
      setShowXpToast(true);
      setTimeout(() => setShowXpToast(false), 3200);
    } else {
      soundEffects.playClick();
      triggerHaptic("light");
    }

    startTransition(async () => {
      await toggleMilestoneAction(
        monthNumber,
        nextCompleted,
        target.xp_reward,
        target.title
      );
      await refreshProfile();
    });
  };

  // Handle weekly build deliverable toggle
  const handleToggleWeek = (monthNumber: number, weekNumber: number) => {
    const targetMonth = months.find((m) => m.month === monthNumber);
    if (!targetMonth) return;

    const targetWeek = targetMonth.weeks.find((w) => w.week === weekNumber);
    if (!targetWeek) return;

    const nextCompleted = !targetWeek.is_completed;

    setMonths((prev) =>
      prev.map((m) => {
        if (m.month === monthNumber) {
          return {
            ...m,
            weeks: m.weeks.map((w) =>
              w.week === weekNumber ? { ...w, is_completed: nextCompleted } : w
            ),
          };
        }
        return m;
      })
    );

    if (nextCompleted) {
      soundEffects.playCheckmark();
      triggerHaptic("success");
      triggerCelebration("small");
      setLastEarnedXp(targetWeek.xp_reward);
      setToastMessage(`Shipped Week ${weekNumber} Deliverable!`);
      setShowXpToast(true);
      setTimeout(() => setShowXpToast(false), 3200);
    } else {
      soundEffects.playClick();
      triggerHaptic("light");
    }

    startTransition(async () => {
      await toggleWeeklyDeliverableAction(
        monthNumber,
        weekNumber,
        nextCompleted,
        targetWeek.xp_reward,
        targetWeek.build
      );
      await refreshProfile();
    });
  };

  // Filtered months
  const filteredMonths = useMemo(() => {
    return months.filter((m) => {
      if (selectedPhase !== "all" && !m.phase.toLowerCase().includes(selectedPhase.toLowerCase())) {
        return false;
      }
      if (selectedTrack === "track-1" && !m.trackFocus.toLowerCase().includes("track 1")) {
        return false;
      }
      if (selectedTrack === "track-2" && !m.trackFocus.toLowerCase().includes("track 2")) {
        return false;
      }
      if (selectedTrack === "track-3" && !m.trackFocus.toLowerCase().includes("track 3")) {
        return false;
      }
      return true;
    });
  }, [months, selectedPhase, selectedTrack]);

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Toast Notification */}
      <XPToast
        visible={showXpToast}
        xp={lastEarnedXp}
        message={toastMessage}
      />

      {/* Hero Banner & 3 Strategic Tracks */}
      <RoadmapHero
        totalMonths={totalMonths}
        completedMonths={completedMonths}
        totalXpEarned={totalXpEarned}
        totalXpAvailable={totalXpAvailable}
        selectedTrack={selectedTrack}
        onSelectTrack={setSelectedTrack}
      />

      {/* View Switcher Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white border border-zinc-200 shadow-2xs">
          <button
            onClick={() => setViewMode("matrix")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === "matrix"
                ? "bg-[#154D38] text-white shadow-xs"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>12-Month Matrix ({filteredMonths.length})</span>
          </button>

          <button
            onClick={() => setViewMode("tree")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === "tree"
                ? "bg-[#154D38] text-white shadow-xs"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            <GitBranch className="h-3.5 w-3.5" />
            <span>Visual Skill Tree</span>
          </button>

          <button
            onClick={() => setViewMode("income")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === "income"
                ? "bg-[#154D38] text-white shadow-xs"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            <DollarSign className="h-3.5 w-3.5" />
            <span>Income Checkpoints</span>
          </button>
        </div>

        {/* Phase Filter Chips (for matrix view) */}
        {viewMode === "matrix" && (
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: "all", label: "All Phases" },
              { id: "foundations", label: "Foundations (M1–2)" },
              { id: "core", label: "AI Core (M3–4)" },
              { id: "agents", label: "Agents & Capstone (M5–6)" },
              { id: "scale", label: "Scale & Income (M7–12)" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedPhase(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                  selectedPhase === tab.id
                    ? "bg-[#154D38] text-white border-[#154D38] font-bold shadow-xs"
                    : "bg-white text-zinc-600 border-zinc-200/80 hover:text-zinc-900 hover:bg-zinc-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {viewMode === "matrix" && (
        <div className="space-y-4">
          {filteredMonths.map((m) => (
            <MonthlyMatrixCard
              key={m.month}
              milestone={m}
              onToggleMilestone={handleToggleMilestone}
              onToggleWeek={handleToggleWeek}
            />
          ))}
        </div>
      )}

      {viewMode === "tree" && (
        <div className="space-y-6">
          <SkillTreeGraph
            months={months}
            onSelectMonth={(monthNum) => {
              setViewMode("matrix");
              const el = document.getElementById(`month-${monthNum}`);
              el?.scrollIntoView({ behavior: "smooth" });
            }}
          />
        </div>
      )}

      {viewMode === "income" && (
        <div className="space-y-6">
          <IncomeCheckpointBar />
        </div>
      )}
    </div>
  );
}
