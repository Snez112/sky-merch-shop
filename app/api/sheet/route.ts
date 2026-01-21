import { authenticateRequest, unauthorizedResponse } from "@/lib/api-auth";

export async function GET(req: Request) {
  // Note: This endpoint is primarily called server-side via cachedReq()
  // Server-side requests (no origin) are automatically allowed
  // This check only blocks external client-side requests
  if (!authenticateRequest(req as any)) {
    return unauthorizedResponse("Unauthorized: Invalid origin");
  }

  const { searchParams } = new URL(req.url);
  const sheet_name = searchParams.get("sheet_name") || "List";
  console.log('Sheet name:', sheet_name);
  const base = `${process.env.NEXT_PUBLIC_GSHEET_WEBAPP_URL}`;
  const token = `${process.env.NEXT_PUBLIC_GSHEET_API_TOKEN}`;
  const url = new URL(base);
  url.searchParams.set("sheet_name", sheet_name);
  url.searchParams.set("token", token)
  const res = await fetch(url.toString(), {
    method: "GET",
    cache: "no-store",
  });
  console.log(url.toString())
  const data = await res.json();
  return Response.json(data, { status: 200 });
}
