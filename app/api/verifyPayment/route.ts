import { NextRequest, NextResponse } from "next/server";
import verifyPayment from "@/hooks/verifyPayment";
import { isValidGenerateCode, formatFriendCode } from "@/lib/validation/code-validator";
import { withSecurity } from "@/lib/security";
import { sanitizeNumber } from "@/lib/security/sanitize";

async function handler(req: NextRequest) {
  try {
    const body = await req.json();
    let { code, amount } = body;

    // Sanitize and format inputs
    code = code ? formatFriendCode(code) : "";
    amount = sanitizeNumber(amount, { min: 0 });

    // Get configuration from environment variables
    const creator = process.env.CREATOR || process.env.CREATER;
    const userid = process.env.USERID;
    const token = process.env.TOKEN;

    // Validate required fields
    if (!code || !amount) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing or invalid required fields: code, amount",
        },
        { status: 400 }
      );
    }

    if (!token) {
      console.error("Missing TOKEN in environment variables");
      return NextResponse.json(
        {
          success: false,
          error: "Server configuration error: Missing API token",
        },
        { status: 500 }
      );
    }

    // Validate code format
    if (!isValidGenerateCode(code)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid code format. Code must be 12 characters (a-Z, 0-9, -)",
        },
        { status: 400 }
      );
    }

    // Verify payment with polling (15 minutes timeout)
    const result = await verifyPayment({
      code,
      creator: creator!,
      userid: userid!,
      quantity: amount, // Map frontend 'amount' (which is quantity) to 'quantity'
      token,
      maxAttempts: 500, // 500 × 3s = 25 minutes
      intervalMs: 3000, // 3 seconds
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("Error in verifyPayment API:", error);
    
    // Check if it's a timeout error
    const isTimeout = error.message?.includes("timeout");
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to verify payment",
        isTimeout, // Flag to help frontend show appropriate message
      },
      { status: isTimeout ? 408 : 500 } // 408 Request Timeout
    );
  }
}

// Export with security middleware
// Rate limit: 10 requests per minute (normal tier) - allows auto-check every 30s + manual checks
// Changed from strict to normal to accommodate payment verification flow (30 checks over 15 min)
export const POST = withSecurity(handler, {
  rateLimitTier: 'normal',
});

