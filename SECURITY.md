# 🔒 AJ OS - 26 Security Guide

## Overview

This document outlines the security measures implemented in AJ OS - 26 and provides guidance for maintaining a secure deployment.

---

## 🛡️ Security Features Implemented

### 1. **Environment Variable Protection**
- All sensitive credentials (Supabase URL, API keys) are stored in environment variables
- `.env.local` file is gitignored to prevent accidental commits
- Never hardcode credentials in source code

### 2. **Input Sanitization**
- All user inputs are sanitized before storage
- Text inputs: Unicode normalized, null bytes removed, length limited
- URLs: Protocol validated (only http/https/mailto allowed)
- Emails: Format validated before storage

### 3. **Rate Limiting**
- Client-side rate limiting: 30 requests per minute
- Prevents accidental API abuse and quota exhaustion
- Graceful degradation when limits are reached

### 4. **Content Security Policy (CSP)**
- Restricts script sources to trusted domains
- Prevents XSS attacks via injected scripts
- Blocks framing to prevent clickjacking

### 5. **Development Server Security**
- Server restricted to localhost only
- Not exposed to local network by default
- Strict port binding

---

## ⚙️ Configuration

### Required Environment Variables

Create a `.env.local` file in the project root:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Gemini AI Configuration (optional)
GEMINI_API_KEY=your-gemini-api-key-here
```

### Getting Your Credentials

1. **Supabase**: Go to [Supabase Dashboard](https://supabase.com/dashboard) → Your Project → Settings → API
2. **Gemini**: Go to [Google AI Studio](https://aistudio.google.com/apikey)

---

## 🔐 Row Level Security (RLS)

### Current Status
The database uses permissive RLS policies (`USING (true)`). This means:
- ✅ Data is accessible only via the anon key
- ⚠️ Anyone with the anon key can access all data
- ✅ Suitable for single-user personal use

### Recommended: Add User Authentication

For multi-user or production deployments, implement proper RLS:

```sql
-- Example: Restrict to authenticated users
ALTER POLICY "Allow all" ON daily_entries
  USING (auth.uid() = user_id);
```

---

## 📋 Security Checklist

Before deploying or sharing this code:

- [ ] Environment variables are set in `.env.local`
- [ ] `.env.local` is NOT committed to git
- [ ] Supabase project has appropriate RLS policies
- [ ] No sensitive data in console.log statements
- [ ] Build output does not contain source maps (`npm run build`)
- [ ] Development server is not exposed to network

---

## 🚨 Reporting Security Issues

If you discover a security vulnerability:

1. **Do not** open a public issue
2. Contact the maintainer directly
3. Provide detailed steps to reproduce
4. Allow reasonable time for a fix before disclosure

---

## 📝 Security Updates Log

| Date | Change |
|------|--------|
| 2026-01-01 | Initial security hardening completed |
| 2026-01-01 | Added input sanitization |
| 2026-01-01 | Moved credentials to environment variables |
| 2026-01-01 | Added CSP headers |
| 2026-01-01 | Implemented rate limiting |

---

## 🔗 References

- [Supabase Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
