import { NextRequest, NextResponse } from "next/server";
import createTaskWithBank from "@/hooks/createTaskWithBank";
import sendToSheet from "@/hooks/sendToSheet";
import { withSecurity } from "@/lib/security";
import { sanitizeCode, sanitizeNumber } from "@/lib/security/sanitize";

async function handler(req: NextRequest) {
  try {
    const body = await req.json();
    let { code, userid, amount } = body;

    // Get creator and token from environment
    const creator = process.env.CREATOR || process.env.CREATER;
    const token = process.env.TOKEN;

    // Sanitize inputs
    code = sanitizeCode(code);
    userid = sanitizeNumber(userid, { integer: true, min: 0 });
    amount = sanitizeNumber(amount, { min: 0 });

    // Validate required fields
    if (!creator || !code || !userid || !amount || !token) {
      return NextResponse.json(
        { error: "Missing or invalid required fields" },
        { status: 400 }
      );
    }

    // Call merged service - creates task and fetches bank data in parallel
    const data = await createTaskWithBank(creator, code, userid, amount, token);
    
    // Send merged data to Google Sheet
    try {
    } catch (sheetError: any) {
      console.error("Failed to send to sheet:", sheetError.message);
      // Continue even if sheet update fails
    }
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error in createTaskWithBank API:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Export with security middleware
// Rate limit: 5 requests per minute (normal tier)
export const POST = withSecurity(handler, {
  rateLimitTier: 'normal',
});

