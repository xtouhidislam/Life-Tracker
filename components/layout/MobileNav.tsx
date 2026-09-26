"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CheckSquare,
  Flame,
  Target,
  MoreHorizontal,
  BarChart3,
  Calendar,
  Sunrise,
  Compass,
  Wallet,
  Settings,
  X,
} from "lucide-react";

const PRIMARY_TABS = [
  { name: "Dashboard", href: "/today", icon: LayoutDashboard },
  { name: "Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Habits", href: "/habits", icon: Flame },
  { name: "Focus", href: "/focus", icon: Target },
];

const MORE_TABS = [
  { name: "Overview", href: "/overview", icon: BarChart3, desc: "Life analytics & trends" },
  { name: "Calendar", href: "/calendar", icon: Calendar, desc: "Schedule & time-blocks" },
  { name: "Routine", href: "/routine", icon: Sunrise, desc: "Morning/Evening timeline" },
  { name: "Roadmap", href: "/roadmap", icon: Compass, desc: "Zenin AI & goals skill-tree" },
  { name: "Expenses", href: "/expenses", icon: Wallet, desc: "Budget & personal finance" },
  { name: "Settings", href: "/settings", icon: Settings, desc: "Preferences & profile" },
];

export function MobileNav() {
  const pathname = usePathname();
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const isMoreActive = MORE_TABS.some((tab) => pathname === tab.href || pathname.startsWith(`${tab.href}/`));

  return (
    <>
      {/* Slide-up "More" Sheet Overlay */}
      {showMoreMenu && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-xs flex flex-col justify-end transition-opacity"
          onClick={() => setShowMoreMenu(false)}
        >
          <div
            className="bg-white rounded-t-3xl p-5 border-t border-zinc-200 shadow-2xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 mb-4">
              <span className="font-bold text-sm text-zinc-900">
                More Modules
              </span>
              <button
                onClick={() => setShowMoreMenu(false)}
                className="h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600 hover:text-zinc-900"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 pb-8">
              {MORE_TABS.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setShowMoreMenu(false)}
                    className={cn(
                      "flex flex-col p-3 rounded-2xl border transition-all",
                      isActive
                        ? "bg-[#E8F5E9] border-[#154D38]/30 text-[#154D38]"
                        : "bg-zinc-50 border-zinc-200/80 text-zinc-700 hover:bg-zinc-100"
                    )}
                  >
                    <Icon className={cn("h-6 w-6 mb-2", isActive ? "text-[#154D38]" : "text-zinc-500")} />
                    <span className="font-semibold text-sm text-zinc-900">{item.name}</span>
                    <span className="text-[11px] text-zinc-500 leading-tight mt-0.5">{item.desc}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Sticky Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-[#EBECEF] z-30 px-3 flex items-center justify-around shadow-sm">
        {PRIMARY_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;

          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full relative transition-colors",
                isActive ? "text-[#154D38] font-bold" : "text-zinc-500 hover:text-zinc-900"
              )}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-[10px] tracking-tight">{tab.name}</span>
              {isActive && (
                <div className="absolute bottom-1 h-1 w-6 rounded-full bg-[#154D38]" />
              )}
            </Link>
          );
        })}

        {/* More Button */}
        <button
          onClick={() => setShowMoreMenu(!showMoreMenu)}
          className={cn(
            "flex flex-col items-center justify-center flex-1 h-full relative transition-colors",
            isMoreActive || showMoreMenu ? "text-[#154D38] font-bold" : "text-zinc-500 hover:text-zinc-900"
          )}
        >
          <MoreHorizontal className="h-5 w-5 mb-1" />
          <span className="text-[10px] tracking-tight">More</span>
          {isMoreActive && (
            <div className="absolute bottom-1 h-1 w-6 rounded-full bg-[#154D38]" />
          )}
        </button>
      </nav>
    </>
  );
}
