"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  Dumbbell,
  Play,
  CheckCircle2,
  ChevronRight,
  Flame,
  Zap,
  Target,
  Shield,
  Coffee,
  Sparkles,
  Info,
} from "lucide-react";
import { WEEKLY_SCHEDULE, DaySchedule } from "@/lib/exercises/calisthenics-data";

interface WeeklyScheduleViewProps {
  onStartWorkout: (schedule: DaySchedule) => void;
}

export function WeeklyScheduleView({ onStartWorkout }: WeeklyScheduleViewProps) {
  // Current day index (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const currentDayIndex = new Date().getDay();

  // Selected day for inspection
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(currentDayIndex);

  const selectedDay =
    WEEKLY_SCHEDULE.find((d) => d.dayIndex === selectedDayIndex) || WEEKLY_SCHEDULE[1];

  return (
    <div className="space-y-6">
      {/* 7-Day Day Selector Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {WEEKLY_SCHEDULE.map((day) => {
          const isToday = day.dayIndex === currentDayIndex;
          const isSelected = day.dayIndex === selectedDayIndex;

          return (
            <button
              key={day.dayName}
              onClick={() => setSelectedDayIndex(day.dayIndex)}
              className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                isSelected
                  ? "bg-[#154D38] text-white border-[#154D38] shadow-md shadow-[#154D38]/15 ring-2 ring-emerald-400/30"
                  : isToday
                  ? "bg-emerald-50/70 border-emerald-300 text-zinc-900"
                  : "bg-white text-zinc-900 border-zinc-200/90 hover:border-zinc-300 hover:bg-zinc-50/70"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`text-xs font-bold ${
                      isSelected ? "text-emerald-200" : isToday ? "text-[#154D38]" : "text-zinc-500"
                    }`}
                  >
                    {day.dayName.slice(0, 3)}
                  </span>
                  {isToday && (
                    <span
                      className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-[#154D38] text-white"
                      }`}
                    >
                      Today
                    </span>
                  )}
                </div>

                <div className="font-bold text-xs leading-snug line-clamp-2">
                  {day.focus.split("(")[0]}
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-current/10 flex items-center justify-between text-[11px]">
                <span className={isSelected ? "text-emerald-100" : "text-zinc-500"}>
                  {day.isRestDay ? "Rest" : `~${day.durationMinutes}m`}
                </span>
                {day.isRestDay ? (
                  <Coffee className={`h-3 w-3 ${isSelected ? "text-emerald-200" : "text-amber-600"}`} />
                ) : (
                  <Dumbbell className={`h-3 w-3 ${isSelected ? "text-emerald-200" : "text-[#154D38]"}`} />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Day Detailed Breakdown Card */}
      <Card className="bg-white border-zinc-200/90 shadow-2xs overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-zinc-50 to-white border-b border-zinc-100 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={selectedDay.isRestDay ? "amber" : "forest"}
                  className="text-xs font-bold"
                >
                  {selectedDay.dayName}
                </Badge>
                {selectedDay.dayIndex === currentDayIndex && (
                  <Badge variant="mint" className="text-xs font-semibold">
                    Scheduled For Today
                  </Badge>
                )}
                <span className="text-xs text-zinc-500 font-medium flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>
                    {selectedDay.isRestDay ? "Full Rest / Active Recovery" : `${selectedDay.durationMinutes} Minutes Session`}
                  </span>
                </span>
              </div>

              <CardTitle className="text-xl font-black text-zinc-900 mt-2">
                {selectedDay.focus}
              </CardTitle>
              <p className="text-xs text-zinc-500 mt-0.5">{selectedDay.subtitle}</p>
            </div>

            {!selectedDay.isRestDay ? (
              <Button
                variant="primary"
                onClick={() => onStartWorkout(selectedDay)}
                className="gap-2 text-xs font-bold bg-[#154D38] hover:bg-[#0F382A] text-white px-5 py-2.5 self-start sm:self-auto shadow-md shadow-emerald-900/15"
              >
                <Play className="h-4 w-4 fill-white" />
                <span>Launch {selectedDay.dayName}&apos;s Workout</span>
              </Button>
            ) : (
              <div className="bg-amber-50 text-amber-900 px-3.5 py-2 rounded-xl border border-amber-200 text-xs font-medium flex items-center gap-2">
                <Coffee className="h-4 w-4 text-amber-700" />
                <span>Recovery Day — Eat Protein & Rest</span>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 space-y-6">
          {/* Blueprint Structure Pills (Warmup / Main / Finisher / Cooldown) */}
          {!selectedDay.isRestDay && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-emerald-50/70 border border-emerald-200/70 rounded-xl p-3">
                <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
                  Warm-Up
                </span>
                <div className="text-base font-black text-emerald-950 mt-0.5">
                  {selectedDay.warmupMinutes} min
                </div>
                <p className="text-[11px] text-emerald-700 mt-0.5">Joints & bloodflow</p>
              </div>

              <div className="bg-emerald-50/70 border border-emerald-200/70 rounded-xl p-3">
                <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
                  Main Working Sets
                </span>
                <div className="text-base font-black text-emerald-950 mt-0.5">
                  {selectedDay.mainSetsMinutes} min
                </div>
                <p className="text-[11px] text-emerald-700 mt-0.5">Target movement ladder</p>
              </div>

              <div className="bg-amber-50/70 border border-amber-200/70 rounded-xl p-3">
                <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">
                  Core Finisher
                </span>
                <div className="text-base font-black text-amber-950 mt-0.5">
                  {selectedDay.finisherMinutes} min
                </div>
                <p className="text-[11px] text-amber-700 mt-0.5">Midline anti-extension</p>
              </div>

              <div className="bg-sky-50/70 border border-sky-200/70 rounded-xl p-3">
                <span className="text-[10px] uppercase font-bold text-sky-800 tracking-wider">
                  Cool-Down
                </span>
                <div className="text-base font-black text-sky-950 mt-0.5">
                  {selectedDay.cooldownMinutes} min
                </div>
                <p className="text-[11px] text-sky-700 mt-0.5">Static muscle release</p>
              </div>
            </div>
          )}

          {/* Exercise Flow Sequence */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
              {selectedDay.isRestDay ? "Recovery Mindset & Guidelines" : "Prescribed Session Flow"}
            </h4>

            <div className="space-y-2.5">
              {selectedDay.sampleExercises.map((ex, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-zinc-200/80 bg-white hover:border-emerald-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-lg bg-zinc-100 text-zinc-600 font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-zinc-900 flex items-center gap-2">
                        <span>{ex.name}</span>
                        <Badge
                          variant={
                            ex.pattern === "warmup"
                              ? "outline"
                              : ex.pattern === "cooldown"
                              ? "cyan"
                              : ex.pattern === "core"
                              ? "amber"
                              : "forest"
                          }
                          className="text-[9px] uppercase px-1.5 py-0"
                        >
                          {ex.pattern}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-zinc-500 mt-0.5">{ex.notes}</p>
                    </div>
                  </div>

                  <div className="sm:text-right shrink-0">
                    <span className="text-xs font-bold text-[#154D38] bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60">
                      {ex.setsReps}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
