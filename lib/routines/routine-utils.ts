export interface RoutineBlock {
  id: string;
  routine_id?: string;
  num: number;
  title: string;
  activity_type: "Spiritual" | "Health" | "Work" | "Office" | "Study" | "Break" | "Knowledge" | "Trading" | "Sleep" | "Education" | "Recharge";
  start_time: string; // "05:30"
  end_time: string;   // "06:00"
  duration_minutes: number;
  energy_level: "high" | "medium" | "low" | "rest";
  description: string;
  icon_name: string;
  xp_reward: number;
  is_completed: boolean;
  completed_at?: string | null;
}

export const DEFAULT_WEEKDAY_BLOCKS: RoutineBlock[] = [
  {
    id: "wd-1",
    num: 1,
    title: "Fazr",
    activity_type: "Spiritual",
    start_time: "05:30",
    end_time: "06:00",
    duration_minutes: 30,
    energy_level: "low",
    description: "Dawn prayer, spiritual grounding, morning silence and reflection.",
    icon_name: "Sunrise",
    xp_reward: 5,
    is_completed: false,
  },
  {
    id: "wd-2",
    num: 2,
    title: "Exercise & Stretching",
    activity_type: "Health",
    start_time: "06:00",
    end_time: "07:00",
    duration_minutes: 60,
    energy_level: "high",
    description: "Full body workout, mobility drills, core activation and dynamic stretching.",
    icon_name: "Dumbbell",
    xp_reward: 5,
    is_completed: false,
  },
  {
    id: "wd-3",
    num: 3,
    title: "Work (Deep Work 1)",
    activity_type: "Work",
    start_time: "07:00",
    end_time: "08:15",
    duration_minutes: 75,
    energy_level: "high",
    description: "High-leverage engineering sprint: core project architectures and AI code.",
    icon_name: "Laptop",
    xp_reward: 5,
    is_completed: false,
  },
  {
    id: "wd-4",
    num: 4,
    title: "Office (Morning Shift)",
    activity_type: "Office",
    start_time: "08:15",
    end_time: "11:00",
    duration_minutes: 165,
    energy_level: "high",
    description: "Daily office execution, project standups, stakeholder meetings and deliverables.",
    icon_name: "Briefcase",
    xp_reward: 5,
    is_completed: false,
  },
  {
    id: "wd-5",
    num: 5,
    title: "Work (Deep Work 2)",
    activity_type: "Work",
    start_time: "11:00",
    end_time: "13:00",
    duration_minutes: 120,
    energy_level: "high",
    description: "Midday focused execution block: deep problem solving without distraction.",
    icon_name: "Laptop",
    xp_reward: 5,
    is_completed: false,
  },
  {
    id: "wd-6",
    num: 6,
    title: "Break (Lunch & Midday Reset)",
    activity_type: "Break",
    start_time: "13:00",
    end_time: "14:00",
    duration_minutes: 60,
    energy_level: "rest",
    description: "Nutritious lunch, Dhuhr prayer, mental cooldown and screen break.",
    icon_name: "Coffee",
    xp_reward: 5,
    is_completed: false,
  },
  {
    id: "wd-7",
    num: 7,
    title: "Study (AI & Engineering)",
    activity_type: "Study",
    start_time: "14:00",
    end_time: "15:00",
    duration_minutes: 60,
    energy_level: "high",
    description: "Dedicated curriculum sprint: machine learning, agentic pipelines & frameworks.",
    icon_name: "BookOpen",
    xp_reward: 5,
    is_completed: false,
  },
  {
    id: "wd-8",
    num: 8,
    title: "Office (Afternoon Block)",
    activity_type: "Office",
    start_time: "15:00",
    end_time: "16:00",
    duration_minutes: 60,
    energy_level: "medium",
    description: "Secondary office coordination, reviews, issue resolution and follow-ups.",
    icon_name: "Briefcase",
    xp_reward: 5,
    is_completed: false,
  },
  {
    id: "wd-9",
    num: 9,
    title: "Break (Late Afternoon Reset)",
    activity_type: "Break",
    start_time: "16:00",
    end_time: "17:00",
    duration_minutes: 60,
    energy_level: "rest",
    description: "Asr prayer, green tea, light walk and physical reset.",
    icon_name: "Coffee",
    xp_reward: 5,
    is_completed: false,
  },
  {
    id: "wd-10",
    num: 10,
    title: "Work (Evening Sprint)",
    activity_type: "Work",
    start_time: "17:00",
    end_time: "19:00",
    duration_minutes: 120,
    energy_level: "high",
    description: "Personal product builds, advanced features, and code shipping.",
    icon_name: "Laptop",
    xp_reward: 5,
    is_completed: false,
  },
  {
    id: "wd-11",
    num: 11,
    title: "Office (Evening Wrap-up)",
    activity_type: "Office",
    start_time: "19:00",
    end_time: "20:00",
    duration_minutes: 60,
    energy_level: "medium",
    description: "End of day office documentation, commit merges and status reports.",
    icon_name: "Briefcase",
    xp_reward: 5,
    is_completed: false,
  },
  {
    id: "wd-12",
    num: 12,
    title: "Knowledge (AI Architecture)",
    activity_type: "Knowledge",
    start_time: "20:00",
    end_time: "21:30",
    duration_minutes: 90,
    energy_level: "high",
    description: "Research papers, system design literature, new AI model releases.",
    icon_name: "Brain",
    xp_reward: 5,
    is_completed: false,
  },
  {
    id: "wd-13",
    num: 13,
    title: "Break (Dinner & Recharge)",
    activity_type: "Break",
    start_time: "21:30",
    end_time: "22:30",
    duration_minutes: 60,
    energy_level: "rest",
    description: "Evening dinner, family conversations, Isha prayer and relaxation.",
    icon_name: "Utensils",
    xp_reward: 5,
    is_completed: false,
  },
  {
    id: "wd-14",
    num: 14,
    title: "Trading (Market Analysis)",
    activity_type: "Trading",
    start_time: "22:30",
    end_time: "23:30",
    duration_minutes: 60,
    energy_level: "medium",
    description: "Financial markets, chart setups, risk management, trade journaling.",
    icon_name: "TrendingUp",
    xp_reward: 5,
    is_completed: false,
  },
  {
    id: "wd-15",
    num: 15,
    title: "Sleep (6 Hours Rest)",
    activity_type: "Sleep",
    start_time: "23:30",
    end_time: "05:30",
    duration_minutes: 360,
    energy_level: "rest",
    description: "Device shutdown, dark room, uninterrupted deep restorative sleep.",
    icon_name: "Moon",
    xp_reward: 5,
    is_completed: false,
  },
];

