import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const word = req.nextUrl.searchParams.get("word");
  if (!word) return NextResponse.json({ error: "Missing word" }, { status: 400 });

  const res = await fetch(`https://lingva.ml/api/v1/auto/vi/${encodeURIComponent(word)}`, {
    next: { revalidate: 86400 }, // cache 24h
  });

  if (!res.ok) return NextResponse.json({ error: "Translation failed" }, { status: 502 });

  const data = await res.json();
  return NextResponse.json({ translation: data.translation });
}
