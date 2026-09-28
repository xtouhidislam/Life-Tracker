"use client";

import React from "react";
import { DollarSign, TrendingUp, ShieldCheck, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function IncomeCheckpointBar() {
  const CHECKPOINTS = [
    {
      period: "By Month 6",
      state: "Groundwork & Proof Stage",
      income: "Current Salary",
      notes: "Zero or near-zero freelance income expected. Focus is entirely on shipping the capstone.",
      icon: ShieldCheck,
      color: "zinc",
    },
    {
      period: "By Month 9",
      state: "First Revenue & Testimonials",
      income: "$25 – $40 / hr",
      notes: "First small paid Zenin AI client projects for testimonials and early Track 2 interviews.",
      icon: DollarSign,
      color: "cyan",
    },
    {
      period: "By Month 12",
      state: "Stabilized Run-Rate",
      income: "$50 – $80 / hr",
      notes: "Either a signed upgraded job role, or repeatable fixed-fee Zenin AI agency retainers.",
      icon: TrendingUp,
      color: "indigo",
    },
    {
      period: "Year 2 Horizon",
      state: "Target Mastery",
      income: "$60,000+ / year",
      notes: "Blended remote AI implementation role + high-margin productized agency services.",
      icon: Award,
      color: "emerald",
    },
  ];

  return (
    <Card className="bg-white border border-zinc-200/90 shadow-sm">
      <CardContent className="p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-sm font-black text-zinc-900 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-[#154D38]" />
              <span>Empirical Income Checkpoints & Expectations</span>
            </h3>
            <p className="text-xs text-zinc-500 font-medium">
              Calibrated benchmarks from the Zenin AI plan to prevent premature disillusionment and maintain velocity.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {CHECKPOINTS.map((cp) => {
            const Icon = cp.icon;
            return (
              <div
                key={cp.period}
                className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 hover:border-zinc-300 space-y-2 flex flex-col justify-between shadow-2xs transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#154D38] font-mono">
                      {cp.period}
                    </span>
                    <Icon className="h-3.5 w-3.5 text-zinc-400" />
                  </div>
                  <div className="text-base font-black text-zinc-900">
                    {cp.income}
                  </div>
                  <div className="text-[11px] font-bold text-zinc-700">
                    {cp.state}
                  </div>
                </div>

                <p className="text-[11px] text-zinc-600 leading-relaxed pt-2 border-t border-zinc-200">
                  {cp.notes}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
