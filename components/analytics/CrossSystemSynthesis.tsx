"use client";

import React from "react";
import Link from "next/link";
import {
  CheckSquare,
  Flame,
  Sunrise,
  Compass,
  Target,
  Wallet,
  ArrowUpRight,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface CrossSystemSynthesisProps {
  stats: {
    tasksCompleted: number;
    tasksTotal: number;
    streak: number;
    habitRate: number;
    focusHours: number;
    expensesSpent: number;
    remainingBuffer: number;
  };
}

export function CrossSystemSynthesis({ stats }: CrossSystemSynthesisProps) {
  const SYSTEMS = [
    {
      name: "Tasks Engine",
      href: "/tasks",
      icon: CheckSquare,
      iconColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
      headline: `${stats.tasksCompleted} / ${stats.tasksTotal} Objectives Cleared`,
      subtext: "Prioritized daily quest deliverables with XP rewards",
      badge: `${Math.round((stats.tasksCompleted / (stats.tasksTotal || 1)) * 100)}% Rate`,
    },
    {
      name: "Habits & Consistency",
      href: "/habits",
      icon: Flame,
      iconColor: "text-amber-700 bg-amber-50 border-amber-200",
      headline: `${stats.streak}-Day Active Streak`,
      subtext: "Consistency heatmap & gamified badge achievements",
      badge: `${stats.habitRate}% Target`,
    },
    {
      name: "Daily Routine Rhythms",
      href: "/routine",
      icon: Sunrise,
      iconColor: "text-[#154D38] bg-[#E8F5E9] border-emerald-200",
      headline: "Digitized Personal Routine",
      subtext: "15 weekday & 8 weekend time-blocks from handwritten sheets",
      badge: "Real-time Tracker",
    },
    {
      name: "Strategic Roadmap",
      href: "/roadmap",
      icon: Compass,
      iconColor: "text-indigo-700 bg-indigo-50 border-indigo-200",
      headline: "12-Month Apex Vision ($60K/yr)",
      subtext: "Zenin AI Implementation Engineer 3-track skill tree",
      badge: "Week 1–46 Matrix",
    },
    {
      name: "Focus & Deep Work",
      href: "/focus",
      icon: Target,
      iconColor: "text-emerald-800 bg-emerald-50 border-emerald-200",
      headline: `${stats.focusHours} Hours of Deep Flow`,
      subtext: "Donezo Pomodoro timer with drift-proof Web Audio chimes",
      badge: "01:24:08 Clock",
    },
    {
      name: "Expenses & Budget",
      href: "/expenses",
      icon: Wallet,
      iconColor: "text-teal-700 bg-teal-50 border-teal-200",
      headline: `৳ ${stats.remainingBuffer.toLocaleString()} Buffer Remaining`,
      subtext: "Bangladeshi Taka (৳ BDT) category caps & transaction log",
      badge: `৳ ${stats.expensesSpent.toLocaleString()} Spent`,
    },
  ];

  return (
    <Card className="bg-white border-zinc-200/90 shadow-2xs rounded-3xl">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold text-zinc-900">
            Unified Life Operating System Status
          </CardTitle>
          <span className="text-xs font-semibold text-zinc-400">
            6 Core Engines Online
          </span>
        </div>
        <CardDescription className="text-xs text-zinc-500">
          Synthesized command status across all life domains
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {SYSTEMS.map((sys) => {
            const Icon = sys.icon;
            return (
              <Link
                key={sys.name}
                href={sys.href}
                className="p-4 rounded-2xl bg-zinc-50/70 border border-zinc-200/80 hover:border-zinc-300 hover:bg-zinc-50/90 hover:shadow-2xs transition-all group flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`h-8 w-8 rounded-xl border flex items-center justify-center shrink-0 ${sys.iconColor}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-zinc-900 group-hover:text-[#154D38] transition-colors">
                        {sys.name}
                      </span>
                    </div>
                  </div>

                  <div className="h-7 w-7 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-400 group-hover:text-[#154D38] group-hover:border-emerald-300 transition-all">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-sm font-bold text-zinc-900 leading-snug">
                    {sys.headline}
                  </div>
                  <p className="text-[11px] text-zinc-500 line-clamp-2">
                    {sys.subtext}
                  </p>
                </div>

                <div className="pt-1 border-t border-zinc-100 flex items-center justify-between text-[10px] font-semibold text-zinc-400">
                  <span>Engine Active</span>
                  <span className="text-[#154D38] font-bold bg-[#E8F5E9] px-2 py-0.5 rounded-full">
                    {sys.badge}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
