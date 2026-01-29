/**
 * Request Signing Utilities
 * HMAC-SHA256 based request signing for API authentication
 */

import crypto from 'crypto';
import { SecurityConfig } from './config';

/**
 * Signature payload interface
 */
export interface SignaturePayload {
  method: string;
  path: string;
  timestamp: number;
  body?: string;
  nonce?: string;
}

/**
 * Generate HMAC signature for request
 * 
 * @param payload - Signature payload
 * @param secret - Secret key (defaults to config)
 * @returns HMAC signature (hex string)
 */
export function generateSignature(
  payload: SignaturePayload,
  secret: string = SecurityConfig.apiSecretKey
): string {
  const data = [
    payload.method,
    payload.path,
    payload.timestamp,
    payload.body || '',
    payload.nonce || '',
  ].join('|');

  return crypto
    .createHmac(SecurityConfig.requestSigning.algorithm, secret)
    .update(data)
    .digest('hex');
}

/**
 * Verify request signature
 * 
 * @param signature - Signature to verify
 * @param payload - Signature payload
 * @param secret - Secret key (defaults to config)
 * @returns True if signature is valid
 */
export function verifySignature(
  signature: string,
  payload: SignaturePayload,
  secret: string = SecurityConfig.apiSecretKey
): boolean {
  const expectedSignature = generateSignature(payload, secret);
  
  // Use timing-safe comparison to prevent timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  } catch {
    // If signatures have different lengths, timingSafeEqual throws
    return false;
  }
}

/**
 * Validate timestamp to prevent replay attacks
 * 
 * @param timestamp - Request timestamp
 * @param maxDrift - Maximum allowed time drift in milliseconds
 * @returns True if timestamp is valid
 */
export function validateTimestamp(
  timestamp: number,
  maxDrift: number = SecurityConfig.requestSigning.maxTimestampDrift
): boolean {
  const now = Date.now();
  const diff = Math.abs(now - timestamp);
  
  return diff <= maxDrift;
}

/**
 * Extract signature from request headers
 * 
 * @param req - Request object
 * @returns Signature data or null
 */
export function extractSignature(req: Request): {
  signature: string;
  timestamp: number;
  nonce?: string;
} | null {
  const signature = req.headers.get('x-signature');
  const timestamp = req.headers.get('x-timestamp');
  const nonce = req.headers.get('x-nonce');

  if (!signature || !timestamp) {
    return null;
  }

  const timestampNum = parseInt(timestamp, 10);
  if (isNaN(timestampNum)) {
    return null;
  }

  return {
    signature,
    timestamp: timestampNum,
    nonce: nonce || undefined,
  };
}

/**
 * Verify request signature from headers
 * 
 * @param req - Request object
 * @param body - Request body (for POST/PUT requests)
 * @returns Verification result
 */
export async function verifyRequestSignature(
  req: Request,
  body?: string
): Promise<{
  valid: boolean;
  error?: string;
}> {
  if (!SecurityConfig.requestSigning.enabled) {
    return { valid: true };
  }

  const signatureData = extractSignature(req);
  
  if (!signatureData) {
    return {
      valid: false,
      error: 'Missing signature headers (x-signature, x-timestamp)',
    };
  }

  // Validate timestamp
  if (!validateTimestamp(signatureData.timestamp)) {
    return {
      valid: false,
      error: 'Request timestamp is too old or in the future',
    };
  }

  // Extract path from URL
  const url = new URL(req.url);
  const path = url.pathname;

  // Create payload
  const payload: SignaturePayload = {
    method: req.method,
    path,
    timestamp: signatureData.timestamp,
    body,
    nonce: signatureData.nonce,
  };

  // Verify signature
  const isValid = verifySignature(signatureData.signature, payload);

  if (!isValid) {
    return {
      valid: false,
      error: 'Invalid signature',
    };
  }

  return { valid: true };
}

/**
 * Create unauthorized signature response
 * 
 * @param error - Error message
 * @returns Response object
 */
export function createSignatureErrorResponse(error: string): Response {
  return new Response(
    JSON.stringify({
      success: false,
      error: `Signature verification failed: ${error}`,
    }),
    {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
