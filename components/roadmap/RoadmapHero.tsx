"use client";

import React from "react";
import {
  Trophy,
  Target,
  Sparkles,
  Zap,
  Briefcase,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { StrategicTrack, STRATEGIC_TRACKS } from "@/lib/roadmap/roadmap-data";
import { Badge } from "@/components/ui/badge";

interface RoadmapHeroProps {
  totalMonths: number;
  completedMonths: number;
  totalXpEarned: number;
  totalXpAvailable: number;
  selectedTrack: string;
  onSelectTrack: (trackId: string) => void;
}

export function RoadmapHero({
  totalMonths,
  completedMonths,
  totalXpEarned,
  totalXpAvailable,
  selectedTrack,
  onSelectTrack,
}: RoadmapHeroProps) {
  const overallPercent = Math.round((completedMonths / totalMonths) * 100);

  return (
    <div className="space-y-6">
      {/* North Star Hero Banner - Luxury Forest Green */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#154D38] via-[#0E3425] to-[#071A13] border border-[#164E3A] p-6 sm:p-8 text-white shadow-xl">
        {/* Ambient subtle glow */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-16 w-72 h-72 bg-emerald-400/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-xs font-bold text-emerald-200">
              <Trophy className="h-3.5 w-3.5 text-amber-300" />
              <span>NORTH STAR VISION · 12-MONTH AI IMPLEMENTATION ROADMAP</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Zenin AI · AI Implementation Engineer Track
            </h1>

            <p className="text-sm text-emerald-100/80 leading-relaxed">
              Target:{" "}
              <span className="text-white font-black underline decoration-emerald-400 underline-offset-2">
                $60,000 / year (~$5,000 / month)
              </span>{" "}
              by Year 2 via ~15 hrs/week disciplined execution. Converting software foundations
              into client-ready AI systems, automated workflows, and high-margin productized services.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
              <span className="text-emerald-200/80">
                Current State:{" "}
                <span className="text-amber-300 font-bold">Month 2 (FastAPI & Support API)</span>
              </span>
              <span className="text-emerald-300/40">•</span>
              <span className="text-emerald-200 font-semibold">
                Weekly Allocation: 15 hrs (6h Study, 3h Exercises, 4h Project, 2h Biz)
              </span>
            </div>
          </div>

          {/* Right: Progress Meter & Stats */}
          <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-4 min-w-[260px] p-5 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-200/80">
                12-Month Progress
              </span>
              <span className="text-sm font-black text-emerald-300 font-mono">
                {overallPercent}% Complete
              </span>
            </div>

            {/* Glowing progress bar */}
            <div className="h-3 w-full bg-black/20 rounded-full overflow-hidden border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full transition-all duration-700 shadow-[0_0_12px_#34d399]"
                style={{ width: `${Math.max(8, overallPercent)}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1 border-t border-white/10">
              <div>
                <span className="text-[10px] text-emerald-200/60 uppercase tracking-wider block">
                  Milestones
                </span>
                <span className="text-base font-bold text-white">
                  {completedMonths} / {totalMonths} Months
                </span>
              </div>
              <div>
                <span className="text-[10px] text-emerald-200/60 uppercase tracking-wider block">
                  Roadmap XP
                </span>
                <span className="text-base font-bold text-amber-300 flex items-center gap-1">
                  <Zap className="h-3 w-3 fill-amber-300" />
                  +{totalXpEarned} XP
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Strategic Tracks Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {STRATEGIC_TRACKS.map((t) => {
          const isSelected = selectedTrack === t.id;
          return (
            <div
              key={t.id}
              onClick={() => onSelectTrack(isSelected ? "all" : t.id)}
              className={`cursor-pointer rounded-2xl p-5 border transition-all duration-300 relative bg-white ${
                isSelected
                  ? "border-[#154D38] bg-emerald-50/40 shadow-xs ring-1 ring-[#154D38]"
                  : "border-zinc-200/90 shadow-2xs hover:border-zinc-300 hover:shadow-xs"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5 text-[#154D38]" />
                  {t.name}
                </span>
                <Badge variant={isSelected ? "forest" : "outline"} className="text-[10px]">
                  {t.probability}
                </Badge>
              </div>

              <div className="text-xs font-semibold text-[#154D38] mb-1">
                Role: {t.targetRole}
              </div>

              <p className="text-xs text-zinc-500 leading-relaxed mb-3">
                {t.description}
              </p>

              <div className="pt-2 border-t border-zinc-100 text-[11px] text-zinc-400">
                <span className="text-zinc-500 font-medium">Timeline:</span> {t.timeline}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
