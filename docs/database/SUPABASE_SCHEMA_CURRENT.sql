-- COMPLETE SUPABASE SCHEMA FOR AJ OS - 26
-- This is the current state of all tables in the database
-- Last updated: 2026-01-02

-- ==================== ACTIVE TABLES ====================

-- 1. Daily Entries (Daily Logs Tab)
-- Status: ✅ ACTIVE - Fully functional
-- Simplified to only essential fields for reduced friction
CREATE TABLE IF NOT EXISTS daily_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    worked_on TEXT,
    shipped TEXT,
    trace_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Ideas (Idea Inbox Tab)
-- Status: ✅ ACTIVE - Fully functional
-- Categories: Content, Product, Deep_Work, Life, Growth
CREATE TABLE IF NOT EXISTS ideas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    thought TEXT NOT NULL,
    category TEXT,
    urgency TEXT,
    status TEXT DEFAULT 'Inbox',
    platform TEXT, -- For Content category (X, LinkedIn)
    executed BOOLEAN DEFAULT FALSE, -- Track if idea was successfully completed
    trace_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Weekly Outcomes (Target Cycles Tab)
-- Status: ✅ ACTIVE - Fully functional
CREATE TABLE IF NOT EXISTS weekly_outcomes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    week_starting DATE NOT NULL,
    build TEXT,
    ship TEXT,
    learn TEXT,
    status TEXT DEFAULT 'Partial',
    review_generated BOOLEAN DEFAULT FALSE,
    trace_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Todos (Mission Control Tab + Command Center Dashboard)
-- Status: ✅ ACTIVE - Fully functional
-- Replaced system_reviews table
CREATE TABLE IF NOT EXISTS todos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    details TEXT,
    deadline DATE NOT NULL,
    priority TEXT DEFAULT 'Medium',
    status TEXT DEFAULT 'Pending',
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    trace_date DATE DEFAULT CURRENT_DATE
);

-- 5. Decision Gates (Logic Filter Tab)
-- Status: ✅ ACTIVE - Fully functional
CREATE TABLE IF NOT EXISTS decision_gates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    decision TEXT NOT NULL,
    outcome TEXT,
    status TEXT DEFAULT 'Pending',
    trace_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Contacts (Network Node Tab)
-- Status: ✅ ACTIVE - Fully functional
CREATE TABLE IF NOT EXISTS contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    company TEXT,
    email TEXT,
    linkedin TEXT,
    x_account TEXT,
    notes TEXT,
    date_added DATE NOT NULL,
    trace_date DATE DEFAULT CURRENT_DATE,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Discoveries (Discoveries Tab)
-- Status: ✅ ACTIVE - Fully functional
CREATE TABLE IF NOT EXISTS discoveries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    url TEXT,
    description TEXT,
    category TEXT,
    impact TEXT DEFAULT 'Linear',
    date_added DATE NOT NULL,
    trace_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== ROW LEVEL SECURITY ====================

ALTER TABLE daily_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_outcomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE decision_gates ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE discoveries ENABLE ROW LEVEL SECURITY;

-- ==================== POLICIES ====================

-- Daily Entries Policies
CREATE POLICY "Allow anon select daily_entries" ON daily_entries FOR SELECT USING (true);
CREATE POLICY "Allow anon insert daily_entries" ON daily_entries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update daily_entries" ON daily_entries FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete daily_entries" ON daily_entries FOR DELETE USING (true);

-- Ideas Policies
CREATE POLICY "Allow anon select ideas" ON ideas FOR SELECT USING (true);
CREATE POLICY "Allow anon insert ideas" ON ideas FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update ideas" ON ideas FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete ideas" ON ideas FOR DELETE USING (true);

-- Weekly Outcomes Policies
CREATE POLICY "Allow anon select weekly_outcomes" ON weekly_outcomes FOR SELECT USING (true);
CREATE POLICY "Allow anon insert weekly_outcomes" ON weekly_outcomes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update weekly_outcomes" ON weekly_outcomes FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete weekly_outcomes" ON weekly_outcomes FOR DELETE USING (true);

-- Todos Policies
CREATE POLICY "Allow anon select todos" ON todos FOR SELECT USING (true);
CREATE POLICY "Allow anon insert todos" ON todos FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update todos" ON todos FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete todos" ON todos FOR DELETE USING (true);

-- Decision Gates Policies
CREATE POLICY "Allow anon select decision_gates" ON decision_gates FOR SELECT USING (true);
CREATE POLICY "Allow anon insert decision_gates" ON decision_gates FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update decision_gates" ON decision_gates FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete decision_gates" ON decision_gates FOR DELETE USING (true);

-- Contacts Policies
CREATE POLICY "Allow anon select contacts" ON contacts FOR SELECT USING (true);
CREATE POLICY "Allow anon insert contacts" ON contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update contacts" ON contacts FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete contacts" ON contacts FOR DELETE USING (true);

-- Discoveries Policies
CREATE POLICY "Allow anon select discoveries" ON discoveries FOR SELECT USING (true);
CREATE POLICY "Allow anon insert discoveries" ON discoveries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update discoveries" ON discoveries FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete discoveries" ON discoveries FOR DELETE USING (true);

-- ==================== PERFORMANCE INDEXES ====================

-- Todos indexes for filtering
CREATE INDEX IF NOT EXISTS idx_todos_deadline ON todos(deadline);
CREATE INDEX IF NOT EXISTS idx_todos_status ON todos(status);
CREATE INDEX IF NOT EXISTS idx_todos_completed ON todos(completed);

-- ==================== TAB MAPPING ====================
/*
ACTIVE TABS WITH PERSISTENCE:
1. Command Center (dashboard) - Reads from: todos (today's tasks)
2. Mission Control (todos) - Writes to: todos
3. Daily Logs (daily) - Writes to: daily_entries
4. Idea Inbox (ideas) - Writes to: ideas
5. Target Cycles (weekly) - Writes to: weekly_outcomes
6. Discoveries (discoveries) - Writes to: discoveries
7. Logic Filter (gate) - Writes to: decision_gates
8. Network Node (contacts) - Writes to: contacts

READ-ONLY TABS (No persistence needed):
9. Pattern Grid (analytics) - Reads from: all tables for analytics

DEPRECATED:
- system_reviews table (replaced by todos)
- ReviewStation component (replaced by TodoList)
*/