export const DEFAULT_WEEKEND_BLOCKS: RoutineBlock[] = [
  {
    id: "we-1",
    num: 1,
    title: "Fazr",
    activity_type: "Spiritual",
    start_time: "05:30",
    end_time: "06:00",
    duration_minutes: 30,
    energy_level: "low",
    description: "Dawn prayer, spiritual grounding and morning gratitude.",
    icon_name: "Sunrise",
    xp_reward: 5,
    is_completed: false,
  },
  {
    id: "we-2",
    num: 2,
    title: "Exercise",
    activity_type: "Health",
    start_time: "06:00",
    end_time: "07:00",
    duration_minutes: 60,
    energy_level: "high",
    description: "Weekend physical conditioning, outdoor run or gym session.",
    icon_name: "Dumbbell",
    xp_reward: 5,
    is_completed: false,
  },
  {
    id: "we-3",
    num: 3,
    title: "Work (Deep Project Sprint)",
    activity_type: "Work",
    start_time: "07:00",
    end_time: "09:00",
    duration_minutes: 120,
    energy_level: "high",
    description: "Undivided deep work on core entrepreneurial and AI software projects.",
    icon_name: "Laptop",
    xp_reward: 5,
    is_completed: false,
  },
  {
    id: "we-4",
    num: 4,
    title: "School (University)",
    activity_type: "Education",
    start_time: "09:00",
    end_time: "17:00",
    duration_minutes: 480,
    energy_level: "high",
    description: "University lectures, lab work, collaborative study and assignments.",
    icon_name: "GraduationCap",
    xp_reward: 5,
    is_completed: false,
  },
  {
    id: "we-5",
    num: 5,
    title: "Hangout (Social & Reset)",
    activity_type: "Recharge",
    start_time: "17:00",
    end_time: "21:00",
    duration_minutes: 240,
    energy_level: "rest",
    description: "Friends meetup, dinner outside, social connection, and weekly unwind.",
    icon_name: "Users",
    xp_reward: 5,
    is_completed: false,
  },
  {
    id: "we-6",
    num: 6,
    title: "Knowledge (Tech Review)",
    activity_type: "Knowledge",
    start_time: "21:00",
    end_time: "22:00",
    duration_minutes: 60,
    energy_level: "medium",
    description: "Weekly tech review, reading industry articles, notes synthesis.",
    icon_name: "Brain",
    xp_reward: 5,
    is_completed: false,
  },
  {
    id: "we-7",
    num: 7,
    title: "Work (Final Push)",
    activity_type: "Work",
    start_time: "22:00",
    end_time: "23:30",
    duration_minutes: 90,
    energy_level: "high",
    description: "Final evening coding sprint, week planning and repository updates.",
    icon_name: "Laptop",
    xp_reward: 5,
    is_completed: false,
  },
  {
    id: "we-8",
    num: 8,
    title: "Sleep (6 Hours Rest)",
    activity_type: "Sleep",
    start_time: "23:30",
    end_time: "05:30",
    duration_minutes: 360,
    energy_level: "rest",
    description: "Restorative weekend night sleep to start the next cycle fully charged.",
    icon_name: "Moon",
    xp_reward: 5,
    is_completed: false,
  },
];

