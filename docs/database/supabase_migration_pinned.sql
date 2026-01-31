-- Add pinned column to todos table
ALTER TABLE todos ADD COLUMN IF NOT EXISTS pinned BOOLEAN DEFAULT FALSE;

-- Add pinned column to ideas table
ALTER TABLE ideas ADD COLUMN IF NOT EXISTS pinned BOOLEAN DEFAULT FALSE;

-- Add pinned column to discoveries table
ALTER TABLE discoveries ADD COLUMN IF NOT EXISTS pinned BOOLEAN DEFAULT FALSE;

-- Add indexes for better query performance on pinned items
CREATE INDEX IF NOT EXISTS idx_todos_pinned ON todos(pinned) WHERE pinned = TRUE;
CREATE INDEX IF NOT EXISTS idx_ideas_pinned ON ideas(pinned) WHERE pinned = TRUE;
CREATE INDEX IF NOT EXISTS idx_discoveries_pinned ON discoveries(pinned) WHERE pinned = TRUE;
