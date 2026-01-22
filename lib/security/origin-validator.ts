/**
 * Enhanced Origin Validation
 * Strict origin checking with protocol validation
 */

import { SecurityConfig } from './config';

/**
 * Origin validation result
 */
export interface OriginValidationResult {
  valid: boolean;
  reason?: string;
}

/**
 * Normalize origin URL
 * Removes trailing slashes and ensures consistent format
 */
function normalizeOrigin(origin: string): string {
  try {
    const url = new URL(origin);
    return `${url.protocol}//${url.host}`;
  } catch {
    return origin;
  }
}

/**
 * Check if origin is in allowed list
 */
function isOriginAllowed(origin: string): boolean {
  const normalized = normalizeOrigin(origin);
  
  return SecurityConfig.origin.allowedOrigins.some(allowed => {
    const normalizedAllowed = normalizeOrigin(allowed);
    
    // Exact match
    if (normalized === normalizedAllowed) {
      return true;
    }
    
    // Check if it's a subdomain (for production domains)
    if (normalizedAllowed.includes('://') && normalized.endsWith(normalizedAllowed.split('://')[1])) {
      return true;
    }
    
    return false;
  });
}

/**
 * Validate request origin
 * 
 * @param req - Request object
 * @returns Validation result
 */
export function validateOrigin(req: Request): OriginValidationResult {
  const origin = req.headers.get('origin');
  const referer = req.headers.get('referer');
  
  // Server-side requests (no origin/referer)
  // Additional check: verify it's actually server-side
  if (!origin && !referer) {
    // Check if request has typical browser headers
    const userAgent = req.headers.get('user-agent');
    const accept = req.headers.get('accept');
    
    // If it has browser-like headers but no origin/referer, it's suspicious
    if (userAgent && accept && accept.includes('text/html')) {
      return {
        valid: false,
        reason: 'Browser request missing origin/referer headers',
      };
    }
    
    // Likely a server-side request
    return { valid: true };
  }

  // Production: require HTTPS
  if (SecurityConfig.origin.requireHttpsInProduction) {
    if (origin && !origin.startsWith('https://')) {
      return {
        valid: false,
        reason: 'HTTPS required in production',
      };
    }
    
    if (referer && !referer.startsWith('https://')) {
      return {
        valid: false,
        reason: 'HTTPS required in production',
      };
    }
  }

  // Check origin header
  if (origin) {
    if (isOriginAllowed(origin)) {
      return { valid: true };
    }
    
    return {
      valid: false,
      reason: `Origin not allowed: ${origin}`,
    };
  }

  // Fallback: check referer header
  if (referer) {
    try {
      const refererUrl = new URL(referer);
      const refererOrigin = `${refererUrl.protocol}//${refererUrl.host}`;
      
      if (isOriginAllowed(refererOrigin)) {
        return { valid: true };
      }
      
      return {
        valid: false,
        reason: `Referer origin not allowed: ${refererOrigin}`,
      };
    } catch {
      return {
        valid: false,
        reason: 'Invalid referer URL',
      };
    }
  }

  return {
    valid: false,
    reason: 'No valid origin or referer header',
  };
}

/**
 * Create origin validation error response
 */
export function createOriginErrorResponse(reason: string): Response {
  return new Response(
    JSON.stringify({
      success: false,
      error: `Origin validation failed: ${reason}`,
    }),
    {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
