"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BarChart3,
  CheckSquare,
  Calendar,
  Flame,
  Sunrise,
  Compass,
  Target,
  Wallet,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  HelpCircle,
  LogOut,
  Trophy,
  Dumbbell,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { getLocalUserStats } from "@/lib/storage/local-store";

interface MenuItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

const PRIMARY_MENU: MenuItem[] = [
  { name: "Dashboard", href: "/today", icon: LayoutDashboard },
  { name: "Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Analytics", href: "/overview", icon: BarChart3 },
  { name: "Habits", href: "/habits", icon: Flame },
  { name: "Routine", href: "/routine", icon: Sunrise },
  { name: "Calisthenics", href: "/exercise", icon: Dumbbell, badge: "New" },
  { name: "Roadmap", href: "/roadmap", icon: Compass },
  { name: "Focus Mode", href: "/focus", icon: Target },
  { name: "Expenses", href: "/expenses", icon: Wallet },
];

const GENERAL_MENU = [
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Help & Docs", href: "#", icon: HelpCircle },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { stats, signOut } = useAuth();
  const [localStats, setLocalStats] = useState(() => getLocalUserStats());

  React.useEffect(() => {
    setLocalStats(getLocalUserStats());
  }, [pathname]);

  const level = stats?.current_level ?? localStats.current_level ?? 1;
  const streak = stats?.current_streak ?? localStats.current_streak ?? 0;
  const totalXp = stats?.total_xp ?? localStats.total_xp ?? 0;

  const nextLevelXp = 50 * level * level + 50 * level;
  const prevLevelXp = 50 * (level - 1) * (level - 1) + 50 * (level - 1);
  const xpInCurrentLevel = Math.max(0, totalXp - prevLevelXp);
  const xpNeededForLevel = Math.max(1, nextLevelXp - prevLevelXp);
  const progressPct = Math.min(100, Math.round((xpInCurrentLevel / xpNeededForLevel) * 100)) || 0;

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col h-screen sticky top-0 bg-white border-r border-[#EBECEF] transition-all duration-300 z-30 select-none",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-[#F0F1F3]">
        <Link href="/today" className="flex items-center gap-2.5 group">
          {/* Donezo-inspired minimalist green loop emblem */}
          <div className="h-9 w-9 rounded-xl bg-[#154D38] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
            <div className="h-4 w-4 rounded-full border-2 border-emerald-300 flex items-center justify-center">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
            </div>
          </div>

          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-black tracking-tight text-lg text-zinc-900 leading-none">
                LifeQuest
              </span>
              <span className="text-[10px] font-semibold text-zinc-400 tracking-wider uppercase mt-0.5">
                Life Operating System
              </span>
            </div>
          )}
        </Link>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="h-7 w-7 rounded-lg border border-zinc-200 hover:bg-zinc-100 flex items-center justify-center text-zinc-500 hover:text-zinc-900 transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* Primary Menu */}
        <div className="space-y-1">
          {!collapsed && (
            <div className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase px-3 mb-2">
              MENU
            </div>
          )}

          {PRIMARY_MENU.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/today" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group",
                  isActive
                    ? "bg-[#E8F5E9] text-[#154D38]"
                    : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
                )}
                title={collapsed ? item.name : undefined}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-colors",
                      isActive ? "text-[#154D38]" : "text-zinc-400 group-hover:text-zinc-700"
                    )}
                  />
                  {!collapsed && <span>{item.name}</span>}
                </div>

                {!collapsed && item.badge && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#154D38] text-white">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* General Menu */}
        <div className="space-y-1 pt-2 border-t border-zinc-100">
          {!collapsed && (
            <div className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase px-3 mb-2">
              GENERAL
            </div>
          )}

          {GENERAL_MENU.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group",
                  isActive
                    ? "bg-[#E8F5E9] text-[#154D38]"
                    : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
                )}
                title={collapsed ? item.name : undefined}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    isActive ? "text-[#154D38]" : "text-zinc-400 group-hover:text-zinc-700"
                  )}
                />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}

          <button
            onClick={() => signOut()}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-zinc-600 hover:text-rose-600 hover:bg-rose-50 transition-all text-left"
            title={collapsed ? "Logout" : undefined}
          >
            <LogOut className="h-4 w-4 shrink-0 text-zinc-400 group-hover:text-rose-600" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Bottom Level / Streak Card (Inspired by Donezo's dark-green wave card) */}
      {!collapsed ? (
        <div className="p-3 m-3 rounded-2xl bg-gradient-to-br from-[#123E2E] to-[#0A261C] text-white p-4 space-y-3 shadow-md relative overflow-hidden">
          {/* Subtle wave highlight */}
          <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />

          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-200 flex items-center gap-1.5">
              <Trophy className="h-3.5 w-3.5 text-amber-300" />
              Level {level} {level >= 10 ? "Master" : level >= 5 ? "Adept" : "Novice"}
            </span>
            <span className="text-[11px] font-semibold text-emerald-300 font-mono">
              {progressPct}%
            </span>
          </div>

          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-emerald-100/90 pt-1">
            <span>{totalXp.toLocaleString()} XP Total</span>
            <span className="font-bold flex items-center gap-1 text-amber-300">
              🔥 {streak} Days
            </span>
          </div>

          <Link href="/overview" className="block w-full">
            <button className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow-xs">
              View Life Stats
            </button>
          </Link>
        </div>
      ) : (
        <div className="p-2 flex flex-col items-center gap-2 border-t border-zinc-100 py-4">
          <div
            className="h-8 w-8 rounded-full bg-[#154D38] flex items-center justify-center text-xs font-bold text-white shadow-xs"
            title={`Level ${level} (${progressPct}%)`}
          >
            {level}
          </div>
          <div className="text-[10px] text-amber-600 font-bold" title={`${streak} day streak`}>
            🔥 {streak}
          </div>
        </div>
      )}
    </aside>
  );
}
