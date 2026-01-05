



export async function GET(req: Request) {
  const base = process.env.GSHEET_WEBAPP_URL!;
  const token = process.env.GSHEET_API_TOKEN!;
  const url = new URL(base);
  url.searchParams.set("token", token);
  const res = await fetch(url.toString(), {
    method: "GET",
    cache: "no-store",
  });
  const data = await res.json();
  return Response.json(data, { status: 200 });
}
