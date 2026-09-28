"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Maximize2,
  X,
  ChevronRight,
  Flame,
  Zap,
  Target,
  Shield,
  CheckCircle2,
  Info,
} from "lucide-react";
import { MOVEMENT_PATTERNS } from "@/lib/exercises/calisthenics-data";

interface VisualGuidesGalleryProps {
  initialPattern?: "push" | "pull" | "legs" | "core";
}

const GUIDES = [
  {
    id: "push",
    title: "Push Progression Guide",
    subtitle: "Wall → Incline → Standard → Diamond / Pike",
    image: "/exercises/pushup-progression.jpg",
    icon: Flame,
    color: "emerald",
    keyFocus: "Chest, Triceps, Shoulders",
    patternKey: "push",
    tips: [
      "Keep elbows tucked at 45° like an arrow, not a 90° T.",
      "Lock glutes and core to keep body in a rigid plank line.",
      "Graduate to next level only after 3 sets of 10–12 clean reps.",
    ],
  },
  {
    id: "pull",
    title: "Pull Progression Guide",
    subtitle: "Table / Doorframe Rows → Superman Holds → Negative Pull-ups",
    image: "/exercises/pull-progression.jpg",
    icon: Zap,
    color: "amber",
    keyFocus: "Lats, Biceps, Upper Back, Rear Delts",
    patternKey: "pull",
    tips: [
      "Always initiate pull by driving elbows back and squeezing shoulder blades.",
      "Under a table: test table stability before hanging full bodyweight.",
      "Negative pull-ups: jump to top and resist gravity over 5 slow seconds.",
    ],
  },
  {
    id: "legs",
    title: "Legs & Glutes Progression Guide",
    subtitle: "Bodyweight Squat → Bulgarian Split Squat → Pistol Squat",
    image: "/exercises/legs-progression.jpg",
    icon: Target,
    color: "cyan",
    keyFocus: "Quads, Glutes, Hamstrings, Single-Leg Balance",
    patternKey: "legs",
    tips: [
      "Keep front heel rooted firmly into floor on Bulgarian split squats.",
      "Push knees slightly outward over toes; never allow knees to collapse inward.",
      "For pistol squats: hold doorframe lightly for balance, use leg strength to drive.",
    ],
  },
  {
    id: "core",
    title: "Core & Compression Guide",
    subtitle: "Knee Plank → Full Plank → Hollow Body Hold → L-Sit",
    image: "/exercises/core-progression.jpg",
    icon: Shield,
    color: "rose",
    keyFocus: "Rectus Abdominis, Obliques, Deep Transverse Core",
    patternKey: "core",
    tips: [
      "Hollow body hold: press lower back firmly into floor with zero arch.",
      "Full plank: pull elbows toward toes to engage maximum abdominal tension.",
      "L-sit: push floor/chair away aggressively to depress shoulders and lift hips.",
    ],
  },
];

