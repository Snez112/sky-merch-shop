"use server";

import { headers, cookies } from "next/headers";
import { notFound } from "next/navigation";
import { cache } from "react";

import { SecurityConfig } from "@/lib/security/config";
import { generateSignature } from "@/lib/security/request-signing";

/**
 * Server-side HTTP request utility with caching
 * Automatically constructs full URLs from relative endpoints
 * Handles cookies, sessions, and request signing
 */
export const cachedReq = cache(serverAction);

export async function serverAction<T = any>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  options?: RequestInit
): Promise<T> {
  try {
    const headersList = await headers();
    const host = headersList.get("x-forwarded-host") || headersList.get("host");
    const protocol = headersList.get("x-forwarded-proto") || "http";

    if (!host) throw new Error("Host header not found.");

    const url = endpoint.startsWith("http")
      ? endpoint
      : `${protocol}://${host}${
          endpoint.startsWith("/") ? endpoint : "/" + endpoint
        }`;

    // Build headers with session cookies
    const mergedHeaders = await buildHeaders(headersList, options?.headers as Record<string, string>);

    // Add request signature if enabled
    if (SecurityConfig.requestSigning.enabled) {
      const timestamp = Date.now();
      const path = endpoint.startsWith("http") ? new URL(endpoint).pathname : endpoint;
      const body = options?.body ? String(options.body) : "";
      
      const signature = generateSignature({
        method,
        path,
        timestamp,
        body,
      });

      mergedHeaders["x-signature"] = signature;
      mergedHeaders["x-timestamp"] = String(timestamp);
    }

    const res = await fetch(url, {
      method,
      headers: mergedHeaders,
      ...options,
    });

    // Handle set-cookie headers from response
    const setCookieHeader = res.headers.get("set-cookie");
    if (setCookieHeader) {
      await handleSetCookie(setCookieHeader);
    }
    
    if (!res.ok) {
      if (res.status === 404) notFound();
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return res.json();
    } else {
      const text = await res.text();
      return text as unknown as T;
    }
  } catch (error: any) {
    // Sanitize endpoint to prevent logging sensitive query parameters
    const sanitizedEndpoint = endpoint.replace(/([?&])(token|key|secret|password|session)=[^&]*/gi, '$1$2=***');
    console.error("serverAction error:", sanitizedEndpoint, error.message || error);
    throw error;
  }
}

/**
 * Build request headers with session cookies and security headers
 */
async function buildHeaders(
  headersList: Awaited<ReturnType<typeof headers>>,
  customHeaders?: Record<string, string>
): Promise<Record<string, string>> {
  const cookieStore = await cookies();
  
  const headersData: Record<string, string> = {
    "Content-Type": "application/json",
    // Add X-Domain header for middleware validation
    "X-Domain": typeof window !== 'undefined' 
      ? window.location.host 
      : (process.env.NEXT_PUBLIC_BASE_URL?.replace('https://', '').replace('http://', '') || 'localhost:3000'),
    ...(customHeaders || {}),
  };

  // Add session cookies to request
  // Only forward cookies for same-origin requests (security best practice)
  const sessionId = cookieStore.get("session_id")?.value;
  if (sessionId) {
    headersData["Cookie"] = `session_id=${sessionId}`;
  }

  // Add other authentication cookies
  const stripeToken = cookieStore.get("stripe-token")?.value;
  if (stripeToken) {
    headersData["Cookie"] = `${headersData["Cookie"] ? headersData["Cookie"] + '; ' : ''}stripe-token=${stripeToken}`;
  }

  return headersData;
}

/**
 * Cookie attributes interface for type safety
 */
interface CookieAttributes {
  name: string;
  value: string;
  path?: string;
  domain?: string;
  maxAge?: number;
  expires?: Date;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

/**
 * Parse and set cookies from set-cookie header with security validation
 */
async function handleSetCookie(setCookieHeader: string): Promise<void> {
  const cookieStore = await cookies();
  
  // Whitelist of allowed cookies (security: prevent arbitrary cookie injection)
  const ALLOWED_COOKIES = ['session_id', 'stripe-token'];
  
  // Simple cookie parsing (handles basic set-cookie format)
  const cookieParts = setCookieHeader.split(';').map(part => part.trim());
  const [nameValue] = cookieParts;
  
  // Better parsing to handle '=' in cookie values
  const match = nameValue.match(/^([^=]+)=(.*)$/);
  if (!match) {
    console.warn('[Security] Invalid cookie format');
    return;
  }
  
  const [, name, value] = match;
  
  // Validate cookie name against whitelist
  if (!ALLOWED_COOKIES.includes(name)) {
    console.warn('[Security] Rejected unauthorized cookie:', name);
    return;
  }
  
  // Validate cookie value (basic XSS prevention)
  if (!value || value.includes('<') || value.includes('>') || value.toLowerCase().includes('script')) {
    console.warn('[Security] Rejected suspicious cookie value');
    return;
  }
  
  // Parse cookie attributes with security defaults
  const attributes: CookieAttributes = {
    name,
    value,
    // Security: Enforce HttpOnly and Secure for sensitive cookies
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict', // Default to strict for CSRF protection
  };
  
  cookieParts.slice(1).forEach(part => {
    const [key, val] = part.split('=');
    if (!key) return;
    
    const lowerKey = key.toLowerCase();
    
    if (lowerKey === 'path') {
      attributes.path = val;
    } else if (lowerKey === 'domain') {
      attributes.domain = val;
    } else if (lowerKey === 'max-age') {
      const maxAge = parseInt(val);
      // Security: Limit max-age to 30 days
      attributes.maxAge = Math.min(maxAge, 30 * 24 * 60 * 60);
    } else if (lowerKey === 'expires') {
      const expiryDate = new Date(val);
      // Security: Limit expiry to 30 days from now
      const maxExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      attributes.expires = expiryDate > maxExpiry ? maxExpiry : expiryDate;
    } else if (lowerKey === 'samesite') {
      // Validate sameSite value
      const sameSiteVal = val.toLowerCase();
      if (sameSiteVal === 'strict' || sameSiteVal === 'lax' || sameSiteVal === 'none') {
        attributes.sameSite = sameSiteVal as 'strict' | 'lax' | 'none';
      }
    }
    // Note: httpOnly and secure are already set to secure defaults above
  });
  
  cookieStore.set(attributes);
}


