"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  TreePine,
  CloudRain,
  Radio,
  Wind,
  CheckCircle2,
  Target,
  Clock,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ambientSound } from "@/lib/audio/ambient-sound";
import { soundEffects } from "@/lib/audio/sound-effects";
import { triggerHaptic } from "@/lib/ui/haptics";
import { triggerCelebration } from "@/lib/ui/celebration";
import { recordFocusSessionAction } from "@/app/actions/focus";
import { useAuth } from "@/components/providers/AuthProvider";
import { addLocalFocusSession } from "@/lib/storage/local-store";

interface PomodoroTimerProps {
  initialTitle?: string;
  initialDurationMinutes?: number;
  availableTasks?: { id: string; title: string; category?: string }[];
  onSessionCompleted?: (earnedXp: number, minutes: number) => void;
}

const PRESETS = [
  { label: "25m Sprint", minutes: 25, type: "focus", xp: 10 },
  { label: "50m Deep Work", minutes: 50, type: "focus", xp: 20 },
  { label: "90m Flow State", minutes: 90, type: "focus", xp: 35 },
  { label: "5m Short Break", minutes: 5, type: "break", xp: 0 },
  { label: "15m Long Break", minutes: 15, type: "break", xp: 0 },
];

const SOUNDS = [
  { id: "forest", name: "Pine Forest", icon: TreePine },
  { id: "rain", name: "Raindrops", icon: CloudRain },
  { id: "alpha", name: "Alpha Waves", icon: Radio },
  { id: "whitenoise", name: "White Noise", icon: Wind },
];

