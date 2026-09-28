-- Migration: Add activity_type to routine_items table
ALTER TABLE public.routine_items 
ADD COLUMN IF NOT EXISTS activity_type TEXT DEFAULT 'Work';
