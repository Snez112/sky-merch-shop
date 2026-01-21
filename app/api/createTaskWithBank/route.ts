import { NextRequest, NextResponse } from "next/server";
import createTaskWithBank from "@/hooks/createTaskWithBank";
import sendToSheet from "@/hooks/sendToSheet";
import { authenticateRequest, unauthorizedResponse } from "@/lib/api-auth";

export async function POST(req: NextRequest) {
  // Verify request is from authorized origin
  if (!authenticateRequest(req)) {
    return unauthorizedResponse("Unauthorized: Invalid origin");
  }

  try {
    const body = await req.json();
    const { creator, code, userid, amount, token } = body;

    // Validate required fields
    if (!creator || !code || !userid || !amount || !token) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Call merged service - creates task and fetches bank data in parallel
    const data = await createTaskWithBank(creator, code, userid, amount, token);
    
    // Send merged data to Google Sheet
    try {
      const sheetResponse = await sendToSheet(data.data.sheetData);
      console.log("Data sent to Google Sheet:", sheetResponse);
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
