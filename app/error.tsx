"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="h-14 w-14 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center mb-5 text-rose-400">
        <AlertTriangle className="h-7 w-7" />
      </div>

      <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
        System Anomaly Detected
      </h2>
      <p className="text-sm text-[var(--text-muted)] max-w-md mb-6">
        {error.message || "An unexpected error occurred while loading this module."}
      </p>

      <Button onClick={() => reset()} variant="secondary" className="gap-2">
        <RefreshCw className="h-4 w-4" />
        <span>Try Again</span>
      </Button>
    </div>
  );
}
