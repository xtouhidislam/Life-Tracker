"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Clock,
  Zap,
  Trash2,
  Check,
  Sparkles,
  Sunrise,
  Dumbbell,
  Laptop,
  Briefcase,
  Coffee,
  BookOpen,
  Brain,
  Utensils,
  TrendingUp,
  Moon,
  GraduationCap,
  Users,
} from "lucide-react";
import {
  RoutineBlock,
  RoutineActivityType,
  ROUTINE_ACTIVITY_TYPES,
  ROUTINE_ICONS,
  calculateDurationMinutes,
} from "@/lib/routines/routine-utils";
import { Button } from "@/components/ui/button";

interface EditRoutineBlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  block: RoutineBlock | null; // null if creating a new block
  onSave: (block: RoutineBlock) => void;
  onDelete?: (blockId: string) => void;
}

const ICON_COMPONENTS: Record<string, React.ReactNode> = {
  Sunrise: <Sunrise className="h-4 w-4" />,
  Dumbbell: <Dumbbell className="h-4 w-4" />,
  Laptop: <Laptop className="h-4 w-4" />,
  Briefcase: <Briefcase className="h-4 w-4" />,
  Coffee: <Coffee className="h-4 w-4" />,
  BookOpen: <BookOpen className="h-4 w-4" />,
  Brain: <Brain className="h-4 w-4" />,
  Utensils: <Utensils className="h-4 w-4" />,
  TrendingUp: <TrendingUp className="h-4 w-4" />,
  Moon: <Moon className="h-4 w-4" />,
  GraduationCap: <GraduationCap className="h-4 w-4" />,
  Users: <Users className="h-4 w-4" />,
  Clock: <Clock className="h-4 w-4" />,
  Zap: <Zap className="h-4 w-4" />,
};

const ENERGY_OPTIONS = [
  {
    level: "high",
    label: "High Focus",
    description: "Deep flow & demanding work",
    color: "border-rose-300 text-rose-700 bg-rose-50/70",
    activeColor: "ring-2 ring-rose-500 bg-rose-50 border-rose-400",
  },
  {
    level: "medium",
    label: "Medium Energy",
    description: "Operational or active tasks",
    color: "border-amber-300 text-amber-700 bg-amber-50/70",
    activeColor: "ring-2 ring-amber-500 bg-amber-50 border-amber-400",
  },
  {
    level: "low",
    label: "Low / Peaceful",
    description: "Spiritual, calm or grounding",
    color: "border-sky-300 text-sky-700 bg-sky-50/70",
    activeColor: "ring-2 ring-sky-500 bg-sky-50 border-sky-400",
  },
  {
    level: "rest",
    label: "Rest & Sleep",
    description: "Recharging or deep recovery",
    color: "border-purple-300 text-purple-700 bg-purple-50/70",
    activeColor: "ring-2 ring-purple-500 bg-purple-50 border-purple-400",
  },
] as const;

