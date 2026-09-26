import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || null;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || null;

  let dbConnection = "unknown";
  let dbError = null;

  try {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from("achievements")
      .select("*", { count: "exact", head: true });
    
    if (error) {
      dbConnection = "error";
      dbError = error.message;
    } else {
      dbConnection = "connected";
    }
  } catch (err: any) {
    dbConnection = "failed";
    dbError = err?.message || String(err);
  }

  return NextResponse.json({
    status: "ok",
    hasSupabaseUrl: Boolean(supabaseUrl && !supabaseUrl.includes("placeholder")),
    supabaseHost: supabaseUrl ? new URL(supabaseUrl).host : null,
    hasAnonKey: Boolean(anonKey && !anonKey.includes("placeholder")),
    dbConnection,
    dbError,
  });
}
