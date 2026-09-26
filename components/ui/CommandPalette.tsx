"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  LayoutDashboard,
  BarChart3,
  CheckSquare,
  Calendar,
  Zap,
  Clock,
  Compass,
  Timer,
  Wallet,
  Settings,
  PlusCircle,
  Bell,
  Volume2,
  VolumeX,
  Keyboard,
  ArrowRight,
  Sparkles,
  Download,
} from "lucide-react";
import { soundEffects } from "@/lib/audio/sound-effects";
import { triggerHaptic } from "@/lib/ui/haptics";
import { triggerCelebration } from "@/lib/ui/celebration";

interface CommandItem {
  id: string;
  title: string;
  subtitle: string;
  category: "Navigation" | "Quick Action" | "Audio & Sensory";
  icon: React.ElementType;
  shortcut?: string;
  action: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenShortcuts?: () => void;
}

export function CommandPalette({ isOpen, onClose, onOpenShortcuts }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSoundOn(soundEffects.isEnabled());
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
      soundEffects.playClick();
      triggerHaptic("light");
    }
  }, [isOpen]);

  const items: CommandItem[] = useMemo(() => {
    return [
      // Navigation
      {
        id: "nav-today",
        title: "Today Command Center",
        subtitle: "Overview of today's rhythm, tasks, and focus",
        category: "Navigation",
        icon: LayoutDashboard,
        shortcut: "G T",
        action: () => {
          router.push("/today");
          onClose();
        },
      },
      {
        id: "nav-tasks",
        title: "Task Deliverables",
        subtitle: "Manage daily deliverables, deadlines, and XP quests",
        category: "Navigation",
        icon: CheckSquare,
        shortcut: "G K",
        action: () => {
          router.push("/tasks");
          onClose();
        },
      },
      {
        id: "nav-calendar",
        title: "Interactive Calendar",
        subtitle: "Month, week, and day execution time-blocks",
        category: "Navigation",
        icon: Calendar,
        shortcut: "G C",
        action: () => {
          router.push("/calendar");
          onClose();
        },
      },
      {
        id: "nav-habits",
        title: "Habits & Consistency Matrix",
        subtitle: "Daily streak tracking and 90-day consistency heatmap",
        category: "Navigation",
        icon: Zap,
        shortcut: "G H",
        action: () => {
          router.push("/habits");
          onClose();
        },
      },
      {
        id: "nav-routine",
        title: "Daily Routine Timeline",
        subtitle: "15 Weekday & 8 Weekend scheduled blocks",
        category: "Navigation",
        icon: Clock,
        shortcut: "G R",
        action: () => {
          router.push("/routine");
          onClose();
        },
      },
      {
        id: "nav-roadmap",
        title: "Strategic AI Roadmap",
        subtitle: "12-month Zenin AI engineer curriculum & skill tree",
        category: "Navigation",
        icon: Compass,
        shortcut: "G M",
        action: () => {
          router.push("/roadmap");
          onClose();
        },
      },
      {
        id: "nav-focus",
        title: "Focus Mode & Pomodoro",
        subtitle: "Deep work chamber with ambient soundscapes",
        category: "Navigation",
        icon: Timer,
        shortcut: "G F",
        action: () => {
          router.push("/focus");
          onClose();
        },
      },
      {
        id: "nav-expenses",
        title: "Personal Finance & Expenses",
        subtitle: "Track monthly budget and expenditures in BDT (৳)",
        category: "Navigation",
        icon: Wallet,
        shortcut: "G E",
        action: () => {
          router.push("/expenses");
          onClose();
        },
      },
      {
        id: "nav-overview",
        title: "Analytics & Statistics",
        subtitle: "Cross-system performance velocity and domain balance",
        category: "Navigation",
        icon: BarChart3,
        shortcut: "G A",
        action: () => {
          router.push("/overview");
          onClose();
        },
      },
      {
        id: "nav-settings",
        title: "System Settings",
        subtitle: "Profile, preferences, push notifications, and theme",
        category: "Navigation",
        icon: Settings,
        shortcut: "G S",
        action: () => {
          router.push("/settings");
          onClose();
        },
      },

      // Quick Actions
      {
        id: "act-new-task",
        title: "Create New Task",
        subtitle: "Schedule a task with priority, XP reward, and deadline",
        category: "Quick Action",
        icon: PlusCircle,
        shortcut: "N",
        action: () => {
          router.push("/tasks");
          onClose();
        },
      },
      {
        id: "act-start-focus",
        title: "Start 25m Focus Sprint",
        subtitle: "Jump into deep work chamber with +10 XP reward",
        category: "Quick Action",
        icon: Timer,
        shortcut: "F",
        action: () => {
          router.push("/focus");
          onClose();
        },
      },
      {
        id: "act-log-expense",
        title: "Log New Expense",
        subtitle: "Record a transaction in Bangladeshi Taka (৳)",
        category: "Quick Action",
        icon: Wallet,
        action: () => {
          router.push("/expenses");
          onClose();
        },
      },
      {
        id: "act-export",
        title: "Export LifeQuest Data",
        subtitle: "Download your sovereign backup in JSON or CSV",
        category: "Quick Action",
        icon: Download,
        action: () => {
          router.push("/overview");
          onClose();
        },
      },
      {
        id: "act-shortcuts",
        title: "View Keyboard Shortcuts",
        subtitle: "Display hotkeys and navigation shortcuts reference",
        category: "Quick Action",
        icon: Keyboard,
        shortcut: "?",
        action: () => {
          onClose();
          onOpenShortcuts?.();
        },
      },

      // Audio & Sensory
      {
        id: "snd-toggle",
        title: soundOn ? "Disable Sound Effects" : "Enable Sound Effects",
        subtitle: soundOn ? "Mute tactile UI clicks and check sounds" : "Enable tactile Web Audio synthesized UI chimes",
        category: "Audio & Sensory",
        icon: soundOn ? VolumeX : Volume2,
        action: () => {
          const next = soundEffects.toggle();
          setSoundOn(next);
          if (next) soundEffects.playCheckmark();
        },
      },
      {
        id: "snd-celebration",
        title: "Test Celebration Confetti",
        subtitle: "Fire a celebratory particle burst",
        category: "Audio & Sensory",
        icon: Sparkles,
        action: () => {
          soundEffects.playLevelUp();
          triggerHaptic("levelUp");
          triggerCelebration("grand");
          onClose();
        },
      },
    ];
  }, [router, onClose, onOpenShortcuts, soundOn]);

  const filteredItems = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase().trim();
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [items, query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard Navigation
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        soundEffects.playClick();
        setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        soundEffects.playClick();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          soundEffects.playCheckmark();
          triggerHaptic("medium");
          filteredItems[selectedIndex].action();
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-24 px-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-zinc-200/90 overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-zinc-100 bg-[#FAFAFA]">
          <Search className="h-5 w-5 text-zinc-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, module, or shortcut..."
            className="w-full bg-transparent border-none text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-xs text-zinc-400 hover:text-zinc-600 px-1.5 py-0.5 rounded bg-zinc-200/50"
            >
              Clear
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono text-zinc-400 bg-white border border-zinc-200 shadow-2xs">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div ref={listRef} className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm font-medium text-zinc-600">No commands found for &quot;{query}&quot;</p>
              <p className="text-xs text-zinc-400 mt-1">Try searching for &quot;Tasks&quot;, &quot;Focus&quot;, or &quot;Export&quot;</p>
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    soundEffects.playCheckmark();
                    triggerHaptic("medium");
                    item.action();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl text-left transition-all ${
                    isSelected
                      ? "bg-[#154D38] text-white shadow-sm"
                      : "text-zinc-800 hover:bg-zinc-50"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className={`text-xs font-semibold truncate ${isSelected ? "text-white" : "text-zinc-900"}`}>
                        {item.title}
                      </p>
                      <p className={`text-[11px] truncate ${isSelected ? "text-emerald-100/80" : "text-zinc-400"}`}>
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.shortcut && (
                      <kbd
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                          isSelected
                            ? "bg-white/15 text-white border-white/20"
                            : "bg-zinc-100 text-zinc-500 border-zinc-200"
                        }`}
                      >
                        {item.shortcut}
                      </kbd>
                    )}
                    {isSelected && (
                      <ArrowRight className="h-3.5 w-3.5 text-white animate-pulse" />
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-4 py-2 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
          <div className="flex items-center gap-3">
            <span>↑↓ to navigate</span>
            <span>↵ to select</span>
            <span>esc to close</span>
          </div>
          <span className="text-emerald-700 font-semibold font-sans">Donezo Command Center</span>
        </div>
      </div>
    </div>
  );
}
