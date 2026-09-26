import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive" | "glow";
  size?: "sm" | "md" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#154D38] disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]";

    const variants = {
      primary:
        "bg-[#154D38] hover:bg-[#0F382A] text-white shadow-xs",
      secondary:
        "bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-200",
      outline:
        "border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-900 shadow-2xs",
      ghost:
        "bg-transparent hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900",
      destructive:
        "bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200",
      glow:
        "bg-[#154D38] hover:bg-[#0F382A] text-white shadow-md shadow-[#154D38]/20",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs gap-1.5",
      md: "h-10 px-4 text-sm gap-2",
      lg: "h-12 px-6 text-base gap-2.5",
      icon: "h-10 w-10 p-0",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
