"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dumbbell,
  Play,
  Eye,
  Trophy,
  Flame,
  Zap,
  Target,
  Shield,
  Apple,
  Clock,
  Sparkles,
  Layers,
} from "lucide-react";
import { CalisthenicsState } from "@/lib/storage/calisthenics-store";
import { DaySchedule } from "@/lib/exercises/calisthenics-data";

interface ExerciseHeroProps {
  state: CalisthenicsState;
  todaySchedule: DaySchedule;
  onStartTodayWorkout: () => void;
  onOpenVisualGuides: () => void;
  onOpenNutrition: () => void;
}

export function ExerciseHero({
  state,
  todaySchedule,
  onStartTodayWorkout,
  onOpenVisualGuides,
  onOpenNutrition,
}: ExerciseHeroProps) {
  const phaseLabel =
    state.currentPhase === 1
      ? "Phase 1: Foundation (Mo 1–2)"
      : state.currentPhase === 2
      ? "Phase 2: Growth (Mo 3–4)"
      : "Phase 3: Definition (Mo 5–6)";

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-[#0F382A] text-white p-6 sm:p-8 shadow-xl border border-zinc-800">
      {/* Subtle Background Glow Rings */}
      <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-60 h-60 rounded-full bg-emerald-400/5 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left: Titles & Blueprint info */}
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2.5 py-0.5 rounded-full">
              Zero to Visible Muscle
            </span>
            <span className="text-zinc-500 text-xs">•</span>
            <span className="text-xs text-zinc-300 font-semibold">{phaseLabel}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            6-Month Calisthenics Protocol
          </h1>

          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-xl font-normal">
            Starting point: zero push-ups. No equipment needed. Built to slot seamlessly into your
            daily routine — 4 weekday sessions (~40m) and 1 high-volume weekend session.
          </p>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-3 pt-2 flex-wrap">
            {!todaySchedule.isRestDay ? (
              <Button
                variant="primary"
                onClick={onStartTodayWorkout}
                className="gap-2 text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-5 py-2.5 shadow-md shadow-emerald-500/20"
              >
                <Play className="h-4 w-4 fill-zinc-950" />
                <span>Start {todaySchedule.dayName}&apos;s Workout ({todaySchedule.durationMinutes}m)</span>
              </Button>
            ) : (
              <Button
                variant="secondary"
                onClick={onStartTodayWorkout}
                className="gap-2 text-xs font-bold bg-white/10 hover:bg-white/20 text-white border-white/10 px-4 py-2"
              >
                <Clock className="h-4 w-4 text-emerald-300" />
                <span>View Today&apos;s Active Recovery</span>
              </Button>
            )}

            <Button
              variant="outline"
              onClick={onOpenVisualGuides}
              className="gap-2 text-xs font-semibold bg-white/5 hover:bg-white/10 text-white border-white/15 px-4 py-2"
            >
              <Eye className="h-4 w-4 text-emerald-400" />
              <span>Visual Form Guides</span>
            </Button>

            <Button
              variant="ghost"
              onClick={onOpenNutrition}
              className="gap-2 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/5 px-3 py-2"
            >
              <Apple className="h-4 w-4 text-emerald-400" />
              <span>Protein Target</span>
            </Button>
          </div>
        </div>

        {/* Right: Ladder Progress Dashboard Chips */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 shrink-0 lg:w-72">
          <div className="bg-white/5 backdrop-blur-xs border border-white/10 rounded-2xl p-3.5">
            <div className="flex items-center justify-between text-zinc-400 mb-1">
              <span className="text-[10px] uppercase font-bold tracking-wider">Push Ladder</span>
              <Flame className="h-3.5 w-3.5 text-emerald-400" />
            </div>
            <div className="text-lg font-black text-white">
              Level {state.userLevels.push} <span className="text-xs text-zinc-400 font-normal">/ 6</span>
            </div>
            <div className="text-[10px] text-emerald-300/80 truncate mt-0.5">
              {state.userLevels.push === 1
                ? "Wall Push-up"
                : state.userLevels.push === 2
                ? "Incline Push-up"
                : state.userLevels.push === 3
                ? "Knee Push-up"
                : state.userLevels.push === 4
                ? "Full Push-up"
                : state.userLevels.push === 5
                ? "Diamond / Pike"
                : "Decline Push-up"}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xs border border-white/10 rounded-2xl p-3.5">
            <div className="flex items-center justify-between text-zinc-400 mb-1">
              <span className="text-[10px] uppercase font-bold tracking-wider">Pull Ladder</span>
              <Zap className="h-3.5 w-3.5 text-amber-400" />
            </div>
            <div className="text-lg font-black text-white">
              Level {state.userLevels.pull} <span className="text-xs text-zinc-400 font-normal">/ 5</span>
            </div>
            <div className="text-[10px] text-amber-300/80 truncate mt-0.5">
              {state.userLevels.pull === 1
                ? "Doorframe Rows"
                : state.userLevels.pull === 2
                ? "Table Rows"
                : state.userLevels.pull === 3
                ? "Superman Holds"
                : state.userLevels.pull === 4
                ? "Negative Pull-ups"
                : "Full Pull-ups"}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xs border border-white/10 rounded-2xl p-3.5">
            <div className="flex items-center justify-between text-zinc-400 mb-1">
              <span className="text-[10px] uppercase font-bold tracking-wider">Legs Ladder</span>
              <Target className="h-3.5 w-3.5 text-sky-400" />
            </div>
            <div className="text-lg font-black text-white">
              Level {state.userLevels.legs} <span className="text-xs text-zinc-400 font-normal">/ 5</span>
            </div>
            <div className="text-[10px] text-sky-300/80 truncate mt-0.5">
              {state.userLevels.legs === 1
                ? "Air Squats"
                : state.userLevels.legs === 2
                ? "Split Squats"
                : state.userLevels.legs === 3
                ? "Bulgarian Split"
                : state.userLevels.legs === 4
                ? "Assisted Pistol"
                : "Full Pistol"}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xs border border-white/10 rounded-2xl p-3.5">
            <div className="flex items-center justify-between text-zinc-400 mb-1">
              <span className="text-[10px] uppercase font-bold tracking-wider">Core Ladder</span>
              <Shield className="h-3.5 w-3.5 text-rose-400" />
            </div>
            <div className="text-lg font-black text-white">
              Level {state.userLevels.core} <span className="text-xs text-zinc-400 font-normal">/ 5</span>
            </div>
            <div className="text-[10px] text-rose-300/80 truncate mt-0.5">
              {state.userLevels.core === 1
                ? "Knee Plank"
                : state.userLevels.core === 2
                ? "Full Plank"
                : state.userLevels.core === 3
                ? "Hollow Body"
                : state.userLevels.core === 4
                ? "Leg Raises"
                : "L-Sit"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
