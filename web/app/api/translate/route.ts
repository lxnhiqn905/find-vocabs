import { NextRequest, NextResponse } from "next/server";

const LINGVA_INSTANCES = [
  "https://translate.plausibility.cloud",
  "https://lingva.ml",
];

export async function GET(req: NextRequest) {
  const word = req.nextUrl.searchParams.get("word");
  if (!word) return NextResponse.json({ error: "Missing word" }, { status: 400 });

  for (const base of LINGVA_INSTANCES) {
    try {
      const res = await fetch(`${base}/api/v1/auto/vi/${encodeURIComponent(word)}`, {
        next: { revalidate: 86400 }, // cache 24h
      });
      if (!res.ok) continue;
      const data = await res.json();
      if (data.translation) return NextResponse.json({ translation: data.translation });
    } catch {
      // try next instance
    }
  }

  return NextResponse.json({ error: "Translation failed" }, { status: 502 });
}
