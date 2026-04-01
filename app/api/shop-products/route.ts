import { NextRequest, NextResponse } from "next/server";

const STYLE_QUERIES: Record<string, string> = {
  trending:   "editorial fashion pieces contemporary style",
  minimalist: "premium minimalist wardrobe essentials clean aesthetic",
  streetwear: "high end streetwear aesthetic urban fashion",
  classic:    "timeless classic tailored fashion pieces",
  casual:     "elevated casual fashion relaxed luxury",
  formal:     "contemporary smart formal wear sleek",
};

export interface ShopProduct {
  id: string;
  title: string;
  brand?: string;
  price?: string;
  priceRaw?: number;
  imageUrl?: string;
  source?: string;
  link?: string;
}

export async function GET(req: NextRequest) {
  const style    = req.nextUrl.searchParams.get("style") ?? "trending";
  const gender   = req.nextUrl.searchParams.get("gender") ?? "all";
  const gap      = req.nextUrl.searchParams.get("gap");
  const minPrice = req.nextUrl.searchParams.get("min");
  const maxPrice = req.nextUrl.searchParams.get("max");

  const apiKey = process.env.SERPAPI_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "SERPAPI_KEY not configured" }, { status: 500 });
  }

  let baseQuery = gap
    ? `premium ${gap} clothing fashion`
    : (STYLE_QUERIES[style] ?? STYLE_QUERIES.trending);

  if (gender === "men")   baseQuery = `mens ${baseQuery}`;
  if (gender === "women") baseQuery = `womens ${baseQuery}`;

  // Add price range to query string for better results
  if (minPrice && maxPrice && maxPrice !== "9999") {
    baseQuery += ` $${minPrice} to $${maxPrice}`;
  } else if (minPrice && minPrice !== "0") {
    baseQuery += ` over $${minPrice}`;
  } else if (maxPrice && maxPrice !== "9999") {
    baseQuery += ` under $${maxPrice}`;
  }

  try {
    const url = new URL("https://serpapi.com/search.json");
    url.searchParams.set("engine",  "google_shopping");
    url.searchParams.set("q",       baseQuery);
    url.searchParams.set("api_key", apiKey);
    url.searchParams.set("num",     "20");
    if (minPrice && minPrice !== "0")    url.searchParams.set("price_min", minPrice);
    if (maxPrice && maxPrice !== "9999") url.searchParams.set("price_max", maxPrice);

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`SerpAPI responded with ${res.status}`);

    const data = await res.json();

    const min = minPrice ? parseFloat(minPrice) : 0;
    const max = maxPrice ? parseFloat(maxPrice) : 9999;

    const products: ShopProduct[] = (data.shopping_results ?? [])
      .map((item: Record<string, string>, i: number) => {
        const priceStr = item.price ?? "";
        const priceRaw = parseFloat(priceStr.replace(/[^0-9.]/g, "")) || 0;
        return {
          id:       String(item.position ?? i),
          title:    item.title     ?? "Unknown item",
          brand:    item.source    ?? undefined,
          price:    priceStr       || undefined,
          priceRaw,
          imageUrl: item.thumbnail ?? undefined,
          source:   item.source    ?? undefined,
          link:     item.link      ?? undefined,
        };
      })
      // Light client-side cleanup — remove obvious outliers
      .filter((p: ShopProduct) => {
        if (!p.priceRaw) return true;
        return p.priceRaw >= min && p.priceRaw <= max;
      })
      .slice(0, 16);

    return NextResponse.json({ products });
  } catch (err) {
    console.error("Shop SerpAPI error:", err);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}