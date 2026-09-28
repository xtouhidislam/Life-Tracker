"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Calendar,
  Layers,
  Sparkles,
  TrendingUp,
  Apple,
  Dumbbell,
  CheckCircle2,
  Clock,
  Eye,
  Trophy,
} from "lucide-react";
import { ExerciseHero } from "@/components/exercises/ExerciseHero";
import { WeeklyScheduleView } from "@/components/exercises/WeeklyScheduleView";
import { ProgressionLaddersView } from "@/components/exercises/ProgressionLaddersView";
import { VisualGuidesGallery } from "@/components/exercises/VisualGuidesGallery";
import { PhaseRoadmapView } from "@/components/exercises/PhaseRoadmapView";
import { NutritionSafetySection } from "@/components/exercises/NutritionSafetySection";
import { ActiveWorkoutRunner } from "@/components/exercises/ActiveWorkoutRunner";
import { XPToast } from "@/components/tasks/XPToast";
import {
  getCalisthenicsState,
  CalisthenicsState,
} from "@/lib/storage/calisthenics-store";
import { WEEKLY_SCHEDULE, DaySchedule } from "@/lib/exercises/calisthenics-data";

export default function ExercisePage() {
  const [activeTab, setActiveTab] = useState<
    "schedule" | "ladders" | "visuals" | "phases" | "nutrition"
  >("schedule");

  const [calisthenicsState, setCalisthenicsState] = useState<CalisthenicsState>(() =>
    getCalisthenicsState()
  );

  // Active workout runner modal state
  const [activeWorkoutDay, setActiveWorkoutDay] = useState<DaySchedule | null>(null);

  // Initial pattern for visual guide if opened from a specific ladder
  const [selectedVisualPattern, setSelectedVisualPattern] = useState<
    "push" | "pull" | "legs" | "core"
  >("push");

  // XP Toast state
  const [showXpToast, setShowXpToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("Calisthenics Session Logged!");

  // Detect today's schedule
  const todaySchedule = useMemo(() => {
    const dayIdx = new Date().getDay();
    return WEEKLY_SCHEDULE.find((d) => d.dayIndex === dayIdx) || WEEKLY_SCHEDULE[1];
  }, []);

  const refreshState = () => {
    setCalisthenicsState(getCalisthenicsState());
  };

  const handleWorkoutCompleted = () => {
    refreshState();
    setToastMessage("+25 XP Earned · Calisthenics Protocol Completed!");
    setShowXpToast(true);
    setTimeout(() => setShowXpToast(false), 3500);
  };

  const handleOpenVisualGuideFromLadder = (patternId: "push" | "pull" | "legs" | "core") => {
    setSelectedVisualPattern(patternId);
    setActiveTab("visuals");
  };

  return (
    <div className="space-y-6 max-w-7xl pb-16 font-sans select-none">
      {/* Toast Notification */}
      <XPToast visible={showXpToast} xp={25} message={toastMessage} />

      {/* Hero Header */}
      <ExerciseHero
        state={calisthenicsState}
        todaySchedule={todaySchedule}
        onStartTodayWorkout={() => setActiveWorkoutDay(todaySchedule)}
        onOpenVisualGuides={() => setActiveTab("visuals")}
        onOpenNutrition={() => setActiveTab("nutrition")}
      />

      {/* Navigation Tabs Bar */}
      <div className="border-b border-zinc-200/90 bg-white rounded-2xl p-1.5 shadow-2xs flex items-center gap-1 overflow-x-auto">
        {[
          { id: "schedule", label: "Weekly Schedule & Today", icon: Calendar },
          { id: "ladders", label: "Movement Progressions", icon: Layers },
          { id: "visuals", label: "Visual Form Guides", icon: Eye, badge: "Generated" },
          { id: "phases", label: "6-Month Roadmap", icon: TrendingUp },
          { id: "nutrition", label: "Nutrition & Safety", icon: Apple },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                isSelected
                  ? "bg-[#154D38] text-white shadow-xs"
                  : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/70"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[9px] uppercase px-1.5 py-0.2 rounded font-black tracking-wider ${
                    isSelected
                      ? "bg-emerald-400/20 text-emerald-200"
                      : "bg-emerald-100 text-[#154D38]"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      {activeTab === "schedule" && (
        <WeeklyScheduleView
          onStartWorkout={(schedule) => setActiveWorkoutDay(schedule)}
        />
      )}

      {activeTab === "ladders" && (
        <ProgressionLaddersView
          onOpenVisualGuide={handleOpenVisualGuideFromLadder}
        />
      )}

      {activeTab === "visuals" && (
        <VisualGuidesGallery initialPattern={selectedVisualPattern} />
      )}

      {activeTab === "phases" && <PhaseRoadmapView />}

      {activeTab === "nutrition" && <NutritionSafetySection />}

      {/* Active Workout Session Modal */}
      {activeWorkoutDay && (
        <ActiveWorkoutRunner
          daySchedule={activeWorkoutDay}
          onClose={() => setActiveWorkoutDay(null)}
          onComplete={handleWorkoutCompleted}
        />
      )}
    </div>
  );
}
