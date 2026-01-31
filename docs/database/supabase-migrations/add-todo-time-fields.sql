-- Migration: Add time_slot and target_time columns to todos table
-- Run this in your Supabase SQL Editor

-- Add time_slot column (Morning, Afternoon, Evening, Night, Anytime)
ALTER TABLE todos 
ADD COLUMN IF NOT EXISTS time_slot TEXT CHECK (time_slot IN ('Morning', 'Afternoon', 'Evening', 'Night', 'Anytime'));

-- Add target_time column (HH:MM format)
ALTER TABLE todos 
ADD COLUMN IF NOT EXISTS target_time TEXT;

-- Add comment for documentation
COMMENT ON COLUMN todos.time_slot IS 'When to work on this task: Morning, Afternoon, Evening, Night, or Anytime';
COMMENT ON COLUMN todos.target_time IS 'Specific target time to finish the task (HH:MM format)';
