import { NextRequest, NextResponse } from "next/server";

export interface ProductResult {
  id: string;
  title: string;
  brand?: string;
  price?: string;
  imageUrl?: string;
  source?: string;
  link?: string;
}

export async function GET(req: NextRequest) {
  console.log("API KEY:", process.env.SERPAPI_KEY);

  const query = req.nextUrl.searchParams.get("q");

  if (!query || query.trim().length < 2) {
    return NextResponse.json({ error: "Query too short" }, { status: 400 });
  }

  const apiKey = process.env.SERPAPI_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "SERPAPI_KEY not configured" }, { status: 500 });
  }

  try {
    const url = new URL("https://serpapi.com/search.json");
    url.searchParams.set("engine", "google_shopping");
    url.searchParams.set("q", query);
    url.searchParams.set("api_key", apiKey);
    url.searchParams.set("num", "12");

    const res = await fetch(url.toString(), { next: { revalidate: 60 } });

    if (!res.ok) {
      throw new Error(`SerpAPI responded with ${res.status}`);
    }

    const data = await res.json();

    const results: ProductResult[] = (data.shopping_results ?? [])
      .slice(0, 12)
      .map((item: Record<string, string>, i: number) => ({
        id: String(item.position ?? i),
        title: item.title ?? "Unknown item",
        brand: item.source ?? undefined,
        price: item.price ?? undefined,
        imageUrl: item.thumbnail ?? undefined,
        source: item.source ?? undefined,
        link: item.link ?? undefined,
      }));

    return NextResponse.json({ results });
  } catch (err) {
    console.error("SerpAPI error:", err);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}