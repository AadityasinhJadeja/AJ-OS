-- Add pinned and position columns to daily_entries table
ALTER TABLE daily_entries ADD COLUMN IF NOT EXISTS pinned BOOLEAN DEFAULT FALSE;
ALTER TABLE daily_entries ADD COLUMN IF NOT EXISTS position INTEGER DEFAULT 0;

-- Add index for better query performance on pinned items
CREATE INDEX IF NOT EXISTS idx_daily_entries_pinned ON daily_entries(pinned) WHERE pinned = TRUE;
CREATE INDEX IF NOT EXISTS idx_daily_entries_position ON daily_entries(position);
