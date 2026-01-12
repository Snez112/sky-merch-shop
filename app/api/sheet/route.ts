



export async function GET(req: Request) {
  const base = `${process.env.NEXT_PUBLIC_GSHEET_WEBAPP_URL_DEV}`;
  const token = `${process.env.NEXT_PUBLIC_GSHEET_API_TOKEN}`;
  const url = new URL(base);
  url.searchParams.set("sheet_name", "Sheet1");
  url.searchParams.set("token", token);
  const res = await fetch(url.toString(), {
    method: "GET",
    cache: "no-store",
  });
  console.log(url.toString())
  const data = await res.json();
  return Response.json(data, { status: 200 });
}
