/**
 * Security Module
 * Central export for all security utilities
 */

// Configuration
export { SecurityConfig } from './config';
export type { SecurityConfigType } from './config';

// Rate Limiting
export {
  checkRateLimit,
  getClientIdentifier,
  createRateLimitResponse,
  type RateLimitTier,
  type RateLimitResult,
} from './rate-limit';

// Request Signing
export {
  generateSignature,
  verifySignature,
  validateTimestamp,
  extractSignature,
  verifyRequestSignature,
  createSignatureErrorResponse,
  type SignaturePayload,
} from './request-signing';

// Origin Validation
export {
  validateOrigin,
  createOriginErrorResponse,
  type OriginValidationResult,
} from './origin-validator';

// Input Sanitization
export {
  sanitizeCode,
  sanitizeSheetName,
  sanitizeText,
  sanitizeNumber,
  isValidEmail,
  sanitizeObject,
} from './sanitize';

// CSRF Protection
export {
  generateCsrfToken,
  verifyCsrfToken,
  extractCsrfToken,
  createCsrfErrorResponse,
} from './csrf';

// Middleware
export {
  applySecurityChecks,
  withSecurity,
  type SecurityCheckResult,
  type SecurityMiddlewareOptions,
} from './middleware';
