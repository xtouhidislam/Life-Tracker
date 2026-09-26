"use client";

import React from "react";
import { Sparkles, Trophy } from "lucide-react";

interface XPToastProps {
  xp: number;
  message?: string;
  visible: boolean;
}

export function XPToast({ xp, message = "Quest Objective Completed!", visible }: XPToastProps) {
  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300 pointer-events-none select-none">
      <div className="bg-white border border-amber-300 px-4 py-3 rounded-2xl shadow-xl shadow-amber-500/10 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 font-black shadow-xs">
          <Trophy className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-1.5 font-black text-amber-700 text-sm tracking-wide">
            <Sparkles className="h-4 w-4" />
            <span>+{xp} XP EARNED!</span>
          </div>
          <div className="text-xs text-zinc-600 font-medium">
            {message}
          </div>
        </div>
      </div>
    </div>
  );
}
