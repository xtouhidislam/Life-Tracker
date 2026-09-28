"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowRight,
  TrendingUp,
  Award,
  Zap,
} from "lucide-react";
import { CALISTHENICS_PHASES, CalisthenicsPhase } from "@/lib/exercises/calisthenics-data";
import {
  getCalisthenicsState,
  updatePhase,
  CalisthenicsState,
} from "@/lib/storage/calisthenics-store";
import { soundEffects } from "@/lib/audio/sound-effects";
import { triggerHaptic } from "@/lib/ui/haptics";

export function PhaseRoadmapView() {
  const [calisthenicsState, setCalisthenicsState] = useState<CalisthenicsState>(() =>
    getCalisthenicsState()
  );

  const activePhaseNumber = calisthenicsState.currentPhase || 1;

  const handleSelectPhase = (phaseNum: 1 | 2 | 3) => {
    const updated = updatePhase(phaseNum);
    setCalisthenicsState(updated);
    soundEffects.playCheckmark();
    triggerHaptic("success");
  };

  return (
    <div className="space-y-6">
      {/* 3 Phases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {CALISTHENICS_PHASES.map((phase) => {
          const isActive = phase.phaseNumber === activePhaseNumber;
          const isPassed = phase.phaseNumber < activePhaseNumber;

          return (
            <Card
              key={phase.phaseNumber}
              className={`transition-all duration-200 border flex flex-col justify-between ${
                isActive
                  ? "bg-white border-[#154D38] ring-2 ring-emerald-500/20 shadow-md shadow-emerald-900/5"
                  : "bg-white border-zinc-200/90 hover:border-zinc-300"
              }`}
            >
              <CardHeader className="pb-3 border-b border-zinc-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#154D38]">
                    Phase {phase.phaseNumber}
                  </span>
                  {isActive ? (
                    <Badge variant="forest" className="text-[10px] font-bold">
                      Current Focus
                    </Badge>
                  ) : isPassed ? (
                    <Badge variant="mint" className="text-[10px] font-bold">
                      Completed
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px]">
                      Upcoming
                    </Badge>
                  )}
                </div>

                <CardTitle className="text-lg font-black text-zinc-900">
                  {phase.title}
                </CardTitle>
                <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block w-fit mt-1">
                  {phase.months}
                </div>
              </CardHeader>

              <CardContent className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <p className="text-xs text-zinc-600 leading-relaxed font-medium">
                    {phase.whatChanges}
                  </p>

                  <div className="bg-zinc-50 rounded-xl p-3 border border-zinc-200/80 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Volume Target:</span>
                      <strong className="text-zinc-800">{phase.setsPerExercise}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Rest Intervals:</span>
                      <strong className="text-zinc-800">{phase.restDuration}</strong>
                    </div>
                  </div>

                  {/* Milestones list */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                      Phase Milestones:
                    </span>
                    {phase.keyMilestones.map((m, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-zinc-600">
                        <CheckCircle2
                          className={`h-3.5 w-3.5 shrink-0 mt-0.5 ${
                            isActive || isPassed ? "text-[#154D38]" : "text-zinc-300"
                          }`}
                        />
                        <span>{m}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-100">
                  {!isActive ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSelectPhase(phase.phaseNumber)}
                      className="w-full text-xs font-semibold"
                    >
                      Set Phase {phase.phaseNumber} as Current
                    </Button>
                  ) : (
                    <div className="w-full py-2 bg-emerald-50 rounded-xl text-center text-xs font-bold text-[#154D38] border border-emerald-200">
                      Active Training Phase
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
