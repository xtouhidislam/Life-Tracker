"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CircularProgress } from "@/components/dashboard/CircularProgress";
import { Sparkles, Trophy, Zap, Flame, CheckCircle2, TrendingUp } from "lucide-react";

interface OverallScoreCardProps {
  dailyScore: number;
  monthlyScore: number;
  completedActions: number;
  totalActions: number;
  habitConsistencyPct: number;
  streak: number;
}

export function OverallScoreCard({
  dailyScore,
  monthlyScore,
  completedActions,
  totalActions,
  habitConsistencyPct,
  streak,
}: OverallScoreCardProps) {
  // Determine momentum tier
  const momentumLabel =
    monthlyScore >= 80
      ? "Peak Performance"
      : monthlyScore >= 60
      ? "Disciplined Flow"
      : monthlyScore >= 40
      ? "Building Momentum"
      : "Calibration Stage";

  return (
    <Card className="bg-white border border-zinc-200/90 shadow-2xs flex flex-col justify-between h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#154D38]">
              <Trophy className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-zinc-900">
                Overall Life Mastery Score
              </CardTitle>
              <CardDescription className="text-xs text-zinc-500">
                Synthesizing daily execution & monthly consistency
              </CardDescription>
            </div>
          </div>

          <Badge variant="mint" className="text-[10px] gap-1 py-0.5">
            <Sparkles className="h-3 w-3" />
            <span>{momentumLabel}</span>
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center">
          {/* Left: Daily Score Circular Ring */}
          <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-zinc-50/70 border border-zinc-100">
            <CircularProgress
              value={dailyScore}
              size={145}
              strokeWidth={12}
              completedText={`${completedActions}/${totalActions} Objectives`}
              subText="Daily Life Score"
            />
            <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-800 mt-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Daily Life Score</span>
            </div>
            <span className="text-[11px] text-zinc-500 font-medium">
              Today&apos;s tasks & habit check-ins
            </span>
          </div>

          {/* Right: Monthly Score & Pillar Breakdown */}
          <div className="space-y-3.5">
            {/* Monthly Mastery Big Metric */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100/80">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#154D38]">
                  Monthly Life Score
                </span>
                <span className="text-xs font-black text-emerald-800 font-mono">
                  {monthlyScore}%
                </span>
              </div>
              <div className="w-full bg-emerald-200/50 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#154D38] h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${monthlyScore}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-zinc-500 mt-1.5 font-medium">
                <span>Cycle Progression</span>
                <span className="text-emerald-700 font-semibold">Active Rhythm</span>
              </div>
            </div>

            {/* Micro Breakdown Metrics */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/60">
                <div className="flex items-center gap-1 text-[11px] text-zinc-500">
                  <Flame className="h-3 w-3 text-amber-500" />
                  <span>Streak</span>
                </div>
                <div className="font-bold text-zinc-900 mt-0.5">{streak} Days Active</div>
              </div>

              <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/60">
                <div className="flex items-center gap-1 text-[11px] text-zinc-500">
                  <CheckCircle2 className="h-3 w-3 text-[#154D38]" />
                  <span>Consistency</span>
                </div>
                <div className="font-bold text-zinc-900 mt-0.5">{habitConsistencyPct}% Rhythm</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
