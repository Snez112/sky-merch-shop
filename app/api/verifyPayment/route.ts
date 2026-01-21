import { NextRequest, NextResponse } from "next/server";
import verifyPayment from "@/hooks/verifyPayment";
import { isValidGenerateCode } from "@/lib/validation";
import { authenticateRequest, unauthorizedResponse } from "@/lib/api-auth";

export async function POST(req: NextRequest) {
  // Verify request is from authorized origin
  if (!authenticateRequest(req)) {
    return unauthorizedResponse("Unauthorized: Invalid origin");
  }

  try {
    const body = await req.json();
    const { code, amount } = body;

    // Get configuration from environment variables
    const creator = process.env.CREATOR || process.env.CREATER;
    const userid = process.env.USERID;
    const token = process.env.TOKEN;

    // Validate required fields
    if (!code || !amount) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: code, amount",
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

    // Validate amount
    if (typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid amount. Must be a positive number",
        },
        { status: 400 }
      );
    }

    console.log(`Starting payment verification for code: ${code}`);

    // Verify payment with polling (15 minutes timeout)
    const result = await verifyPayment({
      code,
      creator,
      userid,
      amount,
      token,
      maxAttempts: 300, // 300 × 3s = 15 minutes
      intervalMs: 3000, // 3 seconds
    });

    console.log(`Payment verified successfully for code: ${code}`);

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
