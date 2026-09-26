"use client";

import React from "react";
import { X, Keyboard, Navigation, Zap, Clock } from "lucide-react";
import { soundEffects } from "@/lib/audio/sound-effects";

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-zinc-200/90 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-[#FAFAFA]">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-800">
              <Keyboard className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900">Keyboard Shortcuts</h3>
              <p className="text-[11px] text-zinc-400">Navigate LifeQuest at lightning speed</p>
            </div>
          </div>
          <button
            onClick={() => {
              soundEffects.playClick();
              onClose();
            }}
            className="h-8 w-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Navigation Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-wider">
              <Navigation className="h-3.5 w-3.5 text-emerald-700" />
              <span>Two-Key Navigation (Press G then Key)</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <ShortcutRow keys={["G", "T"]} label="Today Command Center" />
              <ShortcutRow keys={["G", "K"]} label="Task Deliverables" />
              <ShortcutRow keys={["G", "C"]} label="Interactive Calendar" />
              <ShortcutRow keys={["G", "H"]} label="Habits & Streaks" />
              <ShortcutRow keys={["G", "R"]} label="Daily Routine Timeline" />
              <ShortcutRow keys={["G", "M"]} label="Strategic Roadmap" />
              <ShortcutRow keys={["G", "F"]} label="Focus Mode & Pomodoro" />
              <ShortcutRow keys={["G", "E"]} label="Personal Expenses" />
              <ShortcutRow keys={["G", "A"]} label="Overview Analytics" />
              <ShortcutRow keys={["G", "S"]} label="System Settings" />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-wider">
              <Zap className="h-3.5 w-3.5 text-amber-600" />
              <span>Global Quick Actions</span>
            </div>
            <div className="space-y-2 text-xs">
              <ShortcutRow keys={["⌘", "K"]} label="Open Command Palette" />
              <ShortcutRow keys={["N"]} label="New Task Deliverable" />
              <ShortcutRow keys={["F"]} label="Start 25m Focus Sprint" />
              <ShortcutRow keys={["?"]} label="Show Keyboard Shortcuts" />
              <ShortcutRow keys={["ESC"]} label="Close Active Modal / Dropdown" />
            </div>
          </div>

          {/* Focus Mode Controls */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-wider">
              <Clock className="h-3.5 w-3.5 text-blue-600" />
              <span>Chamber & Focus Controls</span>
            </div>
            <div className="space-y-2 text-xs">
              <ShortcutRow keys={["Space"]} label="Play / Pause Pomodoro Timer" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-400">
          <span>Tip: Press <kbd className="font-mono px-1.5 py-0.5 rounded bg-white border border-zinc-200 text-zinc-600">?</kbd> anywhere to re-open</span>
          <button
            onClick={() => {
              soundEffects.playClick();
              onClose();
            }}
            className="px-3 py-1 rounded-lg bg-[#154D38] text-white font-medium hover:bg-[#123E2E] transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}

function ShortcutRow({ keys, label }: { keys: string[]; label: string }) {
  return (
    <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-50/70 border border-zinc-100">
      <span className="text-zinc-700 font-medium">{label}</span>
      <div className="flex items-center gap-1 shrink-0">
        {keys.map((k, i) => (
          <React.Fragment key={i}>
            <kbd className="px-2 py-0.5 rounded bg-white border border-zinc-200 shadow-2xs font-mono font-semibold text-[11px] text-zinc-700">
              {k}
            </kbd>
            {i < keys.length - 1 && <span className="text-zinc-300 text-[10px]">+</span>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
