/**
 * CSRF Protection Utilities
 * Token generation and validation for CSRF protection
 */

import crypto from 'crypto';
import { SecurityConfig } from './config';

/**
 * Generate CSRF token
 * Uses cryptographically secure random bytes
 * 
 * @returns CSRF token
 */
export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Verify CSRF token
 * 
 * @param token - Token to verify
 * @param expectedToken - Expected token value
 * @returns True if tokens match
 */
export function verifyCsrfToken(token: string, expectedToken: string): boolean {
  if (!SecurityConfig.csrf.enabled) {
    return true;
  }

  if (!token || !expectedToken) {
    return false;
  }

  // Use timing-safe comparison
  try {
    return crypto.timingSafeEqual(
      Buffer.from(token),
      Buffer.from(expectedToken)
    );
  } catch {
    return false;
  }
}

/**
 * Extract CSRF token from request
 * Checks both header and body
 * 
 * @param req - Request object
 * @param body - Request body (optional)
 * @returns CSRF token or null
 */
export function extractCsrfToken(req: Request, body?: any): string | null {
  // Check header first
  const headerToken = req.headers.get('x-csrf-token');
  if (headerToken) {
    return headerToken;
  }

  // Check body
  if (body && typeof body === 'object' && body.csrfToken) {
    return body.csrfToken;
  }

  return null;
}

/**
 * Create CSRF error response
 */
export function createCsrfErrorResponse(): Response {
  return new Response(
    JSON.stringify({
      success: false,
      error: 'CSRF token validation failed',
    }),
    {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
