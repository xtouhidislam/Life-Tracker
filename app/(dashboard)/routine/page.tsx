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
  Plus,
  RotateCcw,
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
  saveRoutineBlockAction,
  deleteRoutineBlockAction,
  resetRoutinesAction,
} from "@/app/actions/routines";
import { useAuth } from "@/components/providers/AuthProvider";
import { soundEffects } from "@/lib/audio/sound-effects";
import { triggerHaptic } from "@/lib/ui/haptics";
import { triggerCelebration } from "@/lib/ui/celebration";
import { RoutineBlockCard } from "@/components/routines/RoutineBlockCard";
import { ActiveBlockHero } from "@/components/routines/ActiveBlockHero";
import { RoutineStatsBar } from "@/components/routines/RoutineStatsBar";
import { EditRoutineBlockModal } from "@/components/routines/EditRoutineBlockModal";
import { XPToast } from "@/components/tasks/XPToast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getLocalRoutines,
  saveLocalRoutines,
  toggleLocalRoutineBlock,
  updateLocalRoutineBlock,
  addLocalRoutineBlock,
  deleteLocalRoutineBlock,
  resetLocalRoutines,
} from "@/lib/storage/local-store";

export default function RoutinePage() {
  const { user, refreshProfile } = useAuth();
  const [, startTransition] = useTransition();

  // Auto-detect whether today is a weekday or weekend
  const isWeekendToday = useMemo(() => {
    if (typeof window === "undefined") return false;
    const day = new Date().getDay();
    return day === 0 || day === 6; // Sunday or Saturday
  }, []);

  const [activeTab, setActiveTab] = useState<"weekday" | "weekend">(
    isWeekendToday ? "weekend" : "weekday"
  );

  const [filterType, setFilterType] = useState<string>("all");
  const [blocks, setBlocks] = useState<RoutineBlock[]>(() =>
    getLocalRoutines(isWeekendToday ? "weekend" : "weekday")
  );

  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);

  // Edit / Add Modal state
  const [editingBlock, setEditingBlock] = useState<RoutineBlock | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // XP Toast state
  const [showXpToast, setShowXpToast] = useState(false);
  const [lastEarnedXp, setLastEarnedXp] = useState(5);
  const [toastMessage, setToastMessage] = useState("Routine Block Completed!");

  // Fetch routine data with local storage hydration
  useEffect(() => {
    let isMounted = true;
    setBlocks(getLocalRoutines(activeTab));

    if (!user) return;

    async function loadData() {
      try {
        const res = await getRoutinesAction(activeTab);
        if (res.success && isMounted && res.blocks && res.blocks.length > 0) {
          setBlocks(res.blocks);
          saveLocalRoutines(activeTab, res.blocks);
        }
      } catch (err) {
        console.warn("Routines cloud sync fallback to local storage:", err);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [activeTab, user]);

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
      setToastMessage("Routine Block Completed!");
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

  // Open Edit Modal for a specific block
  const handleOpenEdit = (block: RoutineBlock) => {
    setEditingBlock(block);
    setIsModalOpen(true);
  };

  // Open Modal to create a new block
  const handleOpenAdd = () => {
    setEditingBlock(null);
    setIsModalOpen(true);
  };

  // Save changes from Edit/Add Modal
  const handleSaveBlock = (blockToSave: RoutineBlock) => {
    const isExisting = blocks.some((b) => b.id === blockToSave.id);

    let nextBlocks: RoutineBlock[];
    if (isExisting) {
      nextBlocks = updateLocalRoutineBlock(activeTab, blockToSave);
      setBlocks(nextBlocks);
      soundEffects.playClick();
      triggerHaptic("light");
      setLastEarnedXp(blockToSave.xp_reward);
      setToastMessage(`Task updated: "${blockToSave.title}"`);
      setShowXpToast(true);
      setTimeout(() => setShowXpToast(false), 3000);
    } else {
      nextBlocks = addLocalRoutineBlock(activeTab, blockToSave);
      setBlocks(nextBlocks);
      soundEffects.playClick();
      triggerHaptic("medium");
      setLastEarnedXp(blockToSave.xp_reward);
      setToastMessage(`Added task: "${blockToSave.title}"`);
      setShowXpToast(true);
      setTimeout(() => setShowXpToast(false), 3000);
    }

    startTransition(async () => {
      await saveRoutineBlockAction(activeTab, blockToSave, nextBlocks);
      await refreshProfile();
    });
  };

  // Delete a block
  const handleDeleteBlock = (blockId: string) => {
    const nextBlocks = deleteLocalRoutineBlock(activeTab, blockId);
    setBlocks(nextBlocks);
    soundEffects.playClick();
    triggerHaptic("medium");
    setToastMessage("Routine task deleted");
    setShowXpToast(true);
    setTimeout(() => setShowXpToast(false), 2500);

    startTransition(async () => {
      await deleteRoutineBlockAction(activeTab, blockId);
      await refreshProfile();
    });
  };

  // Reset to original handwritten default timetable
  const handleResetDefaults = () => {
    if (typeof window !== "undefined") {
      const confirmReset = window.confirm(
        `Reset the ${activeTab === "weekday" ? "Weekday" : "Weekend"} routine to the original digitized default blocks?`
      );
      if (!confirmReset) return;
    }

    const defaults = resetLocalRoutines(activeTab);
    setBlocks(defaults);
    soundEffects.playClick();
    triggerHaptic("success");
    setToastMessage("Routine reset to default rhythms");
    setShowXpToast(true);
    setTimeout(() => setShowXpToast(false), 3000);

    startTransition(async () => {
      await resetRoutinesAction(activeTab);
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
        message={toastMessage}
      />

      {/* Edit / Create Routine Block Modal */}
      <EditRoutineBlockModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        block={editingBlock}
        onSave={handleSaveBlock}
        onDelete={handleDeleteBlock}
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
            Execution timetable digitized directly from your personal routine sheets. Click the pencil icon on any task to edit.
          </p>
        </div>

        {/* Action Controls & Tab Switcher */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Weekday / Weekend Tab Switcher */}
          <div className="flex items-center p-1 rounded-2xl bg-zinc-100 border border-zinc-200 shadow-inner">
            <button
              onClick={() => setActiveTab("weekday")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "weekday"
                  ? "bg-[#154D38] text-white shadow-sm"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              Weekdays ({activeTab === "weekday" ? blocks.length : 15})
            </button>
            <button
              onClick={() => setActiveTab("weekend")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "weekend"
                  ? "bg-[#154D38] text-white shadow-sm"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              Weekend ({activeTab === "weekend" ? blocks.length : 8})
            </button>
          </div>

          {/* Add Routine Task Button */}
          <Button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-3.5 py-1.5 h-auto rounded-xl text-xs font-bold bg-[#154D38] hover:bg-[#0E3425] text-white shadow-sm transition-all hover:scale-105"
          >
            <Plus className="h-3.5 w-3.5 stroke-[3]" />
            <span>Add Task</span>
          </Button>

          {/* Reset Defaults Button */}
          <button
            onClick={handleResetDefaults}
            className="p-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-500 hover:text-zinc-800 transition-colors shadow-2xs"
            title="Reset routine back to default timetable"
          >
            <RotateCcw className="h-3.5 w-3.5" />
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
            onEdit={handleOpenEdit}
          />
        ))}

        {filteredBlocks.length === 0 && (
          <div className="py-12 text-center rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/50">
            <Clock className="h-8 w-8 text-zinc-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-zinc-600">No routine tasks found in this category.</p>
            <p className="text-xs text-zinc-400 mt-1">Try selecting another filter or add a new routine task.</p>
            <Button
              onClick={handleOpenAdd}
              className="mt-4 rounded-xl text-xs font-bold bg-[#154D38] hover:bg-[#0E3425] text-white"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add Routine Task
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
