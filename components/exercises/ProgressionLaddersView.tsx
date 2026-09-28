"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Flame,
  Zap,
  Target,
  Shield,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Award,
  Layers,
  Sparkles,
  ArrowRight,
  Eye,
} from "lucide-react";
import {
  MOVEMENT_PATTERNS,
  MovementPattern,
  ExerciseLevel,
} from "@/lib/exercises/calisthenics-data";
import {
  getCalisthenicsState,
  updateLadderLevel,
  CalisthenicsState,
} from "@/lib/storage/calisthenics-store";
import { soundEffects } from "@/lib/audio/sound-effects";
import { triggerHaptic } from "@/lib/ui/haptics";
import { triggerCelebration } from "@/lib/ui/celebration";

interface ProgressionLaddersViewProps {
  onOpenVisualGuide: (patternId: "push" | "pull" | "legs" | "core") => void;
}

export function ProgressionLaddersView({ onOpenVisualGuide }: ProgressionLaddersViewProps) {
  const [activePatternKey, setActivePatternKey] = useState<"push" | "pull" | "legs" | "core">(
    "push"
  );
  const [calisthenicsState, setCalisthenicsState] = useState<CalisthenicsState>(() =>
    getCalisthenicsState()
  );
  const [expandedLevels, setExpandedLevels] = useState<Record<string, boolean>>({});

  const activePattern = MOVEMENT_PATTERNS[activePatternKey];
  const currentUnlockedLevel = calisthenicsState.userLevels[activePatternKey] || 1;

  const handleSetLevel = (level: number) => {
    const updated = updateLadderLevel(activePatternKey, level);
    setCalisthenicsState(updated);
    soundEffects.playLevelUp();
    triggerHaptic("levelUp");
    if (level > currentUnlockedLevel) {
      triggerCelebration("medium");
    }
  };

  const toggleExpanded = (lvlNum: number) => {
    const key = `${activePatternKey}-${lvlNum}`;
    setExpandedLevels((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      {/* Pattern Selector Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(["push", "pull", "legs", "core"] as const).map((key) => {
          const pat = MOVEMENT_PATTERNS[key];
          const isSelected = activePatternKey === key;
          const userLevel = calisthenicsState.userLevels[key] || 1;
          const totalLevels = pat.levels.length;

          let Icon = Flame;
          if (key === "pull") Icon = Zap;
          if (key === "legs") Icon = Target;
          if (key === "core") Icon = Shield;

          return (
            <button
              key={key}
              onClick={() => setActivePatternKey(key)}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? "bg-[#154D38] text-white border-[#154D38] shadow-md shadow-[#154D38]/15 ring-2 ring-emerald-400/30"
                  : "bg-white text-zinc-900 border-zinc-200/90 hover:border-zinc-300 hover:bg-zinc-50/70"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`h-9 w-9 rounded-xl flex items-center justify-center ${
                    isSelected ? "bg-white/15 text-emerald-300" : "bg-zinc-100 text-zinc-700"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <Badge
                  variant={isSelected ? "forest" : "outline"}
                  className={`text-[10px] uppercase font-bold tracking-wider ${
                    isSelected ? "bg-emerald-400/20 text-emerald-200 border-emerald-400/30" : ""
                  }`}
                >
                  Level {userLevel} of {totalLevels}
                </Badge>
              </div>

              <div>
                <h4 className="font-bold text-sm leading-tight">{pat.name}</h4>
                <p
                  className={`text-xs mt-1 truncate ${
                    isSelected ? "text-emerald-100/80" : "text-zinc-500"
                  }`}
                >
                  {pat.focus}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Pattern Banner & Guide Link */}
      <div className="bg-white border border-zinc-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-black text-zinc-900">{activePattern.name}</h3>
            <Badge variant="mint" className="text-xs font-bold">
              Current: Level {currentUnlockedLevel}
            </Badge>
          </div>
          <p className="text-xs text-zinc-600 mt-1 max-w-xl leading-relaxed">
            {activePattern.description}
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onOpenVisualGuide(activePatternKey)}
          className="gap-2 text-xs font-bold shrink-0 text-zinc-800"
        >
          <Eye className="h-3.5 w-3.5 text-[#154D38]" />
          <span>View Visual Guide</span>
        </Button>
      </div>

      {/* Ladder Progression Cards */}
      <div className="space-y-3.5">
        {activePattern.levels.map((lvl) => {
          const isCurrent = lvl.level === currentUnlockedLevel;
          const isMastered = lvl.level < currentUnlockedLevel;
          const isExpanded = !!expandedLevels[`${activePatternKey}-${lvl.level}`];

          return (
            <Card
              key={lvl.level}
              className={`transition-all duration-200 border ${
                isCurrent
                  ? "bg-white border-[#154D38] ring-2 ring-emerald-500/20 shadow-md shadow-emerald-900/5"
                  : isMastered
                  ? "bg-emerald-50/20 border-emerald-200/70"
                  : "bg-white border-zinc-200/90 hover:border-zinc-300"
              }`}
            >
              <CardContent className="p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Left: Level Number + Title */}
                  <div className="flex items-start sm:items-center gap-3">
                    <div
                      className={`h-10 w-10 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 border transition-colors ${
                        isCurrent
                          ? "bg-[#154D38] text-white border-[#154D38] shadow-xs"
                          : isMastered
                          ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                          : "bg-zinc-100 text-zinc-500 border-zinc-200"
                      }`}
                    >
                      {isMastered ? (
                        <CheckCircle2 className="h-5 w-5 text-[#154D38]" />
                      ) : (
                        `L${lvl.level}`
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-base text-zinc-900">{lvl.name}</h4>
                        {isCurrent && (
                          <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-[#154D38] px-2 py-0.5 rounded-md border border-emerald-300">
                            Active Level
                          </span>
                        )}
                        {lvl.isStretchGoal && (
                          <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md border border-amber-200">
                            Stretch Goal (Month 5–6)
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-500 mt-0.5">{lvl.subtitle}</p>
                    </div>
                  </div>

                  {/* Right: Target & Action */}
                  <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0">
                    <div className="text-right">
                      <div className="text-xs font-bold text-zinc-900 bg-zinc-100 px-2.5 py-1 rounded-lg border border-zinc-200/80">
                        {lvl.targetReps}
                      </div>
                      <div className="text-[10px] text-zinc-500 mt-0.5 font-medium">
                        {lvl.equipment}
                      </div>
                    </div>

                    {!isCurrent && (
                      <Button
                        size="sm"
                        variant={isMastered ? "ghost" : "outline"}
                        onClick={() => handleSetLevel(lvl.level)}
                        className="text-xs h-8 px-2.5 font-semibold"
                      >
                        {isMastered ? "Switch Here" : "Unlock Level"}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Graduation Criteria Pill */}
                <div className="mt-3.5 pt-3 border-t border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-zinc-700 uppercase tracking-wider text-[11px]">
                      Graduate When:
                    </span>
                    <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200/60 font-semibold">
                      {lvl.graduateWhen}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleExpanded(lvl.level)}
                    className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-800 font-medium self-start sm:self-auto"
                  >
                    <span>{isExpanded ? "Hide Technique & Form" : "Technique & Cues"}</span>
                    {isExpanded ? (
                      <ChevronUp className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>

                {/* Expanded Details: Form Cues & Common Mistakes */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-zinc-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {/* Form Cues */}
                    <div className="bg-zinc-50/80 rounded-xl p-3.5 border border-zinc-200/80 space-y-2">
                      <div className="font-bold text-zinc-900 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Form Cues</span>
                      </div>
                      <ul className="space-y-1.5 text-zinc-600">
                        {lvl.formCues.map((cue, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-[#154D38] font-bold">•</span>
                            <span>{cue}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Common Mistakes & Regression */}
                    <div className="space-y-3">
                      <div className="bg-amber-50/60 rounded-xl p-3.5 border border-amber-200/70 space-y-1.5">
                        <div className="font-bold text-amber-900 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                          <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                          <span>Common Mistakes to Avoid</span>
                        </div>
                        <ul className="space-y-1 text-zinc-700">
                          {lvl.commonMistakes.map((mis, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-amber-600 font-bold">×</span>
                              <span>{mis}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Regression */}
                      <div className="bg-zinc-50 rounded-xl p-3 border border-zinc-200 text-zinc-600">
                        <span className="font-bold text-zinc-800">Regression if too hard:</span>{" "}
                        {lvl.regression}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