/**
 * Converts a "HH:MM" string to minutes from 00:00 (0 - 1439).
 */
export function timeStringToMinutes(timeStr: string): number {
  const parts = timeStr.split(":");
  const hours = parseInt(parts[0], 10) || 0;
  const minutes = parseInt(parts[1], 10) || 0;
  return hours * 60 + minutes;
}

/**
 * Formats a "HH:MM" 24h string into friendly 12h AM/PM format (e.g. "05:30 AM", "01:00 PM")
 */
export function formatTo12Hour(timeStr: string): string {
  const [hStr, mStr] = timeStr.split(":");
  let hours = parseInt(hStr, 10);
  const minutes = mStr || "00";
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 becomes 12
  const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
  return `${formattedHours}:${minutes} ${ampm}`;
}

/**
 * Checks whether a given clock minute (0-1439) falls within a block interval.
 * Handles cross-midnight intervals (e.g., 23:30 - 05:30).
 */
export function isMinuteInBlock(currentMinute: number, startStr: string, endStr: string): boolean {
  const startMin = timeStringToMinutes(startStr);
  const endMin = timeStringToMinutes(endStr);

  if (startMin <= endMin) {
    // Normal interval within the same calendar day (e.g. 06:00 to 07:00)
    return currentMinute >= startMin && currentMinute < endMin;
  } else {
    // Cross-midnight interval (e.g. 23:30 to 05:30)
    return currentMinute >= startMin || currentMinute < endMin;
  }
}

export interface ActiveBlockState {
  activeBlock: RoutineBlock | null;
  nextBlock: RoutineBlock | null;
  minutesRemaining: number;
  percentElapsed: number;
}

/**
 * Detects the currently active routine block and up-next block based on the current date/time.
 */
export function getActiveBlockState(blocks: RoutineBlock[], now: Date = new Date()): ActiveBlockState {
  const currentMinute = now.getHours() * 60 + now.getMinutes();

  let activeIndex = -1;
  for (let i = 0; i < blocks.length; i++) {
    if (isMinuteInBlock(currentMinute, blocks[i].start_time, blocks[i].end_time)) {
      activeIndex = i;
      break;
    }
  }

  if (activeIndex === -1) {
    // Fallback: finding the next scheduled block
    const nextIndex = blocks.findIndex((b) => timeStringToMinutes(b.start_time) > currentMinute);
    return {
      activeBlock: null,
      nextBlock: nextIndex !== -1 ? blocks[nextIndex] : blocks[0],
      minutesRemaining: 0,
      percentElapsed: 0,
    };
  }

  const active = blocks[activeIndex];
  const next = blocks[(activeIndex + 1) % blocks.length];

  const startMin = timeStringToMinutes(active.start_time);
  const endMin = timeStringToMinutes(active.end_time);

  let totalDuration = active.duration_minutes;
  let elapsedMinutes = 0;

  if (startMin <= endMin) {
    elapsedMinutes = Math.max(0, currentMinute - startMin);
  } else {
    // Cross midnight
    if (currentMinute >= startMin) {
      elapsedMinutes = currentMinute - startMin;
    } else {
      elapsedMinutes = (1440 - startMin) + currentMinute;
    }
  }

  const minutesRemaining = Math.max(0, totalDuration - elapsedMinutes);
  const percentElapsed = Math.min(100, Math.round((elapsedMinutes / totalDuration) * 100));

  return {
    activeBlock: active,
    nextBlock: next,
    minutesRemaining,
    percentElapsed,
  };
}

