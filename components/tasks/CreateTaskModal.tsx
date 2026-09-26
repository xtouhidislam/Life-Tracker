"use client";

import React, { useState, useEffect } from "react";
import { X, Sparkles, Calendar, Clock, Tag, Flag, Flame, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CreateTaskInput, TaskItem } from "@/app/actions/tasks";
import { createTaskAction } from "@/app/actions/tasks";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: (task: TaskItem) => void;
  initialDate?: string;
}

const CATEGORIES = [
  { name: "Zenin AI", color: "#154D38" },
  { name: "Engineering", color: "#0D9488" },
  { name: "Knowledge", color: "#6366F1" },
  { name: "Trading", color: "#F59E0B" },
  { name: "Health", color: "#10B981" },
  { name: "Personal", color: "#F43F5E" },
];

const PRIORITIES: { value: "low" | "medium" | "high" | "urgent"; label: string; color: string }[] = [
  { value: "low", label: "Low", color: "text-zinc-600 border-zinc-200 bg-zinc-50" },
  { value: "medium", label: "Medium", color: "text-amber-700 border-amber-200 bg-amber-50" },
  { value: "high", label: "High", color: "text-rose-700 border-rose-200 bg-rose-50" },
  { value: "urgent", label: "Urgent", color: "text-red-700 border-red-300 bg-red-50" },
];

const DIFFICULTIES: {
  value: "small" | "normal" | "difficult" | "milestone";
  label: string;
  xp: number;
}[] = [
  { value: "small", label: "Small", xp: 5 },
  { value: "normal", label: "Normal", xp: 10 },
  { value: "difficult", label: "Difficult", xp: 20 },
  { value: "milestone", label: "Milestone", xp: 50 },
];

export function CreateTaskModal({
  isOpen,
  onClose,
  onTaskCreated,
  initialDate,
}: CreateTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryName, setCategoryName] = useState("Zenin AI");
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "urgent">("medium");
  const [difficulty, setDifficulty] = useState<"small" | "normal" | "difficult" | "milestone">("normal");
  const [dueDate, setDueDate] = useState(initialDate || new Date().toISOString().split("T")[0]);
  const [dueTime, setDueTime] = useState("12:00");
  const [estimatedMinutes, setEstimatedMinutes] = useState(45);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceRule, setRecurrenceRule] = useState("daily");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialDate) {
      setDueDate(initialDate);
    }
  }, [initialDate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    setIsSubmitting(true);

    const input: CreateTaskInput = {
      title: title.trim(),
      description: description.trim() || undefined,
      category_name: categoryName,
      priority,
      difficulty,
      due_date: dueDate || undefined,
      due_time: dueTime || undefined,
      estimated_duration_minutes: Number(estimatedMinutes) || undefined,
      is_recurring: isRecurring,
      recurrence_rule: isRecurring ? recurrenceRule : undefined,
    };

    const res = await createTaskAction(input);
    setIsSubmitting(false);

    if (res.success && res.task) {
      onTaskCreated(res.task);
      setTitle("");
      setDescription("");
      onClose();
    }
  };

  const selectedCategoryObj = CATEGORIES.find((c) => c.name === categoryName) || CATEGORIES[0];
  const selectedDifficultyObj = DIFFICULTIES.find((d) => d.value === difficulty) || DIFFICULTIES[1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white border border-zinc-200 rounded-3xl shadow-xl p-6 md:p-7 relative max-h-[92vh] overflow-y-auto">
        {/* Accent Glow Header */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 rounded-full"
          style={{ backgroundColor: selectedCategoryObj.color }}
        />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
          <div className="flex items-center gap-2.5">
            <div
              className="h-9 w-9 rounded-xl flex items-center justify-center text-white shadow-xs"
              style={{ backgroundColor: selectedCategoryObj.color }}
            >
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-zinc-900">Create New Objective</h2>
              <p className="text-xs text-zinc-500">
                Add an actionable task to your Life OS execution queue
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-xl border border-zinc-200 hover:bg-zinc-100 flex items-center justify-center text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5">
              Task Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Build FastEmbed vector search pipeline"
              className="w-full h-11 px-4 rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#154D38] focus:bg-white transition-all font-medium"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5">
              Description & Notes
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Context, requirements, links, or execution checkpoints..."
              className="w-full p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#154D38] focus:bg-white transition-all resize-none"
            />
          </div>

          {/* Category Picker */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => {
                const isSelected = categoryName === cat.name;
                return (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => setCategoryName(cat.name)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                      isSelected
                        ? "border-[#154D38] bg-[#E8F5E9] text-[#154D38] font-bold shadow-xs"
                        : "border-zinc-200 text-zinc-600 hover:text-zinc-900 bg-zinc-50"
                    }`}
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Priority & Difficulty Grids */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Priority */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5">
                Priority Tier
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {PRIORITIES.map((p) => {
                  const isSelected = priority === p.value;
                  return (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setPriority(p.value)}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all text-center ${
                        isSelected
                          ? `${p.color} ring-1 ring-zinc-400 font-black`
                          : "border-zinc-200 text-zinc-500 hover:text-zinc-800 bg-zinc-50"
                      }`}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Difficulty & XP */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5 flex items-center justify-between">
                <span>Difficulty</span>
                <span className="text-amber-700 font-extrabold flex items-center gap-1">
                  <Flame className="h-3 w-3 fill-amber-500 text-amber-500" />
                  +{selectedDifficultyObj.xp} XP
                </span>
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {DIFFICULTIES.map((d) => {
                  const isSelected = difficulty === d.value;
                  return (
                    <button
                      key={d.value}
                      type="button"
                      onClick={() => setDifficulty(d.value)}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                        isSelected
                          ? "border-amber-300 bg-amber-50 text-amber-800 font-bold"
                          : "border-zinc-200 text-zinc-500 hover:text-zinc-800 bg-zinc-50"
                      }`}
                    >
                      {d.label} (+{d.xp})
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Schedule: Due Date, Due Time, Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-zinc-600 mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-[#154D38] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-600 mb-1">
                Due Time
              </label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-[#154D38] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-600 mb-1">
                Duration (min)
              </label>
              <input
                type="number"
                min="5"
                max="480"
                step="5"
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                className="w-full h-10 px-3 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-[#154D38] focus:bg-white"
              />
            </div>
          </div>

          {/* Recurrence Toggle */}
          <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isRecurring"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="h-4 w-4 accent-[#154D38] rounded cursor-pointer"
              />
              <label htmlFor="isRecurring" className="text-xs font-semibold text-zinc-800 cursor-pointer">
                Repeat this objective
              </label>
            </div>

            {isRecurring && (
              <select
                value={recurrenceRule}
                onChange={(e) => setRecurrenceRule(e.target.value)}
                className="h-8 px-2.5 rounded-lg bg-white border border-zinc-200 text-xs text-zinc-800 focus:outline-none focus:border-[#154D38]"
              >
                <option value="daily">Daily</option>
                <option value="weekdays">Every Weekday (Mon-Fri)</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            )}
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting || !title.trim()}
              className="gap-2 px-5 font-bold shadow-xs bg-[#154D38] hover:bg-[#0F382A] text-white"
            >
              <Sparkles className="h-4 w-4" />
              <span>{isSubmitting ? "Dispatching..." : `Create Task (+${selectedDifficultyObj.xp} XP)`}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
