"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface CircularProgressProps {
  value: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  completedText?: string;
  subText?: string;
  className?: string;
}

export function CircularProgress({
  value,
  size = 180,
  strokeWidth = 14,
  completedText,
  subText = "Completed Today",
  className,
}: CircularProgressProps) {
  const percentage = Math.min(100, Math.max(0, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={cn("relative flex items-center justify-center select-none", className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          <linearGradient id="forestProgressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#154D38" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
        </defs>

        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        {/* Animated Progress ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#forestProgressGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      {/* Center percentage and labels */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
        <span className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900">
          {percentage}%
        </span>
        {completedText && (
          <span className="text-xs font-bold text-[#154D38] mt-0.5">
            {completedText}
          </span>
        )}
        <span className="text-[11px] text-zinc-500 font-medium">
          {subText}
        </span>
      </div>
    </div>
  );
}
