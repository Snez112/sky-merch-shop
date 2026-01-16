import { NextRequest, NextResponse } from "next/server";
import createTask from "@/hooks/createTask";

export async function POST(req: NextRequest) {
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