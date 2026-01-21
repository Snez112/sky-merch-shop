import { authenticateRequest, unauthorizedResponse } from "@/lib/api-auth";

export async function GET(req: Request) {
  // Verify request is from authorized origin
  if (!authenticateRequest(req as any)) {
    return unauthorizedResponse("Unauthorized: Invalid origin");
  }

  const base = `${process.env.NEXT_PUBLIC_GSHEET_WEBAPP_URL_DEV}`;
  const token = `${process.env.NEXT_PUBLIC_GSHEET_API_TOKEN}`;
  const url = new URL(base);
  url.searchParams.set("sheet_name", "Orders");
  url.searchParams.set("token", token);
  const res = await fetch(url.toString(), {
    method: "GET",
    cache: "no-store",
  });
  const data = await res.json();
  console.log("data", data);
  return Response.json(data, { status: 200 });
}
