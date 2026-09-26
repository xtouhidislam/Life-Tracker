"use client";

import React from "react";
import {
  Trophy,
  Briefcase,
  GitBranch,
  CheckCircle2,
  Lock,
  Sparkles,
  Zap,
} from "lucide-react";
import { MonthlyMilestone } from "@/lib/roadmap/roadmap-data";

interface SkillTreeGraphProps {
  months: MonthlyMilestone[];
  onSelectMonth: (month: number) => void;
}

export function SkillTreeGraph({ months, onSelectMonth }: SkillTreeGraphProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]";
      case "in_progress":
        return "bg-indigo-500/30 border-indigo-400 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] animate-pulse";
      case "available":
        return "bg-amber-500/20 border-amber-400 text-amber-300";
      default:
        return "bg-zinc-900 border-zinc-800 text-zinc-500 opacity-60";
    }
  };

  return (
    <div className="rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] p-6 sm:p-8 space-y-8 overflow-x-auto">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-indigo-400" />
            <span>Interactive Goal Hierarchy & Skill Tree</span>
          </h2>
          <p className="text-xs text-[var(--text-secondary)]">
            Branching architecture mapping foundational software skills to career upside and productized services.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400" /> Completed
          </span>
          <span className="flex items-center gap-1.5 text-indigo-400">
            <span className="h-2 w-2 rounded-full bg-indigo-400 animate-ping" /> Active
          </span>
          <span className="flex items-center gap-1.5 text-zinc-500">
            <span className="h-2 w-2 rounded-full bg-zinc-600" /> Locked
          </span>
        </div>
      </div>

      {/* Visual Hierarchy */}
      <div className="flex flex-col items-center gap-8 min-w-[760px]">
        {/* Level 0: Apex North Star Node */}
        <div className="relative group">
          <div className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-indigo-500/20 to-emerald-500/20 border-2 border-amber-400/80 text-white shadow-[0_0_30px_rgba(245,158,11,0.25)] flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-400/30">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono font-bold tracking-wider text-amber-300">
                Ultimate Target · Year 2
              </div>
              <div className="text-base font-black tracking-tight">
                $60,000+ Annual Run-Rate ($5,000/mo)
              </div>
            </div>
          </div>
        </div>

        {/* Level 1: 3 Strategic Tracks Trunk */}
        <div className="grid grid-cols-3 gap-6 w-full max-w-4xl relative">
          {/* Track 1 Node */}
          <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/40 text-center space-y-1">
            <div className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider">
              Track 1: Internal Move
            </div>
            <div className="text-xs text-white font-semibold">
              Automation Lead (Months 1–6)
            </div>
            <span className="text-[10px] text-emerald-400 font-mono">80% Probability</span>
          </div>

          {/* Track 2 Node */}
          <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-center space-y-1">
            <div className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider">
              Track 2: Remote AI Roles
            </div>
            <div className="text-xs text-white font-semibold">
              AI Implementation Engineer (Months 6–10)
            </div>
            <span className="text-[10px] text-cyan-400 font-mono">65% High Leverage</span>
          </div>

          {/* Track 3 Node */}
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-1">
            <div className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
              Track 3: Zenin AI Services
            </div>
            <div className="text-xs text-white font-semibold">
              Productized Agency ($25–80/hr)
            </div>
            <span className="text-[10px] text-amber-400 font-mono">Compounding Upside</span>
          </div>
        </div>

        {/* Level 2: 12 Monthly Milestones Grid */}
        <div className="w-full space-y-6">
          <div className="text-xs font-bold uppercase tracking-wider text-zinc-400 text-center">
            12-Month Sequential Skill Progression
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {months.map((m) => (
              <div
                key={m.month}
                onClick={() => onSelectMonth(m.month)}
                className={`cursor-pointer p-3.5 rounded-xl border flex flex-col justify-between transition-all hover:scale-105 ${getStatusColor(
                  m.status
                )}`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold font-mono">
                    <span>M{m.month < 10 ? `0${m.month}` : m.month}</span>
                    {m.status === "completed" ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    ) : m.status === "in_progress" ? (
                      <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                    ) : (
                      <Lock className="h-3 w-3 text-zinc-600" />
                    )}
                  </div>
                  <div className="text-xs font-bold line-clamp-2 text-white">
                    {m.title.split("(")[0]}
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-between text-[10px]">
                  <span className="text-zinc-400 font-medium">
                    {m.weeks.filter((w) => w.is_completed).length}/{m.weeks.length} Weeks
                  </span>
                  <span className="text-amber-400 font-bold">
                    +{m.xp_reward} XP
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
