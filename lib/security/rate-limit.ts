/**
 * Rate Limiting Utilities
 * In-memory rate limiter with sliding window algorithm
 */

import { SecurityConfig } from './config';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

/**
 * In-memory store for rate limit data
 * Key format: "ip:endpoint"
 */
const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Cleanup expired entries every 5 minutes
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

/**
 * Rate limit tiers
 */
export type RateLimitTier = 'strict' | 'normal' | 'relaxed';

/**
 * Rate limit result
 */
export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number; // Seconds until reset
}

/**
 * Check if request is within rate limit
 * 
 * @param identifier - Unique identifier (usually IP address)
 * @param endpoint - API endpoint being accessed
 * @param tier - Rate limit tier (strict/normal/relaxed)
 * @returns Rate limit result
 */
export function checkRateLimit(
  identifier: string,
  endpoint: string,
  tier: RateLimitTier = 'normal'
): RateLimitResult {
  if (!SecurityConfig.rateLimit.enabled) {
    return {
      allowed: true,
      remaining: Infinity,
      resetTime: Date.now(),
    };
  }

  const key = `${identifier}:${endpoint}`;
  const now = Date.now();
  const config = SecurityConfig.rateLimit.limits[tier];
  
  const entry = rateLimitStore.get(key);

  // No entry or expired entry
  if (!entry || entry.resetTime < now) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    });

    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime: now + config.windowMs,
    };
  }

  // Entry exists and not expired
  if (entry.count < config.maxRequests) {
    entry.count++;
    
    return {
      allowed: true,
      remaining: config.maxRequests - entry.count,
      resetTime: entry.resetTime,
    };
  }

  // Rate limit exceeded
  return {
    allowed: false,
    remaining: 0,
    resetTime: entry.resetTime,
    retryAfter: Math.ceil((entry.resetTime - now) / 1000),
  };
}

/**
 * Get client identifier from request
 * Uses IP address or fallback to a hash of headers
 * 
 * @param req - Next.js request object
 * @returns Client identifier
 */
export function getClientIdentifier(req: Request): string {
  // Try to get real IP from headers (for proxies/load balancers)
  const headers = req.headers;
  const forwardedFor = headers.get('x-forwarded-for');
  const realIp = headers.get('x-real-ip');
  
  if (forwardedFor) {
    // x-forwarded-for can be a comma-separated list
    return forwardedFor.split(',')[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }

  // Fallback: create identifier from user-agent + accept-language
  const userAgent = headers.get('user-agent') || 'unknown';
  const acceptLang = headers.get('accept-language') || 'unknown';
  
  return `fallback:${userAgent.substring(0, 50)}:${acceptLang}`;
}

/**
 * Create rate limit response
 * 
 * @param result - Rate limit result
 * @returns Response object
 */
export function createRateLimitResponse(result: RateLimitResult): Response {
  return new Response(
    JSON.stringify({
      success: false,
      error: 'Too many requests. Please try again later.',
      retryAfter: result.retryAfter,
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(result.retryAfter || 60),
        'X-RateLimit-Remaining': String(result.remaining),
        'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
      },
    }
  );
}
