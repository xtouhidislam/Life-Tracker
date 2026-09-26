"use client";

import React, { useState, useEffect } from "react";
import { Wifi, WifiOff } from "lucide-react";

export function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(false);
  const [showRestored, setShowRestored] = useState(false);

  useEffect(() => {
    setIsOffline(!navigator.onLine);

    const handleOffline = () => {
      setIsOffline(true);
      setShowRestored(false);
    };

    const handleOnline = () => {
      setIsOffline(false);
      setShowRestored(true);
      const timer = setTimeout(() => setShowRestored(false), 3500);
      return () => clearTimeout(timer);
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  if (!isOffline && !showRestored) {
    return null;
  }

  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-3 duration-200 pointer-events-none">
      {isOffline ? (
        <div className="px-3.5 py-1.5 rounded-full bg-zinc-900 text-white shadow-lg flex items-center gap-2 text-xs font-semibold border border-zinc-700">
          <WifiOff className="h-3.5 w-3.5 text-amber-400 shrink-0" />
          <span>Offline Mode Active — Running on Local Cache</span>
        </div>
      ) : (
        <div className="px-3.5 py-1.5 rounded-full bg-[#154D38] text-white shadow-lg flex items-center gap-2 text-xs font-semibold border border-emerald-600">
          <Wifi className="h-3.5 w-3.5 text-emerald-300 shrink-0" />
          <span>Connection Restored — Synced</span>
        </div>
      )}
    </div>
  );
}
