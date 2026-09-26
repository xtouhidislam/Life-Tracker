"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { RecordFocusSessionSchema, verifyAndClampXp } from "@/lib/validation/schemas";
import { checkRateLimit } from "@/lib/security/rate-limiter";

export interface FocusSessionRecord {
  id: string;
  user_id?: string;
  task_id: string | null;
  task_title?: string;
  duration_seconds: number;
  environment_sound: string | null;
  notes: string | null;
  xp_earned: number;
  started_at: string;
  completed_at: string;
}

export async function getFocusSessionsAction() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const todayStr = new Date().toISOString().split("T")[0];

    if (!user) {
      return {
        success: true,
        sessions: [],
        totalMinutesToday: 0,
        totalSessionsToday: 0,
        totalXpToday: 0,
      };
    }

    const { data: dbSessions } = await supabase
      .from("focus_sessions")
      .select("*, tasks(title)")
      .eq("user_id", user.id)
      .gte("completed_at", `${todayStr}T00:00:00Z`)
      .order("completed_at", { ascending: false });

    if (dbSessions && dbSessions.length > 0) {
      const sessions: FocusSessionRecord[] = dbSessions.map((s: any) => ({
        id: s.id,
        user_id: s.user_id,
        task_id: s.task_id,
        task_title: s.tasks?.title || "Deep Work Sprint",
        duration_seconds: s.duration_seconds,
        environment_sound: s.environment_sound,
        notes: s.notes,
        xp_earned: s.xp_earned,
        started_at: s.started_at,
        completed_at: s.completed_at,
      }));

      const totalMinutes = Math.round(
        sessions.reduce((acc, s) => acc + s.duration_seconds, 0) / 60
      );
      const totalXp = sessions.reduce((acc, s) => acc + s.xp_earned, 0);

      return {
        success: true,
        sessions,
        totalMinutesToday: totalMinutes,
        totalSessionsToday: sessions.length,
        totalXpToday: totalXp,
      };
    }

    return {
      success: true,
      sessions: [],
      totalMinutesToday: 0,
      totalSessionsToday: 0,
      totalXpToday: 0,
    };
  } catch (error) {
    console.error("Error in getFocusSessionsAction:", error);
    return {
      success: true,
      sessions: [],
      totalMinutesToday: 0,
      totalSessionsToday: 0,
      totalXpToday: 0,
    };
  }
}

export async function recordFocusSessionAction(
  taskId: string | null,
  durationSeconds: number,
  environmentSound: string = "forest",
  notes: string | null = null,
  taskTitle: string = "Deep Work Focus Session"
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // --- INPUT VALIDATION (Zod) ---
    const parsed = RecordFocusSessionSchema.safeParse({
      taskId,
      durationSeconds,
      environmentSound,
      notes,
      taskTitle,
    });

    if (!parsed.success) {
      return {
        success: false,
        earnedXp: 0,
        error: parsed.error.issues[0]?.message || "Invalid focus session input",
      };
    }

    const safe = parsed.data;

    // --- SERVER-AUTHORITATIVE XP (prevents client spoofing) ---
    const earnedXp = verifyAndClampXp("focus", 0, {
      durationSeconds: safe.durationSeconds,
    });

    const nowIso = new Date().toISOString();
    const startedIso = new Date(Date.now() - safe.durationSeconds * 1000).toISOString();
    const todayStr = nowIso.split("T")[0];

    if (!user) {
      return { success: true, earnedXp };
    }

    // --- RATE LIMITING: 20 focus sessions per hour ---
    const rl = checkRateLimit("record_focus", user.id, 20, 3_600_000);
    if (!rl.allowed) {
      return {
        success: false,
        earnedXp: 0,
        error: `Too many focus sessions recorded. Try again in ${rl.retryAfterSeconds}s.`,
      };
    }

    // 1. Insert focus session record
    await supabase.from("focus_sessions").insert({
      user_id: user.id,
      task_id: safe.taskId || null,
      duration_seconds: safe.durationSeconds,
      environment_sound: safe.environmentSound,
      notes: safe.notes,
      xp_earned: earnedXp,
      started_at: startedIso,
      completed_at: nowIso,
    });

    // 2. Insert XP event
    await supabase.from("xp_events").insert({
      user_id: user.id,
      xp_amount: earnedXp,
      source_type: "focus",
      source_id: safe.taskId || "focus-timer",
      description: `Completed ${Math.round(safe.durationSeconds / 60)}m focus session: ${safe.taskTitle}`,
    });

    // 3. Update user stats
    const { data: stats } = await supabase
      .from("user_stats")
      .select("total_xp, current_level, total_focus_minutes")
      .eq("user_id", user.id)
      .single();

    if (stats) {
      const nextXp = (stats.total_xp || 0) + earnedXp;
      const nextLevel = Math.floor(Math.sqrt(nextXp / 50)) + 1;
      const nextFocusMinutes =
        (stats.total_focus_minutes || 0) + Math.round(safe.durationSeconds / 60);

      await supabase
        .from("user_stats")
        .update({
          total_xp: nextXp,
          current_level: nextLevel,
          total_focus_minutes: nextFocusMinutes,
          last_active_date: todayStr,
        })
        .eq("user_id", user.id);
    }

    revalidatePath("/focus");
    revalidatePath("/today");
    return { success: true, earnedXp };
  } catch (error) {
    console.error("Error in recordFocusSessionAction:", error);
    const earnedXp = verifyAndClampXp("focus", 0, { durationSeconds });
    return { success: true, earnedXp };
  }
}

