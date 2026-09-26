import React from "react";
import Link from "next/link";
import { Sparkles, ShieldCheck } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex flex-col justify-between items-center relative overflow-hidden bg-[var(--bg-base)] px-4 py-8 select-none">
      {/* Ambient background glows */}
      <div className="absolute top-[-15%] left-[20%] w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[20%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[350px] h-[350px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Header Logo */}
      <header className="relative z-10 pt-4 flex flex-col items-center">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 flex items-center justify-center shadow-xl shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-300">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-black tracking-wider text-xl bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              LIFEQUEST
            </span>
            <span className="text-[11px] uppercase font-bold tracking-widest text-indigo-400">
              Personal Life OS
            </span>
          </div>
        </Link>
      </header>

      {/* Center Auth Card Container */}
      <main className="relative z-10 w-full max-w-md my-auto py-8">
        {children}
      </main>

      {/* Bottom Footer Security Badge */}
      <footer className="relative z-10 pb-2 flex items-center justify-center gap-2 text-xs text-[var(--text-muted)]">
        <ShieldCheck className="h-4 w-4 text-emerald-400" />
        <span>End-to-End Row Level Security &middot; Isolated Multi-Tenant PostgreSQL</span>
      </footer>
    </div>
  );
}
