"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Mail,
  Bell,
  LogOut,
  User as UserIcon,
  Settings as SettingsIcon,
  Flame,
  Sparkles,
  Volume2,
  VolumeX,
  Keyboard,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNotification } from "@/components/providers/NotificationProvider";
import { useHotkeys } from "@/components/providers/HotkeyProvider";
import { soundEffects } from "@/lib/audio/sound-effects";
import { triggerHaptic } from "@/lib/ui/haptics";
import { getLocalUserStats } from "@/lib/storage/local-store";

const ROUTE_TITLES: Record<string, string> = {
  "/today": "Dashboard",
  "/overview": "Analytics",
  "/tasks": "Tasks",
  "/calendar": "Calendar",
  "/habits": "Habits",
  "/routine": "Daily Routine",
  "/roadmap": "Strategic Roadmap",
  "/focus": "Time Tracker & Focus",
  "/expenses": "Expenses & Finance",
  "/settings": "Settings",
};

export function Topbar() {
  const pathname = usePathname();
  const currentTitle = ROUTE_TITLES[pathname] || "Dashboard";
  const { user, profile, stats, signOut } = useAuth();
  const { permission, requestPermission, sendTestAlert } = useNotification();
  const { openCommandPalette, openShortcuts } = useHotkeys();

  const [soundOn, setSoundOn] = useState(true);
  const [localStats, setLocalStats] = useState(() => getLocalUserStats());

  useEffect(() => {
    setLocalStats(getLocalUserStats());
  }, [pathname]);

  useEffect(() => {
    setSoundOn(soundEffects.isEnabled());
  }, []);

  const handleToggleSound = () => {
    const next = soundEffects.toggle();
    setSoundOn(next);
    if (next) soundEffects.playCheckmark();
    triggerHaptic("light");
  };

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [notifOpen, setNotifOpen] = useState(false);
  const notifDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isGuest = !user;

  const displayName =
    profile?.display_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Guest Commander";

  const userEmail = user?.email || "Local Storage Mode";

  const initials = isGuest
    ? "GC"
    : displayName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || "TQ";

  const streak = stats?.current_streak ?? localStats.current_streak ?? 0;

  return (
    <header className="h-16 sticky top-0 z-20 bg-white border-b border-[#EBECEF] px-4 md:px-8 flex items-center justify-between">
      {/* Left: Quick Search Bar matching Donezo screenshot -> opens Command Palette */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <button
            type="button"
            onClick={() => openCommandPalette()}
            className="w-full flex items-center justify-between gap-2 px-3.5 py-1.5 rounded-full bg-[#F4F5F7] border border-zinc-200/80 text-zinc-400 hover:border-zinc-300 hover:bg-white transition-all text-left group"
          >
            <div className="flex items-center gap-2 truncate">
              <Search className="h-4 w-4 text-zinc-400 shrink-0 group-hover:text-zinc-600" />
              <span className="text-xs text-zinc-400 group-hover:text-zinc-600 truncate">
                Search commands, tasks, habits...
              </span>
            </div>
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold text-zinc-500 bg-white border border-zinc-200 shadow-2xs shrink-0">
              ⌘K
            </kbd>
          </button>
        </div>
      </div>

      {/* Right Controls: Notification, Sound, Shortcuts, User Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Streak Pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-xs font-bold text-amber-700">
          <Flame className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
          <span>{streak} Days</span>
        </div>

        {/* Keyboard Shortcuts Trigger */}
        <button
          onClick={() => {
            soundEffects.playClick();
            openShortcuts();
          }}
          className="h-9 w-9 rounded-full bg-white hover:bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-600 transition-colors shadow-2xs"
          title="Keyboard Shortcuts (?)"
        >
          <Keyboard className="h-4 w-4" />
        </button>

        {/* Sound Effects Toggle */}
        <button
          onClick={handleToggleSound}
          className={`h-9 w-9 rounded-full border flex items-center justify-center transition-colors shadow-2xs ${
            soundOn
              ? "bg-emerald-50/80 border-emerald-200 text-emerald-800 hover:bg-emerald-100"
              : "bg-white border-zinc-200 text-zinc-400 hover:bg-zinc-50"
          }`}
          title={soundOn ? "Mute sound effects" : "Enable sound effects"}
        >
          {soundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </button>

        {/* Notification Bell Button & Dropdown */}
        <div className="relative" ref={notifDropdownRef}>
          <button
            onClick={() => {
              soundEffects.playClick();
              setNotifOpen(!notifOpen);
            }}
            className="h-9 w-9 rounded-full bg-white hover:bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-600 transition-colors relative shadow-2xs"
            title="Notification Center & Web Push"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-emerald-500 ring-2 ring-white" />
          </button>

          {/* Notifications Dropdown Panel */}
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-3xl bg-white border border-zinc-200/90 p-4 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 space-y-3.5">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-zinc-900">Notifications</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F5E9] text-[#154D38]">
                    {permission === "granted" ? "Active" : "Setup"}
                  </span>
                </div>

                <span className="text-[11px] font-mono text-zinc-400">
                  Web Push Engine
                </span>
              </div>

              {/* Permission Banner if not granted */}
              {permission !== "granted" && (
                <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                  <div className="text-xs font-bold text-[#154D38] flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Enable Browser Web Push</span>
                  </div>
                  <p className="text-[11px] text-zinc-600 leading-relaxed">
                    Receive routine block transition warnings and streak alerts even when this tab is closed.
                  </p>
                  <button
                    onClick={() => requestPermission()}
                    className="w-full py-2 rounded-xl text-xs font-bold bg-[#154D38] hover:bg-[#0E3425] text-white transition-colors shadow-2xs"
                  >
                    Grant Permissions
                  </button>
                </div>
              )}

              {/* Instant Test Dispatcher */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Test Background Dispatch
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => sendTestAlert("routine")}
                    className="p-2 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-[11px] font-semibold text-zinc-700 text-left transition-colors flex items-center gap-1.5"
                  >
                    <span>⚡ Routine Alert</span>
                  </button>
                  <button
                    onClick={() => sendTestAlert("streak")}
                    className="p-2 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-[11px] font-semibold text-zinc-700 text-left transition-colors flex items-center gap-1.5"
                  >
                    <span>🔥 Streak Warning</span>
                  </button>
                  <button
                    onClick={() => sendTestAlert("focus")}
                    className="p-2 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-[11px] font-semibold text-zinc-700 text-left transition-colors flex items-center gap-1.5"
                  >
                    <span>🎯 Focus Finish</span>
                  </button>
                  <button
                    onClick={() => sendTestAlert("digest")}
                    className="p-2 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-[11px] font-semibold text-zinc-700 text-left transition-colors flex items-center gap-1.5"
                  >
                    <span>🌅 Morning Digest</span>
                  </button>
                </div>
              </div>

              {/* Feed List */}
              <div className="space-y-2 pt-1 border-t border-zinc-100">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Recent Dispatches
                </span>

                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-100 flex items-start gap-2.5">
                    <div className="h-6 w-6 rounded-lg bg-emerald-100 text-[#154D38] flex items-center justify-center shrink-0 mt-0.5 text-xs">
                      ✓
                    </div>
                    <div className="space-y-0.5 text-left">
                      <p className="text-xs font-bold text-zinc-900 leading-tight">
                        Deep Work Sprint Completed
                      </p>
                      <p className="text-[11px] text-zinc-500">
                        +10 XP logged & total focus minutes updated.
                      </p>
                      <span className="text-[10px] text-zinc-400 font-mono">10m ago</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-100 flex items-start gap-2.5">
                    <div className="h-6 w-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5 text-xs">
                      🔥
                    </div>
                    <div className="space-y-0.5 text-left">
                      <p className="text-xs font-bold text-zinc-900 leading-tight">
                        Daily Streak Maintained
                      </p>
                      <p className="text-[11px] text-zinc-500">
                        14-day momentum active. 10 blocks remaining today.
                      </p>
                      <span className="text-[10px] text-zinc-400 font-mono">1h ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Identity Pill (Avatar + Name + Email) */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 p-1 rounded-full hover:bg-zinc-50 transition-colors group text-left"
          >
            {/* Avatar Circle */}
            <div className="h-9 w-9 rounded-full bg-[#154D38] border border-emerald-600/30 flex items-center justify-center text-white font-bold text-xs shadow-2xs">
              {initials}
            </div>

            {/* Name and Email Label */}
            <div className="hidden md:flex flex-col pr-2">
              <span className="text-xs font-bold text-zinc-900 group-hover:text-[#154D38] transition-colors leading-tight">
                {displayName}
              </span>
              <span className="text-[10px] text-zinc-400 font-medium truncate max-w-[130px]">
                {userEmail}
              </span>
            </div>
          </button>

          {/* User Menu Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-zinc-200 p-2 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-zinc-100">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-zinc-900">{displayName}</p>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${isGuest ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}>
                    {isGuest ? "Guest Mode" : "Cloud Sync"}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 truncate mt-0.5">{userEmail}</p>
              </div>

              <div className="py-1 space-y-0.5">
                <Link
                  href="/settings"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
                >
                  <UserIcon className="h-4 w-4 text-zinc-400" />
                  <span>Profile Settings</span>
                </Link>
                <Link
                  href="/overview"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
                >
                  <SettingsIcon className="h-4 w-4 text-zinc-400" />
                  <span>Account & Stats</span>
                </Link>
              </div>

              <div className="pt-1 border-t border-zinc-100">
                {isGuest ? (
                  <Link
                    href="/login"
                    onClick={() => setDropdownOpen(false)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#154D38] hover:bg-emerald-50 transition-colors text-left"
                  >
                    <UserIcon className="h-4 w-4 text-[#154D38]" />
                    <span>Connect Account / Sign In</span>
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      signOut();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                  >
                    <LogOut className="h-4 w-4 text-rose-500" />
                    <span>Sign Out</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
