# LifeQuest — Product Specification

## 1. Executive Summary & Vision

**LifeQuest** is an all-in-one, production-quality, gamified personal **Life OS** web application. It integrates daily operational management (habits, tasks, routines, calendar events, focus sessions, and expense tracking) with long-term strategic life direction (goals, milestone roadmaps, skill trees, and multi-horizon analytics).

### Core Philosophy
* **Command Center Experience**: Styled with a dark graphite/charcoal dashboard aesthetic with subtle glassmorphic surfaces, crisp geometric typography, and luminous status indicators. It feels like a high-performance executive dashboard, not a children's cartoon game.
* **Deep Gamification**: Gamification is embedded into the core architectural domain ("Life Activity" pattern) rather than as a cosmetic overlay. Every meaningful action dispatches an immutable completion and XP event.
* **Positive Recovery over Punishment**: The system encourages consistency and bouncing back rather than shame-based penalization. Streaks reflect dedication; missed days trigger clean reset prompts ("Reset complete. Let's get back on track.") instead of destructive penalties.

---

## 2. Core Modules Specification

The application is structured into **9 primary modules**:

### 2.1 🏠 Today / Dashboard (`/today`)
* **Purpose**: Single pane of glass for real-time focus, daily execution, and instant progress feedback.
* **Key Components**:
  * **Header & Hero**: Dynamic time-based greeting ("Good morning, {name} 👋"), current date, daily motivational quote/contextual guidance, and a large circular SVG progress indicator reflecting combined daily completion %.
  * **Quick Stats Strip**: Tasks completed (e.g. 14/18), Habits checked (e.g. 5/6), Focus time logged today (e.g. 1h 45m), Current active streak (e.g. 🔥 14 days), Total daily XP earned.
  * **Today's Action Feed**: Filterable view of pending tasks, due routines, and scheduled events with direct completion checkboxes.
  * **Roadmap Snapshot**: Visual node card showing current major active milestone, % progress, and next concrete target.
  * **Financial Snapshot**: Today's spending summary vs. monthly budget allowance remaining (BDT or chosen currency).
  * **Upcoming Schedule**: Timeline strip showing next meetings, time blocks, and hard deadlines for the next 24 hours.

### 2.2 ✅ Tasks & Calendar (`/tasks`, `/calendar`)
* **Tasks System**:
  * Task creation, editing, scheduling, priority tiers (Low, Medium, High, Urgent), categories (Work, Personal, Health, Finance, Learning), due dates, estimated durations, and difficulty levels (Small +5 XP, Normal +10 XP, Difficult +20 XP, Milestone +50 XP).
  * Recurrence engine: Daily, weekly on specific days, monthly, weekdays only. Recurrence is managed through schedule rules and materialized occurrences rather than uncontrolled pre-generation.
  * Overdue indicators, batch operations, sorting (priority, due date, category, XP).
* **Calendar System**:
  * Seamless multi-view engine: Month grid, Week time-block columns (00:00 - 23:00), and Day timeline view.
  * Visual distinction between timed events, schedule time blocks, and actionable task deadlines.
  * Drag-and-drop or click-to-schedule task time-boxing.
  * Category color coding synced across tasks and calendar.

### 2.3 🔥 Habits (`/habits`)
* **Purpose**: Building sustainable, repeating behaviors with tangible momentum.
* **Key Components**:
  * Habit cards with target frequencies (daily, X times per week, specific weekdays).
  * Check-in actions: Complete (+5 XP), Skip (preserve streak with valid reason), and Missed tracking.
  * Streaks: Current active streak counter, all-time personal best (longest streak).
  * Heatmap Visualization: GitHub-style rolling 30-day and 365-day consistency heatmaps.
  * Consistency % metrics per habit and aggregated category scores.

### 2.4 🌅 Routine (`/routine`)
* **Purpose**: Structured daily rhythms that bookend days and structure deep work.
* **Routine Blocks**:
  * **Morning Routine**: Wake-up ritual, hydration, physical priming, daily alignment.
  * **Work / Study Routine**: Deep work preparation, focused work sprints, deliberate rest pauses.
  * **Evening / Night Routine**: Daily review, shutdown ritual, reading, sleep preparation.
* **Execution Engine**:
  * Step-by-step checklist with estimated durations (countdown timer per routine item), ordered sequence, mandatory vs. optional flags, and routine-completion bonus XP (+10 XP).
  * Completion progress bar, routine streak tracking, and daily reset cycle.

### 2.5 🗺️ Roadmap (`/roadmap`)
* **Purpose**: Visual tree connecting high-level life aspirations to concrete ground-level execution.
* **Visual Node Tree Structure**:
  * Hierarchy: Ultimate Life Vision → Strategic Goals → Milestones → Linked Projects / Tasks / Habits.
  * Node States:
    * `LOCKED`: Dependencies not yet met; semi-transparent with padlock iconography.
    * `AVAILABLE`: Prerequisites satisfied; ready to be activated.
    * `ACTIVE`: Currently being executed; pulsing accent outline.
    * `COMPLETED`: Fully achieved; illuminated glow, checkmark badge, and celebrated milestone XP.
  * Direct bidirectional linkage: Completing linked tasks and maintaining target habits automatically advances parent milestone progress bars.