export function EditRoutineBlockModal({
  isOpen,
  onClose,
  block,
  onSave,
  onDelete,
}: EditRoutineBlockModalProps) {
  const isEditing = Boolean(block);

  const [title, setTitle] = useState("");
  const [activityType, setActivityType] = useState<RoutineActivityType>("Work");
  const [startTime, setStartTime] = useState("07:00");
  const [endTime, setEndTime] = useState("08:00");
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [energyLevel, setEnergyLevel] = useState<"high" | "medium" | "low" | "rest">("high");
  const [description, setDescription] = useState("");
  const [iconName, setIconName] = useState("Laptop");
  const [xpReward, setXpReward] = useState(5);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Sync state whenever modal opens or block changes
  useEffect(() => {
    if (block) {
      setTitle(block.title);
      setActivityType(block.activity_type);
      setStartTime(block.start_time);
      setEndTime(block.end_time);
      setDurationMinutes(block.duration_minutes);
      setEnergyLevel(block.energy_level);
      setDescription(block.description);
      setIconName(block.icon_name || "Clock");
      setXpReward(block.xp_reward || 5);
      setConfirmDelete(false);
    } else {
      setTitle("");
      setActivityType("Work");
      setStartTime("08:00");
      setEndTime("09:00");
      setDurationMinutes(60);
      setEnergyLevel("high");
      setDescription("");
      setIconName("Laptop");
      setXpReward(5);
      setConfirmDelete(false);
    }
  }, [block, isOpen]);

  // Recalculate duration automatically when start or end time changes
  const handleStartTimeChange = (newStart: string) => {
    setStartTime(newStart);
    if (newStart && endTime) {
      const dur = calculateDurationMinutes(newStart, endTime);
      setDurationMinutes(dur);
    }
  };

  const handleEndTimeChange = (newEnd: string) => {
    setEndTime(newEnd);
    if (startTime && newEnd) {
      const dur = calculateDurationMinutes(startTime, newEnd);
      setDurationMinutes(dur);
    }
  };

  // Keyboard shortcut: Escape to close
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const updatedBlock: RoutineBlock = {
      id: block ? block.id : `custom-${Date.now()}`,
      routine_id: block?.routine_id,
      num: block ? block.num : 1,
      title: title.trim(),
      activity_type: activityType,
      start_time: startTime,
      end_time: endTime,
      duration_minutes: durationMinutes,
      energy_level: energyLevel,
      description: description.trim(),
      icon_name: iconName,
      xp_reward: xpReward,
      is_completed: block ? block.is_completed : false,
      completed_at: block?.completed_at,
    };

    onSave(updatedBlock);
    onClose();
  };

  const handleDelete = () => {
    if (!block || !onDelete) return;
    onDelete(block.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-3xl bg-white shadow-2xl border border-zinc-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-zinc-100 bg-gradient-to-r from-zinc-50 via-white to-emerald-50/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#154D38] text-white shadow-sm">
              {ICON_COMPONENTS[iconName] || <Clock className="h-5 w-5" />}
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-zinc-900">
                {isEditing ? `Edit Task #${block?.num}` : "New Routine Block"}
              </h2>
              <p className="text-xs text-zinc-500">
                {isEditing
                  ? "Customize timing, energy, and execution guidelines"
                  : "Add a scheduled block to your daily rhythm"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body / Scrollable Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Task Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-700 flex items-center justify-between">
              <span>Task Title</span>
              <span className="text-[11px] text-zinc-400 font-normal">Required</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Deep Work Sprint, Exercise & Stretching"
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#154D38]/30 focus:border-[#154D38] text-sm text-zinc-900 font-medium placeholder:text-zinc-400"
            />
          </div>

          {/* Activity Category Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-700">Activity Type</label>
            <div className="flex flex-wrap gap-1.5">
              {ROUTINE_ACTIVITY_TYPES.map((type) => {
                const isSelected = activityType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setActivityType(type)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                      isSelected
                        ? "bg-[#154D38] text-white border-[#154D38] shadow-sm"
                        : "bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100"
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Interval & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-zinc-400" />
                <span>Start Time</span>
              </label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => handleStartTimeChange(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-sm font-mono text-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#154D38]/30 focus:border-[#154D38]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-zinc-400" />
                <span>End Time</span>
              </label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => handleEndTimeChange(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-sm font-mono text-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#154D38]/30 focus:border-[#154D38]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700">Duration</label>
              <div className="flex items-center h-10 px-3 rounded-xl bg-zinc-100 border border-zinc-200 text-xs font-semibold text-zinc-700">
                {durationMinutes >= 60
                  ? `${Math.floor(durationMinutes / 60)}h ${
                      durationMinutes % 60 > 0 ? `${durationMinutes % 60}m` : ""
                    }`
                  : `${durationMinutes}m`}
                <span className="text-[10px] text-zinc-400 ml-1.5">
                  ({durationMinutes} min)
                </span>
              </div>
            </div>
          </div>

          {/* Energy Tier Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-700">Energy Level Requirement</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {ENERGY_OPTIONS.map((opt) => {
                const isSelected = energyLevel === opt.level;
                return (
                  <button
                    key={opt.level}
                    type="button"
                    onClick={() => setEnergyLevel(opt.level)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSelected ? opt.activeColor : opt.color
                    }`}
                  >
                    <div className="text-xs font-bold">{opt.label}</div>
                    <div className="text-[10px] text-zinc-500 mt-0.5 line-clamp-1">
                      {opt.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Icon Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-700">Display Icon</label>
            <div className="flex flex-wrap gap-2 p-2.5 rounded-2xl bg-zinc-50 border border-zinc-200">
              {ROUTINE_ICONS.map((icon) => {
                const isSelected = iconName === icon;
                return (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setIconName(icon)}
                    title={icon}
                    className={`p-2 rounded-xl border transition-all ${
                      isSelected
                        ? "bg-[#154D38] text-white border-[#154D38] shadow-sm scale-110"
                        : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-100"
                    }`}
                  >
                    {ICON_COMPONENTS[icon] || <Clock className="h-4 w-4" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* XP Reward */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-700 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-amber-500" />
                <span>Completion XP Reward</span>
              </span>
              <span className="text-xs font-mono font-bold text-amber-600">+{xpReward} XP</span>
            </label>
            <div className="flex items-center gap-2">
              {[5, 10, 15, 20].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setXpReward(val)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    xpReward === val
                      ? "bg-amber-500 text-white border-amber-600 shadow-sm"
                      : "bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100"
                  }`}
                >
                  +{val} XP
                </button>
              ))}
            </div>
          </div>

          {/* Description & Objective */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-700">Description & Directives</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What specifically needs to be completed or focused on during this block?"
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#154D38]/30 focus:border-[#154D38] text-xs text-zinc-800 leading-relaxed placeholder:text-zinc-400"
            />
          </div>

          {/* Delete confirmation section */}
          {isEditing && onDelete && (
            <div className="pt-2 border-t border-zinc-100">
              {!confirmDelete ? (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-semibold"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete this routine task</span>
                </button>
              ) : (
                <div className="flex items-center justify-between p-3 rounded-2xl bg-rose-50 border border-rose-200">
                  <div className="text-xs text-rose-800 font-medium">
                    Remove this block from your schedule?
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(false)}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium text-zinc-600 hover:bg-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="px-3 py-1 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
                    >
                      Confirm Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Modal Footer / Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-zinc-100">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl text-xs font-semibold px-4 py-2 border-zinc-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-xl text-xs font-bold px-5 py-2 bg-[#154D38] hover:bg-[#0E3425] text-white shadow-sm"
            >
              {isEditing ? "Save Changes" : "Add Routine Task"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
