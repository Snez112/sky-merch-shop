import { NextRequest, NextResponse } from "next/server";
import { createDraftOrder } from "@/services/order";
import { isValidGenerateCode } from "@/lib/validation";
import { cachedReq } from "@/lib/utils";
import { authenticateRequest, unauthorizedResponse } from "@/lib/api-auth";

export async function POST(req: NextRequest) {
  // Verify request is from authorized origin
  if (!authenticateRequest(req)) {
    return unauthorizedResponse("Unauthorized: Invalid origin");
  }

  try {
    const body = await req.json();
    console.log(body);
    const { code, quantity, productPrice } = body;

    // Validate required fields
    if (!code || !quantity || !productPrice) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: code, quantity, productPrice",
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

    // Validate quantity (must be positive integer)
    if (!Number.isInteger(quantity) || quantity < 1) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid quantity. Must be a positive integer",
        },
        { status: 400 }
      );
    }

    // Validate product price (must be positive number)
    if (typeof productPrice !== "number" || productPrice <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid product price. Must be a positive number",
        },
        { status: 400 }
      );
    }

    // Check for duplicate code in existing orders (case-insensitive)
    try {
      const sheetData = await cachedReq(`/api/sheet?sheet_name=LIST`);
      console.log('Sheet data received:', sheetData);
      
      const existingOrders = Array.isArray(sheetData.data) ? sheetData.data : [];
      console.log('Existing orders count:', existingOrders.length);
      console.log('Checking code:', code);
      
      // Check if code already exists (case-insensitive comparison)
      // Note: Sheet returns uppercase field names (CODE, not code)
      const isDuplicate = existingOrders.some((order: any) => {
        const orderCode = order.CODE || order.code; // Support both uppercase and lowercase
        const match = orderCode && orderCode.toUpperCase() === code.toUpperCase();
        if (match) {
          console.log('Duplicate found! Existing code:', orderCode, 'New code:', code);
        }
        return match;
      });
      
      if (isDuplicate) {
        console.log('Returning duplicate error');
        return NextResponse.json(
          {
            success: false,
            error: "This code has already been used. Please use a different code.",
          },
          { status: 400 }
        );
      }
      
      console.log('No duplicate found, proceeding with order creation');
    } catch (error) {
      console.error("Error checking for duplicate codes:", error);
      // Continue anyway - don't block order creation if sheet check fails
    }

    // Create draft order
    const result = await createDraftOrder({
      code,
      quantity,
      productPrice,
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
