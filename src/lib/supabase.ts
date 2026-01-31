/**
 * Supabase Client Configuration
 * 
 * SECURITY NOTES:
 * - Credentials are loaded from environment variables (never hardcoded)
 * - VITE_SUPABASE_ANON_KEY is the "anon" public key (safe to expose in browser)
 * - Real security comes from Row Level Security (RLS) policies in Supabase
 * - Never use the service_role key in client-side code
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Load from environment variables (set in .env.local)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate configuration at startup
if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
        'Supabase credentials not configured!\n' +
        'Please create a .env.local file with:\n' +
        '  VITE_SUPABASE_URL=your-supabase-url\n' +
        '  VITE_SUPABASE_ANON_KEY=your-anon-key\n\n' +
        'Get these from: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api'
    );
}

// Create client with security-focused configuration
export const supabase: SupabaseClient = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder-key',
    {
        auth: {
            // Persist session in localStorage (for future auth implementation)
            persistSession: true,
            // Auto-refresh tokens before they expire
            autoRefreshToken: true,
            // Detect session from URL (for OAuth flows)
            detectSessionInUrl: true,
        },
        global: {
            headers: {
                // Add custom header for request tracking (useful for debugging)
                'x-application-name': 'aj-os-26',
            },
        },
        // Realtime disabled by default for security (enable if needed)
        realtime: {
            params: {
                eventsPerSecond: 2, // Rate limit realtime events
            },
        },
    }
);

/**
 * Check if Supabase is properly configured
 */
export const isSupabaseConfigured = (): boolean => {
    return !!(supabaseUrl && supabaseAnonKey);
};

/**
 * Safely check connection to Supabase
 * Call this to verify the connection is working
 */
export const checkConnection = async (): Promise<boolean> => {
    if (!isSupabaseConfigured()) {
        return false;
    }

    try {
        // Simple health check - try to access the database
        const { error } = await supabase.from('daily_entries').select('id').limit(1);
        return !error;
    } catch {
        return false;
    }
};
