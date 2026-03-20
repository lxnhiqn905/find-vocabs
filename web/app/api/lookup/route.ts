import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const word = req.nextUrl.searchParams.get("word");
  if (!word) return NextResponse.json({ error: "Missing word" }, { status: 400 });

  const res = await fetch(`https://wordsapi.p.rapidapi.com/words/${encodeURIComponent(word)}`, {
    headers: {
      "X-RapidAPI-Key": process.env.RAPIDAPI_KEY ?? "",
      "X-RapidAPI-Host": "wordsapi.p.rapidapi.com",
    },
  });

  if (!res.ok) {
    return NextResponse.json({ error: `Word not found: "${word}"` }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
