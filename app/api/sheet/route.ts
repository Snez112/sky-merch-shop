import { NextRequest, NextResponse } from "next/server";
import { withSecurity } from "@/lib/security";
import { sanitizeSheetName } from "@/lib/security/sanitize";

async function handler(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  let sheetName = searchParams.get("sheet_name") || "List";
  
  // Sanitize sheet name
  sheetName = sanitizeSheetName(sheetName);
  
  const base = process.env.GSHEET_WEBAPP_URL;
  const token = process.env.GSHEET_API_TOKEN;
  
  if (!base || !token) {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }
  
  const url = new URL(base);
  url.searchParams.set("sheet_name", sheetName);
  url.searchParams.set("token", token); // Fallback: also send via query string
  
  // Use fetch directly here since cachedReq is for internal API calls
  // This calls external Google Apps Script
  // Cache for 30 seconds to improve performance
  const res = await fetch(url.toString(), {
    method: "GET",
    next: { revalidate: 30 }, // Cache for 30 seconds
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  const data = await res.json();

  return NextResponse.json(data, { status: 200 });
}

// Export with security middleware
// Rate limit: 20 requests per minute (relaxed tier) - read-only endpoint
export const GET = withSecurity(handler, {
  rateLimitTier: 'relaxed',
});