export function PomodoroTimer({
  initialTitle,
  initialDurationMinutes = 25,
  availableTasks = [],
  onSessionCompleted,
}: PomodoroTimerProps) {
  const { refreshProfile } = useAuth();

  const [selectedMinutes, setSelectedMinutes] = useState(initialDurationMinutes);
  const [secondsRemaining, setSecondsRemaining] = useState(initialDurationMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTaskTitle, setActiveTaskTitle] = useState(initialTitle || "Zenin AI Core Architecture");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // Sound settings
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [selectedSound, setSelectedSound] = useState<"forest" | "rain" | "alpha" | "whitenoise">("forest");
  const [volume, setVolume] = useState(0.3);

  // Exact background-drift-proof timestamp tracking
  const targetEndTimeRef = useRef<number | null>(null);

  // Format seconds to MM:SS or HH:MM:SS
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    const formattedMins = mins < 10 ? `0${mins}` : `${mins}`;
    const formattedSecs = secs < 10 ? `0${secs}` : `${secs}`;

    if (hours > 0) {
      const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
      return `${formattedHours}:${formattedMins}:${formattedSecs}`;
    }
    return `${formattedMins}:${formattedSecs}`;
  };

  // Timer interval with drift compensation
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      if (!targetEndTimeRef.current) {
        targetEndTimeRef.current = Date.now() + secondsRemaining * 1000;
      }

      interval = setInterval(() => {
        const remaining = Math.max(0, Math.round((targetEndTimeRef.current! - Date.now()) / 1000));
        setSecondsRemaining(remaining);

        if (remaining <= 0) {
          handleTimerComplete();
        }
      }, 1000);
    } else {
      targetEndTimeRef.current = null;
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  // Audio control
  useEffect(() => {
    if (isRunning && soundEnabled) {
      ambientSound.play(selectedSound, volume);
    } else {
      ambientSound.stop();
    }

    return () => {
      ambientSound.stop();
    };
  }, [isRunning, soundEnabled, selectedSound, volume]);

  // Spacebar hotkey listener to play/pause
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      const isInput =
        activeTag === "input" ||
        activeTag === "textarea" ||
        (document.activeElement as HTMLElement)?.isContentEditable;
      if (isInput) return;

      if (e.code === "Space") {
        e.preventDefault();
        handleStartPause();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isRunning, secondsRemaining]);

  const handleStartPause = () => {
    soundEffects.playClick();
    triggerHaptic("medium");
    if (!isRunning) {
      targetEndTimeRef.current = Date.now() + secondsRemaining * 1000;
      setIsRunning(true);
    } else {
      setIsRunning(false);
      targetEndTimeRef.current = null;
    }
  };

  const handleReset = (minutes = selectedMinutes) => {
    soundEffects.playClick();
    triggerHaptic("light");
    setIsRunning(false);
    targetEndTimeRef.current = null;
    setSelectedMinutes(minutes);
    setSecondsRemaining(minutes * 60);
  };

  const handleSelectPreset = (preset: (typeof PRESETS)[0]) => {
    soundEffects.playClick();
    handleReset(preset.minutes);
  };

  const handleTimerComplete = async () => {
    setIsRunning(false);
    targetEndTimeRef.current = null;
    ambientSound.stop();

    // Tactile Audio & Celebratory Particles
    soundEffects.playTimerBell();
    setTimeout(() => soundEffects.playLevelUp(), 300);
    triggerHaptic("levelUp");
    triggerCelebration("grand");

    const sessionSeconds = selectedMinutes * 60;
    const res = await recordFocusSessionAction(
      selectedTaskId,
      sessionSeconds,
      selectedSound,
      null,
      activeTaskTitle
    );

    const earnedXp = res.earnedXp || Math.round(sessionSeconds / 180);

    // Persist immediately to local storage
    addLocalFocusSession({
      id: "focus-" + Date.now(),
      task_id: selectedTaskId,
      task_title: activeTaskTitle,
      duration_seconds: sessionSeconds,
      environment_sound: selectedSound,
      notes: null,
      xp_earned: earnedXp,
      started_at: new Date(Date.now() - sessionSeconds * 1000).toISOString(),
      completed_at: new Date().toISOString(),
    });

    await refreshProfile();

    if (onSessionCompleted) {
      onSessionCompleted(earnedXp, selectedMinutes);
    }

    setSecondsRemaining(selectedMinutes * 60);
  };

  const progressPct = Math.round(
    ((selectedMinutes * 60 - secondsRemaining) / (selectedMinutes * 60)) * 100
  );

  return (
    <div className="space-y-6">
      {/* Luxury Time Tracker Card (Inspired directly by Donezo Reference) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#123E2E] via-[#0E3425] to-[#071A13] text-white p-7 sm:p-10 shadow-xl border border-[#164E3A]">
        {/* Subtle organic silk wave texture overlay */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-20 w-72 h-72 bg-emerald-400/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
          {/* Top Pill & Task Link */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-xs font-bold text-emerald-200">
              <Target className="h-3.5 w-3.5 text-emerald-400" />
              <span>TIME TRACKER & DEEP WORK SPRINT</span>
            </span>

            <span className="text-xs text-emerald-200/80 font-medium">
              Objective: <strong className="text-white">{activeTaskTitle}</strong>
            </span>
          </div>

          {/* Giant Digital Monospace Clock (matching 01:24:08 from screenshot) */}
          <div className="py-2">
            <div className="text-6xl sm:text-8xl font-black font-mono tracking-tight text-white select-none drop-shadow-md">
              {formatTime(secondsRemaining)}
            </div>
            <div className="text-xs text-emerald-300/80 font-medium mt-2">
              {isRunning ? "Focus sprint in progress • Stay in the zone" : "Paused • Ready to sprint"}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-md space-y-1.5">
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden border border-white/10">
              <div
                className="h-full bg-emerald-400 rounded-full transition-all duration-1000 shadow-[0_0_8px_#34d399]"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-emerald-200/70 font-mono">
              <span>{progressPct}% elapsed</span>
              <span>{Math.round(secondsRemaining / 60)}m remaining</span>
            </div>
          </div>

          {/* Large Round Controls (Inspired by Donezo reference Pause & Stop buttons) */}
          <div className="flex items-center justify-center gap-4 pt-2">
            {/* Play/Pause Button */}
            <button
              onClick={handleStartPause}
              className="h-16 w-16 rounded-full bg-white hover:bg-emerald-50 text-[#154D38] flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
              title={isRunning ? "Pause Session" : "Start Focus"}
            >
              {isRunning ? (
                <Pause className="h-7 w-7 fill-[#154D38]" />
              ) : (
                <Play className="h-7 w-7 fill-[#154D38] ml-0.5" />
              )}
            </button>

            {/* Stop/Reset Button */}
            <button
              onClick={() => handleReset()}
              className="h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95"
              title="Reset Timer"
            >
              <RotateCcw className="h-5 w-5" />
            </button>
          </div>

          {/* XP Reward Preview */}
          <div className="text-xs text-emerald-200/80 flex items-center gap-1.5 pt-1">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>
              Awards <strong>+{Math.max(10, Math.floor(selectedMinutes / 25) * 10)} XP</strong> upon session completion
            </span>
          </div>
        </div>
      </div>

      {/* Preset Selectors Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {PRESETS.map((preset) => {
          const isSelected = selectedMinutes === preset.minutes;
          return (
            <button
              key={preset.label}
              onClick={() => handleSelectPreset(preset)}
              className={`p-3 rounded-2xl border text-center transition-all ${
                isSelected
                  ? "bg-[#154D38] text-white border-[#154D38] shadow-xs font-bold"
                  : "bg-white border-zinc-200 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 font-semibold"
              }`}
            >
              <div className="text-xs">{preset.label}</div>
              <div
                className={`text-[10px] mt-0.5 ${
                  isSelected ? "text-emerald-200" : "text-zinc-400"
                }`}
              >
                {preset.xp > 0 ? `+${preset.xp} XP` : "Rest"}
              </div>
            </button>
          );
        })}
      </div>

      {/* Settings Row: Objective Selector & Ambient Audio */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. Target Objective Selector */}
        <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-[#154D38]" />
              Linked Objective
            </span>
            <span className="text-[11px] text-zinc-400">Queue Items</span>
          </div>

          {availableTasks.length > 0 ? (
            <select
              value={selectedTaskId || ""}
              onChange={(e) => {
                const taskId = e.target.value;
                setSelectedTaskId(taskId || null);
                const task = availableTasks.find((t) => t.id === taskId);
                if (task) setActiveTaskTitle(task.title);
              }}
              className="w-full text-xs font-semibold p-2.5 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-800 focus:outline-none focus:border-[#154D38]"
            >
              <option value="">Custom Sprint / Manual Goal</option>
              {availableTasks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title} {t.category ? `(${t.category})` : ""}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={activeTaskTitle}
              onChange={(e) => setActiveTaskTitle(e.target.value)}
              placeholder="What are you focusing on?"
              className="w-full text-xs font-semibold p-2.5 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-800 focus:outline-none focus:border-[#154D38]"
            />
          )}

          <p className="text-[11px] text-zinc-500">
            Attaching a task automatically increments its focus duration and XP records.
          </p>
        </div>

        {/* 2. Web Audio Ambient Soundscapes */}
        <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
              <Volume2 className="h-3.5 w-3.5 text-[#154D38]" />
              Ambient Atmosphere
            </span>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`px-2.5 py-1 rounded-full text-xs font-bold transition-colors ${
                soundEnabled
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-zinc-100 text-zinc-500 border border-zinc-200"
              }`}
            >
              {soundEnabled ? "Audio ON" : "Audio Muted"}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SOUNDS.map((s) => {
              const Icon = s.icon;
              const isSelected = selectedSound === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    setSelectedSound(s.id as any);
                    if (!soundEnabled) setSoundEnabled(true);
                  }}
                  className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                    isSelected
                      ? "bg-[#154D38] text-white border-[#154D38] font-bold"
                      : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-[11px]">{s.name}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 pt-1">
            <span className="text-[11px] text-zinc-400">Volume:</span>
            <input
              type="range"
              min="0.05"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full accent-[#154D38] h-1.5 bg-zinc-200 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
