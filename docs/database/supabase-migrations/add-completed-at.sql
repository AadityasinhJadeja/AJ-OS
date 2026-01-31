-- Add completed_at column to todos table to track when tasks are completed
ALTER TABLE todos ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

-- Add index for better query performance when filtering by completion date
CREATE INDEX IF NOT EXISTS idx_todos_completed_at ON todos(completed_at) WHERE completed_at IS NOT NULL;

-- Add comment to document the column
COMMENT ON COLUMN todos.completed_at IS 'Timestamp when the task was marked as completed';
