"use client";

import React, { useState, useEffect, useTransition, useMemo } from "react";
import {
  CalendarDays,
  Sparkles,
  Zap,
  Filter,
  CheckCircle2,
  Clock,
  Layers,
} from "lucide-react";
import {
  RoutineBlock,
  DEFAULT_WEEKDAY_BLOCKS,
  DEFAULT_WEEKEND_BLOCKS,
  getActiveBlockState,
} from "@/lib/routines/routine-utils";
import {
  getRoutinesAction,
  toggleRoutineBlockCompletionAction,
} from "@/app/actions/routines";
import { useAuth } from "@/components/providers/AuthProvider";
import { soundEffects } from "@/lib/audio/sound-effects";
import { triggerHaptic } from "@/lib/ui/haptics";
import { triggerCelebration } from "@/lib/ui/celebration";
import { RoutineBlockCard } from "@/components/routines/RoutineBlockCard";
import { ActiveBlockHero } from "@/components/routines/ActiveBlockHero";
import { RoutineStatsBar } from "@/components/routines/RoutineStatsBar";
import { XPToast } from "@/components/tasks/XPToast";
import { Badge } from "@/components/ui/badge";
import {
  getLocalRoutines,
  saveLocalRoutines,
  toggleLocalRoutineBlock,
} from "@/lib/storage/local-store";

