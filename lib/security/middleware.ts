/**
 * Security Middleware
 * Composable security functions for API routes
 */

import { NextRequest } from 'next/server';
import {
  checkRateLimit,
  getClientIdentifier,
  createRateLimitResponse,
  type RateLimitTier,
} from './rate-limit';
import {
  validateOrigin,
  createOriginErrorResponse,
} from './origin-validator';
import {
  verifyRequestSignature,
  createSignatureErrorResponse,
} from './request-signing';

/**
 * Security check result
 */
export interface SecurityCheckResult {
  allowed: boolean;
  response?: Response;
}

/**
 * Security middleware options
 */
export interface SecurityMiddlewareOptions {
  /**
   * Rate limit tier (strict/normal/relaxed)
   * @default 'normal'
   */
  rateLimitTier?: RateLimitTier;

  /**
   * Skip rate limiting
   * @default false
   */
  skipRateLimit?: boolean;

  /**
   * Skip origin validation
   * @default false
   */
  skipOriginValidation?: boolean;

  /**
   * Skip signature verification
   * @default false
   */
  skipSignatureVerification?: boolean;

  /**
   * Skip X-Domain header validation
   * @default false
   */
  skipDomainValidation?: boolean;

  /**
   * Custom endpoint name for rate limiting
   * @default req.url pathname
   */
  endpoint?: string;
}

/**
 * Apply security checks to request
 * 
 * @param req - Next.js request
 * @param options - Security options
 * @returns Security check result
 */
export async function applySecurityChecks(
  req: NextRequest,
  options: SecurityMiddlewareOptions = {}
): Promise<SecurityCheckResult> {
  const {
    rateLimitTier = 'normal',
    skipRateLimit = false,
    skipOriginValidation = false,
    skipSignatureVerification = false,
    skipDomainValidation = false,
    endpoint,
  } = options;

  // 1. X-Domain header validation
  if (!skipDomainValidation) {
    const xDomain = req.headers.get('X-Domain');
    const host = req.headers.get('host');
    
    if (!xDomain) {
      console.warn('X-Domain header validation failed: Missing header');
      return {
        allowed: false,
        response: new Response(
          JSON.stringify({ error: 'Missing X-Domain header' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        ),
      };
    }
    
    // Check if X-Domain matches current host or allowed domains
    const isValidDomain = xDomain === host || 
                          xDomain === host?.split(':')[0] ||
                          xDomain.includes('localhost') ||
                          xDomain.includes('127.0.0.1');
    
    if (!isValidDomain) {
      console.warn('X-Domain header validation failed:', { xDomain, host });
      return {
        allowed: false,
        response: new Response(
          JSON.stringify({ error: 'Invalid X-Domain header' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        ),
      };
    }
  }

  // 2. Origin validation
  if (!skipOriginValidation) {
    const originResult = validateOrigin(req);
    
    if (!originResult.valid) {
      console.warn('Origin validation failed:', originResult.reason);
      return {
        allowed: false,
        response: createOriginErrorResponse(originResult.reason || 'Unknown'),
      };
    }
  }

  // 3. Rate limiting
  if (!skipRateLimit) {
    const identifier = getClientIdentifier(req);
    const url = new URL(req.url);
    const endpointPath = endpoint || url.pathname;
    
    const rateLimitResult = checkRateLimit(identifier, endpointPath, rateLimitTier);
    
    if (!rateLimitResult.allowed) {
      console.warn('Rate limit exceeded:', { identifier, endpoint: endpointPath });
      return {
        allowed: false,
        response: createRateLimitResponse(rateLimitResult),
      };
    }
  }

  // 4. Request signature verification (for POST/PUT/DELETE)
  if (!skipSignatureVerification && ['POST', 'PUT', 'DELETE'].includes(req.method)) {
    // Clone request to read body without consuming it
    const clonedReq = req.clone();
    let body: string | undefined;
    
    try {
      const contentType = req.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        const jsonBody = await clonedReq.json();
        body = JSON.stringify(jsonBody);
      }
    } catch {
      // Body might not be JSON, that's okay
    }

    const signatureResult = await verifyRequestSignature(req, body);
    
    if (!signatureResult.valid) {
      console.warn('Signature verification failed:', signatureResult.error);
      return {
        allowed: false,
        response: createSignatureErrorResponse(signatureResult.error || 'Unknown'),
      };
    }
  }

  return { allowed: true };
}

/**
 * Create a security middleware wrapper for API routes
 * 
 * @param handler - API route handler
 * @param options - Security options
 * @returns Wrapped handler with security checks
 */
export function withSecurity(
  handler: (req: NextRequest) => Promise<Response>,
  options: SecurityMiddlewareOptions = {}
) {
  return async (req: NextRequest): Promise<Response> => {
    // Apply security checks
    const securityResult = await applySecurityChecks(req, options);
    
    if (!securityResult.allowed) {
      return securityResult.response!;
    }

    // Call original handler
    return handler(req);
  };
}
