"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Clock,
  Flame,
  Trophy,
  Sparkles,
  ArrowRight,
  X,
  Volume2,
  VolumeX,
  AlertCircle,
  Dumbbell,
  Check,
  Shield,
} from "lucide-react";
import {
  DaySchedule,
  MOVEMENT_PATTERNS,
  ExerciseLevel,
} from "@/lib/exercises/calisthenics-data";
import {
  getCalisthenicsState,
  logWorkoutSession,
  CalisthenicsState,
} from "@/lib/storage/calisthenics-store";
import { soundEffects } from "@/lib/audio/sound-effects";
import { triggerHaptic } from "@/lib/ui/haptics";
import { triggerCelebration } from "@/lib/ui/celebration";

interface ActiveWorkoutRunnerProps {
  daySchedule: DaySchedule;
  onClose: () => void;
  onComplete: () => void;
}

export function ActiveWorkoutRunner({
  daySchedule,
  onClose,
  onComplete,
}: ActiveWorkoutRunnerProps) {
  const [calisthenicsState, setCalisthenicsState] = useState<CalisthenicsState>(() =>
    getCalisthenicsState()
  );

  // Overall workout stopwatch
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Active workout phase: 0 = Warm-up, 1 = Main Sets, 2 = Core Finisher, 3 = Cool-down, 4 = Completed
  const [activeStep, setActiveStep] = useState<number>(0);

  // Rest Timer between sets
  const [restSecondsRemaining, setRestSecondsRemaining] = useState<number | null>(null);
  const restTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Checklists state
  const [warmupChecks, setWarmupChecks] = useState<Record<number, boolean>>({});
  const [cooldownChecks, setCooldownChecks] = useState<Record<number, boolean>>({});

  // Sets completed state: exerciseKey -> setIndex -> boolean
  const [completedSets, setCompletedSets] = useState<Record<string, boolean[]>>({});

  // Core finisher timer
  const [coreTimer, setCoreTimer] = useState<number>(30);
  const [isCoreTimerActive, setIsCoreTimerActive] = useState(false);

  // Determine active exercises based on day and user's current ladder level
  const resolvedExercises = React.useMemo(() => {
    return daySchedule.sampleExercises.map((ex, idx) => {
      let levelData: ExerciseLevel | null = null;
      let targetText = ex.setsReps;

      if (ex.pattern === "push" || ex.pattern === "pull" || ex.pattern === "legs" || ex.pattern === "core") {
        const pattern = MOVEMENT_PATTERNS[ex.pattern];
        const userLevelNum = calisthenicsState.userLevels[ex.pattern] || 1;
        levelData = pattern.levels.find((l) => l.level === userLevelNum) || pattern.levels[0];
        targetText = levelData.targetReps;
      }

      return {
        id: `ex-${idx}`,
        title: levelData ? levelData.name : ex.name,
        pattern: ex.pattern,
        targetReps: targetText,
        notes: levelData ? levelData.formCues[0] : ex.notes,
        equipment: levelData ? levelData.equipment : "No equipment",
        totalSets: 3,
        levelNumber: levelData ? levelData.level : undefined,
      };
    });
  }, [daySchedule, calisthenicsState]);

  // Overall stopwatch tick
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && activeStep < 4) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, activeStep]);

  // Rest timer tick
  useEffect(() => {
    if (restSecondsRemaining !== null && restSecondsRemaining > 0) {
      restTimerRef.current = setTimeout(() => {
        setRestSecondsRemaining((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
    } else if (restSecondsRemaining === 0) {
      soundEffects.playTimerBell();
      triggerHaptic("levelUp");
      setRestSecondsRemaining(null);
    }
    return () => {
      if (restTimerRef.current) clearTimeout(restTimerRef.current);
    };
  }, [restSecondsRemaining]);

  // Core countdown timer tick
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isCoreTimerActive && coreTimer > 0) {
      interval = setInterval(() => {
        setCoreTimer((prev) => prev - 1);
      }, 1000);
    } else if (coreTimer === 0 && isCoreTimerActive) {
      setIsCoreTimerActive(false);
      soundEffects.playTimerBell();
      triggerHaptic("success");
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCoreTimerActive, coreTimer]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remainder.toString().padStart(2, "0")}`;
  };

  const handleToggleSet = (exerciseId: string, setIdx: number) => {
    const current = completedSets[exerciseId] || [false, false, false];
    const updated = [...current];
    updated[setIdx] = !updated[setIdx];

    setCompletedSets((prev) => ({
      ...prev,
      [exerciseId]: updated,
    }));

    if (updated[setIdx]) {
      soundEffects.playCheckmark();
      triggerHaptic("success");

      // Auto start 60s rest timer if not the final set
      const isAllSetsDone = updated.every(Boolean);
      if (!isAllSetsDone) {
        setRestSecondsRemaining(60);
      }
    }
  };

  const handleFinishWorkout = () => {
    const durationMins = Math.max(1, Math.round(elapsedSeconds / 60));

    // Compile completed exercises list
    const completedList = resolvedExercises.map((ex) => {
      const setsDone = (completedSets[ex.id] || []).filter(Boolean).length;
      return {
        name: ex.title,
        level: ex.levelNumber || 1,
        sets: setsDone || 3,
        reps: ex.targetReps,
      };
    });

    logWorkoutSession({
      dayName: daySchedule.dayName,
      focus: daySchedule.focus,
      durationMinutes: durationMins,
      xpEarned: 25,
      completedExercises: completedList,
      date: new Date().toISOString().split("T")[0],
    });

    soundEffects.playLevelUp();
    triggerCelebration("grand");
    triggerHaptic("levelUp");
    setActiveStep(4);
  };

  const steps = [
    { title: "Warm-up", time: "5 min" },
    { title: "Main Sets", time: "25 min" },
    { title: "Core Finisher", time: "5 min" },
    { title: "Cool-down", time: "5 min" },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex flex-col justify-center items-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-3xl border border-zinc-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Control Bar */}
        <div className="bg-[#154D38] text-white px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-white/10 flex items-center justify-center text-emerald-300">
              <Dumbbell className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                  Active Session · {daySchedule.dayName}
                </span>
                <span className="text-white/40">|</span>
                <span className="text-[11px] text-emerald-100/90 font-medium">
                  {daySchedule.durationMinutes}m Blueprint
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight leading-tight">
                {daySchedule.focus}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Stopwatch Pill */}
            <div className="bg-white/15 px-3 py-1.5 rounded-xl flex items-center gap-2 font-mono text-sm font-bold text-emerald-200 shadow-inner">
              <Clock className="h-3.5 w-3.5" />
              <span>{formatTime(elapsedSeconds)}</span>
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="hover:text-white transition-colors"
                title={isTimerRunning ? "Pause timer" : "Resume timer"}
              >
                {isTimerRunning ? (
                  <Pause className="h-3.5 w-3.5" />
                ) : (
                  <Play className="h-3.5 w-3.5 fill-current" />
                )}
              </button>
            </div>

            <button
              onClick={onClose}
              className="h-8 w-8 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Phase Stepper Tabs */}
        {activeStep < 4 && (
          <div className="border-b border-zinc-100 bg-zinc-50/70 px-4 py-2 flex items-center justify-between overflow-x-auto shrink-0 gap-2">
            {steps.map((st, idx) => (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  activeStep === idx
                    ? "bg-[#154D38] text-white shadow-xs"
                    : activeStep > idx
                    ? "bg-emerald-50 text-[#154D38] border border-emerald-200/80"
                    : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-200/50"
                }`}
              >
                <span className="h-4 w-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
                  {activeStep > idx ? "✓" : idx + 1}
                </span>
                <span>{st.title}</span>
                <span className="text-[10px] opacity-75 font-normal">({st.time})</span>
              </button>
            ))}
          </div>
        )}

        {/* Floating Rest Timer Alert Bar */}
        {restSecondsRemaining !== null && activeStep < 4 && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2.5 flex items-center justify-between text-xs text-[#154D38] font-semibold animate-pulse shrink-0">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#154D38]" />
              <span>
                Rest Timer: <strong>{restSecondsRemaining}s</strong> remaining before next set
              </span>
            </div>
            <button
              onClick={() => setRestSecondsRemaining(null)}
              className="text-[11px] underline text-emerald-800 hover:text-emerald-950 font-bold"
            >
              Skip Rest
            </button>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {/* STEP 0: Warm-up */}
          {activeStep === 0 && (
            <div className="space-y-4">
              <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-[#154D38] font-bold text-sm">
                  <Flame className="h-4 w-4" />
                  <span>Warm-up Protocol (5 Minutes)</span>
                </div>
                <p className="text-xs text-zinc-600 mt-1">
                  Never train cold. Elevate joint synovial fluid, activate target stabilizers, and prep
                  your nervous system.
                </p>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    name: "Joint Rotations",
                    desc: "Wrists, elbows, shoulders, hips, and ankles (30s each)",
                  },
                  {
                    name: "Jumping Jacks or High Knees",
                    desc: "20–25 clean reps to raise body core temperature",
                  },
                  {
                    name: "Arm Circles & Torso Twists",
                    desc: "10 forward, 10 backward arm swings + gentle spinal turns",
                  },
                  {
                    name: "Scapular Wall Slides",
                    desc: "10 slides to awaken serratus and mid-trapezius stabilizers",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setWarmupChecks((p) => ({ ...p, [idx]: !p[idx] }));
                      soundEffects.playCheckmark();
                      triggerHaptic("light");
                    }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      warmupChecks[idx]
                        ? "bg-emerald-50/60 border-emerald-300 text-zinc-900"
                        : "bg-white border-zinc-200 hover:border-zinc-300"
                    }`}
                  >
                    <div>
                      <h5 className="font-bold text-xs text-zinc-900">{item.name}</h5>
                      <p className="text-[11px] text-zinc-500 mt-0.5">{item.desc}</p>
                    </div>
                    <div
                      className={`h-6 w-6 rounded-lg border flex items-center justify-center transition-colors ${
                        warmupChecks[idx]
                          ? "bg-[#154D38] border-[#154D38] text-white"
                          : "border-zinc-300 bg-zinc-50"
                      }`}
                    >
                      {warmupChecks[idx] && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 flex justify-end">
                <Button
                  onClick={() => setActiveStep(1)}
                  className="gap-2 text-xs font-bold"
                >
                  <span>Proceed to Main Sets</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 1: Main Sets */}
          {activeStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-zinc-900">
                    Main Working Sets ({daySchedule.mainSetsMinutes} min)
                  </h4>
                  <p className="text-xs text-zinc-500">
                    Click each set bubble when finished. Take 45–60s rest between sets.
                  </p>
                </div>
                <Badge variant="mint" className="text-xs">
                  {daySchedule.focus.split("(")[0]}
                </Badge>
              </div>

              <div className="space-y-3.5">
                {resolvedExercises
                  .filter((ex) => ex.pattern !== "warmup" && ex.pattern !== "cooldown")
                  .map((ex) => {
                    const setsDone = completedSets[ex.id] || [false, false, false];
                    const isAllDone = setsDone.every(Boolean);

                    return (
                      <div
                        key={ex.id}
                        className={`p-4 rounded-2xl border transition-all ${
                          isAllDone
                            ? "bg-emerald-50/50 border-emerald-300/80 shadow-2xs"
                            : "bg-white border-zinc-200/90 shadow-2xs"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                          <div>
                            <div className="flex items-center gap-2">
                              {ex.levelNumber && (
                                <Badge variant="forest" className="text-[10px] font-bold">
                                  Level {ex.levelNumber}
                                </Badge>
                              )}
                              <h5 className="font-bold text-sm text-zinc-900">{ex.title}</h5>
                            </div>
                            <p className="text-xs text-zinc-500 mt-1 line-clamp-1">{ex.notes}</p>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-xs font-bold text-[#154D38] bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60">
                              {ex.targetReps}
                            </span>
                          </div>
                        </div>

                        {/* Interactive Set Pills */}
                        <div className="flex items-center justify-between pt-3 border-t border-zinc-100">
                          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                            Sets Progress:
                          </span>

                          <div className="flex items-center gap-2">
                            {[0, 1, 2].map((setIdx) => {
                              const isChecked = setsDone[setIdx];
                              return (
                                <button
                                  key={setIdx}
                                  onClick={() => handleToggleSet(ex.id, setIdx)}
                                  className={`h-8 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                                    isChecked
                                      ? "bg-[#154D38] text-white shadow-xs"
                                      : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200"
                                  }`}
                                >
                                  {isChecked ? (
                                    <>
                                      <Check className="h-3 w-3 stroke-[3]" />
                                      <span>Set {setIdx + 1}</span>
                                    </>
                                  ) : (
                                    <span>Set {setIdx + 1}</span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              <div className="pt-3 flex justify-between items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveStep(0)}
                  className="text-xs"
                >
                  Back to Warmup
                </Button>
                <Button
                  onClick={() => setActiveStep(2)}
                  className="gap-2 text-xs font-bold"
                >
                  <span>Continue to Core Finisher</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: Core Finisher */}
          {activeStep === 2 && (
            <div className="space-y-4">
              <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                  <Shield className="h-4 w-4 text-amber-700" />
                  <span>Daily Core Finisher (5 Minutes)</span>
                </div>
                <p className="text-xs text-zinc-600 mt-1">
                  Perform one core ladder exercise every session regardless of the main focus. Never skip
                  the midline foundation.
                </p>
              </div>

              {/* Core Exercise Box */}
              <div className="bg-white border border-zinc-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#154D38] uppercase tracking-wider">
                      Assigned Core Movement
                    </span>
                    <h4 className="text-base font-bold text-zinc-900 mt-0.5">
                      {calisthenicsState.userLevels.core === 1
                        ? "Knee Plank (30s hold)"
                        : calisthenicsState.userLevels.core === 2
                        ? "Full Plank + Side Plank (45s)"
                        : calisthenicsState.userLevels.core === 3
                        ? "Hollow Body Hold (30s hold)"
                        : "Controlled Leg Raises (15 reps)"}
                    </h4>
                  </div>
                  <Badge variant="mint" className="text-xs font-bold">
                    Level {calisthenicsState.userLevels.core}
                  </Badge>
                </div>

                {/* Core Hold Countdown Timer */}
                <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 flex flex-col items-center justify-center space-y-2">
                  <div className="text-3xl font-black font-mono text-zinc-900 tracking-tight">
                    00:{coreTimer.toString().padStart(2, "0")}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => setIsCoreTimerActive(!isCoreTimerActive)}
                      className="text-xs font-bold gap-1.5"
                    >
                      {isCoreTimerActive ? (
                        <>
                          <Pause className="h-3.5 w-3.5" />
                          <span>Pause Timer</span>
                        </>
                      ) : (
                        <>
                          <Play className="h-3.5 w-3.5 fill-current" />
                          <span>Start Hold Timer</span>
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setIsCoreTimerActive(false);
                        setCoreTimer(30);
                      }}
                      className="text-xs"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                <div className="bg-zinc-50 rounded-xl p-3 text-xs text-zinc-600 leading-relaxed">
                  <strong>Form Cue:</strong> Press your lower back completely flat into the ground. If
                  doing a plank, pull elbows toward toes to engage the transverse abdominis.
                </div>
              </div>

              <div className="pt-3 flex justify-between items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveStep(1)}
                  className="text-xs"
                >
                  Back to Main Sets
                </Button>
                <Button
                  onClick={() => setActiveStep(3)}
                  className="gap-2 text-xs font-bold"
                >
                  <span>Proceed to Cool-down</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: Cool-down */}
          {activeStep === 3 && (
            <div className="space-y-4">
              <div className="bg-sky-50/80 border border-sky-200/80 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-sky-900 font-bold text-sm">
                  <Sparkles className="h-4 w-4 text-sky-700" />
                  <span>Cool-down & Static Stretching (5 Minutes)</span>
                </div>
                <p className="text-xs text-zinc-600 mt-1">
                  Static stretching down-regulates the sympathetic nervous system and prevents chronic
                  tightness. This is what keeps you training for 6 months, not 6 weeks.
                </p>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    name: "Doorway Chest & Shoulder Opener",
                    desc: "Place forearm on doorframe, rotate torso away gently for 45s each side.",
                  },
                  {
                    name: "Lat & Upper Back Child's Pose",
                    desc: "Sit on heels, reach arms far forward on floor, sink chest into mat.",
                  },
                  {
                    name: "Couch Quad & Hip Flexor Stretch",
                    desc: "Deep hip opening to reverse prolonged sitting posture.",
                  },
                  {
                    name: "Hamstring Fold & Deep Breathing",
                    desc: "Slow diaphragmatic exhales to transition into full recovery mode.",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setCooldownChecks((p) => ({ ...p, [idx]: !p[idx] }));
                      soundEffects.playCheckmark();
                      triggerHaptic("light");
                    }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      cooldownChecks[idx]
                        ? "bg-sky-50/60 border-sky-300 text-zinc-900"
                        : "bg-white border-zinc-200 hover:border-zinc-300"
                    }`}
                  >
                    <div>
                      <h5 className="font-bold text-xs text-zinc-900">{item.name}</h5>
                      <p className="text-[11px] text-zinc-500 mt-0.5">{item.desc}</p>
                    </div>
                    <div
                      className={`h-6 w-6 rounded-lg border flex items-center justify-center transition-colors ${
                        cooldownChecks[idx]
                          ? "bg-[#154D38] border-[#154D38] text-white"
                          : "border-zinc-300 bg-zinc-50"
                      }`}
                    >
                      {cooldownChecks[idx] && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-zinc-100 flex justify-between items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveStep(2)}
                  className="text-xs"
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  onClick={handleFinishWorkout}
                  className="gap-2 text-xs font-bold bg-[#154D38] hover:bg-[#0F382A] text-white px-5 py-2.5 shadow-md shadow-emerald-900/20"
                >
                  <Trophy className="h-4 w-4" />
                  <span>Finish Workout & Log +25 XP</span>
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: Completed Screen */}
          {activeStep === 4 && (
            <div className="py-8 px-4 text-center space-y-5">
              <div className="h-16 w-16 rounded-3xl bg-emerald-100 text-[#154D38] flex items-center justify-center mx-auto shadow-sm">
                <Trophy className="h-8 w-8" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-zinc-900">Session Complete!</h3>
                <p className="text-xs text-zinc-500 mt-1">
                  You successfully crushed the <strong>{daySchedule.focus}</strong> session in{" "}
                  <strong>{formatTime(elapsedSeconds)}</strong>.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-2xl text-xs font-bold text-[#154D38]">
                <Sparkles className="h-4 w-4 text-emerald-600" />
                <span>+25 Calisthenics XP Awarded & Session Logged</span>
              </div>

              <div className="pt-4 max-w-sm mx-auto">
                <Button
                  onClick={() => {
                    onComplete();
                    onClose();
                  }}
                  className="w-full text-xs font-bold py-3"
                >
                  Return to Calisthenics Hub
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
