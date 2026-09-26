"use client";

import React, { useState } from "react";
import {
  Check,
  Clock,
  Flame,
  Repeat,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { TaskItem } from "@/app/actions/tasks";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: TaskItem;
  onToggle: (taskId: string, currentStatus: boolean, xp: number, title: string) => void;
  onDelete: (taskId: string) => void;
}

const PRIORITY_VARIANTS: Record<string, "default" | "amber" | "rose" | "mint" | "outline"> = {
  low: "outline",
  medium: "amber",
  high: "rose",
  urgent: "rose",
};

export function TaskCard({ task, onToggle, onDelete }: TaskCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const isCompleted = task.is_completed;
  const isUrgent = task.priority === "urgent";

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "p-4 rounded-2xl border transition-all duration-200 group flex items-start gap-3.5 relative select-none bg-white",
        isCompleted
          ? "border-zinc-200/70 bg-zinc-50/50 opacity-70"
          : "border-zinc-200/90 shadow-2xs hover:border-zinc-300 hover:shadow-xs",
        isUrgent && !isCompleted && "border-rose-300/80 bg-rose-50/20"
      )}
    >
      {/* Category Indicator Strip */}
      {task.category_color && (
        <div
          className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full"
          style={{ backgroundColor: task.category_color }}
        />
      )}

      {/* Completion Toggle Button */}
      <button
        type="button"
        onClick={() => onToggle(task.id, isCompleted, task.xp_value, task.title)}
        className={cn(
          "h-6 w-6 mt-0.5 rounded-lg border flex items-center justify-center transition-all shrink-0 cursor-pointer",
          isCompleted
            ? "bg-[#154D38] border-[#154D38] text-white shadow-xs"
            : "border-zinc-300 hover:border-[#154D38] hover:bg-emerald-50 text-transparent"
        )}
        title={isCompleted ? "Mark incomplete" : `Complete objective (+${task.xp_value} XP)`}
      >
        <Check className={cn("h-4 w-4 stroke-[3]", isCompleted ? "opacity-100" : "opacity-0")} />
      </button>

      {/* Task Content */}
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Title */}
          <span
            className={cn(
              "text-sm font-semibold tracking-tight transition-all",
              isCompleted
                ? "line-through text-zinc-400"
                : "text-zinc-900 group-hover:text-[#154D38]"
            )}
          >
            {task.title}
          </span>

          {/* Recurring Icon */}
          {task.is_recurring && (
            <span
              className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 flex items-center gap-0.5 font-medium px-1.5 py-0.5 rounded"
              title={`Repeats: ${task.recurrence_rule || "daily"}`}
            >
              <Repeat className="h-3 w-3" />
              <span>{task.recurrence_rule || "Repeats"}</span>
            </span>
          )}
        </div>

        {/* Description (if provided) */}
        {task.description && (
          <p className="text-xs text-zinc-500 line-clamp-1">
            {task.description}
          </p>
        )}

        {/* Metadata Badges Strip */}
        <div className="flex items-center gap-2 flex-wrap pt-0.5">
          {/* Category */}
          {task.category_name && (
            <span className="text-[11px] font-medium text-zinc-500 flex items-center gap-1.5">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: task.category_color || "#154D38" }}
              />
              <span>{task.category_name}</span>
            </span>
          )}

          {/* Priority */}
          <Badge
            variant={PRIORITY_VARIANTS[task.priority] || "default"}
            className="text-[10px] uppercase font-bold px-1.5 py-0.2"
          >
            {task.priority}
          </Badge>

          {/* Difficulty & XP Reward */}
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200">
            <Flame className="h-2.5 w-2.5 fill-amber-500 text-amber-500" />
            <span>+{task.xp_value} XP</span>
          </span>

          {/* Due Time / Date */}
          {(task.due_date || task.due_time) && (
            <span className="text-[11px] text-zinc-400 flex items-center gap-1 font-mono">
              <Clock className="h-3 w-3" />
              <span>
                {task.due_date ? task.due_date : ""}
                {task.due_time ? ` at ${task.due_time}` : ""}
              </span>
            </span>
          )}

          {/* Duration */}
          {task.estimated_duration_minutes && (
            <span className="text-[11px] text-zinc-400">
              &middot; {task.estimated_duration_minutes}m
            </span>
          )}
        </div>
      </div>

      {/* Delete Action (visible on hover) */}
      <button
        type="button"
        onClick={() => onDelete(task.id)}
        className={cn(
          "h-7 w-7 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-all",
          isHovered ? "opacity-100" : "opacity-0"
        )}
        title="Delete task"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