export function VisualGuidesGallery({ initialPattern = "push" }: VisualGuidesGalleryProps) {
  const [selectedGuideId, setSelectedGuideId] = useState<string>(initialPattern);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  const activeGuide = GUIDES.find((g) => g.id === selectedGuideId) || GUIDES[0];
  const activePatternData = MOVEMENT_PATTERNS[activeGuide.patternKey];

  return (
    <div className="space-y-6">
      {/* Pattern Selector Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {GUIDES.map((guide) => {
          const Icon = guide.icon;
          const isSelected = guide.id === selectedGuideId;
          return (
            <button
              key={guide.id}
              onClick={() => setSelectedGuideId(guide.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? "bg-[#154D38] text-white border-[#154D38] shadow-md shadow-[#154D38]/15 ring-2 ring-emerald-400/30"
                  : "bg-white text-zinc-800 border-zinc-200/90 hover:border-zinc-300 hover:bg-zinc-50/70"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`h-8 w-8 rounded-xl flex items-center justify-center ${
                    isSelected ? "bg-white/15 text-emerald-300" : "bg-zinc-100 text-zinc-700"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <Badge
                  variant={isSelected ? "forest" : "outline"}
                  className={`text-[10px] uppercase font-bold tracking-wider ${
                    isSelected ? "bg-emerald-400/20 text-emerald-200 border-emerald-400/30" : ""
                  }`}
                >
                  {guide.id}
                </Badge>
              </div>
              <div>
                <h4 className="font-bold text-sm tracking-tight leading-tight">
                  {guide.title.replace(" Guide", "")}
                </h4>
                <p
                  className={`text-xs mt-1 truncate ${
                    isSelected ? "text-emerald-100/80" : "text-zinc-500"
                  }`}
                >
                  {guide.keyFocus}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Visual Display Card */}
      <Card className="bg-white border-zinc-200/90 shadow-2xs overflow-hidden">
        <CardHeader className="border-b border-zinc-100 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-wider text-[#154D38]">
                  Form & Anatomy Blueprint
                </span>
                <Badge variant="mint" className="text-[10px]">
                  Generated Visual Guide
                </Badge>
              </div>
              <CardTitle className="text-xl font-black text-zinc-900 mt-1">
                {activeGuide.title}
              </CardTitle>
              <p className="text-xs text-zinc-500 mt-0.5">{activeGuide.subtitle}</p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setFullscreenImage(activeGuide.image)}
              className="gap-1.5 self-start sm:self-auto text-xs"
            >
              <Maximize2 className="h-3.5 w-3.5 text-zinc-600" />
              <span>Full Screen View</span>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-4 md:p-6 space-y-6">
          {/* Visual Canvas Box */}
          <div
            className="relative w-full aspect-16/9 rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-900 group cursor-pointer shadow-inner"
            onClick={() => setFullscreenImage(activeGuide.image)}
          >
            <Image
              src={activeGuide.image}
              alt={activeGuide.title}
              fill
              className="object-contain group-hover:scale-[1.02] transition-transform duration-300"
              sizes="(max-width: 1200px) 100vw, 1200px"
              priority
            />
            {/* Overlay hint */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="bg-white/90 backdrop-blur-xs text-zinc-900 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg">
                <Maximize2 className="h-4 w-4" />
                <span>Click to Expand High-Resolution</span>
              </div>
            </div>
          </div>

          {/* Form Rules & Checkpoints */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {activeGuide.tips.map((tip, idx) => (
              <div
                key={idx}
                className="bg-zinc-50/80 rounded-xl p-3.5 border border-zinc-200/80 flex items-start gap-2.5"
              >
                <div className="h-5 w-5 rounded-full bg-emerald-100 text-[#154D38] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                  {idx + 1}
                </div>
                <p className="text-xs text-zinc-700 leading-relaxed font-medium">{tip}</p>
              </div>
            ))}
          </div>

          {/* Pattern Levels Quick Ladder Summary */}
          {activePatternData && (
            <div className="border-t border-zinc-100 pt-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
                  Progression Ladder Levels
                </span>
                <span className="text-xs text-zinc-500">
                  {activePatternData.levels.length} Progressive Variations
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {activePatternData.levels.map((lvl) => (
                  <div
                    key={lvl.level}
                    className="p-3 rounded-xl bg-white border border-zinc-200/80 flex items-center justify-between hover:border-emerald-300 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="h-7 w-7 rounded-lg bg-emerald-50 text-[#154D38] font-bold text-xs flex items-center justify-center border border-emerald-200/60">
                        L{lvl.level}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                          <span>{lvl.name}</span>
                          {lvl.isStretchGoal && (
                            <span className="text-[9px] bg-amber-100 text-amber-800 px-1 rounded font-semibold">
                              Stretch
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-zinc-500">{lvl.targetReps}</div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[10px] shrink-0 font-medium">
                      {lvl.equipment.split(",")[0]}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Fullscreen Lightbox Modal */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-center items-center p-4"
          onClick={() => setFullscreenImage(null)}
        >
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={() => setFullscreenImage(null)}
              className="h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div
            className="relative w-full max-w-5xl aspect-16/9 rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={fullscreenImage}
              alt="Fullscreen Exercise Guide"
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>

          <p className="text-white/70 text-xs mt-3">
            Press anywhere or the close button to exit full-screen view
          </p>
        </div>
      )}
    </div>
  );
}
