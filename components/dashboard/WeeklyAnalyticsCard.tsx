"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Calendar, Clock, Sparkles } from "lucide-react";

interface DayData {
  dayName: string;
  fullDate: string;
  completionRate: number; // 0 to 100
  focusHours: number;
  isToday?: boolean;
}

interface WeeklyAnalyticsCardProps {
  days?: DayData[];
  averageWeeklyScore?: number;
  totalWeeklyHours?: number;
}

const DEFAULT_DAYS: DayData[] = [
  { dayName: "Mon", fullDate: "Sep 22", completionRate: 65, focusHours: 3.2 },
  { dayName: "Tue", fullDate: "Sep 23", completionRate: 85, focusHours: 4.5 },
  { dayName: "Wed", fullDate: "Sep 24", completionRate: 90, focusHours: 5.0 },
  { dayName: "Thu", fullDate: "Sep 25", completionRate: 75, focusHours: 3.8 },
  { dayName: "Fri", fullDate: "Sep 26", completionRate: 95, focusHours: 4.2, isToday: true },
  { dayName: "Sat", fullDate: "Sep 27", completionRate: 60, focusHours: 2.0 },
  { dayName: "Sun", fullDate: "Sep 28", completionRate: 70, focusHours: 2.5 },
];

export function WeeklyAnalyticsCard({
  days = DEFAULT_DAYS,
  averageWeeklyScore = 77,
  totalWeeklyHours = 25.2,
}: WeeklyAnalyticsCardProps) {
  const [hoveredDay, setHoveredDay] = useState<DayData | null>(null);

  const activeDisplay = hoveredDay || days.find((d) => d.isToday) || days[days.length - 1];

  return (
    <Card className="bg-white border border-zinc-200/90 shadow-2xs flex flex-col justify-between h-full">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#154D38]">
            <BarChart3 className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-zinc-900">
              Weekly Performance Analytics
            </CardTitle>
            <CardDescription className="text-xs text-zinc-500">
              7-day velocity & deep work cadence
            </CardDescription>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-semibold text-zinc-600 bg-zinc-50">
            {averageWeeklyScore}% Weekly Avg
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        {/* Dynamic Day Tooltip / Indicator */}
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-zinc-100 text-xs">
          <div className="flex items-center gap-2 font-semibold text-zinc-700">
            <span className="font-mono text-zinc-900 text-sm font-bold">
              {activeDisplay.dayName}
            </span>
            <span className="text-zinc-400 font-normal">({activeDisplay.fullDate})</span>
            {activeDisplay.isToday && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Today
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="text-emerald-800 flex items-center gap-1 font-mono">
              <span className="h-2 w-2 rounded-full bg-[#154D38]" />
              {activeDisplay.completionRate}% Done
            </span>
            <span className="text-zinc-600 flex items-center gap-1 font-mono">
              <Clock className="h-3 w-3 text-zinc-400" />
              {activeDisplay.focusHours}h Focus
            </span>
          </div>
        </div>

        {/* 7-Day Velocity Bars */}
        <div className="flex items-end justify-between gap-3 h-32 px-1 pt-2">
          {days.map((day, idx) => {
            const isHovered = hoveredDay?.dayName === day.dayName;
            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredDay(day)}
                onMouseLeave={() => setHoveredDay(null)}
                className="flex-1 flex flex-col items-center gap-2 h-full justify-end cursor-pointer group"
              >
                {/* Micro badge on active day */}
                {day.isToday && (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[#154D38] text-white shadow-2xs scale-90 sm:scale-100">
                    {day.completionRate}%
                  </span>
                )}

                {/* Capsule Bar */}
                <div className="w-full max-w-[28px] h-full flex items-end">
                  <div
                    className={`w-full rounded-full transition-all duration-300 ${
                      day.isToday || isHovered
                        ? "bg-[#154D38] ring-2 ring-emerald-200"
                        : day.completionRate >= 80
                        ? "bg-emerald-400"
                        : "bg-zinc-200 group-hover:bg-emerald-300"
                    }`}
                    style={{ height: `${Math.max(15, day.completionRate)}%` }}
                  />
                </div>

                <span
                  className={`text-xs font-mono font-semibold transition-colors ${
                    day.isToday ? "text-[#154D38] font-bold" : "text-zinc-500"
                  }`}
                >
                  {day.dayName}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
