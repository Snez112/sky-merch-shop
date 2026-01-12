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
