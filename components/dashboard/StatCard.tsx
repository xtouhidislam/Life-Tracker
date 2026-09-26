import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon, ArrowUpRight } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon?: LucideIcon;
  accentColor?: "violet" | "mint" | "cyan" | "amber" | "rose" | "forest";
  isHero?: boolean;
  trend?: {
    value: string;
    positive: boolean;
  };
  className?: string;
}

export function StatCard({
  title,
  value,
  subtext,
  icon: Icon,
  accentColor = "forest",
  isHero = false,
  trend,
  className,
}: StatCardProps) {
  // If isHero or accentColor is forest, render the signature solid Forest Green card from the Donezo reference
  if (isHero || accentColor === "forest") {
    return (
      <div
        className={cn(
          "rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden bg-[#154D38] text-white shadow-sm transition-all duration-200 hover:shadow-md",
          className
        )}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-emerald-100/90">{title}</span>
          <div className="h-7 w-7 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-colors cursor-pointer">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-3xl font-black tracking-tight text-white">{value}</div>

          {trend && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-600/40 border border-emerald-400/30 text-[11px] font-semibold text-emerald-100">
              <span>{trend.value}</span>
            </div>
          )}

          {subtext && !trend && (
            <p className="text-xs text-emerald-200/80 font-medium">{subtext}</p>
          )}
        </div>
      </div>
    );
  }

  // Standard Minimalist Clean White Card
  return (
    <div
      className={cn(
        "rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden bg-white border border-zinc-200/90 shadow-2xs transition-all duration-200 hover:shadow-xs",
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-zinc-900">{title}</span>
        <div className="h-7 w-7 rounded-full bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-700 transition-colors cursor-pointer">
          <ArrowUpRight className="h-4 w-4" />
        </div>
      </div>

      <div className="space-y-3">
        <div className="text-3xl font-black tracking-tight text-zinc-900">{value}</div>

        {trend && (
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-zinc-50 border border-zinc-200 text-[11px] font-semibold text-zinc-600">
            <span>{trend.value}</span>
          </div>
        )}

        {subtext && !trend && (
          <p className="text-xs text-zinc-500 font-medium">{subtext}</p>
        )}
      </div>
    </div>
  );
}
