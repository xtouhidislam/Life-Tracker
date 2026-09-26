"use client";

import React from "react";
import { DomainDistribution } from "@/app/actions/analytics";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Compass, PieChart } from "lucide-react";

interface DomainBalanceCardProps {
  domains: DomainDistribution[];
}

export function DomainBalanceCard({ domains }: DomainBalanceCardProps) {
  return (
    <Card className="bg-white border-zinc-200/90 shadow-2xs rounded-3xl">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold text-zinc-900">
            Life Domain Distribution
          </CardTitle>
          <span className="text-xs font-semibold text-zinc-400">
            Effort Balance
          </span>
        </div>
        <CardDescription className="text-xs text-zinc-500">
          Proportional time & energy invested across strategic pillars
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3.5 pt-1">
        {domains.map((dom) => (
          <div
            key={dom.name}
            className="p-3.5 rounded-2xl bg-zinc-50/70 border border-zinc-100 hover:bg-zinc-50 transition-colors space-y-2"
          >
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: dom.color }}
                />
                <span className="font-bold text-zinc-800">{dom.name}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono text-zinc-500 text-[11px]">
                  {dom.hours} hrs
                </span>
                <span className="font-bold text-zinc-900 bg-white px-2 py-0.5 rounded-md border border-zinc-200">
                  {dom.percentage}%
                </span>
              </div>
            </div>

            {/* Progress Track */}
            <div className="h-2 w-full bg-zinc-200/70 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${dom.percentage}%`,
                  backgroundColor: dom.color,
                }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
