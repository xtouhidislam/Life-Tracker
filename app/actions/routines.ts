"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { verifyAndClampXp } from "@/lib/validation/schemas";
import {
  RoutineBlock,
  DEFAULT_WEEKDAY_BLOCKS,
  DEFAULT_WEEKEND_BLOCKS,
} from "@/lib/routines/routine-utils";

export async function getRoutinesAction(type: "weekday" | "weekend" = "weekday") {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const baseBlocks = type === "weekday" ? DEFAULT_WEEKDAY_BLOCKS : DEFAULT_WEEKEND_BLOCKS;

    if (!user) {
      return { success: true, blocks: [], isCustom: false, isGuest: true };
    }

    const todayStr = new Date().toISOString().split("T")[0];

    // Check if the user has custom routines in database
    const { data: dbRoutines } = await supabase
      .from("routines")
      .select("id, name, type")
      .eq("user_id", user.id)
      .eq("type", type)
      .limit(1);

    let activeRoutineId: string | null = null;
    let itemsToUse: RoutineBlock[] = [...baseBlocks];

    if (dbRoutines && dbRoutines.length > 0) {
      activeRoutineId = dbRoutines[0].id;
      const { data: dbItems } = await supabase
        .from("routine_items")
        .select("*")
        .eq("routine_id", activeRoutineId)
        .order("order_index", { ascending: true });

      if (dbItems && dbItems.length > 0) {
        itemsToUse = dbItems.map((item, idx) => ({
          id: item.id,
          routine_id: item.routine_id,
          num: idx + 1,
          title: item.title,
          activity_type: (item.description as any) || "Work",
          start_time: item.start_time.slice(0, 5),
          end_time: item.end_time.slice(0, 5),
          duration_minutes: item.duration_minutes,
          energy_level: item.energy_level || "medium",
          description: item.description || "",
          icon_name: item.icon || "Clock",
          xp_reward: item.xp_reward || 5,
          is_completed: false,
        }));
      }
    }

    // Fetch today's completions
    const { data: completions } = await supabase
      .from("routine_completions")
      .select("routine_item_id, completed_at")
      .eq("user_id", user.id)
      .eq("completion_date", todayStr);

    const completedSet = new Set(completions?.map((c) => c.routine_item_id) || []);

    const blocksWithCompletions = itemsToUse.map((block) => ({
      ...block,
      is_completed: completedSet.has(block.id),
      completed_at: completedSet.has(block.id) ? todayStr : null,
    }));

    return {
      success: true,
      blocks: blocksWithCompletions,
      isCustom: Boolean(dbRoutines && dbRoutines.length > 0),
    };
  } catch (error) {
    console.error("Error in getRoutinesAction:", error);
    const fallback = type === "weekday" ? DEFAULT_WEEKDAY_BLOCKS : DEFAULT_WEEKEND_BLOCKS;
    return { success: true, blocks: fallback, isCustom: false };
  }
}

export async function toggleRoutineBlockCompletionAction(
  routineItemId: string,
  completed: boolean,
  xpReward: number = 5,
  title: string = "Routine Block"
) {
  // Server-authoritative XP: clamp client-supplied value
  const safeXp = verifyAndClampXp("routine", xpReward);
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const todayStr = new Date().toISOString().split("T")[0];

    if (!user) {
      // Local fallback mode for guest/demo preview
      return { success: true, earnedXp: completed ? safeXp : 0 };
    }

    if (completed) {
      // Record completion
      await supabase.from("routine_completions").upsert(
        {
          routine_id: "00000000-0000-0000-0000-000000000000", // Default routine placeholder if unassigned
          routine_item_id: routineItemId.startsWith("wd-") || routineItemId.startsWith("we-") ? null : routineItemId,
          user_id: user.id,
          completion_date: todayStr,
          completed_at: new Date().toISOString(),
          xp_awarded: safeXp,
        },
        { onConflict: "routine_item_id, completion_date" }
      );

      // Award XP event
      await supabase.from("xp_events").insert({
        user_id: user.id,
        xp_amount: safeXp,
        source_type: "routine",
        source_id: routineItemId,
        description: `Completed routine block: ${title}`,
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
    } else {
      // Remove completion
      await supabase
        .from("routine_completions")
        .delete()
        .eq("user_id", user.id)
        .eq("completion_date", todayStr)
        .eq("routine_item_id", routineItemId);
    }

    revalidatePath("/routine");
    revalidatePath("/today");
    return { success: true, earnedXp: completed ? safeXp : 0 };
  } catch (error) {
    console.error("Error in toggleRoutineBlockCompletionAction:", error);
    return { success: true, earnedXp: completed ? safeXp : 0 };
  }
}
