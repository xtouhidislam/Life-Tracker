"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { KeyboardShortcutsModal } from "@/components/ui/KeyboardShortcutsModal";

interface HotkeyContextType {
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  openShortcuts: () => void;
  closeShortcuts: () => void;
}

const HotkeyContext = createContext<HotkeyContextType | null>(null);

export function useHotkeys() {
  const context = useContext(HotkeyContext);
  if (!context) {
    throw new Error("useHotkeys must be used within a HotkeyProvider");
  }
  return context;
}

export function HotkeyProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [leaderKeyActive, setLeaderKeyActive] = useState(false);

  const openCommandPalette = useCallback(() => setCommandPaletteOpen(true), []);
  const closeCommandPalette = useCallback(() => setCommandPaletteOpen(false), []);
  const openShortcuts = useCallback(() => setShortcutsOpen(true), []);
  const closeShortcuts = useCallback(() => setShortcutsOpen(false), []);

  useEffect(() => {
    let leaderTimer: NodeJS.Timeout;

    function handleKeyDown(e: KeyboardEvent) {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      const isInput =
        activeTag === "input" ||
        activeTag === "textarea" ||
        (document.activeElement as HTMLElement)?.isContentEditable;

      // ⌘+K or Ctrl+K for Command Palette (works even from inputs)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
        return;
      }

      // If user is actively typing in an input, do not intercept regular letters
      if (isInput) return;

      // '?' opens Keyboard Shortcuts reference
      if (e.key === "?" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setShortcutsOpen((prev) => !prev);
        return;
      }

      // 'G' initiates sequential navigation combo
      if (e.key.toLowerCase() === "g" && !leaderKeyActive) {
        setLeaderKeyActive(true);
        clearTimeout(leaderTimer);
        leaderTimer = setTimeout(() => setLeaderKeyActive(false), 1200);
        return;
      }

      // If 'G' was pressed, handle second key
      if (leaderKeyActive) {
        setLeaderKeyActive(false);
        clearTimeout(leaderTimer);

        switch (e.key.toLowerCase()) {
          case "t":
            e.preventDefault();
            router.push("/today");
            break;
          case "k":
            e.preventDefault();
            router.push("/tasks");
            break;
          case "c":
            e.preventDefault();
            router.push("/calendar");
            break;
          case "h":
            e.preventDefault();
            router.push("/habits");
            break;
          case "r":
            e.preventDefault();
            router.push("/routine");
            break;
          case "m":
            e.preventDefault();
            router.push("/roadmap");
            break;
          case "f":
            e.preventDefault();
            router.push("/focus");
            break;
          case "e":
            e.preventDefault();
            router.push("/expenses");
            break;
          case "a":
            e.preventDefault();
            router.push("/overview");
            break;
          case "s":
            e.preventDefault();
            router.push("/settings");
            break;
        }
        return;
      }

      // Direct single key actions
      if (e.key.toLowerCase() === "n") {
        e.preventDefault();
        router.push("/tasks");
      } else if (e.key.toLowerCase() === "f") {
        e.preventDefault();
        router.push("/focus");
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(leaderTimer);
    };
  }, [leaderKeyActive, router]);

  return (
    <HotkeyContext.Provider
      value={{
        openCommandPalette,
        closeCommandPalette,
        openShortcuts,
        closeShortcuts,
      }}
    >
      {children}

      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={closeCommandPalette}
        onOpenShortcuts={openShortcuts}
      />

      <KeyboardShortcutsModal
        isOpen={shortcutsOpen}
        onClose={closeShortcuts}
      />
    </HotkeyContext.Provider>
  );
}
