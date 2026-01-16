"use server";

import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { cache } from "react";

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

    console.log("urllllll", url);
    const mergedHeaders = {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    };

    const res = await fetch(url, {
      method,
      headers: mergedHeaders,
      ...options,
    });
    console.log("res", res);
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
 * Format Date to DD/MM/YYYY HH:MM:SS format for Google Sheet
 * @param date - Date object to format
 * @returns Formatted string: "HH:MM:SS DD/MM/YYYY"
 * @example formatDateTime(new Date()) // "14:35:52 16/01/2026"
 */
export async function formatDateTime(date: Date): Promise<string> {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
}
