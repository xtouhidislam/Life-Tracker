-- ==============================================================================
-- LifeQuest — Comprehensive Database Schema & Foundation Migration
-- Phase 2 & 3: Multi-tenant isolated schema with Row Level Security (RLS)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. UTILITY FUNCTIONS & UPDATED_AT TRIGGER
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc', now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- 2. USER PROFILE & STATS
-- ==============================================================================

-- Profiles: Extended user identity & preferences
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    timezone TEXT NOT NULL DEFAULT 'UTC',
    primary_currency TEXT NOT NULL DEFAULT 'BDT',
    theme TEXT NOT NULL DEFAULT 'graphite',
    sound_enabled BOOLEAN NOT NULL DEFAULT true,
    particles_enabled BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- User Stats: Denormalized player metrics (XP, level, streaks)
CREATE TABLE IF NOT EXISTS public.user_stats (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    total_xp BIGINT NOT NULL DEFAULT 0,
    current_level INTEGER NOT NULL DEFAULT 1,
    current_streak INTEGER NOT NULL DEFAULT 0,
    longest_streak INTEGER NOT NULL DEFAULT 0,
    last_active_date DATE,
    total_tasks_completed INTEGER NOT NULL DEFAULT 0,
    total_habits_completed INTEGER NOT NULL DEFAULT 0,
    total_focus_minutes INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- Categories: Cross-module classification (Work, Health, Personal, Learning, Finance)
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color TEXT NOT NULL DEFAULT '#6366F1',
    icon TEXT NOT NULL DEFAULT 'folder',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- ==============================================================================
-- 3. TASKS & CALENDAR ENGINE
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    difficulty TEXT NOT NULL DEFAULT 'normal' CHECK (difficulty IN ('small', 'normal', 'difficult', 'milestone')),
    xp_value INTEGER NOT NULL DEFAULT 10,
    due_date DATE,
    due_time TIME,
    estimated_duration_minutes INTEGER,
    is_recurring BOOLEAN NOT NULL DEFAULT false,
    recurrence_rule TEXT,
    parent_goal_id UUID,
    is_completed BOOLEAN NOT NULL DEFAULT false,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.task_occurrences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    occurrence_date DATE NOT NULL,
    is_cancelled BOOLEAN NOT NULL DEFAULT false,
    is_completed BOOLEAN NOT NULL DEFAULT false,
    completed_at TIMESTAMPTZ,
    UNIQUE(task_id, occurrence_date)
);

CREATE TABLE IF NOT EXISTS public.task_completions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    completed_date DATE NOT NULL DEFAULT CURRENT_DATE,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    xp_awarded INTEGER NOT NULL DEFAULT 10
);

-- ==============================================================================
-- 4. HABITS SYSTEM
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.habits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    frequency TEXT NOT NULL DEFAULT 'daily' CHECK (frequency IN ('daily', 'weekdays', 'weekends', 'weekly')),
    target_days_per_week INTEGER NOT NULL DEFAULT 7,
    time_of_day TEXT NOT NULL DEFAULT 'anytime' CHECK (time_of_day IN ('morning', 'afternoon', 'evening', 'anytime')),
    current_streak INTEGER NOT NULL DEFAULT 0,
    longest_streak INTEGER NOT NULL DEFAULT 0,
    xp_per_completion INTEGER NOT NULL DEFAULT 15,
    is_archived BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.habit_completions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    habit_id UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    completion_date DATE NOT NULL DEFAULT CURRENT_DATE,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    notes TEXT,
    xp_awarded INTEGER NOT NULL DEFAULT 15,
    UNIQUE(habit_id, completion_date)
);

