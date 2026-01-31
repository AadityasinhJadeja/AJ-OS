/**
 * Input Sanitization & Validation Utilities
 * 
 * SECURITY: All user inputs should be validated before storage
 * Even though React protects against XSS, defense-in-depth is essential
 */

/**
 * Sanitize text input by removing potentially dangerous characters
 * while preserving normal text formatting
 */
export const sanitizeText = (input: string): string => {
    if (!input || typeof input !== 'string') return '';

    return input
        // Remove null bytes
        .replace(/\0/g, '')
        // Normalize unicode to prevent homograph attacks
        .normalize('NFKC')
        // Trim excessive whitespace
        .trim()
        // Limit length to prevent memory abuse
        .slice(0, 10000);
};

/**
 * Sanitize URL input
 */
export const sanitizeUrl = (input: string): string => {
    if (!input || typeof input !== 'string') return '';

    const trimmed = input.trim();

    // Only allow http, https, mailto protocols
    const allowedProtocols = ['http:', 'https:', 'mailto:'];

    try {
        const url = new URL(trimmed);
        if (!allowedProtocols.includes(url.protocol)) {
            return '';
        }
        return url.href;
    } catch {
        // If not a valid URL, check if it could be a relative path
        if (trimmed.startsWith('/') || trimmed.startsWith('./')) {
            return trimmed;
        }
        // Try adding https://
        if (!trimmed.includes('://')) {
            try {
                const url = new URL('https://' + trimmed);
                return url.href;
            } catch {
                return '';
            }
        }
        return '';
    }
};

/**
 * Sanitize email input
 */
export const sanitizeEmail = (input: string): string => {
    if (!input || typeof input !== 'string') return '';

    const trimmed = input.trim().toLowerCase();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
        return '';
    }

    return trimmed;
};

/**
 * Validate and sanitize all fields of an object
 */
export const sanitizeObject = <T extends Record<string, string>>(
    obj: T,
    urlFields: string[] = [],
    emailFields: string[] = []
): T => {
    const result = { ...obj };

    for (const key of Object.keys(result)) {
        const value = result[key as keyof T];
        if (typeof value === 'string') {
            if (urlFields.includes(key)) {
                (result as Record<string, string>)[key] = sanitizeUrl(value);
            } else if (emailFields.includes(key)) {
                (result as Record<string, string>)[key] = sanitizeEmail(value);
            } else {
                (result as Record<string, string>)[key] = sanitizeText(value);
            }
        }
    }

    return result;
};

/**
 * Rate limiter for preventing API abuse
 */
class RateLimiter {
    private timestamps: number[] = [];
    private readonly maxRequests: number;
    private readonly windowMs: number;

    constructor(maxRequests: number = 30, windowMs: number = 60000) {
        this.maxRequests = maxRequests;
        this.windowMs = windowMs;
    }

    canMakeRequest(): boolean {
        const now = Date.now();
        // Remove old timestamps
        this.timestamps = this.timestamps.filter(t => now - t < this.windowMs);

        if (this.timestamps.length >= this.maxRequests) {
            return false;
        }

        this.timestamps.push(now);
        return true;
    }

    getRemainingRequests(): number {
        const now = Date.now();
        this.timestamps = this.timestamps.filter(t => now - t < this.windowMs);
        return Math.max(0, this.maxRequests - this.timestamps.length);
    }
}

// Global rate limiter instance (30 requests per minute)
export const rateLimiter = new RateLimiter(30, 60000);

/**
 * Validate UUID format
 */
export const isValidUUID = (id: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
};

/**
 * Generate a secure random ID
 */
export const generateSecureId = (): string => {
    return crypto.randomUUID();
};

/**
 * Mask sensitive data for logging
 */
export const maskSensitive = (data: string, visibleChars: number = 4): string => {
    if (!data || data.length <= visibleChars) return '***';
    return data.slice(0, visibleChars) + '***' + data.slice(-visibleChars);
};
