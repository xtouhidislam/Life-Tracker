"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Clock,
  Zap,
  Play,
  CheckCircle2,
  ChevronRight,
  Flame,
  ArrowRight,
} from "lucide-react";
import {
  RoutineBlock,
  ActiveBlockState,
  getActiveBlockState,
  formatTo12Hour,
} from "@/lib/routines/routine-utils";
import { Button } from "@/components/ui/button";

interface ActiveBlockHeroProps {
  blocks: RoutineBlock[];
  onToggle: (block: RoutineBlock) => void;
}

export function ActiveBlockHero({ blocks, onToggle }: ActiveBlockHeroProps) {
  const [now, setNow] = useState<Date>(new Date());
  const [activeState, setActiveState] = useState<ActiveBlockState>(() =>
    getActiveBlockState(blocks, new Date())
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const current = new Date();
      setNow(current);
      setActiveState(getActiveBlockState(blocks, current));
    }, 1000);

    return () => clearInterval(timer);
  }, [blocks]);

  const { activeBlock, nextBlock, minutesRemaining, percentElapsed } = activeState;

  const formattedCurrentTime = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  if (!activeBlock && !nextBlock) {
    return null;
  }

  const isFocusable =
    activeBlock &&
    ["Work", "Study", "Knowledge", "Trading", "Education"].includes(activeBlock.activity_type);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#154D38] via-[#0E3425] to-[#071A13] border border-[#164E3A] p-6 sm:p-7 text-white shadow-xl">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Side: Current State & Countdown */}
        <div className="space-y-4 max-w-2xl">
          {/* Header pill & Live clock */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-xs font-bold text-emerald-200">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              REAL-TIME TIMELINE TRACKER
            </span>

            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-200/80">
              <Clock className="h-3.5 w-3.5 text-emerald-300" />
              <span>Current Time: {formattedCurrentTime}</span>
            </div>
          </div>

          {/* Active Block Title & Interval */}
          {activeBlock ? (
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  {activeBlock.title}
                </h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/10 text-emerald-200 border border-white/10">
                  Block #{activeBlock.num}
                </span>
              </div>

              <p className="text-sm text-emerald-100/80 leading-relaxed">
                {activeBlock.description}
              </p>

              <div className="flex items-center gap-2 text-xs text-emerald-200/80 font-medium">
                <span>
                  Scheduled: {formatTo12Hour(activeBlock.start_time)} –{" "}
                  {formatTo12Hour(activeBlock.end_time)}
                </span>
                <span>•</span>
                <span className="text-amber-300 flex items-center gap-1">
                  <Zap className="h-3 w-3 fill-amber-300" /> +{activeBlock.xp_reward} XP Check-in
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-white">
                Transition Window
              </h2>
              <p className="text-sm text-emerald-200/80">
                You are currently between routine blocks. Prepare for the next rhythm!
              </p>
            </div>
          )}

          {/* Progress Bar & Countdown Meter */}
          {activeBlock && (
            <div className="space-y-2 pt-1 max-w-md">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-emerald-200/80">
                  {percentElapsed}% completed
                </span>
                <span className="text-emerald-200 font-mono">
                  ⏳ {minutesRemaining} minutes remaining
                </span>
              </div>

              {/* Glowing progress track */}
              <div className="h-2.5 w-full bg-black/20 rounded-full overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full transition-all duration-1000 shadow-[0_0_12px_#34d399]"
                  style={{ width: `${Math.max(4, percentElapsed)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Quick Action CTAs & Up Next Preview */}
        <div className="shrink-0 flex flex-col gap-3 min-w-[260px]">
          {activeBlock && (
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
              <Button
                variant={activeBlock.is_completed ? "secondary" : "primary"}
                onClick={() => onToggle(activeBlock)}
                className={`gap-2 font-bold ${
                  activeBlock.is_completed
                    ? "bg-white/20 text-white border-white/20"
                    : "bg-white hover:bg-emerald-50 text-[#154D38] shadow-md"
                }`}
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>
                  {activeBlock.is_completed
                    ? "Block Completed ✓"
                    : `Check Off Block (+${activeBlock.xp_reward} XP)`}
                </span>
              </Button>

              {isFocusable && (
                <Link
                  href={`/focus?title=${encodeURIComponent(
                    activeBlock.title
                  )}&duration=${Math.min(activeBlock.duration_minutes, 60)}`}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-100 border border-emerald-400/30 transition-all hover:scale-[1.02]"
                >
                  <Play className="h-3.5 w-3.5 fill-emerald-300 text-emerald-300" />
                  <span>Launch Deep Work Timer</span>
                </Link>
              )}
            </div>
          )}

          {/* Up Next Mini Card */}
          {nextBlock && (
            <div className="p-3.5 rounded-xl bg-black/20 border border-white/5 text-xs space-y-1">
              <div className="flex items-center justify-between text-emerald-200/70 font-medium">
                <span className="flex items-center gap-1">
                  <ArrowRight className="h-3 w-3 text-emerald-300" /> Up Next
                </span>
                <span className="font-mono text-emerald-200">{formatTo12Hour(nextBlock.start_time)}</span>
              </div>
              <p className="font-bold text-white truncate">{nextBlock.title}</p>
              <p className="text-[11px] text-emerald-200/80 line-clamp-1">
                {nextBlock.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
