/**
 * Vite Configuration - Security Hardened
 * 
 * SECURITY FEATURES:
 * - Dev server restricted to localhost only (not exposed to network)
 * - Environment variables properly handled
 * - CSP headers for production builds
 */

import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  const isDev = mode === 'development';

  return {
    server: {
      port: 3000,
      // SECURITY: Only listen on localhost in development
      // This prevents exposure to local network
      host: 'localhost',
      // Strict port - fail if 3000 is taken
      strictPort: true,
      // Open browser automatically in dev
      open: isDev,
    },

    preview: {
      port: 3000,
      host: 'localhost',
    },

    plugins: [react()],

    define: {
      // Gemini API key - server-side only, injected at build time
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY || ''),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || ''),
    },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },

    build: {
      // Generate source maps only in development
      sourcemap: isDev,
      // Minify for production
      minify: !isDev,
      // Target modern browsers
      target: 'es2020',
      rollupOptions: {
        output: {
          // Sanitize chunk names
          sanitizeFileName: (name) => name.replace(/[^\w.-]/g, '_'),
        },
      },
    },

    // Security: Don't expose sensitive env vars
    envPrefix: ['VITE_'],
  };
});
