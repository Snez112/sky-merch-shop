"use server";

import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { cache } from "react";

import { SecurityConfig } from "@/lib/security/config";
import { generateSignature } from "@/lib/security/request-signing";

/**
 * Server-side HTTP request utility with caching
 * Automatically constructs full URLs from relative endpoints
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

    // Prepare headers
    const mergedHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      // Add X-Domain header for middleware validation
      // On server: use NEXT_PUBLIC_BASE_URL, on client: use window.location.host
      "X-Domain": typeof window !== 'undefined' 
        ? window.location.host 
        : (process.env.NEXT_PUBLIC_BASE_URL?.replace('https://', '').replace('http://', '') || 'localhost:3000'),
      ...(options?.headers as Record<string, string> || {}),
    };

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
  } catch (error) {
    console.error("serverAction error:", endpoint, error);
    throw error;
  }
}


