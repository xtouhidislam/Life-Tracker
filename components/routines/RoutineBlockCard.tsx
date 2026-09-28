"use client";

import React from "react";
import Link from "next/link";
import {
  Sunrise,
  Dumbbell,
  Laptop,
  Briefcase,
  Coffee,
  BookOpen,
  Brain,
  Utensils,
  TrendingUp,
  Moon,
  GraduationCap,
  Users,
  Clock,
  Check,
  Zap,
  Play,
  Pencil,
} from "lucide-react";
import { RoutineBlock, formatTo12Hour } from "@/lib/routines/routine-utils";

interface RoutineBlockCardProps {
  block: RoutineBlock;
  isActive: boolean;
  onToggle: (block: RoutineBlock) => void;
  onEdit?: (block: RoutineBlock) => void;
  disabled?: boolean;
}

export function RoutineBlockCard({
  block,
  isActive,
  onToggle,
  onEdit,
  disabled = false,
}: RoutineBlockCardProps) {
  const getIcon = (name: string) => {
    switch (name) {
      case "Sunrise":
        return <Sunrise className="h-4 w-4" />;
      case "Dumbbell":
        return <Dumbbell className="h-4 w-4" />;
      case "Laptop":
        return <Laptop className="h-4 w-4" />;
      case "Briefcase":
        return <Briefcase className="h-4 w-4" />;
      case "Coffee":
        return <Coffee className="h-4 w-4" />;
      case "BookOpen":
        return <BookOpen className="h-4 w-4" />;
      case "Brain":
        return <Brain className="h-4 w-4" />;
      case "Utensils":
        return <Utensils className="h-4 w-4" />;
      case "TrendingUp":
        return <TrendingUp className="h-4 w-4" />;
      case "Moon":
        return <Moon className="h-4 w-4" />;
      case "GraduationCap":
        return <GraduationCap className="h-4 w-4" />;
      case "Users":
        return <Users className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getEnergyBadge = (level: string) => {
    switch (level) {
      case "high":
        return {
          label: "High Focus",
          className: "bg-rose-50 text-rose-700 border-rose-200",
        };
      case "medium":
        return {
          label: "Medium Energy",
          className: "bg-amber-50 text-amber-700 border-amber-200",
        };
      case "low":
        return {
          label: "Low / Peaceful",
          className: "bg-sky-50 text-sky-700 border-sky-200",
        };
      case "rest":
        return {
          label: "Rest & Recovery",
          className: "bg-purple-50 text-purple-700 border-purple-200",
        };
      default:
        return {
          label: "Standard",
          className: "bg-zinc-100 text-zinc-700 border-zinc-200",
        };
    }
  };

  const energy = getEnergyBadge(block.energy_level);
  const isFocusable = ["Work", "Study", "Knowledge", "Trading", "Education"].includes(block.activity_type);

  return (
    <div
      className={`group relative rounded-2xl p-4 sm:p-5 transition-all duration-200 border ${
        isActive
          ? "bg-emerald-50/40 border-[#154D38] shadow-md ring-1 ring-[#154D38]/20"
          : block.is_completed
          ? "bg-zinc-50/50 border-zinc-200"
          : "bg-white border-zinc-200/90 hover:border-zinc-300 hover:shadow-sm"
      }`}
    >
      <div className="flex items-start justify-between gap-3 sm:gap-4">
        {/* Sequence & Time Indicator */}
        <div className="flex items-start gap-3.5 min-w-0">
          {/* Completion Checkbox */}
          <button
            onClick={() => onToggle(block)}
            disabled={disabled}
            className={`mt-0.5 shrink-0 h-6 w-6 rounded-lg border flex items-center justify-center transition-all ${
              block.is_completed
                ? "bg-[#154D38] border-[#154D38] text-white shadow-sm"
                : "border-zinc-300 hover:border-[#154D38] bg-zinc-50 text-transparent hover:text-zinc-400"
            }`}
            title={block.is_completed ? "Mark incomplete" : `Complete block (+${block.xp_reward} XP)`}
          >
            <Check className="h-3.5 w-3.5 stroke-[3]" />
          </button>

          {/* Details */}
          <div className="space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-zinc-400 font-medium">
                #{block.num < 10 ? `0${block.num}` : block.num}
              </span>

              {/* Time Range */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-100 border border-zinc-200 text-[11px] font-semibold text-zinc-700">
                <Clock className="h-3 w-3 text-zinc-500" />
                <span>
                  {formatTo12Hour(block.start_time)} – {formatTo12Hour(block.end_time)}
                </span>
              </div>

              {/* Duration Tag */}
              <span className="text-[11px] text-zinc-500 font-medium">
                {block.duration_minutes >= 60
                  ? `${Math.floor(block.duration_minutes / 60)}h ${
                      block.duration_minutes % 60 > 0 ? `${block.duration_minutes % 60}m` : ""
                    }`
                  : `${block.duration_minutes}m`}
              </span>

              {/* Active Pulse Pill */}
              {isActive && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100/80 border border-emerald-300 text-[11px] font-bold text-[#154D38] animate-pulse">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#154D38]" />
                  ACTIVE NOW
                </span>
              )}
            </div>

            {/* Block Title & Activity Badge */}
            <div className="flex items-center gap-2">
              <h3
                className={`text-base font-bold tracking-tight transition-colors ${
                  block.is_completed
                    ? "line-through text-zinc-400"
                    : "text-zinc-900"
                }`}
              >
                {block.title}
              </h3>

              <div className="shrink-0 p-1 rounded-md bg-zinc-100 text-zinc-600">
                {getIcon(block.icon_name)}
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-zinc-500 leading-relaxed max-w-2xl">
              {block.description}
            </p>

            {/* Bottom Tag Bar */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span
                className={`text-[10px] font-medium px-2 py-0.5 rounded-md border ${energy.className}`}
              >
                {energy.label}
              </span>

              <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-zinc-100 border border-zinc-200 text-zinc-600">
                {block.activity_type}
              </span>

              <span className="text-[10px] font-semibold text-amber-600 flex items-center gap-1">
                <Zap className="h-2.5 w-2.5 fill-amber-500" />
                +{block.xp_reward} XP
              </span>
            </div>
          </div>
        </div>

        {/* Right CTA Area */}
        <div className="shrink-0 flex items-center gap-1.5 sm:gap-2">
          {onEdit && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(block);
              }}
              className="p-1.5 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 hover:border-zinc-300 text-zinc-500 hover:text-zinc-900 transition-all shadow-2xs"
              title="Edit routine task"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          )}

          {isFocusable && !block.is_completed && (
            <Link
              href={`/focus?title=${encodeURIComponent(block.title)}&duration=${Math.min(block.duration_minutes, 60)}`}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-[#154D38] border border-emerald-200 transition-all hover:scale-105"
            >
              <Play className="h-3 w-3 fill-[#154D38]" />
              <span>Focus</span>
            </Link>
          )}

          {block.is_completed && (
            <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1 py-1">
              <Check className="h-3.5 w-3.5" /> Checked
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
