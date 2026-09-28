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

// 12-Month Theme Palettes for rich visual variety
const MONTH_PALETTES: Record<
  number,
  {
    theme: string;
    lockedContainer: string;
    tagText: string;
    titleColor: string;
    lockIconColor: string;
    borderAccent: string;
  }
> = {
  1: {
    theme: "Foundations (Python & DB)",
    lockedContainer: "bg-emerald-100/70 border-emerald-300 text-zinc-900",
    tagText: "text-emerald-900 bg-emerald-200/70",
    titleColor: "text-zinc-900",
    lockIconColor: "text-emerald-700",
    borderAccent: "border-emerald-400",
  },
  2: {
    theme: "Backend Engineering",
    lockedContainer: "bg-amber-100/70 border-amber-300 text-zinc-900",
    tagText: "text-amber-900 bg-amber-200/70",
    titleColor: "text-zinc-900",
    lockIconColor: "text-amber-700",
    borderAccent: "border-amber-400",
  },
  3: {
    theme: "LLM Core & Prompting",
    lockedContainer: "bg-amber-100/70 border-amber-300 text-zinc-900",
    tagText: "text-amber-900 bg-amber-200/70",
    titleColor: "text-zinc-900",
    lockIconColor: "text-amber-700",
    borderAccent: "border-amber-400",
  },
  4: {
    theme: "RAG & Vector Pipelines",
    lockedContainer: "bg-blue-100/75 border-blue-300/90 text-zinc-900",
    tagText: "text-blue-900 bg-blue-200/70",
    titleColor: "text-zinc-900",
    lockIconColor: "text-blue-600",
    borderAccent: "border-blue-400",
  },
  5: {
    theme: "Autonomous Agentic Workflows",
    lockedContainer: "bg-indigo-100/75 border-indigo-300/90 text-zinc-900",
    tagText: "text-indigo-900 bg-indigo-200/70",
    titleColor: "text-zinc-900",
    lockIconColor: "text-indigo-600",
    borderAccent: "border-indigo-400",
  },
  6: {
    theme: "Production Capstone",
    lockedContainer: "bg-purple-100/75 border-purple-300/90 text-zinc-900",
    tagText: "text-purple-900 bg-purple-200/70",
    titleColor: "text-zinc-900",
    lockIconColor: "text-purple-600",
    borderAccent: "border-purple-400",
  },
  7: {
    theme: "Technical Interviews & Hiring",
    lockedContainer: "bg-sky-100/75 border-sky-300/90 text-zinc-900",
    tagText: "text-sky-900 bg-sky-200/70",
    titleColor: "text-zinc-900",
    lockIconColor: "text-sky-600",
    borderAccent: "border-sky-400",
  },
  8: {
    theme: "Zenin AI Services Launch",
    lockedContainer: "bg-teal-100/75 border-teal-300/90 text-zinc-900",
    tagText: "text-teal-900 bg-teal-200/70",
    titleColor: "text-zinc-900",
    lockIconColor: "text-teal-600",
    borderAccent: "border-teal-400",
  },
  9: {
    theme: "Open Source & Paid Clients",
    lockedContainer: "bg-rose-100/75 border-rose-300/90 text-zinc-900",
    tagText: "text-rose-900 bg-rose-200/70",
    titleColor: "text-zinc-900",
    lockIconColor: "text-rose-600",
    borderAccent: "border-rose-400",
  },
  10: {
    theme: "Real Client Conversion",
    lockedContainer: "bg-orange-100/75 border-orange-300/90 text-zinc-900",
    tagText: "text-orange-900 bg-orange-200/70",
    titleColor: "text-zinc-900",
    lockIconColor: "text-orange-600",
    borderAccent: "border-orange-400",
  },
  11: {
    theme: "Productized Agency Retainers",
    lockedContainer: "bg-amber-100/80 border-amber-300/90 text-zinc-900",
    tagText: "text-amber-950 bg-amber-200/80",
    titleColor: "text-zinc-900",
    lockIconColor: "text-amber-700",
    borderAccent: "border-amber-500",
  },
  12: {
    theme: "$60K Mastery & Scale",
    lockedContainer: "bg-emerald-100/80 border-emerald-300/90 text-zinc-900",
    tagText: "text-emerald-950 bg-emerald-200/80",
    titleColor: "text-zinc-900",
    lockIconColor: "text-emerald-700",
    borderAccent: "border-emerald-500",
  },
};

