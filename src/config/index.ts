/**
 * AJ OS Configuration
 * 
 * This file contains all configuration constants and environment variable access.
 * Configure your API keys and settings in .env.local file.
 */

// =============================================================================
// ENVIRONMENT VARIABLES
// =============================================================================

/**
 * Supabase Configuration
 * 
 * To set up Supabase:
 * 1. Create a project at https://supabase.com
 * 2. Go to Project Settings > API
 * 3. Copy your Project URL and anon/public key
 * 4. Add them to your .env.local file
 */
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

/**
 * Gemini AI Configuration (Optional)
 * 
 * To enable AI features:
 * 1. Get an API key from https://makersuite.google.com/app/apikey
 * 2. Add VITE_GEMINI_API_KEY to your .env.local file
 */
export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

// =============================================================================
// APPLICATION SETTINGS
// =============================================================================

/**
 * Application Metadata
 */
export const APP_CONFIG = {
    name: 'AJ OS',
    version: '26',
    description: 'Personal Operating System for Productivity',

    // Default timezone for date operations
    timezone: 'America/Los_Angeles',

    // Local storage keys prefix (to avoid conflicts)
    storagePrefix: 'ajos_',
} as const;

/**
 * Feature Flags
 * Enable/disable features for different environments
 */
export const FEATURES = {
    // Enable AI-powered insights (requires GEMINI_API_KEY)
    aiInsights: Boolean(GEMINI_API_KEY),

    // Enable Supabase sync (requires valid credentials)
    supabaseSync: Boolean(SUPABASE_URL && SUPABASE_ANON_KEY),

    // Enable offline mode (localStorage fallback)
    offlineMode: true,

    // Enable debug logging
    debugMode: import.meta.env.DEV,
} as const;

/**
 * API Endpoints (if you want to add custom backend)
 */
export const API_ENDPOINTS = {
    // Add your custom API endpoints here
    // Example:
    // analytics: 'https://your-api.com/analytics',
    // webhooks: 'https://your-api.com/webhooks',
} as const;

/**
 * Rate Limiting Configuration
 */
export const RATE_LIMITS = {
    // Maximum operations per minute for Supabase
    supabaseOpsPerMinute: 60,

    // Sync interval in milliseconds (5 minutes)
    syncInterval: 5 * 60 * 1000,

    // Debounce delay for save operations
    saveDebounce: 500,
} as const;

/**
 * UI Configuration
 */
export const UI_CONFIG = {
    // Animation durations
    animationDuration: 300,

    // Toast notification duration
    toastDuration: 3000,

    // Maximum items to display in lists before pagination
    maxListItems: 50,
} as const;

// =============================================================================
// VALIDATION HELPERS
// =============================================================================

/**
 * Check if Supabase is properly configured
 */
export const isSupabaseConfigured = (): boolean => {
    return Boolean(
        SUPABASE_URL &&
        SUPABASE_ANON_KEY &&
        SUPABASE_URL !== 'https://placeholder.supabase.co'
    );
};

/**
 * Check if Gemini AI is properly configured
 */
export const isGeminiConfigured = (): boolean => {
    return Boolean(
        GEMINI_API_KEY &&
        GEMINI_API_KEY !== 'dummy-key'
    );
};

/**
 * Get configuration status for debugging
 */
export const getConfigStatus = () => ({
    supabase: isSupabaseConfigured() ? 'configured' : 'not configured',
    gemini: isGeminiConfigured() ? 'configured' : 'not configured',
    features: FEATURES,
    environment: import.meta.env.MODE,
});
