"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  User,
  Bell,
  Shield,
  Save,
  LogOut,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNotification } from "@/components/providers/NotificationProvider";
import { createClient } from "@/lib/supabase/client";
import { resetUserStatsAction } from "@/app/actions/analytics";
import { soundEffects } from "@/lib/audio/sound-effects";
import { triggerHaptic } from "@/lib/ui/haptics";
import { triggerCelebration } from "@/lib/ui/celebration";
import { resetAllLocalData } from "@/lib/storage/local-store";

export default function SettingsPage() {
  const { user, profile, stats, signOut, refreshProfile } = useAuth();
  const { permission, requestPermission, sendTestAlert } = useNotification();
  const supabase = createClient();

  const [displayName, setDisplayName] = useState("");
  const [primaryCurrency, setPrimaryCurrency] = useState("BDT");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [particlesEnabled, setParticlesEnabled] = useState(true);
  const [browserPushEnabled, setBrowserPushEnabled] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || "");
      setPrimaryCurrency(profile.primary_currency || "BDT");
      setSoundEnabled(profile.sound_enabled ?? true);
      setParticlesEnabled(profile.particles_enabled ?? true);
    } else if (user) {
      setDisplayName(user.user_metadata?.full_name || user.email?.split("@")[0] || "");
    }
  }, [profile, user]);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    // Save to local storage cache immediately
    if (typeof window !== "undefined") {
      localStorage.setItem("lifequest_user_profile_v1", JSON.stringify({
        display_name: displayName,
        primary_currency: primaryCurrency,
        sound_enabled: soundEnabled,
        particles_enabled: particlesEnabled,
      }));
    }

    if (!user) {
      setIsSaving(false);
      setSuccessMessage("Player settings successfully saved in browser storage.");
      setTimeout(() => setSuccessMessage(null), 4000);
      return;
    }

    try {
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          display_name: displayName,
          primary_currency: primaryCurrency,
          sound_enabled: soundEnabled,
          particles_enabled: particlesEnabled,
        });

      if (error) {
        setSuccessMessage("Saved locally (cloud sync pending database setup).");
      } else {
        await refreshProfile();
        setSuccessMessage("Player settings successfully saved.");
      }
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: unknown) {
      setSuccessMessage("Saved locally.");
      setTimeout(() => setSuccessMessage(null), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetStats = async () => {
    if (!window.confirm("Are you sure you want to reset all your stats, focus time, and completions to zero?")) {
      return;
    }
    setIsResetting(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    // Reset local store
    resetAllLocalData();

    try {
      const res = await resetUserStatsAction();
      await refreshProfile();
      setSuccessMessage(res?.message || "All stats reset to baseline zero.");
      triggerHaptic("success");
    } catch (err: unknown) {
      setSuccessMessage("All local stats reset to zero.");
      triggerHaptic("success");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl pb-10 font-sans">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
          <span>Settings & Command Center Preferences</span>
          <Sparkles className="h-5 w-5 text-[#154D38]" />
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Manage your personal profile, gamification mechanics, currencies, and authenticated session.
        </p>
      </div>

      {/* Success / Error Banners */}
      {successMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs font-semibold text-[#154D38] animate-in fade-in duration-200">
          <CheckCircle2 className="h-4 w-4 text-[#154D38] shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs font-semibold text-rose-700 animate-in fade-in duration-200">
          <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Profile Section */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-3 pb-4">
          <div className="h-9 w-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#154D38]">
            <User className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-zinc-900">Player Identity</CardTitle>
            <CardDescription className="text-zinc-500">Your public profile, handle, and financial currency</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700">
                Display Name / Call-Sign
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Commander"
                className="w-full h-10 px-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-zinc-900 focus:outline-none focus:border-[#154D38] focus:bg-white transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700">
                Primary Currency
              </label>
              <select
                value={primaryCurrency}
                onChange={(e) => setPrimaryCurrency(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-zinc-900 focus:outline-none focus:border-[#154D38] focus:bg-white transition-colors"
              >
                <option value="BDT">BDT (৳) — Bangladeshi Taka</option>
                <option value="USD">USD ($) — US Dollar</option>
                <option value="EUR">EUR (€) — Euro</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gamification Settings */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-3 pb-4">
          <div className="h-9 w-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-zinc-900">Gamification Engine</CardTitle>
            <CardDescription className="text-zinc-500">Level calculations, sound effects, and feedback</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80">
            <div>
              <div className="text-sm font-semibold text-zinc-900">Sound Effects & Celebrations</div>
              <div className="text-xs text-zinc-500">Play synthesized Web Audio chimes on task, habit, and milestone completion</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  soundEffects.playCheckmark();
                  triggerHaptic("success");
                }}
                className="px-2.5 py-1 rounded-lg text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
              >
                Test Chime
              </button>
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => {
                  setSoundEnabled(e.target.checked);
                  soundEffects.setEnabled(e.target.checked);
                  if (e.target.checked) soundEffects.playCheckmark();
                }}
                className="h-4 w-4 accent-[#154D38] rounded cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80">
            <div>
              <div className="text-sm font-semibold text-zinc-900">Particle & Confetti Bursts</div>
              <div className="text-xs text-zinc-500">Display 60fps Donezo celebratory particles on milestones and quests</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  soundEffects.playLevelUp();
                  triggerHaptic("levelUp");
                  triggerCelebration("grand");
                }}
                className="px-2.5 py-1 rounded-lg text-xs font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors"
              >
                Test Burst
              </button>
              <input
                type="checkbox"
                checked={particlesEnabled}
                onChange={(e) => setParticlesEnabled(e.target.checked)}
                className="h-4 w-4 accent-[#154D38] rounded cursor-pointer"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-3 pb-4">
          <div className="h-9 w-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-zinc-900">Notifications & Web Push</CardTitle>
            <CardDescription className="text-zinc-500">Reminders for scheduled routines, deadlines, and streak defense</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Permission Status Row */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80">
            <div>
              <div className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
                <span>Browser Push Notifications</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  permission === "granted"
                    ? "bg-emerald-100 text-[#154D38]"
                    : permission === "denied"
                    ? "bg-rose-100 text-rose-700"
                    : "bg-amber-100 text-amber-800"
                }`}>
                  {permission === "granted" ? "Granted ✓" : permission === "denied" ? "Blocked in Browser" : "Permission Required"}
                </span>
              </div>
              <div className="text-xs text-zinc-500 mt-0.5">
                Service Worker alert dispatch via <code className="font-mono text-[10px]">/sw.js</code>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {permission !== "granted" ? (
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => requestPermission()}
                  className="text-xs bg-[#154D38] hover:bg-[#0E3425] text-white"
                >
                  Enable Permissions
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => sendTestAlert("routine")}
                  className="text-xs border-zinc-200 text-zinc-700 hover:bg-zinc-100"
                >
                  Send Test Alert
                </Button>
              )}
            </div>
          </div>

          {/* Sub-Preferences Checklist */}
          <div className="space-y-2 pt-1">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              Alert Trigger Rules
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-zinc-50/70 border border-zinc-200/60 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-zinc-800">Routine Transitions</div>
                  <div className="text-[10px] text-zinc-400">5 minutes prior to next block</div>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 accent-[#154D38] rounded cursor-pointer"
                />
              </div>

              <div className="p-3 rounded-xl bg-zinc-50/70 border border-zinc-200/60 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-zinc-800">Streak Defense</div>
                  <div className="text-[10px] text-zinc-400">Evening warnings at 20:00 PM</div>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 accent-[#154D38] rounded cursor-pointer"
                />
              </div>

              <div className="p-3 rounded-xl bg-zinc-50/70 border border-zinc-200/60 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-zinc-800">Morning Briefing</div>
                  <div className="text-[10px] text-zinc-400">08:00 AM daily objective digest</div>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 accent-[#154D38] rounded cursor-pointer"
                />
              </div>

              <div className="p-3 rounded-xl bg-zinc-50/70 border border-zinc-200/60 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-zinc-800">Focus Chimes</div>
                  <div className="text-[10px] text-zinc-400">On Pomodoro interval complete</div>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 accent-[#154D38] rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account & Security Section */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-3 pb-4">
          <div className="h-9 w-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#154D38]">
            <KeyRound className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-zinc-900">Account & Active Session</CardTitle>
            <CardDescription className="text-zinc-500">Supabase Auth details and session management</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-1">
              <span className="text-zinc-400 font-medium">Signed-in Email</span>
              <div className="font-semibold text-zinc-900 truncate">{user?.email || "demo@lifequest.app"}</div>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-1">
              <span className="text-zinc-400 font-medium">Player Progression</span>
              <div className="font-semibold text-emerald-800">
                Level {stats?.current_level ?? 1} &middot; {stats?.total_xp ?? 0} Total XP
              </div>
            </div>
          </div>

          {/* Reset All Stats & Progress */}
          <div className="pt-2 pb-2 border-t border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold text-zinc-900">Reset All Stats & Progress</div>
              <div className="text-xs text-zinc-500">
                Reset your XP, level, streaks, and completed activities back to clean initial zeroes.
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetStats}
              disabled={isResetting}
              className="gap-2 text-xs border-amber-300 text-amber-900 hover:bg-amber-50 shrink-0"
            >
              <RotateCcw className={`h-3.5 w-3.5 ${isResetting ? "animate-spin" : ""}`} />
              <span>{isResetting ? "Resetting..." : "Reset Stats to Zero"}</span>
            </Button>
          </div>

          <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
            <div className="text-xs text-zinc-500">
              Terminate your authenticated session on this browser.
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={signOut}
              className="gap-2 text-xs"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end pt-2">
        <Button
          variant="primary"
          onClick={handleSaveProfile}
          disabled={isSaving}
          className="gap-2 px-6 bg-[#154D38] hover:bg-[#0E3425] text-white shadow-sm"
        >
          <Save className="h-4 w-4" />
          <span>{isSaving ? "Saving..." : "Save Preferences"}</span>
        </Button>
      </div>
    </div>
  );
}
