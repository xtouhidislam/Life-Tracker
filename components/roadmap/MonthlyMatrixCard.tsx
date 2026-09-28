"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Lock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Briefcase,
  Zap,
  Code,
  BookOpen,
  ArrowRight,
  FolderGit2,
} from "lucide-react";
import { MonthlyMilestone } from "@/lib/roadmap/roadmap-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface MonthlyMatrixCardProps {
  milestone: MonthlyMilestone;
  onToggleMilestone: (month: number) => void;
  onToggleWeek: (month: number, week: number) => void;
}

export function MonthlyMatrixCard({
  milestone,
  onToggleMilestone,
  onToggleWeek,
}: MonthlyMatrixCardProps) {
  const [isExpanded, setIsExpanded] = useState(
    milestone.status === "in_progress" || milestone.month === 2
  );

  const getStatusBadge = () => {
    switch (milestone.status) {
      case "completed":
        return (
          <Badge variant="mint" className="gap-1 font-bold">
            <CheckCircle2 className="h-3 w-3" /> Completed
          </Badge>
        );
      case "in_progress":
        return (
          <Badge variant="forest" className="gap-1 font-bold">
            <Sparkles className="h-3 w-3" /> Active Sprint
          </Badge>
        );
      case "available":
        return (
          <Badge variant="amber" className="font-bold">
            Available Next
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-zinc-400 border-zinc-200 gap-1 font-medium">
            <Lock className="h-2.5 w-2.5" /> Locked
          </Badge>
        );
    }
  };

  const isLocked = milestone.status === "locked";
  const completedWeeksCount = milestone.weeks.filter((w) => w.is_completed).length;

  return (
    <div
      className={`rounded-2xl border transition-all duration-300 overflow-hidden bg-white ${
        milestone.status === "in_progress"
          ? "border-[#154D38] shadow-xs ring-1 ring-[#154D38]"
          : milestone.status === "completed"
          ? "border-zinc-200/90"
          : isLocked
          ? "border-zinc-200 bg-zinc-50/50"
          : "border-zinc-200/90 hover:border-zinc-300"
      }`}
    >
      {/* Header bar */}
      <div className="p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200">
              Month {milestone.month < 10 ? `0${milestone.month}` : milestone.month}
            </span>
            <span className="text-xs text-zinc-500 font-medium">
              {milestone.phase}
            </span>
            <span className="text-zinc-300">•</span>
            <span className="text-xs font-semibold text-[#154D38]">
              {milestone.trackFocus}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {getStatusBadge()}
            <span className="text-xs font-bold text-amber-700 flex items-center gap-1">
              <Zap className="h-3 w-3 fill-amber-500 text-amber-500" />
              +{milestone.xp_reward} XP
            </span>
          </div>
        </div>

        {/* Title & Flagship Project */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-900">
              {milestone.title}
            </h3>
            {milestone.flagshipProject && (
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700">
                <FolderGit2 className="h-3.5 w-3.5 text-[#154D38]" />
                <span>Flagship: {milestone.flagshipProject}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={milestone.is_completed ? "secondary" : "primary"}
              onClick={() => onToggleMilestone(milestone.month)}
              disabled={isLocked}
              className={`text-xs font-bold gap-1.5 ${
                !milestone.is_completed ? "bg-[#154D38] hover:bg-[#0F382A] text-white shadow-xs" : ""
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{milestone.is_completed ? "Milestone Unlocked ✓" : "Mark Milestone Complete"}</span>
            </Button>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-600 transition-colors"
              title={isExpanded ? "Collapse curriculum" : "Expand curriculum"}
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Milestone Goal Description */}
        <p className="text-xs text-zinc-600 leading-relaxed bg-zinc-50 p-3.5 rounded-xl border border-zinc-200/80">
          <span className="text-zinc-800 font-bold">Monthly Milestone Target: </span>
          {milestone.milestoneDescription}
        </p>
      </div>

      {/* Expandable Weekly Breakdown & Career Actions */}
      {isExpanded && (
        <div className="border-t border-zinc-100 bg-zinc-50/50 p-5 sm:p-6 space-y-5">
          {/* Weekly Deliverables */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
                <Code className="h-3.5 w-3.5 text-[#154D38]" />
                Weekly Curriculum & Build Deliverables ({completedWeeksCount} / {milestone.weeks.length} Completed)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {milestone.weeks.map((week) => (
                <div
                  key={week.week}
                  className={`p-4 rounded-xl border transition-all ${
                    week.is_completed
                      ? "bg-emerald-50/70 border-emerald-200 text-zinc-700"
                      : "bg-white border-zinc-200 text-zinc-800 shadow-2xs"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-[#154D38] font-mono">
                          Week {week.week}
                        </span>
                        <span className="text-[10px] text-amber-700 font-semibold">
                          +{week.xp_reward} XP
                        </span>
                      </div>

                      {/* Learn */}
                      <p className="text-[11px] text-zinc-500 line-clamp-2">
                        <span className="text-zinc-600 font-semibold">Learn: </span>
                        {week.learn}
                      </p>

                      {/* Build */}
                      <p className="text-xs font-bold text-zinc-900">
                        <span className="text-emerald-700 font-semibold">Build: </span>
                        {week.build}
                      </p>
                    </div>

                    <button
                      onClick={() => onToggleWeek(milestone.month, week.week)}
                      className={`shrink-0 mt-1 h-5 w-5 rounded-md border flex items-center justify-center transition-all ${
                        week.is_completed
                          ? "bg-[#154D38] border-[#154D38] text-white shadow-xs"
                          : "border-zinc-300 hover:border-[#154D38] bg-white text-transparent"
                      }`}
                      title={week.is_completed ? "Mark incomplete" : "Check off deliverable (+25 XP)"}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Career & Income Actions */}
          {milestone.careerActions.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-zinc-200/70">
              <span className="text-xs font-bold text-[#154D38] uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5 text-[#154D38]" />
                Strategic Career / Income Actions This Month
              </span>

              <div className="space-y-1.5">
                {milestone.careerActions.map((ca, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white border border-zinc-200 text-xs text-zinc-700"
                  >
                    <ArrowRight className="h-3.5 w-3.5 text-[#154D38] shrink-0" />
                    <span>{ca.action}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