export default function RoutinePage() {
  const { refreshProfile } = useAuth();
  const [, startTransition] = useTransition();

  // Auto-detect whether today is a weekday or weekend
  const isWeekendToday = useMemo(() => {
    const day = new Date().getDay();
    return day === 0 || day === 6; // Sunday or Saturday
  }, []);

  const [activeTab, setActiveTab] = useState<"weekday" | "weekend">(
    isWeekendToday ? "weekend" : "weekday"
  );

  const [filterType, setFilterType] = useState<string>("all");
  const [blocks, setBlocks] = useState<RoutineBlock[]>(
    isWeekendToday ? DEFAULT_WEEKEND_BLOCKS : DEFAULT_WEEKDAY_BLOCKS
  );

  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);

  // XP Toast state
  const [showXpToast, setShowXpToast] = useState(false);
  const [lastEarnedXp, setLastEarnedXp] = useState(5);

  // Fetch routine data with local storage hydration
  useEffect(() => {
    let isMounted = true;
    const stored = getLocalRoutines(activeTab);
    if (stored && stored.length > 0) {
      setBlocks(stored);
    }

    async function loadData() {
      try {
        const res = await getRoutinesAction(activeTab);
        if (res.success && isMounted && res.blocks) {
          if (res.blocks.length > 0 || stored.length === 0) {
            setBlocks(res.blocks);
            saveLocalRoutines(activeTab, res.blocks);
          }
        }
      } catch (err) {
        console.warn("Routines cloud sync fallback to local storage:", err);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [activeTab]);

  // Keep track of active block ID
  useEffect(() => {
    const checkActive = () => {
      const state = getActiveBlockState(blocks, new Date());
      setActiveBlockId(state.activeBlock ? state.activeBlock.id : null);
    };

    checkActive();
    const interval = setInterval(checkActive, 10000);
    return () => clearInterval(interval);
  }, [blocks]);

  // Handle block completion toggle
  const handleToggle = (block: RoutineBlock) => {
    const nextCompleted = !block.is_completed;

    // Immediately persist in local storage
    const updated = toggleLocalRoutineBlock(activeTab, block.id, nextCompleted);
    setBlocks(updated);

    if (nextCompleted) {
      soundEffects.playCheckmark();
      triggerHaptic("success");

      // Check if all blocks will be completed
      const totalBlocks = blocks.length;
      const willBeCompletedCount = blocks.filter((b) => b.id === block.id ? true : b.is_completed).length;

      if (willBeCompletedCount === totalBlocks) {
        soundEffects.playLevelUp();
        triggerHaptic("levelUp");
        triggerCelebration("grand");
      } else {
        triggerCelebration("small");
      }

      setLastEarnedXp(block.xp_reward);
      setShowXpToast(true);
      setTimeout(() => setShowXpToast(false), 3000);
    } else {
      soundEffects.playClick();
      triggerHaptic("light");
    }

    startTransition(async () => {
      await toggleRoutineBlockCompletionAction(
        block.id,
        nextCompleted,
        block.xp_reward,
        block.title
      );
      await refreshProfile();
    });
  };

  // Filtered blocks
  const filteredBlocks = useMemo(() => {
    if (filterType === "all") return blocks;
    if (filterType === "work") {
      return blocks.filter((b) => ["Work", "Trading"].includes(b.activity_type));
    }
    if (filterType === "office") {
      return blocks.filter((b) => ["Office", "Education"].includes(b.activity_type));
    }
    if (filterType === "study") {
      return blocks.filter((b) => ["Study", "Knowledge"].includes(b.activity_type));
    }
    if (filterType === "rest") {
      return blocks.filter((b) =>
        ["Break", "Spiritual", "Recharge", "Sleep", "Health"].includes(b.activity_type)
      );
    }
    return blocks;
  }, [blocks, filterType]);

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Toast Notification */}
      <XPToast
        visible={showXpToast}
        xp={lastEarnedXp}
        message="Routine Block Completed!"
      />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900">
              Daily Routine Rhythms
            </h1>
            <Badge variant="outline" className="text-xs text-[#154D38] border-emerald-200 bg-emerald-50">
              Digitized Timetable
            </Badge>
          </div>
          <p className="text-sm text-zinc-500 mt-1">
            Execution timetable digitized directly from your personal handwritten routine sheets.
          </p>
        </div>

        {/* Weekday / Weekend Tab Switcher */}
        <div className="flex items-center p-1 rounded-2xl bg-zinc-100 border border-zinc-200 shadow-inner">
          <button
            onClick={() => setActiveTab("weekday")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "weekday"
                ? "bg-[#154D38] text-white shadow-sm"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            Weekdays (15 Blocks)
          </button>
          <button
            onClick={() => setActiveTab("weekend")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "weekend"
                ? "bg-[#154D38] text-white shadow-sm"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            Weekend (8 Blocks)
          </button>
        </div>
      </div>

      {/* Hero Active Block Spotlight */}
      <ActiveBlockHero blocks={blocks} onToggle={handleToggle} />

      {/* KPI Stats Strip */}
      <RoutineStatsBar
        blocks={blocks}
        scheduleTitle={activeTab === "weekday" ? "Weekday Rhythms" : "Weekend Rhythms"}
      />

      {/* Category Filter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-zinc-400" />
          <span className="text-xs font-bold text-zinc-700">Filter Activities:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: "all", label: "All Blocks", count: blocks.length },
            {
              id: "work",
              label: "Deep Work & Trading",
              count: blocks.filter((b) => ["Work", "Trading"].includes(b.activity_type)).length,
            },
            {
              id: "office",
              label: "Office & School",
              count: blocks.filter((b) => ["Office", "Education"].includes(b.activity_type)).length,
            },
            {
              id: "study",
              label: "Study & Knowledge",
              count: blocks.filter((b) => ["Study", "Knowledge"].includes(b.activity_type)).length,
            },
            {
              id: "rest",
              label: "Health, Rest & Sleep",
              count: blocks.filter((b) =>
                ["Break", "Spiritual", "Recharge", "Sleep", "Health"].includes(b.activity_type)
              ).length,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                filterType === tab.id
                  ? "bg-[#154D38] text-white border-[#154D38] shadow-sm"
                  : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"
              }`}
            >
              <span>{tab.label}</span>
              <span className={`ml-1.5 text-[10px] font-mono ${filterType === tab.id ? "text-emerald-200" : "text-zinc-400"}`}>
                ({tab.count})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Routine Blocks List */}
      <div className="space-y-3">
        {filteredBlocks.map((block) => (
          <RoutineBlockCard
            key={block.id}
            block={block}
            isActive={block.id === activeBlockId}
            onToggle={handleToggle}
          />
        ))}
      </div>
    </div>
  );
}
