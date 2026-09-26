"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Loader2, Sparkles } from "lucide-react";
import { loginAction } from "@/app/actions/auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/today";
  const urlError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(urlError || null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("redirectUrl", redirectTarget);

    startTransition(async () => {
      const res = await loginAction(null, formData);
      if (res?.error) {
        setErrorMessage(res.error);
      }
    });
  };

  const handleDemoFill = () => {
    setEmail("demo@lifequest.app");
    setPassword("LifeQuest2026!");
    setErrorMessage(null);
  };

  return (
    <Card className="glass-card border border-[var(--border-strong)] p-7 md:p-8 shadow-2xl relative">
      {/* Accent Header Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />

      <div className="text-center mb-6">
        <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
          Welcome Back, Player
        </h2>
        <p className="text-xs text-[var(--text-secondary)] mt-1.5">
          Sign in to access your Command Center, streak counters, and daily quests.
        </p>
      </div>

      {/* Error alert */}
      {errorMessage && (
        <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-start gap-2.5 text-xs text-rose-300 animate-in fade-in duration-200">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
          <div className="flex-1">{errorMessage}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div>
          <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="commander@lifequest.app"
              autoComplete="email"
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-violet)] focus:ring-1 focus:ring-[var(--accent-violet)] transition-all"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
              Password
            </label>
            <span className="text-[11px] text-[var(--accent-violet)] hover:underline cursor-pointer">
              Forgot password?
            </span>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              autoComplete="current-password"
              className="w-full h-11 pl-10 pr-11 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-violet)] focus:ring-1 focus:ring-[var(--accent-violet)] transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-white transition-colors"
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isPending}
          className="w-full h-11 font-bold text-sm bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:from-indigo-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-500/25 mt-2 transition-all flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <span>Enter Command Center</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      {/* Demo Credentials Helper Pill */}
      <div className="mt-5 pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
        <button
          type="button"
          onClick={handleDemoFill}
          className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1.5 transition-colors"
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span>Fill Demo Credentials</span>
        </button>
        <span className="text-[11px] text-[var(--text-muted)]">
          Quick test ready
        </span>
      </div>

      {/* Footer Switcher */}
      <div className="text-center mt-5 text-xs text-[var(--text-secondary)]">
        New to LifeQuest?{" "}
        <Link
          href={`/signup${redirectTarget !== "/today" ? `?redirect=${encodeURIComponent(redirectTarget)}` : ""}`}
          className="font-bold text-indigo-400 hover:text-indigo-300 hover:underline transition-colors"
        >
          Create an Account &rarr;
        </Link>
      </div>
    </Card>
  );
}
