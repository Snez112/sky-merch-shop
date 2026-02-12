import { NextRequest, NextResponse } from "next/server";
import { cachedReq } from "@/lib/utils";

interface RefCodeEntry {
  CODE: string;
  TYPE: string;
  DISCOUNT: number;
  USE_LEFT: number;
}

export interface CouponData {
  code: string;
  type: string;
  discount: number;
  useLeft: number;
}

/**
 * API endpoint to validate coupon/referral code
 * 
 * GET /api/validate-coupon?code=2026
 * 
 * Response:
 * {
 *   "valid": true,
 *   "exists": true,
 *   "coupon": { code, type, discount, useLeft },
 *   "message": "Coupon is valid"
 * }
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json(
        {
          valid: false,
          exists: false,
          message: "Code parameter is required",
        },
        { status: 400 }
      );
    }

    // Fetch REF_CODE sheet
    // Fetch REF_CODE sheet or check specific coupon directly
    // Optimization: Call Google Script directly instead of internal API to avoid loop/URL issues
    const base = process.env.GSHEET_WEBAPP_URL;
    const token = process.env.GSHEET_API_TOKEN;
    
    if (!base || !token) {
      throw new Error("Missing Google Sheet configuration");
    }

    // Direct fetch with aggressive caching for coupon codes
    // We fetch the whole list to check limits/details or could implement a specific check param in App Script
    // For now, fetch list like before but directly
    const url = new URL(base);
    url.searchParams.set("sheet_name", "REF_CODE");
    url.searchParams.set("token", token);
    
    const res = await fetch(url.toString(), {
      next: { revalidate: 60 }, // Cache for 60 seconds
    });
    
    if (!res.ok) throw new Error("Failed to fetch coupon data");
    
    const responseData = await res.json();
    const refCodeData: RefCodeEntry[] = responseData.data || [];
    console.log(`Fetched ${refCodeData.length} coupons`);
    // Normalize code for comparison (uppercase, trim)
    const normalizedCode = code.trim().toUpperCase();
    console.log(refCodeData)
    // Find coupon in REF_CODE
    const coupon = refCodeData.find((entry) => {
      const entryCode = String(entry.CODE || "").trim().toUpperCase();
      return entryCode === normalizedCode;
    });
    console.log(coupon);
    
    if (!coupon) {
      return NextResponse.json({
        valid: false,
        exists: false,
        message: "Coupon not found",
      });
    }

    // Check if coupon has uses left
    // CTV type has unlimited uses
    if (coupon.TYPE !== 'CTV' && coupon.USE_LEFT <= 0) {
      return NextResponse.json({
        valid: false,
        exists: true,
        message: "Coupon has been used up",
      });
    }

    // Coupon is valid
    return NextResponse.json({
      valid: true,
      exists: true,
      coupon: {
        code: coupon.CODE,
        type: coupon.TYPE,
        discount: coupon.DISCOUNT,
        useLeft: coupon.USE_LEFT,
      },
      message: "Coupon is valid",
    });
  } catch (error: any) {
    console.error("Error validating coupon:", error);
    return NextResponse.json(
      {
        valid: false,
        exists: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