-- ==============================================================================
-- 5. ROUTINES SYSTEM
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.routines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('weekday', 'weekend', 'custom')),
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.routine_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    routine_id UUID NOT NULL REFERENCES public.routines(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration_minutes INTEGER NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    energy_level TEXT DEFAULT 'medium' CHECK (energy_level IN ('high', 'medium', 'low', 'rest')),
    icon TEXT DEFAULT 'clock',
    xp_reward INTEGER NOT NULL DEFAULT 5,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.routine_completions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    routine_id UUID NOT NULL REFERENCES public.routines(id) ON DELETE CASCADE,
    routine_item_id UUID REFERENCES public.routine_items(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    completion_date DATE NOT NULL DEFAULT CURRENT_DATE,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    xp_awarded INTEGER NOT NULL DEFAULT 5,
    UNIQUE(routine_item_id, completion_date)
);

-- ==============================================================================
-- 6. ROADMAP & GOALS ENGINE
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    vision TEXT,
    track TEXT NOT NULL DEFAULT 'career',
    target_year INTEGER NOT NULL DEFAULT 2026,
    target_quarter INTEGER CHECK (target_quarter BETWEEN 1 AND 4),
    target_month INTEGER CHECK (target_month BETWEEN 1 AND 12),
    status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('not_started', 'in_progress', 'completed', 'paused')),
    progress_percentage NUMERIC(5,2) NOT NULL DEFAULT 0.00 CHECK (progress_percentage BETWEEN 0 AND 100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.goal_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    goal_id UUID NOT NULL REFERENCES public.goals(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    target_month INTEGER NOT NULL CHECK (target_month BETWEEN 1 AND 12),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
    xp_reward INTEGER NOT NULL DEFAULT 100,
    is_completed BOOLEAN NOT NULL DEFAULT false,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.roadmap_nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    goal_id UUID REFERENCES public.goals(id) ON DELETE CASCADE,
    milestone_id UUID REFERENCES public.goal_milestones(id) ON DELETE CASCADE,
    parent_node_id UUID REFERENCES public.roadmap_nodes(id) ON DELETE SET NULL,
    node_type TEXT NOT NULL CHECK (node_type IN ('milestone', 'action', 'decision', 'checkpoint')),
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'locked' CHECK (status IN ('locked', 'unlocked', 'active', 'completed')),
    xp_reward INTEGER NOT NULL DEFAULT 25,
    position_x NUMERIC(8,2) NOT NULL DEFAULT 0,
    position_y NUMERIC(8,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- ==============================================================================
-- 7. FOCUS SESSIONS (DEEP WORK)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.focus_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
    duration_seconds INTEGER NOT NULL CHECK (duration_seconds > 0),
    environment_sound TEXT DEFAULT 'rain',
    notes TEXT,
    xp_earned INTEGER NOT NULL DEFAULT 20,
    started_at TIMESTAMPTZ NOT NULL,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- ==============================================================================
-- 8. EXPENSES & BUDGETS (BDT / ৳)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.expense_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    icon TEXT NOT NULL DEFAULT 'dollar-sign',
    color TEXT NOT NULL DEFAULT '#10B981',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.expense_categories(id) ON DELETE SET NULL,
    amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
    currency TEXT NOT NULL DEFAULT 'BDT',
    description TEXT,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.expense_categories(id) ON DELETE CASCADE,
    month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
    year INTEGER NOT NULL CHECK (year >= 2024),
    allocated_amount NUMERIC(12,2) NOT NULL CHECK (allocated_amount >= 0),
    currency TEXT NOT NULL DEFAULT 'BDT',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    UNIQUE(user_id, category_id, month, year)
);

-- ==============================================================================
-- 9. GAMIFICATION, ACHIEVEMENTS & NOTIFICATIONS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.xp_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    source_type TEXT NOT NULL CHECK (source_type IN ('task', 'habit', 'routine', 'focus', 'roadmap', 'achievement', 'bonus')),
    source_id UUID,
    xp_amount INTEGER NOT NULL CHECK (xp_amount > 0),
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.achievements (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    badge_icon TEXT NOT NULL,
    tier TEXT NOT NULL DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
    xp_bonus INTEGER NOT NULL DEFAULT 50
);

CREATE TABLE IF NOT EXISTS public.user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_id TEXT NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    UNIQUE(user_id, achievement_id)
);

CREATE TABLE IF NOT EXISTS public.reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    source_type TEXT NOT NULL CHECK (source_type IN ('task', 'habit', 'routine', 'calendar')),
    source_id UUID NOT NULL,
    remind_at TIMESTAMPTZ NOT NULL,
    is_sent BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.notification_preferences (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    push_subscription JSONB,
    browser_push_enabled BOOLEAN NOT NULL DEFAULT false,
    daily_digest_time TIME DEFAULT '08:00',
    quiet_hours_start TIME DEFAULT '22:00',
    quiet_hours_end TIME DEFAULT '07:00',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- ==============================================================================
-- 10. INDEXES FOR PERFORMANCE & FAST LOOKUPS
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_tasks_user_due ON public.tasks(user_id, due_date) WHERE is_completed = false;
CREATE INDEX IF NOT EXISTS idx_task_completions_user ON public.task_completions(user_id, completed_date);
CREATE INDEX IF NOT EXISTS idx_habits_user_active ON public.habits(user_id) WHERE is_archived = false;
CREATE INDEX IF NOT EXISTS idx_habit_completions_lookup ON public.habit_completions(user_id, completion_date);
CREATE INDEX IF NOT EXISTS idx_routines_user ON public.routines(user_id);
CREATE INDEX IF NOT EXISTS idx_routine_items_order ON public.routine_items(routine_id, order_index);
CREATE INDEX IF NOT EXISTS idx_focus_sessions_user_date ON public.focus_sessions(user_id, started_at);
CREATE INDEX IF NOT EXISTS idx_expenses_user_date ON public.expenses(user_id, date);
CREATE INDEX IF NOT EXISTS idx_xp_events_user_time ON public.xp_events(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_reminders_pending ON public.reminders(remind_at) WHERE is_sent = false;

-- ==============================================================================
-- 11. AUTOMATED TRIGGERS (UPDATED_AT)
-- ==============================================================================

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_profiles_updated_at') THEN
        CREATE TRIGGER tr_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_tasks_updated_at') THEN
        CREATE TRIGGER tr_tasks_updated_at BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_habits_updated_at') THEN
        CREATE TRIGGER tr_habits_updated_at BEFORE UPDATE ON public.habits FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_routines_updated_at') THEN
        CREATE TRIGGER tr_routines_updated_at BEFORE UPDATE ON public.routines FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_goals_updated_at') THEN
        CREATE TRIGGER tr_goals_updated_at BEFORE UPDATE ON public.goals FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_expenses_updated_at') THEN
        CREATE TRIGGER tr_expenses_updated_at BEFORE UPDATE ON public.expenses FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_user_stats_updated_at') THEN
        CREATE TRIGGER tr_user_stats_updated_at BEFORE UPDATE ON public.user_stats FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
    END IF;
END $$;

-- ==============================================================================
-- 12. AUTOMATED USER PROVISIONING TRIGGER (ON AUTH SIGNUP)
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    default_name TEXT;
BEGIN
    default_name := COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1));

    -- Create profile
    INSERT INTO public.profiles (id, display_name)
    VALUES (NEW.id, default_name)
    ON CONFLICT (id) DO NOTHING;

    -- Create initial user scorecard
    INSERT INTO public.user_stats (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;

    -- Create notification preferences
    INSERT INTO public.notification_preferences (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;

    -- Create default category set
    INSERT INTO public.categories (user_id, name, color, icon)
    VALUES
        (NEW.id, 'Engineering & Career', '#6366F1', 'code'),
        (NEW.id, 'Health & Fitness', '#10B981', 'activity'),
        (NEW.id, 'Personal Growth', '#F59E0B', 'book-open'),
        (NEW.id, 'Daily Operations', '#06B6D4', 'check-circle')
    ON CONFLICT DO NOTHING;

    -- Create default expense categories
    INSERT INTO public.expense_categories (user_id, name, color, icon)
    VALUES
        (NEW.id, 'Food & Groceries', '#10B981', 'coffee'),
        (NEW.id, 'Living & Rent', '#6366F1', 'home'),
        (NEW.id, 'Tech & Subscriptions', '#06B6D4', 'laptop'),
        (NEW.id, 'Transport & Transit', '#F59E0B', 'navigation'),
        (NEW.id, 'Health & Personal', '#F43F5E', 'heart')
    ON CONFLICT DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 13. XP RECALCULATION & LEVELING TRIGGER
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.update_user_stats_from_xp()
RETURNS TRIGGER AS $$
DECLARE
    new_total BIGINT;
    calc_level INTEGER;
BEGIN
    SELECT COALESCE(SUM(xp_amount), 0) INTO new_total
    FROM public.xp_events
    WHERE user_id = NEW.user_id;

    -- Quadratic level progression equation:
    -- Level 1: 0 XP
    -- Level 2: 100 XP
    -- Level 3: 300 XP
    -- Level L: 50*(L-1)^2 + 50*(L-1)
    calc_level := GREATEST(1, FLOOR((SQRT(200 * new_total + 25) + 25) / 100)::INTEGER);

    UPDATE public.user_stats
    SET total_xp = new_total,
        current_level = calc_level,
        updated_at = timezone('utc', now())
    WHERE user_id = NEW.user_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_xp_event_added ON public.xp_events;
CREATE TRIGGER on_xp_event_added
    AFTER INSERT ON public.xp_events
    FOR EACH ROW EXECUTE FUNCTION public.update_user_stats_from_xp();

-- ==============================================================================
-- 14. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_occurrences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routine_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routine_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goal_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.focus_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- Profiles: Own user can select and update
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- User Stats: Own user can view
DROP POLICY IF EXISTS "Users can view their own stats" ON public.user_stats;
CREATE POLICY "Users can view their own stats" ON public.user_stats FOR SELECT USING (auth.uid() = user_id);

-- Categories
DROP POLICY IF EXISTS "Users can manage categories" ON public.categories;
CREATE POLICY "Users can manage categories" ON public.categories FOR ALL USING (auth.uid() = user_id);

-- Tasks & Task Occurrences & Completions
DROP POLICY IF EXISTS "Users can manage tasks" ON public.tasks;
CREATE POLICY "Users can manage tasks" ON public.tasks FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage task occurrences" ON public.task_occurrences;
CREATE POLICY "Users can manage task occurrences" ON public.task_occurrences FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage task completions" ON public.task_completions;
CREATE POLICY "Users can manage task completions" ON public.task_completions FOR ALL USING (auth.uid() = user_id);

-- Habits & Completions
DROP POLICY IF EXISTS "Users can manage habits" ON public.habits;
CREATE POLICY "Users can manage habits" ON public.habits FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage habit completions" ON public.habit_completions;
CREATE POLICY "Users can manage habit completions" ON public.habit_completions FOR ALL USING (auth.uid() = user_id);

-- Routines & Items & Completions
DROP POLICY IF EXISTS "Users can manage routines" ON public.routines;
CREATE POLICY "Users can manage routines" ON public.routines FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view routine items" ON public.routine_items;
CREATE POLICY "Users can view routine items" ON public.routine_items FOR ALL USING (
    EXISTS (SELECT 1 FROM public.routines r WHERE r.id = routine_items.routine_id AND r.user_id = auth.uid())
);

DROP POLICY IF EXISTS "Users can manage routine completions" ON public.routine_completions;
CREATE POLICY "Users can manage routine completions" ON public.routine_completions FOR ALL USING (auth.uid() = user_id);

-- Goals, Milestones & Roadmap
DROP POLICY IF EXISTS "Users can manage goals" ON public.goals;
CREATE POLICY "Users can manage goals" ON public.goals FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage goal milestones" ON public.goal_milestones;
CREATE POLICY "Users can manage goal milestones" ON public.goal_milestones FOR ALL USING (
    EXISTS (SELECT 1 FROM public.goals g WHERE g.id = goal_milestones.goal_id AND g.user_id = auth.uid())
);

DROP POLICY IF EXISTS "Users can manage roadmap nodes" ON public.roadmap_nodes;
CREATE POLICY "Users can manage roadmap nodes" ON public.roadmap_nodes FOR ALL USING (
    EXISTS (SELECT 1 FROM public.goals g WHERE g.id = roadmap_nodes.goal_id AND g.user_id = auth.uid())
);

-- Focus Sessions
DROP POLICY IF EXISTS "Users can manage focus sessions" ON public.focus_sessions;
CREATE POLICY "Users can manage focus sessions" ON public.focus_sessions FOR ALL USING (auth.uid() = user_id);

-- Expenses & Budgets
DROP POLICY IF EXISTS "Users can manage expense categories" ON public.expense_categories;
CREATE POLICY "Users can manage expense categories" ON public.expense_categories FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage expenses" ON public.expenses;
CREATE POLICY "Users can manage expenses" ON public.expenses FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage budgets" ON public.budgets;
CREATE POLICY "Users can manage budgets" ON public.budgets FOR ALL USING (auth.uid() = user_id);

-- XP Events
DROP POLICY IF EXISTS "Users can view xp events" ON public.xp_events;
CREATE POLICY "Users can view xp events" ON public.xp_events FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert xp events" ON public.xp_events;
CREATE POLICY "Users can insert xp events" ON public.xp_events FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Achievements: Public read for all users
DROP POLICY IF EXISTS "Achievements viewable by all authenticated users" ON public.achievements;
CREATE POLICY "Achievements viewable by all authenticated users" ON public.achievements FOR SELECT TO authenticated USING (true);

-- User Achievements
DROP POLICY IF EXISTS "Users can view their unlocked achievements" ON public.user_achievements;
CREATE POLICY "Users can view their unlocked achievements" ON public.user_achievements FOR ALL USING (auth.uid() = user_id);

-- Reminders & Notification Preferences
DROP POLICY IF EXISTS "Users can manage reminders" ON public.reminders;
CREATE POLICY "Users can manage reminders" ON public.reminders FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage notification preferences" ON public.notification_preferences;
CREATE POLICY "Users can manage notification preferences" ON public.notification_preferences FOR ALL USING (auth.uid() = user_id);

-- ==============================================================================
-- 15. SEED SYSTEM ACHIEVEMENTS
-- ==============================================================================

INSERT INTO public.achievements (id, title, description, badge_icon, tier, xp_bonus)
VALUES
    ('first_task', 'First Blood', 'Completed your first recorded task.', 'check-circle-2', 'bronze', 25),
    ('tasks_10', 'Task Decathlete', 'Completed 10 tasks in total.', 'award', 'bronze', 50),
    ('tasks_50', 'Centurion Aspirant', 'Completed 50 tasks across your quests.', 'medal', 'silver', 150),
    ('streak_7_days', 'Unstoppable Flame', 'Maintained an unbroken 7-day habit streak.', 'flame', 'silver', 100),
    ('streak_30_days', 'Habit Titan', 'Maintained an unbroken 30-day streak.', 'trophy', 'gold', 300),
    ('focus_10_hours', 'Deep Work Monk', 'Completed 10 cumulative hours of uninterrupted focus.', 'timer', 'silver', 150),
    ('zenin_milestone_1', 'AI Pioneer', 'Conquered Month 1 Zenin AI Engineer Roadmap.', 'sparkles', 'gold', 500)
ON CONFLICT (id) DO NOTHING;
