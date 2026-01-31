# Database Setup Guide

This directory contains all SQL schemas and migrations for AJ OS.

## Initial Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** in your Supabase dashboard
3. Run `SUPABASE_SCHEMA_CURRENT.sql` to create all tables

## File Overview

| File | Purpose |
|------|---------|
| `SUPABASE_SCHEMA_CURRENT.sql` | Complete database schema (run first) |
| `supabase-migrations/` | Incremental migrations (for updates) |

## Tables Created

- `daily_entries` - Daily logs and journal entries
- `todos` - Tasks with priorities and deadlines
- `ideas` - Captured ideas and content drafts
- `discoveries` - Saved resources and links
- `contacts` - Network and contact management
- `weekly_outcomes` - Weekly goal tracking
- `expenses` - Financial tracking (optional)

## Row Level Security

All tables have RLS (Row Level Security) enabled. The schema creates policies that:
- Allow authenticated users to read/write their own data
- Prevent access to other users' data

## Running Migrations

If you're updating an existing installation:

```sql
-- Run migrations in order from supabase-migrations/
-- Check file dates and only run newer migrations
```

## Troubleshooting

**"relation does not exist" error:**
- Run the full schema first before migrations

**"permission denied" error:**
- Check that RLS policies are properly configured
- Verify your anon key in `.env.local`

**Data not syncing:**
- Verify Supabase URL and key are correct
- Check browser console for errors
