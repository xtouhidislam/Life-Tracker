"use client";

import React, { useState, useEffect, useMemo, useTransition } from "react";
import {
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Flame,
  Filter,
  ListTodo,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TaskCard } from "@/components/tasks/TaskCard";
import { CreateTaskModal } from "@/components/tasks/CreateTaskModal";
import { XPToast } from "@/components/tasks/XPToast";
import { StatCard } from "@/components/dashboard/StatCard";
import type { TaskItem } from "@/app/actions/tasks";
import {
  getTasksAction,
  toggleTaskCompletionAction,
  deleteTaskAction,
} from "@/app/actions/tasks";
import { useAuth } from "@/hooks/useAuth";
import { soundEffects } from "@/lib/audio/sound-effects";
import { triggerHaptic } from "@/lib/ui/haptics";
import { triggerCelebration } from "@/lib/ui/celebration";
import {
  getLocalTasks,
  saveLocalTasks,
  addLocalTask,
  toggleLocalTask,
  deleteLocalTask,
} from "@/lib/storage/local-store";

const FILTER_TABS = [
  { id: "all", label: "All Tasks" },
  { id: "today", label: "Due Today" },
  { id: "upcoming", label: "Upcoming" },
  { id: "priority", label: "High / Urgent" },
  { id: "completed", label: "Completed" },
];

export default function TasksPage() {
  const { refreshProfile } = useAuth();
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastEarnedXp, setLastEarnedXp] = useState(10);
  const [showXpToast, setShowXpToast] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Load tasks on mount with local persistence hydration
  useEffect(() => {
    const stored = getLocalTasks();
    if (stored && stored.length > 0) {
      setTasks(stored);
    }

    async function loadTasks() {
      try {
        const res = await getTasksAction();
        if (res.tasks && !res.error) {
          if (res.tasks.length > 0 || stored.length === 0) {
            setTasks(res.tasks);
            saveLocalTasks(res.tasks);
          }
        } else if (stored.length === 0 && res.tasks) {
          setTasks(res.tasks);
          saveLocalTasks(res.tasks);
        }
      } catch (err) {
        console.warn("Tasks cloud sync fallback to local storage:", err);
      }
    }
    loadTasks();
  }, []);

  // Today's date string YYYY-MM-DD
  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

  // Toggle completion
  const handleToggle = async (
    taskId: string,
    currentStatus: boolean,
    xpValue: number,
    title: string
  ) => {
    const nextStatus = !currentStatus;

    // Immediately persist and update UI
    const updated = toggleLocalTask(taskId, nextStatus, xpValue);
    setTasks(updated);

    if (nextStatus) {
      soundEffects.playCheckmark();
      triggerHaptic("success");
      if (xpValue >= 20) {
        triggerCelebration("small");
      }
      setLastEarnedXp(xpValue);
      setShowXpToast(true);
      setTimeout(() => setShowXpToast(false), 3200);
    } else {
      soundEffects.playClick();
      triggerHaptic("light");
    }

    startTransition(async () => {
      await toggleTaskCompletionAction(taskId, currentStatus, xpValue, title);
      await refreshProfile();
    });
  };

  // Delete task
  const handleDelete = async (taskId: string) => {
    const updated = deleteLocalTask(taskId);
    setTasks(updated);
    startTransition(async () => {
      await deleteTaskAction(taskId);
    });
  };

  // On Task Created
  const handleTaskCreated = (newTask: TaskItem) => {
    const updated = addLocalTask(newTask);
    setTasks(updated);
  };

  // Category list derived from tasks
  const categories = useMemo(() => {
    const set = new Set<string>();
    tasks.forEach((t) => {
      if (t.category_name) set.add(t.category_name);
    });
    return Array.from(set);
  }, [tasks]);

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesDesc = task.description?.toLowerCase().includes(query);
        const matchesCat = task.category_name?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesCat) return false;
      }

      // Category filter
      if (selectedCategory && task.category_name !== selectedCategory) {
        return false;
      }

      // Tab filter
      switch (activeFilter) {
        case "today":
          return task.due_date === todayStr && !task.is_completed;
        case "upcoming":
          return (
            task.due_date &&
            task.due_date > todayStr &&
            !task.is_completed
          );
        case "priority":
          return (
            (task.priority === "high" || task.priority === "urgent") &&
            !task.is_completed
          );
        case "completed":
          return task.is_completed;
        case "all":
        default:
          return true;
      }
    });
  }, [tasks, activeFilter, searchQuery, selectedCategory, todayStr]);

  // Statistics
  const totalCompleted = tasks.filter((t) => t.is_completed).length;
  const totalPending = tasks.filter((t) => !t.is_completed).length;
  const totalQueueXp = tasks
    .filter((t) => !t.is_completed)
    .reduce((sum, t) => sum + (t.xp_value || 10), 0);
  const completionPct =
    tasks.length > 0 ? Math.round((totalCompleted / tasks.length) * 100) : 0;

  return (
    <div className="space-y-6 max-w-5xl pb-12 select-none">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-900 flex items-center gap-2.5">
            <span>Tasks & Objectives</span>
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Plan, prioritize, and execute your operational goals with ease.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setIsModalOpen(true)}
          className="gap-2 px-5 bg-[#154D38] hover:bg-[#0F382A] text-white shadow-xs font-bold"
        >
          <Plus className="h-4 w-4" />
          <span>New Objective</span>
        </Button>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          title="Active Tasks"
          value={totalPending}
          isHero={true}
          trend={{ value: `${totalPending} in queue`, positive: true }}
        />
        <StatCard
          title="Completed"
          value={totalCompleted}
          trend={{ value: `${completionPct}% rate`, positive: true }}
        />
        <StatCard
          title="Available XP"
          value={`+${totalQueueXp}`}
          subtext="From active objectives"
        />
        <StatCard
          title="Completion Rate"
          value={`${completionPct}%`}
          subtext="Total task velocity"
        />
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {FILTER_TABS.map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-[#154D38] text-white font-bold shadow-xs"
                    : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 border border-zinc-200/80 bg-white"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search objectives..."
            className="w-full h-9 pl-9 pr-3 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#154D38] transition-colors"
          />
        </div>
      </div>

      {/* Category Pills */}
      {categories.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap text-xs">
          <span className="text-zinc-400 font-semibold mr-1">
            Category:
          </span>
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
              selectedCategory === null
                ? "bg-[#154D38] text-white font-bold"
                : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
            }`}
          >
            All
          </button>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() =>
                  setSelectedCategory(isSelected ? null : cat)
                }
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                  isSelected
                    ? "bg-[#E8F5E9] text-[#154D38] border border-emerald-200 font-bold"
                    : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 border border-transparent"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      )}

      {/* Tasks List */}
      <div className="space-y-2.5">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="py-14 text-center bg-white border border-zinc-200 rounded-3xl p-8 shadow-2xs">
            <ListTodo className="h-10 w-10 text-zinc-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-zinc-900">
              No objectives found
            </h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-1 mb-4">
              {searchQuery
                ? `No tasks match "${searchQuery}". Try adjusting your search query or filters.`
                : "Your action queue for this view is clear! Ready to dispatch a new mission?"}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(true)}
              className="gap-2 text-[#154D38] border-zinc-200 hover:bg-zinc-50"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create Task</span>
            </Button>
          </div>
        )}
      </div>

      {/* Task Creation Modal */}
      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTaskCreated={handleTaskCreated}
      />

      {/* Celebratory XP Toast */}
      <XPToast xp={lastEarnedXp} visible={showXpToast} />
    </div>
  );
}