export interface RoutineAggregates {
  totalBlocks: number;
  completedBlocks: number;
  completionRate: number;
  workMinutes: number;
  officeMinutes: number;
  studyMinutes: number;
  breakMinutes: number;
  sleepMinutes: number;
  totalXpAvailable: number;
  earnedXp: number;
  isFullRoutineCompleted: boolean;
}

export function computeRoutineAggregates(blocks: RoutineBlock[]): RoutineAggregates {
  const totalBlocks = blocks.length;
  const completedBlocks = blocks.filter((b) => b.is_completed).length;
  const completionRate = totalBlocks > 0 ? Math.round((completedBlocks / totalBlocks) * 100) : 0;

  let workMinutes = 0;
  let officeMinutes = 0;
  let studyMinutes = 0;
  let breakMinutes = 0;
  let sleepMinutes = 0;

  let totalXpAvailable = 0;
  let earnedXp = 0;

  for (const b of blocks) {
    totalXpAvailable += b.xp_reward;
    if (b.is_completed) {
      earnedXp += b.xp_reward;
    }

    switch (b.activity_type) {
      case "Work":
      case "Trading":
        workMinutes += b.duration_minutes;
        break;
      case "Office":
      case "Education":
        officeMinutes += b.duration_minutes;
        break;
      case "Study":
      case "Knowledge":
        studyMinutes += b.duration_minutes;
        break;
      case "Break":
      case "Spiritual":
      case "Recharge":
        breakMinutes += b.duration_minutes;
        break;
      case "Sleep":
        sleepMinutes += b.duration_minutes;
        break;
      default:
        breakMinutes += b.duration_minutes;
    }
  }

  const isFullRoutineCompleted = totalBlocks > 0 && completedBlocks === totalBlocks;
  if (isFullRoutineCompleted) {
    earnedXp += 10; // +10 XP bonus for completing 100% of daily routine
  }

  return {
    totalBlocks,
    completedBlocks,
    completionRate,
    workMinutes,
    officeMinutes,
    studyMinutes,
    breakMinutes,
    sleepMinutes,
    totalXpAvailable,
    earnedXp,
    isFullRoutineCompleted,
  };
}

/**
 * Calculates duration in minutes between start time and end time (format: HH:MM).
 * Handles cross-midnight scenarios gracefully.
 */
export function calculateDurationMinutes(startTime: string, endTime: string): number {
  const startMin = timeStringToMinutes(startTime);
  const endMin = timeStringToMinutes(endTime);

  if (endMin >= startMin) {
    return endMin - startMin;
  }
  // Cross-midnight
  return 1440 - startMin + endMin;
}

export const ROUTINE_ACTIVITY_TYPES = [
  "Spiritual",
  "Health",
  "Work",
  "Office",
  "Study",
  "Break",
  "Knowledge",
  "Trading",
  "Sleep",
  "Education",
  "Recharge",
] as const;

export type RoutineActivityType = (typeof ROUTINE_ACTIVITY_TYPES)[number];

export const ROUTINE_ICONS = [
  "Sunrise",
  "Dumbbell",
  "Laptop",
  "Briefcase",
  "Coffee",
  "BookOpen",
  "Brain",
  "Utensils",
  "TrendingUp",
  "Moon",
  "GraduationCap",
  "Users",
  "Clock",
  "Zap",
] as const;

