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

/**
 * Format Date to HH:MM:SS DD/MM/YYYY format for Google Sheet
 * Uses Vietnam timezone (Asia/Ho_Chi_Minh, GMT+7)
 * @param date - Date object to format
 * @returns Formatted string: "HH:MM:SS DD/MM/YYYY"
 * @example formatDateTime(new Date()) // "14:35:52 16/01/2026"
 */
export async function formatDateTime(date: Date): Promise<string> {
  // Convert to Vietnam timezone (GMT+7)
  const vietnamTime = new Date(date.toLocaleString('en-US', { 
    timeZone: 'Asia/Ho_Chi_Minh' 
  }));
  
  const day = String(vietnamTime.getDate()).padStart(2, '0');
  const month = String(vietnamTime.getMonth() + 1).padStart(2, '0');
  const year = vietnamTime.getFullYear();
  const hours = String(vietnamTime.getHours()).padStart(2, '0');
  const minutes = String(vietnamTime.getMinutes()).padStart(2, '0');
  const seconds = String(vietnamTime.getSeconds()).padStart(2, '0');
  
  return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
}

/**
 * Parse Vietnamese datetime format back to Date object
 * @param dateTimeString - String in format "HH:MM:SS DD/MM/YYYY"
 * @returns Date object in Vietnam timezone
 * @example parseVietnameseDateTime("14:35:52 16/01/2026")
 */
export async function parseVietnameseDateTime(dateTimeString: string): Promise<Date> {
  // Format: "HH:MM:SS DD/MM/YYYY"
  const [timePart, datePart] = dateTimeString.split(' ');
  const [hours, minutes, seconds] = timePart.split(':').map(Number);
  const [day, month, year] = datePart.split('/').map(Number);
  
  // Create date in Vietnam timezone
  // Note: Month is 0-indexed in JavaScript Date
  const date = new Date(year, month - 1, day, hours, minutes, seconds);
  
  return date;
}
