import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  gradient?: "violet" | "mint" | "amber" | "cyan";
  showLabel?: boolean;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, gradient = "violet", showLabel = false, ...props }, ref) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    const gradients = {
      violet: "bg-gradient-to-r from-indigo-500 to-indigo-400",
      mint: "bg-gradient-to-r from-emerald-500 to-teal-400",
      amber: "bg-gradient-to-r from-amber-500 to-orange-400",
      cyan: "bg-gradient-to-r from-cyan-500 to-blue-400",
    };

    return (
      <div className="w-full">
        {showLabel && (
          <div className="flex justify-between text-xs text-[var(--text-secondary)] mb-1">
            <span>Progress</span>
            <span className="font-medium text-[var(--text-primary)]">{Math.round(percentage)}%</span>
          </div>
        )}
        <div
          ref={ref}
          className={cn(
            "relative h-2.5 w-full overflow-hidden rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)]",
            className
          )}
          {...props}
        >
          <div
            className={cn("h-full transition-all duration-500 rounded-full", gradients[gradient])}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
);
Progress.displayName = "Progress";

export { Progress };
