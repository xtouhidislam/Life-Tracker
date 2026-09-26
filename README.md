# LifeQuest — Personal Life OS

> A full-stack, gamified life management system built with Next.js 16, Supabase, and TypeScript.

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router, Server Actions, Turbopack) |
| **Language** | TypeScript 5 (strict mode) |
| **Styling** | Tailwind CSS v4 + Glassmorphism design system |
| **Animation** | Framer Motion 13 |
| **Backend / Database** | Supabase (PostgreSQL 15 + Auth + Realtime + RLS) |
| **State** | Zustand (client) + React Server Components (server) |
| **Validation** | Zod v4 (server-side schema enforcement) |
| **Deployment** | Vercel (edge-compatible) |

---

## 🚀 Modules

| Module | Route | Description |
|---|---|---|
| 🏠 Today | `/today` | Command Center — daily execution queue |
| ✅ Tasks | `/tasks` | Task management with XP gamification |
| 📅 Calendar | `/calendar` | Month / Week / Day views |
| 🔥 Habits | `/habits` | Streak tracking + heatmaps |
| 🌅 Routine | `/routine` | Weekday / Weekend routine timeline |
| 🗺️ Roadmap | `/roadmap` | 12-month visual goal tree |
| 🎯 Focus | `/focus` | Pomodoro deep work timer |
| 💰 Expenses | `/expenses` | Budget tracker (BDT ৳) |
| 📊 Overview | `/overview` | Long-term analytics |
| ⚙️ Settings | `/settings` | Profile & preferences |

---

## 🛠️ Local Development

### Prerequisites
- Node.js 20+
- A [Supabase](https://supabase.com) project

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/life-tracker.git
cd life-tracker
npm install
```

### 2. Configure Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Run Database Migrations

In your Supabase dashboard → **SQL Editor**, execute:
`supabase/migrations/20260926000000_phase2_init_schema.sql`

This creates all 18 tables, RLS policies, triggers, and indexes.

### 4. Start Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 🌐 Deployment (Vercel)

### Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "feat: LifeQuest v1.0.0"
git remote add origin https://github.com/YOUR_USERNAME/life-tracker.git
git push -u origin main
```

### Step 2 — Import on Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Add **Environment Variables** in the Vercel dashboard:

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |

4. Click **Deploy** ✅

### Step 3 — Configure Supabase Auth Redirect URLs

In Supabase dashboard → **Authentication → URL Configuration**:

- **Site URL**: `https://your-app.vercel.app`
- **Redirect URLs**: `https://your-app.vercel.app/auth/callback`

---

## 🔐 Security

- **HttpOnly cookies** — Auth tokens never exposed to JavaScript
- **Row Level Security** — Every table enforces `auth.uid() = user_id`
- **Zod validation** — All server actions validate input before DB writes
- **Rate limiting** — Sliding window limits on all write actions
- **OWASP headers** — X-Frame-Options, X-Content-Type-Options, Referrer-Policy
- **Open redirect protection** — Redirect URLs sanitized via allowlist

---

## 📁 Project Structure

```
Life-Tracker/
├── app/
│   ├── (auth)/         # Login, Signup, Auth callback
│   ├── (dashboard)/    # All 9 protected feature routes
│   ├── actions/        # Zod-validated Server Actions
│   └── globals.css     # Design system + CSS variables
├── components/
│   ├── ui/             # Atomic components (Button, Card, Badge...)
│   ├── layout/         # Sidebar, Topbar, MobileNav
│   └── [feature]/      # Feature-specific components
├── lib/
│   ├── supabase/       # SSR client, server client, proxy
│   ├── security/       # Rate limiter
│   └── validation/     # Zod schemas + XP verifier
├── supabase/
│   └── migrations/     # SQL migration files
└── docs/               # Architecture, DB schema, design system
```

---

## 📄 License

Private — personal productivity tool.
