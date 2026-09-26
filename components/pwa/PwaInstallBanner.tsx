"use client";

import React, { useState, useEffect } from "react";
import { Download, X, Smartphone, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PwaInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already running as standalone PWA
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true
    ) {
      setIsInstalled(true);
      return;
    }

    // Check if user previously dismissed
    const dismissed = localStorage.getItem("lifequest_pwa_dismissed");
    if (dismissed) {
      setIsDismissed(true);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setIsInstalled(true);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem("lifequest_pwa_dismissed", "true");
  };

  if (!deferredPrompt || isDismissed || isInstalled) {
    return null;
  }

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 max-w-sm w-full p-4 rounded-3xl bg-white border border-zinc-200/90 shadow-2xl animate-in slide-in-from-bottom-4 duration-300 select-none">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-2xl bg-[#154D38] flex items-center justify-center shrink-0 shadow-xs">
            <div className="h-4 w-4 rounded-full border-2 border-emerald-300 flex items-center justify-center">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-zinc-900">Install LifeQuest</span>
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-[#E8F5E9] text-[#154D38]">
                PWA
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 leading-snug">
              Install to home screen or desktop for fullscreen performance, offline cache, and instant reminders.
            </p>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className="h-6 w-6 rounded-full hover:bg-zinc-100 flex items-center justify-center text-zinc-400 hover:text-zinc-600 transition-colors shrink-0"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="flex items-center justify-end gap-2 pt-3 mt-1 border-t border-zinc-100">
        <button
          onClick={handleDismiss}
          className="px-3 py-1.5 rounded-xl text-xs font-semibold text-zinc-500 hover:bg-zinc-50"
        >
          Later
        </button>
        <Button
          size="sm"
          variant="primary"
          onClick={handleInstallClick}
          className="gap-1.5 px-4 text-xs font-bold bg-[#154D38] hover:bg-[#0E3425] text-white shadow-xs"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Install App</span>
        </Button>
      </div>
    </div>
  );
}
