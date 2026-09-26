"use client";

import React, { useState, useEffect, useMemo, useTransition } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  CheckCircle2,
  Sparkles,
  Flame,
  Layers,
  CalendarDays,
  CalendarRange,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreateTaskModal } from "@/components/tasks/CreateTaskModal";
import { XPToast } from "@/components/tasks/XPToast";
import type { TaskItem } from "@/app/actions/tasks";
import {
  getTasksAction,
  toggleTaskCompletionAction,
} from "@/app/actions/tasks";
import { useAuth } from "@/hooks/useAuth";
import {
  format,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";

type ViewMode = "month" | "week" | "day";

const DAYS_HEADER = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const HOURS = Array.from({ length: 18 }, (_, i) => i + 6); // 06:00 to 23:00

export default function CalendarPage() {
  const { refreshProfile } = useAuth();
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastEarnedXp, setLastEarnedXp] = useState(10);
  const [showXpToast, setShowXpToast] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Load tasks on mount
  useEffect(() => {
    async function loadTasks() {
      const res = await getTasksAction();
      if (res.tasks) {
        setTasks(res.tasks);
      }
    }
    loadTasks();
  }, []);

  // Navigation handlers
  const handlePrev = () => {
    if (viewMode === "month") {
      setCurrentDate((prev) => subMonths(prev, 1));
    } else if (viewMode === "week") {
      setCurrentDate((prev) => subWeeks(prev, 1));
    } else {
      setCurrentDate((prev) => subDays(prev, 1));
      setSelectedDate((prev) => subDays(prev, 1));
    }
  };

  const handleNext = () => {
    if (viewMode === "month") {
      setCurrentDate((prev) => addMonths(prev, 1));
    } else if (viewMode === "week") {
      setCurrentDate((prev) => addWeeks(prev, 1));
    } else {
      setCurrentDate((prev) => addDays(prev, 1));
      setSelectedDate((prev) => addDays(prev, 1));
    }
  };

  const handleToday = () => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDate(now);
  };

  // Month grid days
  const monthDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [currentDate]);

  // Week days
  const weekDays = useMemo(() => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: weekStart, end: weekEnd });
  }, [currentDate]);

  // Group tasks by date string (YYYY-MM-DD)
  const tasksByDate = useMemo(() => {
    const map = new Map<string, TaskItem[]>();
    tasks.forEach((t) => {
      if (t.due_date) {
        const list = map.get(t.due_date) || [];
        list.push(t);
        map.set(t.due_date, list);
      }
    });
    return map;
  }, [tasks]);

  // Tasks for the selected date
  const selectedDateStr = format(selectedDate, "yyyy-MM-dd");
  const selectedDateTasks = tasksByDate.get(selectedDateStr) || [];

  // Toggle completion
  const handleToggle = async (
    taskId: string,
    currentStatus: boolean,
    xpValue: number,
    title: string
  ) => {
    const nextStatus = !currentStatus;

    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              is_completed: nextStatus,
              completed_at: nextStatus ? new Date().toISOString() : null,
            }
          : t
      )
    );

    if (nextStatus) {
      setLastEarnedXp(xpValue);
      setShowXpToast(true);
      setTimeout(() => setShowXpToast(false), 3200);
    }

    startTransition(async () => {
      await toggleTaskCompletionAction(taskId, currentStatus, xpValue, title);
      await refreshProfile();
    });
  };

  const handleTaskCreated = (newTask: TaskItem) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  return (
    <div className="space-y-6 max-w-6xl pb-12 select-none">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-900 flex items-center gap-2.5">
            <span>Calendar & Schedule</span>
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Interactive multi-view schedule integrating daily missions, routines, and milestones.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white border border-zinc-200">
            <button
              onClick={() => setViewMode("month")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === "month"
                  ? "bg-[#154D38] text-white font-bold shadow-xs"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode("week")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === "week"
                  ? "bg-[#154D38] text-white font-bold shadow-xs"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode("day")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === "day"
                  ? "bg-[#154D38] text-white font-bold shadow-xs"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              Day
            </button>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="gap-2 px-4 bg-[#154D38] hover:bg-[#0F382A] text-white font-bold shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Add Event</span>
          </Button>
        </div>
      </div>

      {/* Date Navigator Bar */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <CalendarIcon className="h-5 w-5 text-[#154D38]" />
          <span className="text-base font-extrabold text-zinc-900">
            {viewMode === "day"
              ? format(selectedDate, "EEEE, MMMM d, yyyy")
              : viewMode === "week"
              ? `Week of ${format(startOfWeek(currentDate, { weekStartsOn: 1 }), "MMM d")} - ${format(
                  endOfWeek(currentDate, { weekStartsOn: 1 }),
                  "MMM d, yyyy"
                )}`
              : format(currentDate, "MMMM yyyy")}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="h-8 w-8 rounded-lg border border-zinc-200 hover:bg-zinc-50 flex items-center justify-center text-zinc-600 hover:text-zinc-900 transition-colors"
            title="Previous"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={handleToday}
            className="px-3 h-8 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-xs font-bold text-zinc-700 hover:text-zinc-900 transition-colors"
          >
            Today
          </button>
          <button
            onClick={handleNext}
            className="h-8 w-8 rounded-lg border border-zinc-200 hover:bg-zinc-50 flex items-center justify-center text-zinc-600 hover:text-zinc-900 transition-colors"
            title="Next"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* VIEW: MONTH GRID */}
      {viewMode === "month" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 7-Column Month Grid */}
          <div className="lg:col-span-2">
            <Card className="p-4 border-zinc-200/90 bg-white shadow-2xs">
              {/* Day of Week Headers */}
              <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-zinc-400 pb-3 border-b border-zinc-100">
                {DAYS_HEADER.map((d) => (
                  <div key={d}>{d}</div>
                ))}
              </div>

              {/* Day Cells Grid */}
              <div className="grid grid-cols-7 gap-1.5 pt-3">
                {monthDays.map((day) => {
                  const dayStr = format(day, "yyyy-MM-dd");
                  const isCurrentMonth = isSameMonth(day, currentDate);
                  const isDayToday = isToday(day);
                  const isDaySelected = isSameDay(day, selectedDate);
                  const dayTasks = tasksByDate.get(dayStr) || [];
                  const pendingCount = dayTasks.filter((t) => !t.is_completed).length;

                  return (
                    <div
                      key={dayStr}
                      onClick={() => setSelectedDate(day)}
                      className={`min-h-[92px] p-2 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isDaySelected
                          ? "bg-emerald-50/70 border-[#154D38] shadow-xs"
                          : isDayToday
                          ? "bg-zinc-50 border-emerald-500/50"
                          : isCurrentMonth
                          ? "bg-white border-zinc-200/70 hover:border-zinc-300 hover:bg-zinc-50/50"
                          : "bg-transparent border-transparent opacity-30 hover:opacity-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-bold ${
                            isDayToday
                              ? "h-6 w-6 rounded-full bg-[#154D38] text-white flex items-center justify-center font-black"
                              : isDaySelected
                              ? "text-[#154D38] font-black"
                              : "text-zinc-600"
                          }`}
                        >
                          {format(day, "d")}
                        </span>

                        {pendingCount > 0 && (
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                        )}
                      </div>

                      {/* Task Pills Preview */}
                      <div className="space-y-1 mt-1 overflow-hidden">
                        {dayTasks.slice(0, 2).map((t) => (
                          <div
                            key={t.id}
                            className={`text-[10px] truncate px-1.5 py-0.5 rounded font-medium flex items-center gap-1 ${
                              t.is_completed
                                ? "bg-zinc-100 text-zinc-400 line-through"
                                : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            }`}
                          >
                            <span
                              className="h-1 w-1 rounded-full shrink-0"
                              style={{ backgroundColor: t.category_color || "#154D38" }}
                            />
                            <span className="truncate">{t.title}</span>
                          </div>
                        ))}
                        {dayTasks.length > 2 && (
                          <div className="text-[9px] text-zinc-400 font-semibold px-1">
                            +{dayTasks.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Right: Selected Day Inspector & Actions */}
          <div className="space-y-4">
            <Card className="border-zinc-200/90 bg-white p-5 shadow-2xs">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">
                    {format(selectedDate, "EEEE, MMMM d")}
                  </h3>
                  <p className="text-xs text-zinc-400">
                    {selectedDateTasks.length} {selectedDateTasks.length === 1 ? "objective" : "objectives"} scheduled
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => setIsModalOpen(true)}
                  className="gap-1 h-8 text-xs bg-[#154D38] hover:bg-[#0F382A] text-white"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add</span>
                </Button>
              </div>

              {/* Day Tasks Feed */}
              <div className="space-y-2.5 pt-3 max-h-[380px] overflow-y-auto">
                {selectedDateTasks.length > 0 ? (
                  selectedDateTasks.map((t) => (
                    <div
                      key={t.id}
                      className={`p-3 rounded-xl border flex items-start gap-2.5 transition-all ${
                        t.is_completed
                          ? "bg-zinc-50 border-zinc-200/60 opacity-60"
                          : "bg-white border-zinc-200/90 shadow-2xs"
                      }`}
                    >
                      <button
                        onClick={() =>
                          handleToggle(t.id, t.is_completed, t.xp_value, t.title)
                        }
                        className={`h-5 w-5 mt-0.5 rounded-md border flex items-center justify-center shrink-0 transition-all ${
                          t.is_completed
                            ? "bg-[#154D38] border-[#154D38] text-white font-bold"
                            : "border-zinc-300 hover:border-[#154D38]"
                        }`}
                      >
                        {t.is_completed && <CheckCircle2 className="h-3.5 w-3.5" />}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div
                          className={`text-xs font-semibold truncate ${
                            t.is_completed
                              ? "line-through text-zinc-400"
                              : "text-zinc-900"
                          }`}
                        >
                          {t.title}
                        </div>

                        <div className="flex items-center gap-2 mt-1 text-[10px] text-zinc-400">
                          {t.due_time && (
                            <span className="flex items-center gap-1 font-mono">
                              <Clock className="h-3 w-3" />
                              <span>{t.due_time}</span>
                            </span>
                          )}
                          <span className="text-amber-700 font-bold">
                            +{t.xp_value} XP
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-xs text-zinc-400">
                    No deliverables due on this date.
                    <div className="mt-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setIsModalOpen(true)}
                        className="text-xs text-[#154D38]"
                      >
                        + Schedule objective
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Quick Time Blocks Guide */}
            <Card className="border-zinc-200/90 bg-white p-4 shadow-2xs">
              <div className="text-xs font-bold text-zinc-900 mb-2 flex items-center gap-1.5">
                <Flame className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                <span>Productivity Time-Boxing Tip</span>
              </div>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                Group similar tasks into dedicated 45-minute blocks. Schedule your highest priority quest between 09:00 - 12:00 for optimal cognitive focus.
              </p>
            </Card>
          </div>
        </div>
      )}

      {/* VIEW: WEEK VIEW */}
      {viewMode === "week" && (
        <Card className="p-4 border-zinc-200/90 bg-white shadow-2xs overflow-x-auto">
          <div className="min-w-[700px]">
            {/* Day Column Headers */}
            <div className="grid grid-cols-7 gap-2 pb-3 border-b border-zinc-100 text-center">
              {weekDays.map((day) => {
                const dayStr = format(day, "yyyy-MM-dd");
                const isDayToday = isToday(day);
                return (
                  <div key={dayStr} className="space-y-0.5">
                    <div className="text-[11px] font-bold text-zinc-400 uppercase">
                      {format(day, "EEE")}
                    </div>
                    <div
                      className={`text-sm font-extrabold mx-auto h-7 w-7 rounded-full flex items-center justify-center ${
                        isDayToday
                          ? "bg-[#154D38] text-white"
                          : "text-zinc-800"
                      }`}
                    >
                      {format(day, "d")}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Week Columns Grid */}
            <div className="grid grid-cols-7 gap-2 pt-3 min-h-[420px]">
              {weekDays.map((day) => {
                const dayStr = format(day, "yyyy-MM-dd");
                const dayTasks = tasksByDate.get(dayStr) || [];

                return (
                  <div
                    key={dayStr}
                    className="p-2 rounded-xl bg-zinc-50/70 border border-zinc-200/70 flex flex-col gap-2 min-h-[350px]"
                  >
                    {dayTasks.map((t) => (
                      <div
                        key={t.id}
                        className={`p-2 rounded-lg text-xs border space-y-1 ${
                          t.is_completed
                            ? "bg-zinc-100 border-zinc-200 line-through text-zinc-400 opacity-70"
                            : "bg-white border-zinc-200/90 text-zinc-900 shadow-2xs"
                        }`}
                      >
                        <div className="font-semibold line-clamp-2">
                          {t.title}
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-zinc-400">
                          <span>{t.due_time || "All day"}</span>
                          <span className="text-amber-700 font-bold">
                            +{t.xp_value} XP
                          </span>
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={() => {
                        setSelectedDate(day);
                        setIsModalOpen(true);
                      }}
                      className="mt-auto py-1 text-[11px] text-zinc-400 hover:text-[#154D38] border border-dashed border-zinc-300 rounded-lg hover:border-[#154D38] transition-colors text-center"
                    >
                      + Add
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      )}

      {/* VIEW: DAY TIMELINE VIEW */}
      {viewMode === "day" && (
        <Card className="p-5 border-zinc-200/90 bg-white shadow-2xs">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div>
                <h2 className="text-lg font-bold text-zinc-900">
                  Hourly Schedule & Execution Plan
                </h2>
                <p className="text-xs text-zinc-400">
                  {format(selectedDate, "EEEE, MMMM d, yyyy")}
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsModalOpen(true)}
                className="gap-2 bg-[#154D38] hover:bg-[#0F382A] text-white"
              >
                <Plus className="h-4 w-4" />
                <span>Schedule Time Block</span>
              </Button>
            </div>

            {/* Hourly Timeline */}
            <div className="divide-y divide-zinc-100 max-h-[550px] overflow-y-auto pr-2">
              {HOURS.map((hour) => {
                const hourFormatted = `${hour.toString().padStart(2, "0")}:00`;
                const matchingTasks = selectedDateTasks.filter(
                  (t) => t.due_time && t.due_time.startsWith(hour.toString().padStart(2, "0"))
                );

                return (
                  <div key={hour} className="py-3 flex items-start gap-4 group">
                    <div className="w-14 text-xs font-mono font-bold text-zinc-400 pt-1">
                      {hourFormatted}
                    </div>

                    <div className="flex-1 min-h-[40px] rounded-xl p-2 bg-zinc-50/50 border border-transparent group-hover:border-zinc-200 transition-all">
                      {matchingTasks.length > 0 ? (
                        <div className="space-y-2">
                          {matchingTasks.map((t) => (
                            <div
                              key={t.id}
                              className={`p-3 rounded-xl border flex items-center justify-between ${
                                t.is_completed
                                  ? "bg-zinc-100 border-zinc-200 line-through text-zinc-400"
                                  : "bg-white border-zinc-200/90 text-zinc-900 shadow-2xs"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span
                                  className="h-2 w-2 rounded-full"
                                  style={{ backgroundColor: t.category_color || "#154D38" }}
                                />
                                <span className="text-sm font-semibold">{t.title}</span>
                              </div>
                              <div className="flex items-center gap-3 text-xs">
                                <span className="text-amber-700 font-bold">+{t.xp_value} XP</span>
                                <Badge variant="outline">{t.priority}</Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-[11px] text-zinc-400 opacity-40 group-hover:opacity-100 flex items-center gap-2">
                          <span>Open Focus Slot</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      )}

      {/* Creation Modal */}
      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTaskCreated={handleTaskCreated}
        initialDate={format(selectedDate, "yyyy-MM-dd")}
      />

      {/* Celebratory XP Toast */}
      <XPToast xp={lastEarnedXp} visible={showXpToast} />
    </div>
  );
}
