/**
 * Tactile Haptic Vibration Engine for LifeQuest.
 * Invokes navigator.vibrate with tailored vibration patterns on supported devices.
 */

export type HapticType = "light" | "medium" | "heavy" | "success" | "warning" | "levelUp";

const HAPTIC_PATTERNS: Record<HapticType, number | number[]> = {
  light: 12,
  medium: 25,
  heavy: 45,
  success: [15, 30, 20],
  warning: [30, 40, 30],
  levelUp: [30, 40, 30, 50, 60],
};

export function triggerHaptic(type: HapticType = "light") {
  if (typeof window === "undefined") return;
  if (!("vibrate" in navigator)) return;

  try {
    const pattern = HAPTIC_PATTERNS[type];
    navigator.vibrate(pattern);
  } catch {
    // Vibrate may be restricted or unsupported on some browsers
  }
}
