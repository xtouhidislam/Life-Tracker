"use client";

import React, { useState, useEffect } from "react";
import { X, Sparkles, Flame, Sun, Sunset, Clock, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CreateHabitInput, HabitItem } from "@/app/actions/habits";
import { createHabitAction } from "@/app/actions/habits";

interface CreateHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onHabitCreated: (habit: HabitItem) => void;
}

const CATEGORIES = [
  { name: "Health", color: "#10B981" },
  { name: "Engineering", color: "#154D38" },
  { name: "Knowledge", color: "#6366F1" },
  { name: "Trading", color: "#F59E0B" },
  { name: "Personal", color: "#F43F5E" },
];

const TIME_OPTIONS = [
  { value: "morning", label: "Morning", icon: Sun },
  { value: "afternoon", label: "Afternoon", icon: Sun },
  { value: "evening", label: "Evening", icon: Sunset },
  { value: "anytime", label: "Anytime", icon: Clock },
];

const FREQUENCIES = [
  { value: "daily", label: "Daily (7 days)" },
  { value: "weekdays", label: "Weekdays (Mon-Fri)" },
  { value: "weekends", label: "Weekends (Sat-Sun)" },
  { value: "weekly", label: "Custom Weekly Target" },
];

export function CreateHabitModal({
  isOpen,
  onClose,
  onHabitCreated,
}: CreateHabitModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryName, setCategoryName] = useState("Health");
  const [frequency, setFrequency] = useState<"daily" | "weekdays" | "weekends" | "weekly">("daily");
  const [timeOfDay, setTimeOfDay] = useState<"morning" | "afternoon" | "evening" | "anytime">("morning");
  const [targetDays, setTargetDays] = useState(7);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    const input: CreateHabitInput = {
      title: title.trim(),
      description: description.trim() || undefined,
      category_name: categoryName,
      frequency,
      target_days_per_week: frequency === "weekdays" ? 5 : frequency === "weekends" ? 2 : targetDays,
      time_of_day: timeOfDay,
      xp_per_completion: 15,
    };

    const res = await createHabitAction(input);
    setIsSubmitting(false);

    if (res.success && res.habit) {
      onHabitCreated(res.habit);
      setTitle("");
      setDescription("");
      onClose();
    } else {
      const todayStr = new Date().toISOString().split("T")[0];
      const fallbackHabit: HabitItem = {
        id: "habit-" + Date.now(),
        title: input.title,
        description: input.description,
        category_name: input.category_name || "Health",
        category_color: selectedCategoryObj.color,
        frequency: input.frequency,
        target_days_per_week: input.target_days_per_week,
        time_of_day: input.time_of_day,
        current_streak: 0,
        longest_streak: 0,
        xp_per_completion: 15,
        is_completed_today: false,
        history_7_days: [],
        history_30_days: [],
        consistency_pct: 0,
      };
      onHabitCreated(fallbackHabit);
      setTitle("");
      setDescription("");
      onClose();
    }
  };

  const selectedCategoryObj = CATEGORIES.find((c) => c.name === categoryName) || CATEGORIES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white border border-zinc-200 rounded-3xl shadow-xl p-6 md:p-7 relative max-h-[92vh] overflow-y-auto select-none">
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
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-zinc-900">Initialize New Habit</h2>
              <p className="text-xs text-zinc-500">
                Build an automated daily ritual and maintain your flame streak
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
              Habit Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 20-minute daily algorithm problem"
              className="w-full h-11 px-4 rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#154D38] focus:bg-white transition-all font-medium"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5">
              Ritual Context & Cue
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Why this habit matters, environmental trigger, or rules of engagement..."
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

          {/* Time of Day */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5">
              Execution Window
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {TIME_OPTIONS.map((opt) => {
                const isSelected = timeOfDay === opt.value;
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setTimeOfDay(opt.value as any)}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-xs font-semibold transition-all ${
                      isSelected
                        ? "border-[#154D38] bg-[#E8F5E9] text-[#154D38] font-bold shadow-xs"
                        : "border-zinc-200 text-zinc-600 hover:text-zinc-900 bg-zinc-50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Frequency */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5">
              Target Frequency
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {FREQUENCIES.map((freq) => {
                const isSelected = frequency === freq.value;
                return (
                  <button
                    key={freq.value}
                    type="button"
                    onClick={() => setFrequency(freq.value as any)}
                    className={`px-3 py-2 rounded-xl border text-xs font-semibold text-left transition-all ${
                      isSelected
                        ? "border-[#154D38] bg-[#E8F5E9] text-[#154D38] font-bold shadow-xs"
                        : "border-zinc-200 text-zinc-600 hover:text-zinc-900 bg-zinc-50"
                    }`}
                  >
                    {freq.label}
                  </button>
                );
              })}
            </div>
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
              <span>{isSubmitting ? "Activating..." : "Activate Habit (+15 XP)"}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
