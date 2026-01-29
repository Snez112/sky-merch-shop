import { NextRequest, NextResponse } from "next/server";
import { withSecurity } from "@/lib/security";

async function handler(req: NextRequest) {
  const base = process.env.GSHEET_WEBAPP_URL;
  const token = process.env.GSHEET_API_TOKEN;
  
  if (!base || !token) {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }
  
  const url = new URL(base);
  url.searchParams.set("sheet_name", "Orders");
  url.searchParams.set("token", token); // Fallback: also send via query string
  
  // Use fetch directly here since this calls external Google Apps Script
  // cachedReq is designed for internal API routes only
  // Cache for 10 seconds (bank data updates frequently)
  const res = await fetch(url.toString(), {
    method: "GET",
    next: { revalidate: 10 }, // Cache for 10 seconds
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  
  const data = await res.json();
  return NextResponse.json(data, { status: 200 });
}

// Export with security middleware
// Rate limit: 10 requests per minute (normal tier)
// Skip X-Domain validation since this is called server-side by verifyPayment
export const GET = withSecurity(handler, {
  rateLimitTier: 'normal',
  skipDomainValidation: true, // Server-to-server calls don't have X-Domain header
});

