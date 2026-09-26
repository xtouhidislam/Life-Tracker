import React from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { NotificationProvider } from "@/components/providers/NotificationProvider";
import { HotkeyProvider } from "@/components/providers/HotkeyProvider";
import { PwaInstallBanner } from "@/components/pwa/PwaInstallBanner";
import { OfflineIndicator } from "@/components/pwa/OfflineIndicator";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NotificationProvider>
      <HotkeyProvider>
        <div className="min-h-screen flex bg-[var(--bg-base)] text-[var(--text-primary)]">
          {/* Offline Network Status Indicator */}
          <OfflineIndicator />

          {/* Desktop Fixed Sidebar */}
          <Sidebar />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0">
            <Topbar />

            <main className="flex-1 p-4 md:p-8 max-w-[1500px] w-full mx-auto pb-24 md:pb-8">
              {children}
            </main>

            {/* Mobile Sticky Bottom Nav */}
            <MobileNav />
          </div>

          {/* PWA Home Screen Installation Prompt Banner */}
          <PwaInstallBanner />
        </div>
      </HotkeyProvider>
    </NotificationProvider>
  );
}
