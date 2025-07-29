export async function POST(req: Request) {
  const data = await req.json();
  const API_URL = process.env.SPREADSHEETS_URL || "";

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  return Response.json(result);
}
