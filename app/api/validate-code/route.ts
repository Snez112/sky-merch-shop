import { NextRequest, NextResponse } from "next/server";
import { isValidGenerateCode } from "@/lib/validation/code-validator";
import { cachedReq } from "@/lib/utils";

interface ListEntry {
  CODE: string;
  [key: string]: any;
}

/**
 * API endpoint to validate friend code
 * 
 * GET /api/validate-code?code=XXXXXXXXXXXX
 * 
 * Response:
 * {
 *   "valid": true/false,      // Format is valid
 *   "exists": true/false,     // Code exists in LIST sheet
 *   "message": string
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

    // Step 1: Validate format
    if (!isValidGenerateCode(code)) {
      return NextResponse.json({
        valid: false,
        exists: false,
        message: "Invalid code format. Code must be 12 characters (a-Z, 0-9, -).",
      });
    }

    // Step 2: Check if code exists in LIST sheet
    try {
      const listRes = await cachedReq(`/api/sheet?sheet_name=LIST`);
      const listData: ListEntry[] = listRes.data || [];

      // Normalize code for comparison (remove hyphens, uppercase)
      const normalizedCode = code.replace(/-/g, "").toUpperCase();

      // Check if code exists in LIST
      const codeExists = listData.some((entry) => {
        const entryCode = entry.CODE?.replace(/-/g, "").toUpperCase();
        return entryCode === normalizedCode;
      });
      console.log(codeExists);
      if (!codeExists) {
        return NextResponse.json({
          valid: true,
          exists: false,
          message: "Code not found in system",
        });
      }

      // Code is valid and exists
      return NextResponse.json({
        valid: true,
        exists: true,
        message: "Code is valid",
      });
    } catch (sheetError) {
      console.error("Error fetching LIST sheet:", sheetError);
      return NextResponse.json(
        {
          valid: true,
          exists: false,
          message: "Unable to verify code existence",
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error validating code:", error);
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
