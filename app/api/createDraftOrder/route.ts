import { NextRequest, NextResponse } from "next/server";
import { createDraftOrder } from "@/services/order";
import { isValidGenerateCode } from "@/lib/validation";
import { cachedReq } from "@/lib/utils";
import { withSecurity } from "@/lib/security";
import { sanitizeCode, sanitizeNumber } from "@/lib/security/sanitize";

async function handler(req: NextRequest) {
  try {
    const body = await req.json();
    let { code, quantity, productPrice } = body;

    // Sanitize inputs
    code = sanitizeCode(code);
    quantity = sanitizeNumber(quantity, { integer: true, min: 1 });
    productPrice = sanitizeNumber(productPrice, { min: 0 });

    // Validate required fields
    if (!code || !quantity || !productPrice) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing or invalid required fields: code, quantity, productPrice",
        },
        { status: 400 }
      );
    }

    // Validate code format (12 characters, uppercase)
    if (!isValidGenerateCode(code)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid code format. Code must be 12 uppercase characters (A-Z, 0-9)",
        },
        { status: 400 }
      );
    }

    // Check for duplicate code in existing orders (case-insensitive)
    try {
      const sheetData = await cachedReq(`/api/sheet?sheet_name=LIST`);
      
      const existingOrders = Array.isArray(sheetData.data) ? sheetData.data : [];
      
      // Check if code already exists (case-insensitive comparison)
      // Note: Sheet returns uppercase field names (CODE, not code)
      const isDuplicate = existingOrders.some((order: any) => {
        const orderCode = order.CODE || order.code; // Support both uppercase and lowercase
        const match = orderCode && orderCode.toUpperCase() === code.toUpperCase();
        return match;
      });
      
      if (isDuplicate) {
        return NextResponse.json(
          {
            success: false,
            error: "This code has already been used. Please use a different code.",
          },
          { status: 400 }
        );
      }
    } catch (error) {
      console.error("Error checking for duplicate codes:", error);
      // Continue anyway - don't block order creation if sheet check fails
    }

    // Create draft order
    const result = await createDraftOrder({
      code,
      quantity,
      productPrice,
      productName: body.productName || 'Unknown Product', // Add productName
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("Error in createDraftOrder API:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create draft order",
      },
      { status: 500 }
    );
  }
}

// Export with security middleware
// Rate limit: 5 requests per minute (normal tier)
export const POST = withSecurity(handler, {
  rateLimitTier: 'normal',
});

