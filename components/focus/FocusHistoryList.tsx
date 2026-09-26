"use client";

import React from "react";
import { Clock, Target, Zap, CheckCircle2 } from "lucide-react";
import { FocusSessionRecord } from "@/app/actions/focus";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FocusHistoryListProps {
  sessions: FocusSessionRecord[];
}

export function FocusHistoryList({ sessions }: FocusHistoryListProps) {
  const formatTimeStr = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch (e) {
      return "--:--";
    }
  };

  return (
    <Card className="bg-white border border-zinc-200/90 shadow-2xs">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-bold text-zinc-900">
            Today&apos;s Focus Log
          </CardTitle>
          <CardDescription className="text-xs text-zinc-500">
            Completed deep work sessions and focus milestones
          </CardDescription>
        </div>

        <Badge variant="mint" className="text-xs font-semibold">
          {sessions.length} Completed
        </Badge>
      </CardHeader>

      <CardContent className="space-y-2.5 pt-1">
        {sessions.length > 0 ? (
          sessions.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-50/80 border border-zinc-200/70 hover:bg-zinc-100/60 transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-8 w-8 rounded-lg bg-[#E8F5E9] text-[#154D38] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-4 w-4" />
                </div>

                <div className="truncate">
                  <span className="text-xs font-bold text-zinc-900 block truncate">
                    {s.task_title || "Deep Work Sprint"}
                  </span>
                  <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-0.5">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="h-3 w-3" />
                      {formatTimeStr(s.completed_at)}
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-zinc-600">
                      {Math.round(s.duration_seconds / 60)} minutes
                    </span>
                    {s.environment_sound && (
                      <>
                        <span>•</span>
                        <span className="capitalize">{s.environment_sound}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/80 flex items-center gap-1 shrink-0">
                <Zap className="h-3 w-3 fill-amber-400 text-amber-500" />
                +{s.xp_earned} XP
              </span>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-xs text-zinc-400">
            No focus sessions logged yet today. Hit start to record your first sprint!
          </div>
        )}
      </CardContent>
    </Card>
  );
}
