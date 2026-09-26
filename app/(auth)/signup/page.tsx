"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  User as UserIcon,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Sparkles,
} from "lucide-react";
import { signupAction } from "@/app/actions/auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/today";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Simple password strength calculation
  const getPasswordStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 1;
    return score; // 0 to 4
  };

  const strength = getPasswordStrength();
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = ["", "bg-rose-500", "bg-amber-500", "bg-blue-500", "bg-emerald-500"];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);

    startTransition(async () => {
      const res = await signupAction(null, formData);
      if (res?.error) {
        setErrorMessage(res.error);
      } else if (res?.success) {
        setSuccessMessage(
          res.message || "Registration successful! You may now sign in or check your email."
        );
      }
    });
  };

  return (
    <Card className="glass-card border border-[var(--border-strong)] p-7 md:p-8 shadow-2xl relative">
      {/* Accent Header Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />

      <div className="text-center mb-6">
        <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)] flex items-center justify-center gap-2">
          <span>Create Character</span>
          <Sparkles className="h-5 w-5 text-emerald-400" />
        </h2>
        <p className="text-xs text-[var(--text-secondary)] mt-1.5">
          Initialize your Level 1 profile, skill trees, and quest logs.
        </p>
      </div>

      {/* Success banner */}
      {successMessage && (
        <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2.5 text-xs text-emerald-300 animate-in fade-in duration-200">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
          <div className="flex-1 font-medium">{successMessage}</div>
        </div>
      )}

      {/* Error alert */}
      {errorMessage && (
        <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-start gap-2.5 text-xs text-rose-300 animate-in fade-in duration-200">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
          <div className="flex-1">{errorMessage}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider">
            Player Name / Call-sign
          </label>
          <div className="relative">
            <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Toukir Ahmed"
              autoComplete="name"
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-mint)] focus:ring-1 focus:ring-[var(--accent-mint)] transition-all"
            />
          </div>
        </div>

        {/* Email */}
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
              placeholder="toukir@zenin.ai"
              autoComplete="email"
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-mint)] focus:ring-1 focus:ring-[var(--accent-mint)] transition-all"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider">
            Password (min 6 characters)
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              autoComplete="new-password"
              className="w-full h-11 pl-10 pr-11 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-mint)] focus:ring-1 focus:ring-[var(--accent-mint)] transition-all"
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

          {/* Password strength bar */}
          {password.length > 0 && (
            <div className="mt-2 space-y-1">
              <div className="flex gap-1.5 h-1 w-full bg-[var(--bg-subtle)] rounded-full overflow-hidden">
                <div className={`h-full flex-1 rounded-full ${strength >= 1 ? strengthColors[strength] : "bg-transparent"}`} />
                <div className={`h-full flex-1 rounded-full ${strength >= 2 ? strengthColors[strength] : "bg-transparent"}`} />
                <div className={`h-full flex-1 rounded-full ${strength >= 3 ? strengthColors[strength] : "bg-transparent"}`} />
                <div className={`h-full flex-1 rounded-full ${strength >= 4 ? strengthColors[strength] : "bg-transparent"}`} />
              </div>
              <div className="text-[10px] text-right font-medium text-[var(--text-muted)]">
                Strength: <span className="text-[var(--text-secondary)]">{strengthLabels[strength]}</span>
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
            <input
              type={showPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••••••"
              autoComplete="new-password"
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-mint)] focus:ring-1 focus:ring-[var(--accent-mint)] transition-all"
            />
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isPending}
          className="w-full h-11 font-bold text-sm bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 hover:from-emerald-500 hover:to-teal-400 text-white shadow-lg shadow-emerald-500/25 mt-3 transition-all flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Initializing Player Profile...</span>
            </>
          ) : (
            <>
              <span>Begin Quest</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      {/* Footer Switcher */}
      <div className="text-center mt-6 text-xs text-[var(--text-secondary)] pt-4 border-t border-[var(--border-subtle)]">
        Already have an active quest?{" "}
        <Link
          href={`/login${redirectTarget !== "/today" ? `?redirect=${encodeURIComponent(redirectTarget)}` : ""}`}
          className="font-bold text-emerald-400 hover:text-emerald-300 hover:underline transition-colors"
        >
          Sign In &rarr;
        </Link>
      </div>
    </Card>
  );
}
