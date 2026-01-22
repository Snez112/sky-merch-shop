/**
 * Client-Side Secure Fetch Utility
 * Wrapper for API calls with automatic request signing
 */

import { generateSignature, type SignaturePayload } from '../security/request-signing';

/**
 * Secure fetch options
 */
export interface SecureFetchOptions extends RequestInit {
  /**
   * Skip request signing (for public endpoints)
   */
  skipSigning?: boolean;

  /**
   * Custom nonce for signature
   */
  nonce?: string;
}

/**
 * Get API secret key from environment
 * In production, this should be fetched from a secure endpoint
 */
function getApiSecretKey(): string {
  // For development, use the same key as server
  // In production, implement a key exchange mechanism
  return process.env.API_SECRET_KEY || process.env.NEXT_PUBLIC_API_SECRET_KEY || 'dev-secret-key-change-in-production';
}

/**
 * Secure fetch wrapper with automatic request signing
 * 
 * @param url - API endpoint URL
 * @param options - Fetch options
 * @returns Fetch response
 */
export async function secureFetch(
  url: string,
  options: SecureFetchOptions = {}
): Promise<Response> {
  const {
    skipSigning = false,
    nonce,
    ...fetchOptions
  } = options;

  // Parse URL to get path
  const urlObj = new URL(url, window.location.origin);
  const path = urlObj.pathname;

  // Prepare headers
  const headers = new Headers(fetchOptions.headers);

  // Add signature for POST/PUT/DELETE requests
  if (!skipSigning && ['POST', 'PUT', 'DELETE'].includes(fetchOptions.method || 'GET')) {
    const timestamp = Date.now();
    let body: string | undefined;

    // Serialize body if present
    if (fetchOptions.body) {
      if (typeof fetchOptions.body === 'string') {
        body = fetchOptions.body;
      } else if (fetchOptions.body instanceof FormData) {
        // FormData cannot be signed reliably, skip signing
        console.warn('FormData cannot be signed, skipping signature');
      } else {
        body = JSON.stringify(fetchOptions.body);
      }
    }

    // Generate signature
    const payload: SignaturePayload = {
      method: fetchOptions.method || 'POST',
      path,
      timestamp,
      body,
      nonce,
    };

    const signature = generateSignature(payload, getApiSecretKey());

    // Add signature headers
    headers.set('x-signature', signature);
    headers.set('x-timestamp', timestamp.toString());
    if (nonce) {
      headers.set('x-nonce', nonce);
    }
  }

  // Make request
  return fetch(url, {
    ...fetchOptions,
    headers,
  });
}

/**
 * Secure POST request
 */
export async function securePost<T = any>(
  url: string,
  data: any,
  options: SecureFetchOptions = {}
): Promise<T> {
  const response = await secureFetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: JSON.stringify(data),
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

/**
 * Secure GET request
 */
export async function secureGet<T = any>(
  url: string,
  options: SecureFetchOptions = {}
): Promise<T> {
  const response = await secureFetch(url, {
    method: 'GET',
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}
