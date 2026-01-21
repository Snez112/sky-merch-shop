import { NextRequest, NextResponse } from "next/server";
import createTask from "@/hooks/createTask";
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

    const data = await createTask(creator, code, userid, amount, token);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error in createTask API:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}