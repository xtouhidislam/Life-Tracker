import { recordLocalWorkoutSession, recordLocalXp } from "./local-store";

export interface WorkoutLog {
  id: string;
  date: string; // ISO date string "YYYY-MM-DD"
  timestamp: number;
  dayName: string;
  focus: string;
  durationMinutes: number;
  xpEarned: number;
  completedExercises: {
    name: string;
    level: number;
    sets: number;
    reps: string;
  }[];
  notes?: string;
}

export interface CalisthenicsState {
  currentPhase: 1 | 2 | 3;
  userLevels: {
    push: number;
    pull: number;
    legs: number;
    core: number;
  };
  userWeightKg: number;
  proteinRatio: number; // 1.2 to 1.6 g/kg
  personalBests: Record<string, number>; // exerciseId -> max clean reps
  workoutHistory: WorkoutLog[];
  completedDates: string[]; // "YYYY-MM-DD"
}

const STORAGE_KEY = "lifequest_calisthenics_v1";

const DEFAULT_STATE: CalisthenicsState = {
  currentPhase: 1,
  userLevels: {
    push: 1,
    pull: 1,
    legs: 1,
    core: 1,
  },
  userWeightKg: 65,
  proteinRatio: 1.4,
  personalBests: {
    "push-1": 15,
    "pull-1": 12,
    "legs-1": 20,
    "core-1": 30,
  },
  workoutHistory: [],
  completedDates: [],
};

function isClient(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function getCalisthenicsState(): CalisthenicsState {
  if (!isClient()) return DEFAULT_STATE;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return DEFAULT_STATE;
  try {
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_STATE,
      ...parsed,
      userLevels: {
        ...DEFAULT_STATE.userLevels,
        ...(parsed.userLevels || {}),
      },
    };
  } catch {
    return DEFAULT_STATE;
  }
}

export function saveCalisthenicsState(state: CalisthenicsState): void {
  if (!isClient()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function updateLadderLevel(
  pattern: "push" | "pull" | "legs" | "core",
  level: number
): CalisthenicsState {
  const current = getCalisthenicsState();
  const nextState: CalisthenicsState = {
    ...current,
    userLevels: {
      ...current.userLevels,
      [pattern]: level,
    },
  };
  saveCalisthenicsState(nextState);
  return nextState;
}

export function updatePhase(phase: 1 | 2 | 3): CalisthenicsState {
  const current = getCalisthenicsState();
  const nextState: CalisthenicsState = {
    ...current,
    currentPhase: phase,
  };
  saveCalisthenicsState(nextState);
  return nextState;
}

export function updateNutritionWeight(weightKg: number, ratio: number = 1.4): CalisthenicsState {
  const current = getCalisthenicsState();
  const nextState: CalisthenicsState = {
    ...current,
    userWeightKg: Math.max(30, Math.min(200, weightKg)),
    proteinRatio: Math.max(1.0, Math.min(2.5, ratio)),
  };
  saveCalisthenicsState(nextState);
  return nextState;
}

export function updatePersonalBest(exerciseId: string, reps: number): CalisthenicsState {
  const current = getCalisthenicsState();
  const nextState: CalisthenicsState = {
    ...current,
    personalBests: {
      ...current.personalBests,
      [exerciseId]: reps,
    },
  };
  saveCalisthenicsState(nextState);
  return nextState;
}

export function logWorkoutSession(log: Omit<WorkoutLog, "id" | "timestamp">): {
  state: CalisthenicsState;
  newWorkoutCount: number;
} {
  const current = getCalisthenicsState();
  const todayStr = new Date().toISOString().split("T")[0];

  const newLog: WorkoutLog = {
    ...log,
    id: `workout-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: Date.now(),
  };

  const updatedDates = current.completedDates.includes(todayStr)
    ? current.completedDates
    : [...current.completedDates, todayStr];

  const nextState: CalisthenicsState = {
    ...current,
    workoutHistory: [newLog, ...current.workoutHistory].slice(0, 100),
    completedDates: updatedDates,
  };

  saveCalisthenicsState(nextState);

  // Sync with global lifequest local store:
  // Award XP and increment workout counter
  recordLocalWorkoutSession(1);
  recordLocalXp(log.xpEarned || 25, "routine");

  return {
    state: nextState,
    newWorkoutCount: nextState.workoutHistory.length,
  };
}
