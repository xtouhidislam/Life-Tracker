"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Apple,
  Calculator,
  ShieldCheck,
  AlertCircle,
  Egg,
  Beef,
  Fish,
  Wheat,
  Milk,
  Sparkles,
  HeartPulse,
  Info,
} from "lucide-react";
import { NUTRITION_FOODS, SAFETY_PRINCIPLES } from "@/lib/exercises/calisthenics-data";
import {
  getCalisthenicsState,
  updateNutritionWeight,
  CalisthenicsState,
} from "@/lib/storage/calisthenics-store";

export function NutritionSafetySection() {
  const [calisthenicsState, setCalisthenicsState] = useState<CalisthenicsState>(() =>
    getCalisthenicsState()
  );

  const [weightKg, setWeightKg] = useState<number>(calisthenicsState.userWeightKg || 65);
  const [multiplier, setMultiplier] = useState<number>(calisthenicsState.proteinRatio || 1.4);

  const handleWeightChange = (newWeight: number) => {
    setWeightKg(newWeight);
    const updated = updateNutritionWeight(newWeight, multiplier);
    setCalisthenicsState(updated);
  };

  const handleMultiplierChange = (newMult: number) => {
    setMultiplier(newMult);
    const updated = updateNutritionWeight(weightKg, newMult);
    setCalisthenicsState(updated);
  };

  // Calculations
  const dailyProteinTarget = Math.round(weightKg * multiplier);
  const lowTarget = Math.round(weightKg * 1.2);
  const highTarget = Math.round(weightKg * 1.6);

  return (
    <div className="space-y-6">
      {/* Top Nutrition & Protein Target Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Interactive Protein Target Calculator (7 cols) */}
        <Card className="lg:col-span-7 bg-white border-zinc-200/90 shadow-2xs">
          <CardHeader className="pb-3 border-b border-zinc-100">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold tracking-wider text-[#154D38]">
                Fueling Visible Muscle
              </span>
              <Badge variant="forest" className="text-[10px]">
                1.2–1.6g / kg Guideline
              </Badge>
            </div>
            <CardTitle className="text-lg font-black text-zinc-900 mt-1">
              Personalized Daily Protein Calculator
            </CardTitle>
            <p className="text-xs text-zinc-500">
              Training provides the stimulus; protein provides the raw amino bricks to build muscle.
            </p>
          </CardHeader>

          <CardContent className="p-4 sm:p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Bodyweight input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-700 flex justify-between">
                  <span>Your Bodyweight:</span>
                  <span className="text-[#154D38] font-black">{weightKg} kg</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="45"
                    max="120"
                    step="1"
                    value={weightKg}
                    onChange={(e) => handleWeightChange(Number(e.target.value))}
                    className="w-full accent-[#154D38] cursor-pointer"
                  />
                </div>
                <div className="flex justify-between text-[10px] text-zinc-400">
                  <span>45 kg</span>
                  <span>80 kg</span>
                  <span>120 kg</span>
                </div>
              </div>

              {/* Multiplier input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-700 flex justify-between">
                  <span>Intensity Target:</span>
                  <span className="text-[#154D38] font-black">{multiplier.toFixed(1)}g / kg</span>
                </label>
                <div className="flex items-center gap-1.5">
                  {[
                    { label: "Base (1.2g)", val: 1.2 },
                    { label: "Optimal (1.4g)", val: 1.4 },
                    { label: "Growth (1.6g)", val: 1.6 },
                  ].map((preset) => (
                    <button
                      key={preset.val}
                      onClick={() => handleMultiplierChange(preset.val)}
                      className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all border ${
                        multiplier === preset.val
                          ? "bg-[#154D38] text-white border-[#154D38] shadow-xs"
                          : "bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border-zinc-200"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Target Display Box */}
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl p-4 border border-emerald-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
                  Target Daily Protein
                </span>
                <div className="text-3xl font-black text-emerald-950 mt-0.5 tracking-tight">
                  {dailyProteinTarget}g{" "}
                  <span className="text-xs font-normal text-emerald-800">
                    ({lowTarget}g – {highTarget}g range)
                  </span>
                </div>
                <p className="text-xs text-emerald-700 mt-1">
                  Aim for ~25–35g across 3–4 meals throughout your day.
                </p>
              </div>

              <div className="text-right shrink-0">
                <div className="bg-white px-3.5 py-2 rounded-xl border border-emerald-200 shadow-2xs text-xs">
                  <div className="font-bold text-zinc-900">Per Meal Target</div>
                  <div className="text-emerald-700 font-bold mt-0.5">
                    ~{Math.round(dailyProteinTarget / 3)}g / meal
                  </div>
                </div>
              </div>
            </div>

            {/* Whole Food Protein Sources */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-zinc-800 uppercase tracking-wider">
                Whole-Food Protein Staples:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {NUTRITION_FOODS.map((food, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl border border-zinc-200/80 bg-zinc-50/60 flex flex-col justify-between"
                  >
                    <div className="font-bold text-xs text-zinc-900">{food.name}</div>
                    <div className="text-[11px] text-emerald-700 font-semibold mt-1">
                      {food.protein}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right: Nutrition Reality Timeline (5 cols) */}
        <Card className="lg:col-span-5 bg-white border-zinc-200/90 shadow-2xs flex flex-col justify-between">
          <CardHeader className="pb-3 border-b border-zinc-100">
            <span className="text-xs uppercase font-bold tracking-wider text-zinc-400">
              Physiology Timeline
            </span>
            <CardTitle className="text-base font-bold text-zinc-900 mt-1">
              The Two-Stage Nutrition Strategy
            </CardTitle>
          </CardHeader>

          <CardContent className="p-4 sm:p-6 space-y-4 flex-1 flex flex-col justify-around">
            {/* Months 1-3 */}
            <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-[#154D38] px-2 py-0.5 rounded-md">
                  Months 1–3 · Build Stage
                </span>
              </div>
              <h5 className="font-bold text-xs text-zinc-900 mt-1">
                Eat to fuel tissue synthesis
              </h5>
              <p className="text-xs text-zinc-600 leading-relaxed">
                If unaccustomed to training or undereating, you may need to eat slightly <em>more</em>,
                not less. Your body needs material and glycogen to adapt to new stimulus.
              </p>
            </div>

            {/* Months 4-6 */}
            <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">
                  Months 4–6 · Reveal Stage
                </span>
              </div>
              <h5 className="font-bold text-xs text-zinc-900 mt-1">
                Modest calorie awareness
              </h5>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Once foundational muscle has been synthesized underneath, modest calorie awareness (not
                a crash diet) reveals the cuts and definition you&apos;ve built.
              </p>
            </div>

            <div className="bg-emerald-50/50 rounded-xl p-3 border border-emerald-200/50 text-[11px] text-emerald-900 leading-relaxed">
              <strong>Core Takeaway:</strong> You do not need to obsessively track every calorie. Just
              hit your daily protein goal and do not wildly overeat.
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Safety Principles Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <HeartPulse className="h-4 w-4 text-[#154D38]" />
          <h4 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">
            Safety Principles & Longevity Rules
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {SAFETY_PRINCIPLES.map((principle, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl border border-zinc-200/90 bg-white shadow-2xs space-y-2 flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded">
                  {principle.badge}
                </span>
                <h5 className="font-bold text-sm text-zinc-900 mt-2">{principle.title}</h5>
                <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">{principle.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
