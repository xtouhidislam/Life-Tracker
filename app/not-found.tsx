import React from "react";
import Link from "next/link";
import { Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex flex-col items-center justify-center p-6 text-center">
      <div className="h-16 w-16 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center mb-6 glow-violet">
        <Sparkles className="h-8 w-8 text-indigo-400" />
      </div>

      <h1 className="text-5xl font-black tracking-tight text-white mb-2">404</h1>
      <h2 className="text-xl font-semibold text-[var(--text-secondary)] mb-4">
        Sector Not Found
      </h2>
      <p className="text-sm text-[var(--text-muted)] max-w-md mb-8">
        The command center coordinates you requested do not exist in this sector.
        Return to the primary dashboard to resume your mission.
      </p>

      <Link href="/today">
        <Button variant="primary" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Today</span>
        </Button>
      </Link>
    </div>
  );
}