export function SkillTreeGraph({ months, onSelectMonth }: SkillTreeGraphProps) {
  const getCardStyle = (status: string, month: number) => {
    const palette = MONTH_PALETTES[month] || MONTH_PALETTES[1];

    switch (status) {
      case "completed":
        return {
          container:
            "bg-emerald-50 border-2 border-emerald-400 text-zinc-900 shadow-2xs hover:border-emerald-500 hover:shadow-sm",
          monthBadge: "text-emerald-900 bg-emerald-100/90 px-1.5 py-0.5 rounded-md",
          titleText: "text-zinc-900 font-black",
          weeksText: "text-emerald-800 font-bold",
          xpText: "text-emerald-800 font-black",
          icon: <CheckCircle2 className="h-4 w-4 text-emerald-600 stroke-[2.5]" />,
        };
      case "in_progress":
        return {
          // Beating/pulsing heartbeat glow effect requested by user
          container:
            "bg-white border-2 border-[#154D38] shadow-[0_0_22px_rgba(21,77,56,0.35)] ring-2 ring-[#154D38] animate-pulse hover:shadow-xl hover:scale-105",
          monthBadge: "text-white bg-[#154D38] px-1.5 py-0.5 rounded-md shadow-xs",
          titleText: "text-zinc-950 font-black",
          weeksText: "text-zinc-800 font-bold",
          xpText: "text-amber-700 font-black",
          icon: <Sparkles className="h-4 w-4 text-[#154D38] stroke-[2.5] animate-spin" />,
        };
      case "available":
        return {
          container:
            "bg-amber-50/80 border-2 border-amber-300 text-zinc-900 shadow-2xs hover:border-amber-400",
          monthBadge: "text-amber-900 bg-amber-200/80 px-1.5 py-0.5 rounded-md",
          titleText: "text-zinc-900 font-bold",
          weeksText: "text-zinc-700 font-semibold",
          xpText: "text-amber-700 font-bold",
          icon: <Lock className="h-3.5 w-3.5 text-amber-600" />,
        };
      default:
        // Locked: Slightly darker card tone with unique phase color variation
        return {
          container: `${palette.lockedContainer} border shadow-2xs hover:scale-102 transition-all`,
          monthBadge: `${palette.tagText} px-1.5 py-0.5 rounded-md font-black`,
          titleText: `${palette.titleColor} font-bold`,
          weeksText: "text-zinc-600 font-medium",
          xpText: "text-zinc-700 font-bold",
          icon: <Lock className={`h-3.5 w-3.5 ${palette.lockIconColor}`} />,
        };
    }
  };

  return (
    <div className="rounded-3xl bg-white border border-zinc-200/90 p-6 sm:p-8 space-y-8 overflow-x-auto shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-black text-zinc-900 tracking-tight flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-[#154D38]" />
            <span>Interactive Goal Hierarchy & Skill Tree</span>
          </h2>
          <p className="text-xs text-zinc-600 font-medium">
            Branching architecture mapping foundational software skills to career upside and productized services.
          </p>
        </div>

        <div className="flex items-center gap-2.5 text-xs font-bold">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Completed
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-[#154D38] border border-emerald-300 animate-pulse">
            <span className="h-2 w-2 rounded-full bg-[#154D38] animate-ping" /> Active Sprint
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-200 text-zinc-800 border border-zinc-300 font-bold">
            <span className="h-2 w-2 rounded-full bg-zinc-500" /> Locked (Color-Coded)
          </span>
        </div>
      </div>

      {/* Visual Hierarchy */}
      <div className="flex flex-col items-center gap-8 min-w-[760px]">
        {/* Level 0: Apex North Star Node */}
        <div className="relative group">
          <div className="px-7 py-4.5 rounded-2xl bg-gradient-to-r from-amber-50 via-emerald-50/50 to-teal-50 border-2 border-amber-400 text-zinc-900 shadow-md flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black shadow-md shadow-amber-500/25">
              <Trophy className="h-6 w-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-xs uppercase font-mono font-black tracking-wider text-amber-800">
                Ultimate Target · Year 2
              </div>
              <div className="text-lg sm:text-xl font-black tracking-tight text-zinc-950">
                $60,000+ Annual Run-Rate ($5,000/mo)
              </div>
            </div>
          </div>
        </div>

        {/* Level 1: 3 Strategic Tracks Trunk */}
        <div className="grid grid-cols-3 gap-6 w-full max-w-4xl relative">
          {/* Track 1 Node */}
          <div className="p-4.5 rounded-2xl bg-indigo-50/80 border-2 border-indigo-200 text-center space-y-1.5 shadow-2xs">
            <div className="text-xs font-black text-indigo-900 uppercase tracking-wider">
              Track 1: Internal Move
            </div>
            <div className="text-sm text-zinc-900 font-bold">
              Automation Lead (Months 1–6)
            </div>
            <span className="inline-block px-3 py-0.5 rounded-full text-xs font-bold font-mono bg-indigo-100 text-indigo-800 border border-indigo-200">
              80% Probability
            </span>
          </div>

          {/* Track 2 Node */}
          <div className="p-4.5 rounded-2xl bg-sky-50/80 border-2 border-sky-200 text-center space-y-1.5 shadow-2xs">
            <div className="text-xs font-black text-sky-900 uppercase tracking-wider">
              Track 2: Remote AI Roles
            </div>
            <div className="text-sm text-zinc-900 font-bold">
              AI Implementation Engineer (Months 6–10)
            </div>
            <span className="inline-block px-3 py-0.5 rounded-full text-xs font-bold font-mono bg-sky-100 text-sky-800 border border-sky-200">
              65% High Leverage
            </span>
          </div>

          {/* Track 3 Node */}
          <div className="p-4.5 rounded-2xl bg-emerald-50/80 border-2 border-emerald-200 text-center space-y-1.5 shadow-2xs">
            <div className="text-xs font-black text-[#154D38] uppercase tracking-wider">
              Track 3: Zenin AI Services
            </div>
            <div className="text-sm text-zinc-900 font-bold">
              Productized Agency ($25–80/hr)
            </div>
            <span className="inline-block px-3 py-0.5 rounded-full text-xs font-bold font-mono bg-emerald-100 text-[#154D38] border border-emerald-300">
              Compounding Upside
            </span>
          </div>
        </div>

        {/* Level 2: 12 Monthly Milestones Grid */}
        <div className="w-full space-y-5">
          <div className="text-xs font-black uppercase tracking-wider text-zinc-700 text-center">
            12-Month Sequential Skill Progression
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {months.map((m) => {
              const styles = getCardStyle(m.status, m.month);
              return (
                <div
                  key={m.month}
                  onClick={() => onSelectMonth(m.month)}
                  className={`cursor-pointer p-3.5 rounded-2xl flex flex-col justify-between transition-all ${styles.container}`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono font-black">
                      <span className={styles.monthBadge}>
                        M{m.month < 10 ? `0${m.month}` : m.month}
                      </span>
                      {styles.icon}
                    </div>
                    <div className={`text-xs leading-snug line-clamp-2 ${styles.titleText}`}>
                      {m.title.split("(")[0]}
                    </div>
                  </div>

                  <div className="pt-2.5 flex items-center justify-between text-[11px] border-t border-black/5 mt-2">
                    <span className={styles.weeksText}>
                      {m.weeks.filter((w) => w.is_completed).length}/{m.weeks.length} Weeks
                    </span>
                    <span className={styles.xpText}>
                      +{m.xp_reward} XP
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