### 2.6 🎯 Focus Mode (`/focus`)
* **Purpose**: Distraction-free, immersive Pomodoro / Deep Work environment.
* **Key Components**:
  * Configurable timers (Standard 25/5 min, 50/10 min, or custom work/break intervals).
  * Accurate time tracking: Relies on `performance.now()` timestamp deltas to remain 100% accurate across background tab switches, screen locks, and device sleep.
  * Associated Task Selector: Attribute focused hours to specific tasks or roadmap milestones.
  * Visual Environment: Minimalist atmosphere with subtle growth progression (seedling → plant → flourishing tree) or abstract serene particle glow.
  * Session controls: Start, Pause, Resume, Extend, Complete (+10 XP per 25-minute block), or Abandon (no XP awarded).

### 2.7 💰 Expense Tracker (`/expenses`)
* **Purpose**: Clean, pragmatic financial oversight without overwhelming gamification.
* **Key Components**:
  * Monthly budget vs. actual spending gauge.
  * Expense logging: Amount, category (Food, Housing, Utilities, Transport, Tech, Education, Entertainment, Health, Other), date, payment method, optional receipt/notes, and recurring expense tags.
  * Default currency: Bangladeshi Taka (৳ BDT) with configurable global currency options.
  * Spending breakdown donuts, daily expenditure trend charts, and recent transaction log with search and category filtering.

### 2.8 📊 Overview & Analytics (`/overview`)
* **Purpose**: Meta-level life dashboard answering: *"How is my life actually progressing?"*
* **Metrics & Horizons**:
  * Time Filters: Day, Week, Month, Year.
  * Aggregated KPIs: Total XP Progression, Level Progression Curve, Overall Task Completion Rate, Habit Consistency Index, Total Focus Hours logged, Budget Burn Rate.
  * Recharts visual trends: Weekly performance bar charts, multi-category spider/radar charts, and XP accumulation timelines.

### 2.9 ⚙️ Settings (`/settings`)
* **Purpose**: Configuration and user profile management.
* **Settings Domains**:
  * Profile: Display name, avatar, bio, timezone, primary currency.
  * Gamification: Sound effects volume, celebration particle intensity, streak freeze management.
  * Appearance: Dark theme tuning (Graphite, Midnight OLED, Cyber Slate), reduced motion override.
  * Notifications: In-app alerts, desktop web push notification permissions and quiet hours.
  * Data Management: Export personal data (JSON/CSV), account deletion.

---

## 3. The Gamification Engine (RPG Mechanics)

### 3.1 Player Stats
* **Level**: Current progression tier calculated deterministically from cumulative lifetime XP.
* **Current XP**: XP accumulated towards the next level.
* **Current Streak**: Consecutive days with at least 1 completed core activity.
* **Longest Streak**: All-time record streak.
* **Consistency Score**: Weighted average of habits, routines, and scheduled task completions over rolling 7-day and 30-day windows.

### 3.2 XP System
XP rewards reflect effort and cognitive load:
| Activity | Base XP |
| :--- | :--- |
| Small Task | +5 XP |
| Normal Task | +10 XP |
| Difficult Task | +20 XP |
| Task Milestone | +50 XP |
| Habit Completion | +5 XP |
| Full Routine Completion | +10 XP |
| Focus Session (per 25 min) | +10 XP |
| Major Roadmap Milestone | +100 XP |

### 3.3 Leveling Equation
The level curve scales smoothly to provide quick initial wins while remaining rewarding over months:
$$\text{XP Required for Level } L = 50 \times (L - 1)^2 + 50 \times (L - 1)$$
* Level 1: 0 XP
* Level 2: 100 XP
* Level 3: 300 XP
* Level 4: 600 XP
* Level 5: 1,000 XP
* Level 10: 4,500 XP
* Level 20: 19,000 XP

### 3.4 Event Sourcing Principle
XP is **never** updated via direct unconstrained increments (e.g., `UPDATE users SET xp = xp + 10`). Every score change inserts an immutable record into `xp_events`:
* Fields: `id`, `user_id`, `source_type` (`task`, `habit`, `routine`, `focus`, `roadmap`), `source_id`, `xp_amount`, `created_at`.
* Allows total historical reconstructibility, audit trails, and segmented XP analytics (e.g. "XP from Focus vs XP from Habits").

---

## 4. Non-Functional Requirements & Principles
1. **Performance**: Page loads with Time to Interactive (TTI) < 1.2s; optimistic UI updates for task/habit toggles (< 50ms perceived latency).
2. **Accessibility**: Full WCAG 2.1 AA compliance, visible keyboard focus rings, semantic landmark structures, ARIA tags, and `prefers-reduced-motion` compliance.
3. **Data Security**: Strict Row-Level Security (RLS) on all Supabase tables, zero data leakage across user tenants, secure cookie-based SSR authentication.
4. **Mobile First**: Fluid layouts adapting seamlessly from 360px mobile viewports to 4K ultra-wide monitors. Dedicated bottom navigation and swipeable sheets on mobile.
