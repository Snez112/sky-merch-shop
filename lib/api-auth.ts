/**
 * @deprecated This file is deprecated. Use @/lib/security instead.
 * 
 * The new security module provides:
 * - Rate limiting
 * - Request signing
 * - CSRF protection
 * - Enhanced origin validation
 * - Input sanitization
 * 
 * Migration guide:
 * - Replace `authenticateRequest(req)` with `withSecurity(handler, options)`
 * - See lib/security/middleware.ts for usage examples
 */

/**
 * API Authentication Utilities
 * Provides functions to verify API requests are coming from authorized sources
 */

import { NextRequest } from "next/server";

/**
 * Verify request origin matches allowed domains
 * Checks Origin and Referer headers to prevent unauthorized API access
 */
export function verifyOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");
  
  // Allow requests from same origin (server-side)
  if (!origin && !referer) {
    // Server-side requests (no origin/referer) are allowed
    return true;
  }
  
  // Get allowed origins from environment
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  ];
  
  // Check origin
  if (origin && allowedOrigins.some(allowed => origin.startsWith(allowed))) {
    return true;
  }
  
  // Check referer as fallback
  if (referer && allowedOrigins.some(allowed => referer.startsWith(allowed))) {
    return true;
  }
  
  console.warn("Unauthorized origin:", { origin, referer });
  return false;
}

/**
 * Combined authentication check
 * Verifies origin matches allowed domains
 */
export function authenticateRequest(req: NextRequest): boolean {
  // Always check origin
  if (!verifyOrigin(req)) {
    return false;
  }
  
  return true;
}

/**
 * Create unauthorized response
 */
export function unauthorizedResponse(message: string = "Unauthorized") {
  return new Response(
    JSON.stringify({
      success: false,
      error: message,
    }),
    {
      status: 401,
      headers: { "Content-Type": "application/json" },
    }
  );
}
