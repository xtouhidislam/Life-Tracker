import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "mint" | "amber" | "cyan" | "rose" | "outline" | "forest";
}

function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  const variants = {
    default: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
    forest: "bg-[#154D38] text-white border-transparent",
    mint: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-800 border-amber-200",
    cyan: "bg-sky-50 text-sky-800 border-sky-200",
    rose: "bg-rose-50 text-rose-800 border-rose-200",
    outline: "bg-white text-zinc-600 border-zinc-200",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
