"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { verifyAndClampXp } from "@/lib/validation/schemas";
import {
  MonthlyMilestone,
  DEFAULT_ROADMAP_MONTHS,
} from "@/lib/roadmap/roadmap-data";

export async function getRoadmapAction() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: true, months: DEFAULT_ROADMAP_MONTHS };
    }

    // Check if user has goals or milestones in DB
    const { data: dbMilestones } = await supabase
      .from("goal_milestones")
      .select("*")
      .order("target_month", { ascending: true });

    if (dbMilestones && dbMilestones.length > 0) {
      const milestoneMap = new Map(dbMilestones.map((m) => [m.target_month, m]));

      const merged = DEFAULT_ROADMAP_MONTHS.map((month) => {
        const dbM = milestoneMap.get(month.month);
        if (dbM) {
          return {
            ...month,
            is_completed: dbM.is_completed,
            status: dbM.is_completed
              ? ("completed" as const)
              : (dbM.status as any) || month.status,
          };
        }
        return month;
      });

      return { success: true, months: merged };
    }

    return { success: true, months: DEFAULT_ROADMAP_MONTHS };
  } catch (error) {
    console.error("Error in getRoadmapAction:", error);
    return { success: true, months: DEFAULT_ROADMAP_MONTHS };
  }
}

export async function toggleMilestoneAction(
  monthNumber: number,
  isCompleted: boolean,
  xpReward: number = 100,
  title: string = "Monthly Milestone"
) {
  // Server-authoritative XP: monthly milestones award 100 XP
  const safeXp = verifyAndClampXp("roadmap", xpReward, { milestoneTier: "month" });
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: true, earnedXp: isCompleted ? xpReward : 0 };
    }

    const todayStr = new Date().toISOString().split("T")[0];

    // Find or create default goal
    const { data: goals } = await supabase
      .from("goals")
      .select("id")
      .eq("user_id", user.id)
      .limit(1);

    let goalId = goals && goals.length > 0 ? goals[0].id : null;

    if (!goalId) {
      const { data: newGoal } = await supabase
        .from("goals")
        .insert({
          user_id: user.id,
          title: "Zenin AI · AI Implementation Engineer Track ($60K/yr)",
          description: "12-Month technical skill tree & multi-track career progression",
          track: "career",
          target_year: 2026,
          status: "in_progress",
          progress_percentage: 18,
        })
        .select()
        .single();

      if (newGoal) {
        goalId = newGoal.id;
      }
    }

    if (goalId) {
      // Upsert milestone record
      await supabase.from("goal_milestones").upsert(
        {
          goal_id: goalId,
          title: `Month ${monthNumber}: ${title}`,
          target_month: monthNumber,
          status: isCompleted ? "completed" : "in_progress",
          xp_reward: safeXp,
          is_completed: isCompleted,
          completed_at: isCompleted ? new Date().toISOString() : null,
        },
        { onConflict: "goal_id, target_month" }
      );
    }

    if (isCompleted) {
      // Award XP event
      await supabase.from("xp_events").insert({
        user_id: user.id,
        xp_amount: safeXp,
        source_type: "roadmap",
        source_id: `month-${monthNumber}`,
        description: `Unlocked Roadmap Milestone: Month ${monthNumber} — ${title}`,
      });

      // Update user stats
      const { data: stats } = await supabase
        .from("user_stats")
        .select("total_xp, current_level")
        .eq("user_id", user.id)
        .single();

      if (stats) {
        const nextXp = (stats.total_xp || 0) + xpReward;
        const nextLevel = Math.floor(Math.sqrt(nextXp / 50)) + 1;
        await supabase
          .from("user_stats")
          .update({
            total_xp: nextXp,
            current_level: nextLevel,
            last_active_date: todayStr,
          })
          .eq("user_id", user.id);
      }
    }

    revalidatePath("/roadmap");
    revalidatePath("/today");
    return { success: true, earnedXp: isCompleted ? safeXp : 0 };
  } catch (error) {
    console.error("Error in toggleMilestoneAction:", error);
    return { success: true, earnedXp: isCompleted ? safeXp : 0 };
  }
}

export async function toggleWeeklyDeliverableAction(
  monthNumber: number,
  weekNumber: number,
  isCompleted: boolean,
  xpReward: number = 25,
  title: string = "Weekly Build"
) {
  // Server-authoritative XP: weekly deliverables award 25 XP
  const safeXp = verifyAndClampXp("roadmap", xpReward, { milestoneTier: "week" });
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: true, earnedXp: isCompleted ? safeXp : 0 };
    }

    const todayStr = new Date().toISOString().split("T")[0];

    if (isCompleted) {
      await supabase.from("xp_events").insert({
        user_id: user.id,
        xp_amount: safeXp,
        source_type: "roadmap",
        source_id: `month-${monthNumber}-week-${weekNumber}`,
        description: `Shipped Weekly Deliverable: Week ${weekNumber} — ${title}`,
      });

      const { data: stats } = await supabase
        .from("user_stats")
        .select("total_xp, current_level")
        .eq("user_id", user.id)
        .single();

      if (stats) {
        const nextXp = (stats.total_xp || 0) + xpReward;
        const nextLevel = Math.floor(Math.sqrt(nextXp / 50)) + 1;
        await supabase
          .from("user_stats")
          .update({
            total_xp: nextXp,
            current_level: nextLevel,
            last_active_date: todayStr,
          })
          .eq("user_id", user.id);
      }
    }

    revalidatePath("/roadmap");
    revalidatePath("/today");
    return { success: true, earnedXp: isCompleted ? safeXp : 0 };
  } catch (error) {
    console.error("Error in toggleWeeklyDeliverableAction:", error);
    return { success: true, earnedXp: isCompleted ? safeXp : 0 };
  }
}
