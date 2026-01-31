-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  category TEXT NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  trace_date TEXT -- Format YYYY-MM-DD for local query optimization
);

-- Add index for trace_date for faster queries since it's used for sorting/filtering
CREATE INDEX IF NOT EXISTS idx_expenses_trace_date ON expenses(trace_date);

-- Enable Row Level Security (RLS) if it's generally enabled, 
-- but assuming based on other tables provided in context (or lack thereof) we might just stick to basic table creation first.
-- The user context mentions "AJ OS - 26 (Hosted)" which implies a single user system for now locally/hosted for self.

-- Grant access to authenticated users if needed (standard supabase pattern)
-- ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Users can manage their own expenses" ON expenses FOR ALL USING (auth.uid() = user_id);
-- Note: existing tables in store.ts don't seem to have user_id, it seems to be single-tenant or handled differently. 
-- I will stick to the pattern of other tables.
